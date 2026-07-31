import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Project } from "@/lib/projects/types";

type ProjectSwitcherProps = {
  projects: Project[];
  activeId: string;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
};

export function ProjectSwitcher({
  projects,
  activeId,
  onSwitch,
  onCreate,
  onRename,
  onDelete,
}: ProjectSwitcherProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);
  const renameInputId = useId();
  const suppressMenuFocusRestore = useRef(false);

  const active = projects.find((p) => p.id === activeId) ?? projects[0];
  const canDelete = projects.length > 1;
  const activeName = active?.name ?? "Draft";

  useEffect(() => {
    if (!renameOpen) return;
    const frame = window.requestAnimationFrame(() => {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [renameOpen]);

  const openRename = () => {
    if (!active) return;
    suppressMenuFocusRestore.current = true;
    setRenameValue(active.name);
    setRenameOpen(true);
  };

  const openDelete = () => {
    if (!canDelete) return;
    suppressMenuFocusRestore.current = true;
    setDeleteOpen(true);
  };

  const handleConfirmRename = () => {
    if (!active) return;
    onRename(active.id, renameValue);
    setRenameOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!active || !canDelete) return;
    onDelete(active.id);
    setDeleteOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 max-w-48 gap-1 border-transparent bg-transparent px-2.5 font-normal text-muted-foreground shadow-none hover:text-foreground"
            aria-label={`Draft: ${activeName}`}
          >
            <span className="truncate">{activeName}</span>
            <ChevronDown className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-48"
          onCloseAutoFocus={(event) => {
            if (suppressMenuFocusRestore.current) {
              event.preventDefault();
              suppressMenuFocusRestore.current = false;
            }
          }}
        >
          {projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              onSelect={() => onSwitch(project.id)}
              aria-current={project.id === activeId ? "true" : undefined}
            >
              <span className="min-w-0 flex-1 truncate">{project.name}</span>
              {project.id === activeId ? (
                <>
                  <span className="sr-only">(current)</span>
                  <Check className="size-4" />
                </>
              ) : null}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={onCreate}>
            <Plus className="size-4" />
            New draft
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={openRename}>
            <Pencil className="size-4" />
            Rename
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            disabled={!canDelete}
            onSelect={openDelete}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Rename draft</DialogTitle>
            <DialogDescription>
              Choose a name for this draft.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              handleConfirmRename();
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor={renameInputId}>Name</Label>
              <Input
                ref={renameInputRef}
                id={renameInputId}
                value={renameValue}
                onChange={(event) => setRenameValue(event.target.value)}
                autoComplete="off"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRenameOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete draft?</DialogTitle>
            <DialogDescription>
              Delete “{active?.name}”? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
