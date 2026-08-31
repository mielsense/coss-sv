import { createContext } from "svelte";

export class ContextMenuIdState {
  #readOpen: () => boolean;
  #readPopupId: () => string;
  #readDefaultPopupId: () => string;
  #writePopupId: (id: string | undefined) => void;

  constructor(
    readOpen: () => boolean,
    readPopupId: () => string,
    readDefaultPopupId: () => string,
    writePopupId: (id: string | undefined) => void,
  ) {
    this.#readOpen = readOpen;
    this.#readPopupId = readPopupId;
    this.#readDefaultPopupId = readDefaultPopupId;
    this.#writePopupId = writePopupId;
  }

  get open(): boolean {
    return this.#readOpen();
  }

  get popupId(): string {
    return this.#readPopupId();
  }

  get defaultPopupId(): string {
    return this.#readDefaultPopupId();
  }

  setPopupId(id: string | undefined): void {
    this.#writePopupId(id);
  }
}

export const [getContextMenuIdContext, setContextMenuIdContext] =
  createContext<ContextMenuIdState>();
