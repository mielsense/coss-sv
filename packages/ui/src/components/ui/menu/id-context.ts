import { createContext } from "svelte";

export type MenuIdContext = {
  readonly open: boolean;
  popupId: string;
};

export const [getMenuIdContext, setMenuIdContext] = createContext<MenuIdContext>();
