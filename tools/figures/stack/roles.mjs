// The machines' roles: how many, what drives their size, and the ports an
// administrator opens. Re-exported by model.mjs. The sizes are in
// specs.mjs.
export const ROLES = [
  {
    id: "main",
    role: "Main server",
    count: "1",
    drives: "how many people and modules use it at once",
    ports: ":443 from people's network; outbound HTTPS to AWS",
  },
  {
    id: "worker",
    role: "Trino worker",
    count: "1 to start; add more for big data",
    drives: "the size of the largest jobs and how many run at once",
    ports: "none from people; out to the source databases' own ports",
  },
  {
    id: "lake",
    role: "Lake server",
    count: "1",
    drives: "how much data is copied from the sources, and for how long it is kept",
    ports: "none from people",
  },
  {
    id: "replica",
    role: "Lake replica · optional",
    count: "1, at another site",
    drives: "the lake's size, plus 30 days of locked versions",
    ports: "from the lake server only",
  },
];

// What an administrator provides.
export const NEEDS = [
  ["A private network between the machines", "only Traefik's :443 on the main server is reached by people"],
  ["Outbound HTTPS from the main server", "to AWS's public endpoints for S3, ECR and IAM Roles Anywhere"],
  ["A time source", "synchronised clocks on every machine: certificates last about a day"],
  ["Read-only logins to the source databases", "one per source, kept as the core's secrets"],
];
