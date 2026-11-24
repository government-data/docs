// Every scenario of the simulation, in the order its buttons show them
// within each section (story.ts).
import type { Scenario } from "../story";
import { quality } from "./quality";
import { thirdParty } from "./thirdParty";

export const SCENARIOS: Scenario[] = [quality, thirdParty];
