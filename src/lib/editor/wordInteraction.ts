import { type Extension, Facet } from "@codemirror/state";
import {
  EditorView,
  keymap,
  type PluginValue,
  type ViewUpdate,
  ViewPlugin,
} from "@codemirror/view";

import {
  pointerHitsWordAnchor,
  pointerHitsWordToolbarBridge,
  resolveWordTarget,
  wordTargetAtPointer,
  type WordTarget,
} from "@/lib/editor/resolveWordTarget";

export type { WordTarget };

export type WordLookupMode = "thesaurus" | "rhyme";

export type WordLookupRequest = WordTarget & {
  mode: WordLookupMode;
  /**
   * Syllable count for the resolved token, filled at open by PoemEditor when
   * metered line data is available.
   */
  tokenSyllables?: number;
};

export type WordInteractionHandlers = {
  onToolbarChange: (target: WordTarget | null) => void;
  onOpenLookup: (request: WordLookupRequest) => void;
};

/** Exported for tests. */
export const HOVER_SHOW_MS = 350;
/** Exported for tests. */
export const HOVER_HIDE_MS = 120;
/** Long-press thesaurus + tap-skip threshold (one timer story). */
export const LONG_PRESS_MS = 500;

/** Selector for the portaled toolbar surface (word ∪ toolbar hover target). */
export const WORD_TOOLBAR_ATTR = "data-word-toolbar";

const MOVE_CANCEL_PX = 8;

const wordInteractionFacet = Facet.define<
  WordInteractionHandlers,
  WordInteractionHandlers | null
>({
  combine(handlers) {
    return handlers[handlers.length - 1] ?? null;
  },
});

function emitToolbar(view: EditorView, target: WordTarget | null): void {
  view.state.facet(wordInteractionFacet)?.onToolbarChange(target);
}

function targetKey(target: WordTarget | null): string {
  if (!target) return "";
  return `${target.from}:${target.to}:${target.word}`;
}

function isInsideToolbar(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    Boolean(target.closest(`[${WORD_TOOLBAR_ATTR}]`))
  );
}

/**
 * Shared pointer/gesture plugin: hover + tap toolbar, long-press thesaurus.
 * One MOVE_CANCEL_PX and one LONG_PRESS_MS for tap vs long-press.
 */
class WordPointerPlugin implements PluginValue {
  private view: EditorView;
  private showTimer: number | null = null;
  private hideTimer: number | null = null;
  private longPressTimer: number | null = null;
  private pendingKey = "";
  private openKey = "";
  private openTarget: WordTarget | null = null;
  private popoverHovered = false;
  /** When true, ignore mouse-leave hide (e.g. syllable / lookup panels). */
  private sticky = false;
  private docListening = false;
  private suppressTap = false;
  private pointerDown: {
    x: number;
    y: number;
    pos: number;
    at: number;
    moved: boolean;
  } | null = null;

  constructor(view: EditorView) {
    this.view = view;
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerCancel = this.onPointerCancel.bind(this);
    this.onDocumentPointerMove = this.onDocumentPointerMove.bind(this);
    view.dom.addEventListener("pointermove", this.onPointerMove);
    view.dom.addEventListener("pointerdown", this.onPointerDown);
    view.dom.addEventListener("pointerup", this.onPointerUp);
    view.dom.addEventListener("pointercancel", this.onPointerCancel);
  }

  update(update: ViewUpdate): void {
    if (update.docChanged || update.viewportChanged) {
      this.dismissImmediate();
      return;
    }
    // Font load / measure: keep the pin but refresh React's fixed WordAnchor
    // so popover position matches updated glyph geometry.
    if (update.geometryChanged && this.openKey && this.openTarget) {
      const fresh = resolveWordTarget(this.view, this.openTarget.from);
      if (fresh && targetKey(fresh) === this.openKey) {
        this.openTarget = fresh;
        emitToolbar(this.view, fresh);
      }
    }
  }

  destroy(): void {
    this.clearShow();
    this.clearHide();
    this.clearLongPress();
    this.detachDocumentListener();
    this.view.dom.removeEventListener("pointermove", this.onPointerMove);
    this.view.dom.removeEventListener("pointerdown", this.onPointerDown);
    this.view.dom.removeEventListener("pointerup", this.onPointerUp);
    this.view.dom.removeEventListener("pointercancel", this.onPointerCancel);
  }

  /** React popover enter/leave — part of the hover target while open. */
  setPopoverHovered(hovered: boolean): void {
    this.popoverHovered = hovered;
    if (!this.openKey) return;
    if (hovered) {
      this.clearHide();
    } else {
      this.scheduleHide();
    }
  }

