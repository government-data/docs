import { concept } from "../types";

// Concepts of data quality and its indicators, from the old glossary
// (guide/glossary.md), shortened to a sentence or two.
export const quality = [
  concept(
    "accuracy",
    "Quality dimension: the value represents reality correctly. Without an external source it is approximated by plausibility.",
  ),
  concept(
    "active customer",
    "A customer with a current relationship with the organisation. The optional SFC indicator is measured over active records only.",
    ["active customers", "active client", "active clients"],
  ),
  concept(
    "band",
    "The band of an entity's ICD: good (≥ 0.90), fair (0.75–0.90) or poor (< 0.75).",
    ["bands"],
  ),
  concept("baseline", "A first measurement taken as the reference later ones are compared with.", [
    "baselines",
  ]),
  concept(
    "systemic cause",
    "A cause of errors that comes from a load, a master, a catalog or the passing of time, fixed once at the source or with a campaign. A capture cause depends on who recorded the data and is fixed case by case at the office.",
    ["systemic causes", "capture cause", "capture causes"],
  ),
  concept(
    "cell",
    "Each field the optional SFC indicator evaluates: 1 when at least 90 % of the active records have it right, 0 otherwise.",
    ["cells"],
  ),
  concept("completeness", "Quality dimension: the data is present when it must be."),
  concept(
    "ICD components",
    "The parts that add up to a field's ICD: C (conformity with the field's own rules), S (consistency with other fields) and A (timeliness).",
    ["components of the ICD"],
  ),
  concept(
    "conformity",
    "The share of the records a rule applies to that meet it: 1 − failures / applies.",
  ),
  concept(
    "consistency",
    "Quality dimension: the data does not contradict other fields or sources (for example, net worth = assets − liabilities).",
  ),
  concept(
    "coverage",
    "For a batch of third-party data, the share of its records that match records already held.",
  ),
  concept("data owner", "The business person responsible for a data element's meaning and rules.", [
    "data owners",
  ]),
  concept(
    "data quality desk",
    "The team that reviews the cases that cannot be fixed automatically (suspicious batches, outliers, disagreements) and decides what to do with them.",
    ["quality desk"],
  ),
  concept(
    "enhanced due diligence",
    "Reinforced verification of a customer because of higher risk, required of regulated financial entities.",
  ),
  concept(
    "expiring field",
    "A field whose value loses validity over time (contact, income, occupation…). Only these carry the timeliness component A.",
    ["expiring fields"],
  ),
  concept(
    "field rule",
    "A rule (C) for data that is wrong by itself: empty, misspelled, impossible length. A cross rule (S) is for data that contradicts another field, for example a retiree with an employer.",
    ["field rules", "cross rule", "cross rules"],
  ),
  concept(
    "field priority",
    "Critical, high, medium or low: it weights each field in a record's ICD and in a finding's priority (weights 4, 3, 2, 1).",
  ),
  concept(
    "functional dependency",
    "A relation in which one attribute determines another (occupation → admissible activity codes; region → postcode prefix).",
    ["functional dependencies"],
  ),
  concept(
    "ISO 8000",
    "Master data quality standard: quality is declared against explicit requirements, with provenance and traceability.",
  ),
  concept(
    "ISO/IEC 25012",
    "Data quality model: inherent dimensions (accuracy, completeness, consistency, credibility, timeliness) and system-dependent ones.",
  ),
  concept(
    "margin",
    "For a passing cell of the optional SFC indicator, how many records could break before it falls below 90 %.",
  ),
  concept(
    "onboarding",
    "The process in which a person or company becomes a customer; most of their data is captured there.",
  ),
  concept(
    "plausibility",
    "That a value is believable. A negative net worth or expenses far above income are possible but unlikely: they are confirmed with the customer, not taken as errors.",
  ),
  concept(
    "precedence of sources",
    "The rule that defines, per attribute, which source wins in a conflict (internal or external) according to its reliability and age.",
    ["precedence"],
  ),
  concept(
    "closeness to the threshold",
    "In the optional SFC indicator, a weight that favours fields with 80 % to 90 % right, where the fewest fixes turn a cell from 0 to 1.",
  ),
  concept(
    "quarantine",
    "An isolated area where a suspicious data element or batch stays until validated; nothing is written to production before.",
  ),
  concept(
    "reconciliation",
    "A field-by-field comparison of an external value with the internal one of the same customer: they agree, disagree, or the external one fills a gap.",
  ),
  concept(
    "referential integrity",
    "Quality dimension: a code points to something that exists in its master (for example, the advisor's code is in the advisors' master).",
  ),
  concept(
    "segment",
    "The commercial group a customer belongs to; it defines the offer and the service.",
    ["segments"],
  ),
  concept(
    "SFC indicator",
    "The data quality indicator of Colombia's financial supervisor, for the entities it supervises: the share of its cells that meet the 90 % threshold. Quality Data computes it from the same rule results as the ICD when a dataset takes part in it.",
  ),
  concept(
    "stratum",
    "In Colombia, the socio-economic stratum of a dwelling (1 to 6). It applies to individuals, not to companies.",
  ),
  concept(
    "timeliness",
    "Quality dimension: the data is up to date. A mobile phone that was right five years ago may not be today.",
  ),
  concept(
    "uniqueness",
    "Quality dimension: an entity appears only once (a unique document; a mobile phone or e-mail not shared).",
  ),
  concept(
    "update campaign",
    "A mass action so customers confirm or correct their data (digital channels, calls or at the office). It is how outdated data is handled, since it is not solved case by case.",
    ["update campaigns"],
  ),
  concept(
    "validity",
    "Quality dimension: the data has the right form and an allowed value (an e-mail with an @ and a domain; a region from its list).",
  ),
];
