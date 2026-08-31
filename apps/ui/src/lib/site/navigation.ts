import { componentCategories } from "./categories.js";
import {
  hooksNavigation,
  overviewNavigation,
  primaryNavigation,
  resourcesNavigation,
} from "./site.js";

export type NavigationItem = {
  href: string;
  label: string;
  componentSlug?: string;
  isNew?: boolean;
};

export type NavigationGroup = {
  items: readonly NavigationItem[];
  label: string;
};

export const componentNavigation: readonly NavigationItem[] = componentCategories.map(
  ({ docsName, isNew, name, slug }) => ({
    componentSlug: slug,
    href: `/docs/components/${slug}`,
    label: docsName ?? name,
    ...(isNew ? { isNew: true } : {}),
  }),
);

export const documentationNavigationGroups: readonly NavigationGroup[] = [
  { label: "Overview", items: overviewNavigation },
  { label: "Components", items: componentNavigation },
  { label: "Hooks", items: hooksNavigation },
  { label: "Resources", items: resourcesNavigation },
];

export const commandNavigationGroups: readonly NavigationGroup[] = [
  { label: "Pages", items: primaryNavigation },
  ...documentationNavigationGroups,
];
