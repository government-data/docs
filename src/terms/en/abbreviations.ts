import { abbr } from "../types";

// The abbreviations of the English pages: those of the old glossary, in its
// words, and standard ones in plain words.
export const abbreviations = [
  abbr(
    "AML",
    "Anti-money laundering",
    "Controls against money laundering and terrorist financing. In Colombia, supervised financial entities manage them with SARLAFT; see the optional sector module.",
  ),
  abbr(
    "API",
    "Application programming interface",
    "The entry point other programs use to talk to the platform; its own screens use it too.",
  ),
  abbr(
    "CDE",
    "Critical data element",
    "A data element whose errors have a material regulatory, financial or commercial impact; in Quality Data, a field given a critical or high priority.",
  ),
  abbr(
    "CIIU",
    "International Standard Industrial Classification (Colombia's adaptation)",
    "In Colombia, the 4-digit code of an economic activity.",
  ),
  abbr(
    "CPU",
    "Central processing unit",
    "A server's processor; the installer asks for at least 2.",
  ),
  abbr(
    "CSRF",
    "Cross-site request forgery",
    "An attack in which another website tries to act with a signed-in person's session; the platform blocks it with a token kept in a cookie.",
  ),
  abbr(
    "DAMA",
    "DAMA International (Data Management Association)",
    "The professional association that publishes DAMA-DMBOK, the data management body of knowledge.",
  ),
  abbr(
    "DAMA-DMBOK",
    "DAMA International's data management body of knowledge",
    "Governance framework, roles (owner, steward) and quality cycle.",
  ),
  abbr(
    "DANE",
    "Departamento Administrativo Nacional de Estadística",
    "Colombia's national statistics department, which issues the DIVIPOLA codes.",
  ),
  abbr(
    "DN",
    "Distinguished name",
    "The full name of an entry in a company directory, such as a group: CN=Quality,OU=Groups,DC=example,DC=org.",
  ),
  abbr(
    "DIVIPOLA",
    "Colombia's political-administrative division",
    "In Colombia, the 5-digit code of a municipality or the 8-digit code of a place; the first 2 digits are the department.",
  ),
  abbr(
    "HTTPS",
    "Hypertext Transfer Protocol Secure",
    "The secure web protocol: the product is reached over it, with the certificate the installer makes.",
  ),
  abbr(
    "ICD",
    "Data reliability index",
    "A score from 0 to 1 for each field of each record that combines conformity with its own rules, consistency with other fields and timeliness; weighted by priority, it gives a record's and an entity's ICD.",
  ),
  abbr(
    "IEC",
    "International Electrotechnical Commission",
    "An international standards body; with ISO it publishes ISO/IEC 25012.",
  ),
  abbr(
    "IGCD",
    "Overall data quality index",
    "The mean ICD of a dataset at a cut: the one figure to follow over time.",
  ),
  abbr(
    "ISO",
    "International Organization for Standardization",
    "The international body that publishes standards such as ISO 8000.",
  ),
  abbr(
    "JSON",
    "JavaScript Object Notation",
    "A common plain-text format in which programs exchange structured data.",
  ),
  abbr("KB", "Kilobyte", "A unit of file size, about a thousand bytes."),
  abbr(
    "LDAP",
    "Lightweight Directory Access Protocol",
    "The standard way to look up people in an organisation's user directory, so they can sign in with the account they already use at work.",
  ),
  abbr(
    "MAD",
    "Median absolute deviation",
    "How spread the data is around its typical value: the median of the distances of each value to the median. An extreme value does not inflate it, which is why it serves to find outliers.",
  ),
  abbr(
    "MVP",
    "Minimum viable product",
    "The first version of the service that already gives useful results with real data, to validate it before building the rest.",
  ),
  abbr(
    "NBSP",
    "Non-breaking space (U+00A0)",
    "It looks like a space, but breaks comparisons and searches.",
  ),
  abbr(
    "OIDC",
    "OpenID Connect",
    "A standard for signing in through an external identity provider, such as the organisation's corporate account.",
  ),
  abbr(
    "OTP",
    "One-time code",
    "A code sent to a mobile phone or an e-mail address to check the person really has it.",
  ),
  abbr("P99", "Percentile 99", "The value below which 99 % of the data falls."),
  abbr(
    "PEP",
    "Politically exposed person",
    "Someone who holds, or is close to, a prominent public position; financial regulation requires reinforced AML controls for them.",
  ),
  abbr(
    "PSI",
    "Population stability index",
    "How much a data element's distribution changed between two groups, comparing their shares across 10 bins of the base. Under 0.10, stable; 0.10 to 0.25, moderate change to watch; above 0.25, large change: the batch is reviewed before use.",
  ),
  abbr(
    "RE2",
    "Google's regular-expression engine",
    "The dialect the rules' regular expressions are written in; it always runs in predictable time, so it has no backreferences or lookaround.",
  ),
  abbr(
    "S3",
    "Simple Storage Service",
    "Amazon's interface for storing files, which many storage systems (RustFS among them) also offer.",
  ),
  abbr(
    "SARLAFT",
    "Sistema de Administración del Riesgo de Lavado de Activos y Financiación del Terrorismo",
    "Colombia's system for managing money-laundering and terrorist-financing risk, required of supervised financial entities.",
  ),
  abbr(
    "SFC",
    "Superintendencia Financiera de Colombia",
    "Colombia's financial supervisor. Its data quality indicator applies only to the entities it supervises.",
  ),
  abbr(
    "SIEM",
    "Security information and event management",
    "The system where an organisation's security team gathers and watches the logs of all its applications.",
  ),
  abbr(
    "SLA",
    "Service level agreement",
    "A measurable commitment of time; a remediation queue's SLA is the days allowed to fix its findings, 30 unless someone sets another.",
  ),
  abbr(
    "SMTP",
    "Simple Mail Transfer Protocol",
    "The standard mail protocol; through it, the organisation's mail server sends colleagues their activation links.",
  ),
  abbr(
    "SQL",
    "Structured Query Language",
    "The standard language for querying databases; the platform turns each rule into SQL for the engine that runs it.",
  ),
  abbr(
    "TLS",
    "Transport Layer Security",
    "The encryption that protects data travelling between two systems; with mutual TLS, both sides prove who they are with a certificate.",
  ),
  abbr("VM", "Virtual machine", "A computer simulated in software on a physical server."),
  abbr(
    "YAML",
    "YAML Ain't Markup Language",
    "A plain-text format, easy for people to read and write, in which rules are written.",
  ),
];
