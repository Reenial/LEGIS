# A. Overview of Group Activities

## A.1 Meeting Log

The following entries summarize the project milestones and coordination outcomes reported by the team.

| Date and participants | Main topic | Decision, action, or open question | Result |
| --- | --- | --- | --- |
| 19 October 2026 | Topic approval | The Lost & Found topic was approved. Daniel developed the topic. | [Project scope](1-Project-Scope.md) |
| 28 October 2026, Iva Puljak and Nika Kožul | Initial documentation | Updated chapters 1, 2, and 3. | [Scope](1-Project-Scope.md), [requirements](2-requirements.md), and [use cases](3-use-cases.md) |
| 29 October 2026, Lovre Galov | Project presentation | Lovre presented the project. | Project presentation |
| 30 October 2026, Iva Puljak and Lea Lendić | Database implementation | Prepared the SQL database. | [Database files](../database) |
| 4 November 2026, Iva Puljak and Nika Kožul | Architecture documentation | Completed chapter 4. | [Architecture and design](4-Architecture-and-Design.md) |
| 12 November 2026, Lea Lendić, Mihael Jurković, Daniel Božulić, Ivan Jović, and Lovre Galov | Application implementation | Completed frontend and backend development for this stage. | [Frontend](../frontend) and [backend](../backend) |
| 16 November 2026, Iva Puljak | Frontend update | Added further frontend work. | [Frontend](../frontend) |
| 17 November 2026, Nika Kožul and Iva Puljak | Documentation update | Nika prepared the README Template and group activity overview. Iva updated the documentation to reflect subsequent implementation work. | [README Template](../README_TEMPLATE.md) and project documentation |

## A.2 Work Plan

The team coordinates tasks through WhatsApp and manages changes with Git. The table records completed work and the next planned implementation tasks.

| Period | Principal work | Responsible members | Result |
| --- | --- | --- | --- |
| 19–29 October 2026 | Topic, initial documentation, and presentation | Daniel Božulić, Iva Puljak, Nika Kožul, Lovre Galov | Approved topic, updated chapters 1–3, and project presentation |
| 30 October–4 November 2026 | Database and architecture documentation | Lea Lendić, Iva Puljak, Nika Kožul | SQL database and chapter 4 |
| By 12 November 2026 | Frontend and backend implementation | Lea Lendić, Mihael Jurković, Daniel Božulić, Ivan Jović, Lovre Galov | Frontend and backend completed for this stage |
| 16 November 2026 | Update the frontend | Iva Puljak | Frontend updates |
| 17 November 2026 | Update documentation and activity records | Nika Kožul and Iva Puljak | README Template, activity overview, and updated documentation |
| Next three weeks | Implement return requests and private chats | Frontend — Lea Lendić and Mihael Jurković. Backend — Daniel Božulić, Ivan Jović, and Lovre Galov. | Planned implementation |

## A.3 Activity Table

The following approximate totals were confirmed by Nika for the work described in this overview. Each total includes the member's listed activities.

| Activity or deliverable | Member | Estimated total hours | Representative result |
| --- | --- | --- | --- |
| Backend, DevOps, and project topic development | Daniel Božulić | 45 | [Scope](1-Project-Scope.md), [backend](../backend), and [Render configuration](../render.yaml) |
| Frontend and database design | Lea Lendić | 35 | [Frontend](../frontend) and [database](../database) |
| Backend and project presentation | Lovre Galov | 40 | [Backend](../backend) and presentation on 29 October 2026 |
| Documentation | Nika Kožul | 25 | [Documentation](Home.md) and [README Template](../README_TEMPLATE.md) |
| Database and documentation | Iva Puljak | 35 | [Database](../database), [documentation](Home.md), and [frontend](../frontend) |
| Frontend development | Mihael Jurković | 30 | [Frontend](../frontend) |
| Backend development | Ivan Jović | 40 | [Backend](../backend) |

The repository includes Docker configuration for the frontend, backend, and database, Render deployment configuration, and GitHub Actions workflows for backend tests and frontend builds. The deployment workflow depends on a configured Render deploy hook. The team confirmed that Google Sign-In, browsing posts, and creating posts work for all members in the [public application](https://ferlostandfound.onrender.com/).

## A.4 Change Overview Diagram

See the [GitHub Contributors view](https://github.com/Reenial/LEGIS/graphs/contributors) and [develop branch commit history](https://github.com/Reenial/LEGIS/commits/develop/) for repository changes. This activity overview covers 19 October–17 November 2026.

The activity table records documentation, presentations, and shared work alongside code changes.

## A.5 Key Challenges and Solutions

| Challenge | Action taken | Outcome or remaining limit |
| --- | --- | --- |
| The Render backend became inactive after about 15 minutes without traffic. Requests from the frontend did not reliably restart it, and the initial workaround also had problems on mobile. | Daniel added a browser request to wake the backend and retry the connection. If this does not work for a read request, the browser opens the backend wake page, which redirects the user back to the app. | The team reports that the desktop and mobile issue was fixed. Starting the backend after inactivity can still take some time. |
