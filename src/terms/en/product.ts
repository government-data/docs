import { concept } from "../types";

// The product's concepts, from guide/concepts.md (and the old glossary where
// it defined them too), shortened to a sentence or two.
export const product = [
  concept(
    "source",
    "A database the organisation already runs. Quality Data reads it and never writes to it.",
    ["sources"],
  ),
  concept(
    "dataset",
    "One table of a source as Quality Data reads it: a name, its fields and the rules that check them.",
    ["datasets"],
  ),
  concept(
    "mapping",
    "How a dataset's table is read: which column each field reads and its type, the record key, each field's priority and the roles of some fields.",
    ["mappings"],
  ),
  concept(
    "record key",
    "The field or fields of a dataset's mapping that tell one record from another.",
    ["record keys"],
  ),
  concept(
    "entity key",
    "The field that tells whom a record is about, such as a person's or a company's identity document; charts by entity need it.",
    ["entity keys"],
  ),
  concept("field role", "What a field is for in a dataset's mapping, such as a grouping field.", [
    "field roles",
  ]),
  concept(
    "grouping field",
    "A field (an office, a region, a channel) that the dashboard and the remediation queues split results by.",
    ["grouping fields", "grouping dimension", "grouping dimensions"],
  ),
  concept(
    "rule",
    "It applies a pattern to a field; the pattern gives it its dimension and a default severity. The rules that count are the ones on main, the approved version.",
    ["rules"],
  ),
  concept(
    "pattern",
    "A reusable way of validating (required, format, fresh and eleven more). Each rule is a pattern applied to a field with its condition.",
    ["patterns", "rule pattern", "rule patterns"],
  ),
  concept(
    "dimension",
    "The kind of quality a rule measures (completeness, validity, timeliness…), given by its pattern.",
    ["dimensions"],
  ),
  concept(
    "severity",
    "A rule's weight in the ICD: blocking 1.0, major 0.6 and minor 0.3. The pattern gives a rule its default severity.",
  ),
  concept(
    "draft",
    "A change to a dataset's rules kept apart from main, usually saved by an author who may edit rules but not approve them, until someone who may approve reviews it and approves or discards it.",
    ["drafts"],
  ),
  concept(
    "global rules",
    "A dataset's file reglas_globales.yaml: what several fields share, such as lists, populations and named rules, declared once for every rules file of the dataset.",
  ),
  concept(
    "named rule",
    "A check written once in a dataset's global rules, with everything but its id and field; a field's rule starts from it with extends.",
    ["named rules"],
  ),
  concept(
    "linter",
    "The checker that reads a rules file as it is typed, without data, and marks its errors, which block saving and deploying, and its warnings.",
  ),
  concept(
    "cut",
    "The dataset's data as it was on one date, copied into the lake so it can be measured again without touching the source. Every figure of a report refers to that moment.",
    ["cuts"],
  ),
  concept("lake", "Quality Data's own store, where it keeps the cuts it copies from the sources."),
  concept("schedule", "What starts a dataset's cuts on its own: daily, weekly, monthly…", [
    "schedules",
  ]),
  concept(
    "evaluation",
    "It runs every rule on main on every record of a cut. A rule fails, passes or does not apply to each record; one it does not apply to is left out of its figures.",
    ["evaluations"],
  ),
  concept(
    "dashboard",
    "Each dataset's charts of the results of the cut chosen: conformity and IGCD by cut, failures by dimension and more.",
    ["dashboards"],
  ),
  concept(
    "finding",
    "A record that fails a rule at a cut. It is resolved when a later cut no longer fails it.",
    ["findings"],
  ),
  concept(
    "remediation queue",
    "The findings of one value of a grouping field, such as an office, a region or a channel, with an SLA in days. The dashboard lists the groups with the most open findings first, each with its priority added up.",
    ["remediation queues"],
  ),
  concept(
    "worker",
    "A program that runs on its own beside the application and does the heavy work: listing a source's tables, mapping a table, copying a cut and evaluating it. Mapping and cuts need at least one.",
    ["workers"],
  ),
  concept(
    "rules catalog",
    "Where Quality Data keeps every dataset's mapping and rules, with their history and the approved version, main.",
  ),
  concept(
    "policy",
    "A set of permissions an administrator gives an account or a group. The product ships ready-made ones for the usual roles, such as quality-steward and quality-viewer.",
    ["policies"],
  ),
  concept(
    "audit trail",
    "The record of who did what and when: changes, runs, and every view of a source's values. Read with the auditor policy.",
    ["audit log"],
  ),
  concept(
    "personal data",
    "Values from a source about a person. They are shown whole only to policies that allow View personal data, such as quality-analyst; anyone else sees them masked, and every whole view is recorded in the audit trail.",
  ),
  concept(
    "service account",
    "A token for a script or another system to use Quality Data in its owner's name; it can do at most what its owner can.",
    ["service accounts"],
  ),
];
