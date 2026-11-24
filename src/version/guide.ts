// The version of this build of the guide: module.yaml's, read at build time
// (a raw import, resolved by Vite), never written anywhere else.
import manifest from "../../module.yaml?raw";
import { versionOf } from "./index";

export const GUIDE_VERSION = versionOf(manifest);
