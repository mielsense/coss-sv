import { createContext } from "svelte";

export type SidebarState = "collapsed" | "expanded";

export type SidebarContext = {
  readonly isMobile: boolean;
  readonly open: boolean;
  readonly openMobile: boolean;
  readonly state: SidebarState;
  setOpen: (open: boolean | ((current: boolean) => boolean)) => void;
  setOpenMobile: (open: boolean | ((current: boolean) => boolean)) => void;
  toggleSidebar: () => void;
};

const [getSidebarContext, setSidebarContext] = createContext<SidebarContext>();

export function useSidebar(): SidebarContext {
  try {
    return getSidebarContext();
  } catch {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
}

export { setSidebarContext };
