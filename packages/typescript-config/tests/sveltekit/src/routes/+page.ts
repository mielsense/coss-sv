import type { PageLoad } from "./$types";

export const load: PageLoad = ({ url }) => {
  const navigation = ["docs", "components"].toSorted();

  return {
    navigation,
    pathname: url.pathname,
  };
};