  /**
   * Pin the toolbar open (no mouse-leave dismiss). Used while syllable /
   * thesaurus / rhyme panels are active so editing isn’t interrupted by mouseout.
   */
  setSticky(sticky: boolean): void {
    this.sticky = sticky;
    if (sticky) this.clearHide();
  }

  /** Sync React-driven close with plugin open state. */
  dismiss(): void {
    this.dismissImmediate();
  }

  private clearShow(): void {
    if (this.showTimer !== null) {
      window.clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    this.pendingKey = "";
  }

  private clearHide(): void {
    if (this.hideTimer !== null) {
      window.clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  private clearLongPress(): void {
    if (this.longPressTimer !== null) {
      window.clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  private attachDocumentListener(): void {
    if (this.docListening) return;
    document.addEventListener("pointermove", this.onDocumentPointerMove, true);
    this.docListening = true;
  }

  private detachDocumentListener(): void {
    if (!this.docListening) return;
    document.removeEventListener(
      "pointermove",
      this.onDocumentPointerMove,
      true,
    );
    this.docListening = false;
  }

  private dismissImmediate(): void {
    this.clearShow();
    this.clearHide();
    this.clearLongPress();
    this.popoverHovered = false;
    this.sticky = false;
    this.detachDocumentListener();
    if (this.openKey) {
      this.openKey = "";
      this.openTarget = null;
      emitToolbar(this.view, null);
    }
  }

  private scheduleShow(target: WordTarget): void {
    const key = targetKey(target);
    if (key === this.openKey) {
      this.clearHide();
      return;
    }
    if (key === this.pendingKey && this.showTimer !== null) return;

    this.clearShow();
    this.clearHide();
    this.pendingKey = key;
    this.showTimer = window.setTimeout(() => {
      this.showTimer = null;
      this.pendingKey = "";
      this.setOpen(target);
      emitToolbar(this.view, target);
    }, HOVER_SHOW_MS);
  }

  private scheduleHide(): void {
    this.clearShow();
    if (!this.openKey) return;
    if (this.sticky || this.popoverHovered) return;
    if (this.hideTimer !== null) return;
    this.hideTimer = window.setTimeout(() => {
      this.hideTimer = null;
      this.popoverHovered = false;
      this.detachDocumentListener();
      this.openKey = "";
      this.openTarget = null;
      emitToolbar(this.view, null);
    }, HOVER_HIDE_MS);
  }

  private setOpen(target: WordTarget): void {
    this.openKey = targetKey(target);
    this.openTarget = target;
    this.attachDocumentListener();
  }

  private openNow(target: WordTarget): void {
    this.clearShow();
    this.clearHide();
    this.setOpen(target);
    emitToolbar(this.view, target);
  }

  /** Refresh glyph box from current layout so pin math stays current. */
  private refreshOpenAnchor(): void {
    if (!this.openTarget || !this.openKey) return;
    const fresh = resolveWordTarget(this.view, this.openTarget.from);
    if (fresh && targetKey(fresh) === this.openKey) {
      this.openTarget = fresh;
    }
  }

  private isPinnedWordAt(x: number, y: number): boolean {
    if (!this.openKey || !this.openTarget) return false;
    this.refreshOpenAnchor();
    // Geometry first — empty line margins must not keep the pin alive via
    // snapped document positions.
    const geo = pointerHitsWordAnchor(x, y, this.openTarget.anchor);
    if (geo === true) return true;
    // Bridge the sideOffset gap (and collision-flipped top side) so the
    // pointer can travel word → toolbar without scheduling hide.
    const bridge = pointerHitsWordToolbarBridge(x, y, this.openTarget.anchor);
    if (bridge === true) return true;
    if (geo === false || bridge === false) return false;
    // No glyph box (jsdom): fall back to precise word-under-pointer.
    const target = wordTargetAtPointer(this.view, x, y);
    return target !== null && targetKey(target) === this.openKey;
  }

  private onDocumentPointerMove(event: PointerEvent): void {
    if (!this.openKey) return;
    if (event.pointerType !== "mouse") return;

    if (this.popoverHovered || isInsideToolbar(event.target)) {
      this.clearHide();
      return;
    }

    if (this.isPinnedWordAt(event.clientX, event.clientY)) {
      this.clearHide();
      return;
    }

    this.scheduleHide();
  }

  private onPointerMove(event: PointerEvent): void {
    if (this.pointerDown) {
      const dx = event.clientX - this.pointerDown.x;
      const dy = event.clientY - this.pointerDown.y;
      if (dx * dx + dy * dy > MOVE_CANCEL_PX * MOVE_CANCEL_PX) {
        this.pointerDown.moved = true;
        this.clearLongPress();
        this.clearShow();
      }
      return;
    }

    // Hover affordance is mouse-only; touch uses tap.
    if (event.pointerType !== "mouse") return;

    // While open, pin the word — hover must not retarget. Document listener
    // owns leave detection; editor moves over other words just schedule hide.
    if (this.openKey) {
      if (this.isPinnedWordAt(event.clientX, event.clientY)) {
        this.clearHide();
      } else if (!this.popoverHovered && !isInsideToolbar(event.target)) {
        this.scheduleHide();
      }
      return;
    }

    const target = wordTargetAtPointer(
      this.view,
      event.clientX,
      event.clientY,
    );
    if (!target) {
      this.clearShow();
      return;
    }

    this.scheduleShow(target);
  }

  private onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    this.clearLongPress();
    this.suppressTap = false;

    const target = wordTargetAtPointer(
      this.view,
      event.clientX,
      event.clientY,
    );
    if (!target) {
      this.pointerDown = null;
      this.dismissImmediate();
      return;
    }
    this.pointerDown = {
      x: event.clientX,
      y: event.clientY,
      pos: target.from,
      at: performance.now(),
      moved: false,
    };
    this.longPressTimer = window.setTimeout(() => {
      this.longPressTimer = null;
      const down = this.pointerDown;
      this.pointerDown = null;
      this.suppressTap = true;
      if (!down) return;
      openWordLookup(this.view, "thesaurus", down.pos);
    }, LONG_PRESS_MS);
  }

  private onPointerUp(event: PointerEvent): void {
    this.clearLongPress();
    const down = this.pointerDown;
    this.pointerDown = null;
    if (this.suppressTap || !down || event.button !== 0) return;

    const dx = event.clientX - down.x;
    const dy = event.clientY - down.y;
    if (dx * dx + dy * dy > MOVE_CANCEL_PX * MOVE_CANCEL_PX || down.moved) {
      return;
    }
    if (performance.now() - down.at >= LONG_PRESS_MS) {
      return;
    }

    const target = wordTargetAtPointer(
      this.view,
      event.clientX,
      event.clientY,
    );
    if (!target) {
      this.dismissImmediate();
      return;
    }
    this.openNow(target);
  }

  private onPointerCancel(): void {
    this.clearLongPress();
    this.pointerDown = null;
    this.suppressTap = false;
  }
}

const wordPointerPlugin = ViewPlugin.fromClass(WordPointerPlugin);

function getPlugin(view: EditorView): WordPointerPlugin | null {
  return view.plugin(wordPointerPlugin);
}

/** Open thesaurus/rhyme for the word at selection or an optional document pos. */
export function openWordLookup(
  view: EditorView,
  mode: WordLookupMode,
  pos?: number,
): boolean {
  const handlers = view.state.facet(wordInteractionFacet);
  if (!handlers) return false;
  const target = resolveWordTarget(view, pos);
  if (!target) return false;
  // Drop hover toolbar so React state is owned by the lookup panel.
  getPlugin(view)?.dismiss();
  handlers.onOpenLookup({ ...target, mode });
  return true;
}

/** Open thesaurus for the word at the current selection / caret. */
export function openThesaurusCommand(view: EditorView): boolean {
  return openWordLookup(view, "thesaurus");
}

/** Open rhyme lookup for the word at the current selection / caret. */
export function openRhymeCommand(view: EditorView): boolean {
  return openWordLookup(view, "rhyme");
}

const wordLookupKeymap = keymap.of([
  {
    key: "Mod-'",
    run: openThesaurusCommand,
  },
  {
    key: "Mod-;",
    run: openRhymeCommand,
  },
]);

/** Cancel hide while the pointer is over the portaled toolbar. */
export function setWordToolbarPopoverHovered(
  view: EditorView,
  hovered: boolean,
): void {
  getPlugin(view)?.setPopoverHovered(hovered);
}

/** Pin toolbar open while an intentional panel is active. */
export function setWordToolbarSticky(
  view: EditorView,
  sticky: boolean,
): void {
  getPlugin(view)?.setSticky(sticky);
}

/** Sync React-driven close with the CM plugin open state. */
export function dismissWordToolbar(view: EditorView): void {
  getPlugin(view)?.dismiss();
}

/** Targeted in-place word replace (undoable via CM history). */
export function replaceWordRange(
  view: EditorView,
  from: number,
  to: number,
  insert: string,
): void {
  view.dispatch({
    changes: { from, to, insert },
    selection: { anchor: from + insert.length },
    userEvent: "input.replace.wordLookup",
  });
  view.focus();
}

/**
 * Hover/tap word toolbar + long-press/keymap thesaurus·rhyme bridge.
 */
export function wordInteractionExtension(
  handlers: WordInteractionHandlers,
): Extension {
  return [
    wordInteractionFacet.of(handlers),
    wordPointerPlugin,
    wordLookupKeymap,
  ];
}
