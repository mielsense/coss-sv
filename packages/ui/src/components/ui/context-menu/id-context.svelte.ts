import { createContext } from "svelte";

export class ContextMenuIdState {
  #readOpen: () => boolean;
  popupId = $state("");

  constructor(readOpen: () => boolean, popupId: string) {
    this.#readOpen = readOpen;
    this.popupId = popupId;
  }

  get open(): boolean {
    return this.#readOpen();
  }

  setPopupId(id: string): void {
    this.popupId = id;
  }
}

export const [getContextMenuIdContext, setContextMenuIdContext] =
  createContext<ContextMenuIdState>();
