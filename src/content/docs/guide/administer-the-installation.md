---
title: "Tasks: mail, sign-in and updates"
description: The rest of Settings for whoever runs the installation, outgoing mail, signing in with the company directory or an external provider, updates, and adding and approving a machine.
sidebar:
  label: Mail, sign-in and updates
  order: 2.95
---

**Who does this:** an administrator: an account with the role
**Administrator**, or one with the `quality-admin` policy. Each card under
**Settings** (the menu at the top right) shows only to whoever may use it.
Accounts, groups and policies are in [Manage users and
access](../manage-access/).

## To set up outgoing mail

Quality Data sends by e-mail the links that activate accounts and recover
passwords, and its notices. The installation has no mail server of its
own: it uses your organisation's. Without it, no account can be created.

1. In **Settings**, choose **Outgoing mail**. The card says **Not
   configured** until it is set up.
2. Turn on **Send mail** and pick the **Mail provider**: **Office 365
   (Microsoft Graph)** or **SMTP server**, the standard mail protocol.
3. Fill in the fields; each has its help.
4. Under **Send a test email**, choose **Send test**: it uses what is in
   the form, even unsaved.
5. Choose **Save**.

**You should see** _Saved. Outgoing mail is on._, the card saying **On**,
and the test message in your inbox. Under **Password recovery**, **The link
expires in (minutes)** sets how long a recovery link works, from 5 minutes
to a day. With mail off, Quality Data sends nothing, no account can be
created, and **Forgot your password?** says recovery is not available.

## To let people sign in with the company directory

People can sign in with the account they use at work, through the
organisation's directory, over LDAP (Lightweight Directory Access
Protocol), such as Active Directory. Local accounts keep working. The
directory names each account and group by its DN (distinguished name), its
full name there.

1. In **Settings**, choose **LDAP / Active Directory**.
2. Tick **Allow signing in with directory accounts**.
3. Under **Connection**, type the **Server URL**; under **Service
   account**, the **Account DN** and **Password** of an account that may
   read the directory; under **Users and groups**, the **Search base
   (DN)** and the **User filter**. Each field has its help; ask your
   directory's administrator for the values.
4. Under **Administrator groups**, list the directory groups whose members
   are Administrators here, one per line.
5. Under **Test the connection**, type a colleague's e-mail and choose
   **Test**: it shows their **Email**, **Name**, whether they are
   **Administrator**, and their **Direct groups**, without checking any
   password.
6. Choose **Save**.

**You should see** _Saved. LDAP sign-in now uses these settings._

Who can then sign in with the directory:

