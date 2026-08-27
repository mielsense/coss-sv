import { createContext } from "svelte";

export class ContextMenuIdState {
  #readOpen: () => boolean;
  #readPopupId: () => string;
  #writePopupId: (id: string) => void;

  constructor(
    readOpen: () => boolean,
    readPopupId: () => string,
    writePopupId: (id: string) => void,
  ) {
    this.#readOpen = readOpen;
    this.#readPopupId = readPopupId;
    this.#writePopupId = writePopupId;
  }

  get open(): boolean {
    return this.#readOpen();
  }

  get popupId(): string {
    return this.#readPopupId();
  }

  setPopupId(id: string): void {
    this.#writePopupId(id);
  }
}

export const [getContextMenuIdContext, setContextMenuIdContext] =
  createContext<ContextMenuIdState>();
