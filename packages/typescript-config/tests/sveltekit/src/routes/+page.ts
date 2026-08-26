import type { PageLoad } from "./$types";

export const load: PageLoad = ({ url }) => ({
  pathname: url.pathname,
});
