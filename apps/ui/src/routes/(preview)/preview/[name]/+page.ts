import type { PageLoad } from "./$types";
import { resolvePreviewPage } from "./preview-page.js";

export const load: PageLoad = ({ params }) => resolvePreviewPage(params.name);
