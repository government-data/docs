// The Spanish of the figure, keyed by its English text (i18n.mjs): es.json,
// one entry a text. Names (products, sizes) stay as they are: SAME lists the
// ones a reader sees, so the build can tell a name kept on purpose from a
// text with no translation.
import { readFileSync } from "node:fs";

export const SAME = [
  "PostgreSQL",
  "Superset",
  "Grafana",
  "Loki",
  "Mimir",
  "Alloy",
  "CPU",
  "RAM",
  "Traefik",
  "Trino",
  "OIDC",
  "CA · mTLS",
  "Dolt",
  "RustFS",
  "Iceberg",
  "Valkey",
  "Compose",
  "Quality Data",
  "Government Data",
  "AWS",
  "IAM Roles Anywhere",
  "OpenID Connect",
  "Apache Iceberg",
  "Apache Superset",
  "Grafana Loki",
  "Grafana Mimir",
  "Grafana Alloy",
  "Docker Compose",
  "Big data",
  "qd · AWS",
  "500 GB SSD*",
  "8 vCPU*",
  "32 GB*",
  "100 GB SSD*",
  "16 GB*",
  "4 × 4 TB*",
  "4 vCPU*",
  "2 vCPU*",
  "8 GB*",
];

export const ES = {
  ...Object.fromEntries(SAME.map((name) => [name, name])),
  ...JSON.parse(readFileSync(new URL("./es.json", import.meta.url), "utf8")),
};
