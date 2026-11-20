# Lost & Found — Project Documentation

**Course:** [Software Engineering](https://www.fer.unizg.hr/predmet/proinz), Faculty of Electrical Engineering and Computing, University of Zagreb  
**Academic year:** 2026/2027  
**Team:** 8.2 — 007  
**Instructor:** prof. dr. sc. Vlado Sruk  
**Assistant:** univ. mag. ing. comp. Marin Matjanec  
**Demonstrator:** Kristijan Gas

## Project Overview

Lost & Found is a web application for students and staff at the university who have lost or found personal belongings on campus. It brings lost and found item posts together in one place, so users can search them by keywords, category, date, and map area instead of following several student groups and social media channels. Signed-in users publish posts with a location and keep an optional hidden detail private, which the finder will use to check return requests.

**Application and basic setup:** [Repository README](../README.md#quick-start)  
**Public application:** [ferlostandfound.onrender.com](https://ferlostandfound.onrender.com/) (see [README – Deployment](../README.md#deployment))

## Team Members and Roles

The maintained list of members and their main contributions is in the [repository README](../README.md#team-members). Hours and individual activities are recorded in [A. Overview of Group Activities](A-Overview-of-Group-Activities.md).

## Documentation Index

| Page | Purpose |
| --- | --- |
| [1. Project Scope](1-Project-Scope.md) | Problem, objective, and boundary of the project |
| [2. Requirement Analysis](2-requirements.md) | Requirements, constraints, and traceability |
| [3. Use Cases](3-use-cases.md) | Actors and representative user interactions |
| [4. Architecture and Design](4-Architecture-and-Design.md) | Main design decisions, structure, data, and behavior |
| [5. Testing](5-Testing.md) | Test approach, actual results, and known defects |
| [6. Deployment, Installation, and Configuration](6-Deployment-Installation-and-Configuration.md) | Local installation, configuration, public deployment, and administration |
| [7. Conclusion and Future Work](7-Conclusion-and-Future-Work.md) | Conclusion and future work |
| [A. Overview of Group Activities](A-Overview-of-Group-Activities.md) | Team activities, contributions, and challenges |

Related reference pages: [backend API](../backend/API.md) and [database setup](../database/README.md).

## Project Milestones

| Checkpoint | Demonstration | Video |
| --- | --- | --- |
| Week 7 — first review | Upcoming. The version to be demonstrated is the [public application](https://ferlostandfound.onrender.com/). | Not recorded yet |
| Week 14 — final review | Planned | Not recorded yet |

The documentation is updated as the application develops; only weeks 7 and 14 are formal checkpoints.

## Project Organization and Development Process

**Working approach:** Work is divided by area: frontend, backend, database, and documentation, with the members responsible for each listed in the [README](../README.md#team-members). The team coordinates in a WhatsApp group. Code changes are made on the `develop` branch and merged into `main`; a push to `main` triggers deployment to Render. GitHub Actions run the backend tests and the frontend build on pushes and pull requests to `main` and `develop`.  
**Current task and defect tracking:** Tasks and defects are agreed in the team's WhatsApp group; the team does not use a separate issue board. Completed work is visible in the [Git history](https://github.com/Reenial/LEGIS/commits/develop/), and planned work is listed in [A.2 Work Plan](A-Overview-of-Group-Activities.md#a2-work-plan).

## Documentation Conventions

The documentation consists of linked Markdown pages in the `docs/` folder. UML diagrams are written in PlantUML in [`docs/puml/`](puml). On every push to `main` that changes a `.puml` file, a GitHub Actions workflow regenerates all SVG images in `docs/assets/diagrams/`, so only generated diagrams belong in that folder. The ER diagram is drawn in pgAdmin and kept separately in [`docs/assets/erd/`](assets/erd). The pages describe the implemented application; behavior that is not implemented yet is marked as planned.

## Academic Integrity, Conduct, and Licensing

The repository README contains the project's [AI usage statement](../README.md#ai-usage), [code of conduct and support information](../README.md#code-of-conduct-and-support), and [license](../README.md#license). Access credentials and other secrets are never published in the documentation or shared through ordinary messages.

## AI Usage Statement

Short summary: [README – AI Usage](../README.md#ai-usage). This section records which tools were used, for which documentation or code, and how the team verified the result. It follows the FER [Policy on the Appropriate Use of Artificial Intelligence](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

### Tools Used

| Tool | Version or model | Used by | Main purpose |
| --- | --- | --- | --- |
| ChatGPT | Not recorded | Documentation team (Nika Kožul, Iva Puljak); Developers (Daniel Božulić, Lea Lendić, Lovre Galov, Mihael Jurković, Ivan Jović) | Drafting and rewording documentation text, drafting PlantUML diagram sources, explaining errors and helping with debugging |
| Gemini | Not recorded | Lovre Galov (presentation) | Preparing the project presentation |
| Claude | Not recorded | Developers (Daniel Božulić, Lea Lendić, Lovre Galov, Mihael Jurković, Ivan Jović) | Explaining errors and helping with debugging |

### Scope of AI Contribution

| Page, file or artifact | Type of assistance | What the tool produced | What the team supplied and changed | Location |
| --- | --- | --- | --- | --- |
| 1. Project Scope, 2. Requirement Analysis, 3. Use Cases | Drafting and rewording | Draft wording of sections, requirement descriptions and use case flows | The project assignment, the agreed rules recorded in [Section 2.5](2-requirements.md#25-significant-requirement-changes), and corrections after comparing the text with the application | [1](1-Project-Scope.md), [2](2-requirements.md), [3](3-use-cases.md) |
| 4. Architecture and Design | Drafting and rewording | Draft wording of the design description, decision records and risks | The chosen technologies and alternatives, the database schema, and corrections after comparing the text with the code | [4](4-Architecture-and-Design.md) |
| PlantUML diagrams (use case, component, sequence, state) | Diagram source | Draft PlantUML sources | Actors, components, flows and states corrected to match the use cases and the implemented system; diagrams rendered and checked | [`docs/puml/`](puml), [`docs/assets/diagrams/`](assets/diagrams) |
| Project presentation | Preparing slides | Draft presentation slides | Project content, structure and final edits of the slides | Presentation on 29 October 2026, see [A.1](A-Overview-of-Group-Activities.md#a1-meeting-log) |

### Verification of Generated Content

| Check | How it was performed | Evidence |
| --- | --- | --- |
| Factual accuracy | Statements about features, behavior and architecture were compared with the running application and the code. | [Git history](https://github.com/Reenial/LEGIS/commits/develop/) of the documentation updates |
| No unimplemented claims | Features that are not implemented yet are described as planned. | [README – App Description](../README.md#app-description), [A.2 Work Plan](A-Overview-of-Group-Activities.md#a2-work-plan) |
| Consistency with other pages | A second team member reviewed AI-assisted text before it was published. | [Git history](https://github.com/Reenial/LEGIS/commits/develop/) |
| Diagram sources | PlantUML sources were rendered and corrected until they matched the implemented system. | [`docs/puml/`](puml) and the rendered images in [`docs/assets/diagrams/`](assets/diagrams) |
| Confidential content | No credentials or personal data were entered into AI tools. Secrets are kept in local `.env` files, which Git ignores; only `.env.example` files are committed. | [`backend/.env.example`](../backend/.env.example), [`frontend/.env.example`](../frontend/.env.example) |

### Errors Found in AI Output

| Problem | How it was found | Resolution |
| --- | --- | --- |
| An ER diagram generated by ChatGPT did not show the names of the tables. | Team review of the diagram against the [database schema](../database/schema.sql) | Replaced with an ER diagram generated in pgAdmin from the schema: [`lostAndFoundERD.png`](assets/erd/lostAndFoundERD.png) (source [`lostAndFoundERD.pgerd`](assets/erd/lostAndFoundERD.pgerd)). |
| Diagram and image links written by ChatGPT pointed to wrong or missing files, so some diagrams did not display. | Review of the documentation pages | Links corrected to the existing files, e.g. the use case diagram in [chapter 3](3-use-cases.md) now points to the generated `lost-and-found-UC.svg`, and the ER diagram links in [chapter 4](4-Architecture-and-Design.md) point to `docs/assets/erd/`. |
| Gemini added content to the project presentation that the team had not specified. | Team review of the slides against the project assignment and the documentation | The unspecified content was removed before the presentation on 29 October 2026. |
