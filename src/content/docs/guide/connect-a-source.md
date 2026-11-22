---
title: "Tasks: connect a source"
description: Which databases Quality Data reads, what to ask your database administrator, and how to add, check, edit and remove a source.
sidebar:
  label: Connect a source
  order: 2.1
---

**Who does this:** a data steward, with the `quality-steward` policy. Anyone
with `quality-analyst` or `auditor` sees the sources and their tables but
cannot change them. The first time through is in
[Getting started: data steward](../start-steward/#1-add-the-source); this
page is the fuller account.

## Which databases can be connected

Today a source can be a **PostgreSQL**, **MySQL** or **SQL Server**
database. Quality Data reads tables; spreadsheets and files cannot be a
source yet.

The **Engine** list in the form also shows `oracle` and `openedge`. They are
not ready yet: a source of either kind cannot be read today.

## What to ask your database administrator

- The **server**'s name or address, and its **port** if it is not the usual
  one (5432 for PostgreSQL, 3306 for MySQL, 1433 for SQL Server).
- The **database** name.
- A **user and password** that can read the tables you want to measure. Ask
  for a read-only user: Quality Data never writes, but a user that cannot
  write makes that certain.
- That the database accepts connections from the servers Quality Data runs
  on, including its workers, which are the ones that connect.
- For SQL Server, any extra connection settings the server needs, such as
  how to encrypt the connection; they go in **Options**.

Each cut reads the whole table it measures, so a large table means a
heavier read: agree with the administrator on a quiet hour for scheduled
cuts.

## What Quality Data does with a source

It **reads**, and only when asked:

- the list of schemas, tables and columns, with their types, when the
  source is saved and each time someone lists it again;
- a sample of a table when it is mapped, of which it keeps counts, never
  values;
- the whole table at each cut, copied into its own store, the lake;
- a page of records when someone opens a table's **Records**.

It **never** writes, changes or deletes anything in the source. Removing a
source or a dataset in Quality Data leaves the database as it was.

## How credentials are kept

The user and password are stored sealed (encrypted) in Quality Data's own
database. Nobody sees them again, not even an administrator: editing the
source shows them empty. They never appear in logs or notices. A worker
receives them only for the job that needs them.

When you change the password, the previous one is kept as well: if the
source still refuses the new one, a cut tries the previous one. This lets
your database administrator change the password without stopping the
cuts for a moment. Every change of credentials is recorded in the
audit trail, never their value.

## To add a source

1. In the **Explorer**, in the side bar, choose **+** beside **Sources**
   (**New source**).
2. Type a **Name**: lowercase letters, digits and `_`, starting with a
   letter, such as `customers_db`. It cannot be changed later.
3. In **Engine**, pick the entry that starts with `postgres`, `mysql` or
   `sqlserver`.
4. Fill in **Server**, **Database**, **User** and **Password**, and
   **Port** if it is not the usual one. Fields marked `*` are required; the
   form lists those still missing.
5. Choose **Save**.

**You should see** the source in the Explorer, under **Sources**. Open it:
Quality Data connects at once and lists its tables. The source shows its
database, then its schemas and tables, and a line that says how many tables
it read and when.

## To check the connection

There is no separate test button: listing the tables is the test. Open the
source in the Explorer and choose **List again**. The line under the source
goes through **Connecting to the source…**, **Reviewing its schemas…**,
**Reading the columns…** and **Loading the tables…**, then says how many
tables it read and when.

If the listing cannot connect, it tries again by itself, three times in all,
and says so (_Retrying, attempt 2 of 3…_). After the last attempt it shows
the reason: see [Problems](#problems).

Open a table to see its columns and their types. A table no dataset reads
yet is marked **not read**, and one that has disappeared from the source,
**gone**. To find a table among many, type part of its name in **Filter by
schema, table or column**.

## To look at a table's records

Choose **Records** beside a table. Pick what to **Read** (the first or last
1,000, or all of them 1,000 at a time) and, if you want, a column to
**Order by**, then **Read**. The records come straight from the source, as
they are now, every value masked. With permission to see personal data,
**Show values** shows them whole with a purpose and, if you want, a
reference, and each page shown is recorded in the audit trail ([To show
values whole](../personal-data-and-audit/#to-show-values-whole)).

## To edit a source

1. Open the source in the Explorer and choose **Edit**.
2. Change what you need. The user and password show empty with **Stored:
   leave it empty to keep it.**: leave them empty to keep them, or type new
   ones.
3. Choose **Save**.

Quality Data lists the tables again with the new settings. The next cuts of
every dataset that reads the source use them.

## To remove a source

1. Open the source in the Explorer and choose **Delete**.
2. In **Delete the source …**, read the warning and choose **Delete**.

The source and its credentials, the previous version too, are gone. A
source cannot be removed while a dataset reads it: remove those datasets
first, as [Map a table into a dataset](../map-a-table/#to-remove-a-dataset)
explains, or keep the source.

## Problems

| What you see                                                                          | What it means and what to do                                                                                                                                                                               |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No **+** beside **Sources**, and no **Edit** or **Delete**                            | Your policies do not let you manage sources. Ask your administrator for `quality-steward`.                                                                                                                 |
| **The source did not accept the connection: check its server, port and credentials.** | The server could not be reached, or refused the user. Check the fields with **Edit**. If they are right, ask the database administrator whether the workers can reach the server and the user can sign in. |
| **The tables could not be read. Check the source's connection, and refresh.**         | The listing gave up after three attempts. Fix what the message before it says, then **List again**.                                                                                                        |
| **The source's catalog could not be read.** or **The listing could not finish.**      | The list of tables could not be read. Check with the database administrator that the user can see the schemas, then **List again**. If it persists, tell whoever supports your installation.               |
| **Its tables have not been read yet.**                                                | Nobody has listed the source. Choose **List again**.                                                                                                                                                       |
| **Only the first ones are shown: search for the one you need.**                       | The source has more tables than the Explorer shows. Type part of the name in the filter.                                                                                                                   |
| **The name is not valid.**, **The port is not valid.**, **… is missing.**             | The form refused a field. Fix it and save again.                                                                                                                                                           |
| A SQL Server source was saved, but a message says its catalog was not created         | Quality Data could not prepare the connection to it. Choose **Save** again to retry.                                                                                                                       |
| **It cannot be deleted: these datasets read it: …**                                   | Remove the datasets named, or keep the source.                                                                                                                                                             |
| On deleting, a message says the source's catalog was not dropped                      | Nothing was deleted. Try again.                                                                                                                                                                            |
| **Could not load. Try again.**, and the Explorer stays empty                          | The installation cannot measure data yet. Tell your administrator.                                                                                                                                         |

## Where next

[Map a table into a dataset](../map-a-table/), then
[Run and schedule cuts](../run-cuts/).
