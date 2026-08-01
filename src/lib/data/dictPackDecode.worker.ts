/**
 * Decodes dictionary packs off the main thread.
 */
import { decodePack, type DictPackKind } from "./dictPackCodec";

type Request = {
  kind: DictPackKind;
  buffer: ArrayBuffer;
};

self.onmessage = (event: MessageEvent<Request>) => {
  try {
    const { kind, buffer } = event.data;
    const decoded = decodePack(kind, new Uint8Array(buffer));
    self.postMessage(decoded);
  } catch (err) {
    self.postMessage({
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
