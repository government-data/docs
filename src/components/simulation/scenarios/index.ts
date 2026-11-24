// Every scenario of the simulation, in the order its buttons show them
// within each section (story.ts).
import type { Scenario } from "../story";
import { bigData } from "./bigData";
import { lakeServer, sourceDown, trinoWorkerLost, workerDies } from "./failures";
import { normal } from "./normal";
import { quality } from "./quality";
import { thirdParty } from "./thirdParty";
import { update, updateFails } from "./update";

export const SCENARIOS: Scenario[] = [
  quality,
  thirdParty,
  normal,
  bigData,
  update,
  workerDies,
  sourceDown,
  trinoWorkerLost,
  lakeServer,
  updateFails,
];