- Members of an **Administrator groups** group, as Administrators.
- Members of a directory group listed under a group's **Directory groups**
  ([groups](../manage-access/#to-give-policies-to-several-people-groups)),
  as users with that group's policies. Copy each group's DN exactly as
  **Test** shows it under **Direct groups**; groups inside groups do not
  count.
- Nobody else: they get **Invalid email or password.**, as with a wrong
  password.

The note under **Administrator groups** still says that only
administrators sign in with the directory: the groups' **Directory groups**
let other people in too. A directory account shows **Directory (LDAP)**
under **Users**; the directory sets its name and role at every sign-in. An
e-mail that already has a local account keeps signing in with its local
password.

## To let people sign in with Microsoft, Google or another provider

A **Continue with …** button on the sign-in page can send people to an
external provider that speaks OIDC (OpenID Connect).

1. In **Settings**, choose **OAuth2 / OIDC**.
2. Under **Add provider**, choose **+ Microsoft Entra ID** (type your
   organisation's tenant ID in the box first), **+ Google** or **+ Another
   OIDC provider**.
3. Copy the **Redirect URL (register it at the provider)** into the
   provider's application settings, and copy from there the **Client ID**
   and the **Client secret**.
4. For another provider, type its **Issuer** and choose **Discover
   endpoints**.
5. Choose **Save providers**.

**You should see** _Saved. 1 provider active on the sign-in page._ and,
on **Sign in**, a **Continue with …** button. A person gets in only if
they already have an account with that e-mail (when the provider vouches
for it), or once they link the provider under **Settings**, **My account**,
**Linked accounts**, **Link**.

## To install updates

In **Settings**, choose **Updates**: the **Installed version**, its
**Status**, any **New version** with **What's new**, and the **History**.
Before installing, Quality Data waits for running jobs, backs up its
database and, if the new version does not start, goes back to the previous
one by itself. It does not respond for a few minutes.

- **Now:** choose **Update now**, read the dialog and choose **Update**.
  **You should see** _Request sent: it starts in less than a minute_, and
  the progress on every screen.
- **When it updates:** choose **With approval** (each version waits for
  **Update now**), **Automatic** (it installs by itself on the **Days**,
  between **From** and **To**, when no jobs are running) or **Manual** (it
  is installed on the server), set **Wait for jobs to finish for up to
  (min)**, and choose **Save**. **You should see** _Policy saved_.

## To add a machine

In **Settings**, **Execution**, choose **Add a machine**, pick the **Role**
(for now **worker** and **lake-replica** have an installation command; a
lake pool's servers are added in **Settings**, **Lake**, below) and,
if you use them, a **Pool**. For **lake-replica**, type in **Drives** the
path where each of the server's drives is mounted, one per line (each a
filesystem of its own, mounted and empty), or leave it empty and add
`--drive` followed by each path to the end of the command before running
it. Choose **Get the command**. **You should see** the
command with **Copy**, and until when it works: an hour, once. It is shown
only this once; copy it before **I have copied it, close**, or ask for a
new one. Whoever supports your installation runs it as root on the new
server, which then shows in the list as **Pending approval**. For another
role you get the token alone, with no command: no installation exists for
that role yet.

The command also sets up the machine to send its metrics to your
installation's observability server, which Grafana shows. It looks up that
server's address in DNS when it runs: if the address cannot be found it
stops, changing nothing, and if the address changes later, get a new
command and run it again.

## To keep the main lake's admin keys

When whoever supports your installation brings the lake's stack up, it
makes the main lake's admin user and shows, once, on that server's
terminal, an **access key** (`qd-platform-admin`) and a **secret** (64 hex
digits), marked _SHOWN ONLY THIS ONCE_. They are written to no file and
never shown again, so they pass them to you right away. In **Settings**,
**Lake**, under **The main lake's admin user**, paste them in **Access
key** and **Secret** and choose **Keep the keys**. **You should see** _The
main lake's admin keys are kept._ and the access key and when it was
pasted. Above it, **The main lake** says whether Quality Data reaches the
lake with those keys: **You should see** that it answers with the kept
keys, and how many of its drives are online and offline. Nothing is
changed on the lake.

## To define the lake's pool

A lake grows by pools of at least four servers. Before any of them is
installed, in **Settings**, **Lake**, under **The lake's pool**, type in
**Servers** their names, one per line, in order (lowercase letters, digits
and hyphens; each must resolve in DNS from the others), and in **Drives per
server** how many drives each has (the same on every server). Choose **Save
the pool**. **You should see** _The pool main is saved._ and a table of the
servers, each _Not joined yet_. For a server, choose **Command**, type the
mounted paths of its drives (as many as the pool says) or leave it empty,
and choose **Get the command**: it is shown once, as when adding a machine,
and names that server; it joins only under that name. Once a server has
joined, the table shows its state and the pool's servers and drives no
longer change. The first pool is always **main**; adding a second one is
not possible yet.

## To install the lake pool's servers

Whoever supports your installation runs each server's command on that
server, as root, one server after another. The pool forms once all of them
are up. The **last** server of the list makes the lake's admin user and
shows its keys once, as in "To keep the main lake's admin keys": run its
command last. If it ran before the others were up, it says so: once every
server is up, get its command again and run it. The other servers say
which server makes the user.

Each command looks up the other servers' addresses in DNS when it runs,
and lets only those addresses reach the server's port for its peers. So
get each server's command again and run it when:

- a server's address changes, on every other server;
- the lake's replica joins after the pool's servers, on every server, so
  that each one copies to it;
- a server restarts, on that server: until this version keeps its rules
  across a restart, the port is open again to any address, though still
  only to machines with a certificate of your installation.

Running a command again changes nothing that is already in place.

## To keep the lake replica's admin keys

When the **lake-replica** command starts the replica, it makes the lake's
admin user and shows, once, on that server's terminal, an **access key**
(`qd-platform-admin`) and a **secret** (64 hex digits), marked _SHOWN ONLY
THIS ONCE_. They are written to no file and the command never shows them
again, so whoever runs it passes them to you right away. In **Settings**,
**Lake**, paste them in **Access key** and **Secret** and choose **Keep the
keys**. **You should see** _The replica's admin keys are kept._ and, above
the form, the access key and when it was pasted. The secret is not shown
again, here or anywhere; pasting the keys again replaces them.

Above the form, **The replica** says whether Quality Data reaches the
replica with those keys: once the replica is approved in **Execution** and
the keys are kept, **You should see** the replica's name, that it answers
with the kept keys, and how many of its drives are online and offline.
Choose **Ask again** to ask it now. Nothing is changed on the replica.

## To see the lake's replication

Once the main lake's admin keys are kept, Quality Data makes the
installation's warehouse on the main lake when it is missing, before any
replica is there. Once the replica's are kept too and the replica is
approved, it configures the main lake to copy the warehouse into the
replica, where each object is kept for 30 days and no one, not even an
administrator, can delete it or shorten that; the main lake's old versions
are removed after 7 days. It does so when keys are kept and every hour, and
changes nothing when all is already in place. In **Settings**, **Lake**,
**The replication** says whether it is ready and lists each warehouse:
**You should see** _Configured since_ and a date for each. Until the replica
and its keys are there, a warehouse shows _Made on the main lake; its
replication waits for the replica and its keys_. Choose **Ask again** to
read it now.

## To approve a machine

The machines that do the heavy work join the installation from their own
server, which whoever supports your installation sets up with the command
above. In **Settings**, **Execution** lists them. A new one shows **Pending approval** and takes
no work until you choose **Approve**. **Drain** lets one finish what it has
and take nothing new; **Retire** takes it out for good, after a
confirmation.

## Problems

| What you see                                                                                   | What it means and what to do                                                                                                               |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| No card for mail, directory or external sign-in under **Settings**                             | Your policies do not allow configuring them.                                                                                               |
| **Connection OK, but the filter did not find that user.**                                      | Check the **User filter** and the **Search base (DN)**.                                                                                    |
| A directory colleague gets **Invalid email or password.** with the right password              | None of their direct groups is an **Administrator groups** group or in a group's **Directory groups**.                                     |
| **The directory is not responding. Please try again later.**, on **Sign in**                   | Quality Data cannot reach the directory: check the **Server URL** and the network.                                                         |
| **Signing in with the provider did not work. …**                                               | Usually no account has that e-mail: the person signs in with a password and links the provider.                                            |
| **Updates** says **No service** or **Not responding**                                          | The update service on the server is not running. Tell whoever supports your installation.                                                  |
| **Updates** says **This installation is not updated from here …**                              | It is updated another way: ask whoever supports your installation.                                                                         |
| **This installation has no certificate authority yet: no machine can join.**, in **Execution** | Machines cannot join yet. Ask whoever supports your installation.                                                                          |
| **Each drive is an absolute path …**, under **Drives**                                         | A path starts with `/` and has only letters, digits, `.`, `_`, `-` and `/`, as `/srv/disk1`.                                               |
| **The secret is the 64 hex digits join.sh showed …**, under **Secret**                         | Paste the whole secret, as shown, with no other characters.                                                                                |
| The replica's admin keys were lost before they were pasted                                     | The command does not show them again. Ask whoever supports your installation.                                                              |
| **… refuses the kept keys …**, under **The replica**                                           | The keys pasted are not the replica's: paste again the ones its command showed.                                                            |
| **… could not be reached: …**, under **The replica**                                           | Quality Data cannot reach the replica's server. Tell whoever supports your installation what it says.                                      |
| **More than one replica is approved …**, under **The replica**                                 | Retire in **Execution** the machines that are not the replica.                                                                             |
| **The main lake refuses the kept keys …**, under **The main lake**                             | The keys pasted are not the main lake's: paste again the ones shown when its stack was brought up.                                         |
| **The main lake could not be reached …**, under **The main lake**                              | Quality Data cannot reach the lake. Tell whoever supports your installation what it says.                                                  |
| **This installation reaches no lake …**, under **The main lake**                               | Tell whoever supports your installation.                                                                                                   |
| **Failed at …**, under **The replication**                                                     | The step named was refused or not reached. It is tried again every hour; tell whoever supports your installation what it says if it stays. |

## Where next

- [Manage users and access](../manage-access/) and [Personal data and the
  audit trail](../personal-data-and-audit/).
- [Getting started: administrator](../start-admin/): installing the
  product.
