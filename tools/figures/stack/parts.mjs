// Helpers of the technologies' lists (techs-*.mjs): a participation, and
// the units every machine carries.
export const pt = (what, at, state = "built") => ({ what, at, state });
export const AGENTS = ["main.agent", "tw1.agent", "lake.agent"];
export const ALLOYS = ["main.alloy", "tw1.alloy", "lake.alloy"];
