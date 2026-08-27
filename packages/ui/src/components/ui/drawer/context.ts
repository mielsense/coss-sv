import { createContext } from "svelte";
export type DrawerPosition = "right" | "left" | "top" | "bottom";
export type DrawerPositionContext = { readonly position: DrawerPosition };
export const [getDrawerPositionContext, setDrawerPositionContext] =
  createContext<DrawerPositionContext>();
