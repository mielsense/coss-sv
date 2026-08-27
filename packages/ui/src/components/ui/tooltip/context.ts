import { createContext } from "svelte";
import type { TooltipHandle } from "./handle.svelte.js";

export const [getTooltipHandleContext, setTooltipHandleContext] = createContext<TooltipHandle>();
