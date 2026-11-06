# 4. Architecture and Design

Lost & Found sastoji se od web-sučelja, Node.js backenda i PostgreSQL baze podataka. Za prijavu koristi Google, za karte Leaflet i OpenStreetMap, a za pretvaranje adresa u koordinate Nominatim. Ovo poglavlje opisuje odabrani dizajn, glavne komponente, podatke i ponašanje sustava.

| View | Main question |
| --- | --- |
| Solution strategy | Which architectural choices were made, and why? |
| Building blocks | What are the principal parts, their responsibilities, and their external connections? |
| Data and class design | What information is stored, and how is a representative part of the code structured? |
| Runtime behavior | How do parts collaborate, and how does a meaningful object change state? |
| Architectural decisions | Why was a consequential option chosen over alternatives? |
| Crosscutting concepts and risks | Which shared mechanisms and important compromises affect the design? |

## 4.1 Solution Strategy

Lost & Found has a web interface built with HTML, CSS, and JavaScript, a single Node.js backend, and a PostgreSQL database. We plan to add Express.js for request handling. The following describes the selected design and does not confirm that all functionality has already been implemented.

| Decision | Alternative considered | Project-specific rationale and trade-off |
| --- | --- | --- |
| A single Node.js backend with Express.js planned | Java (Spring Boot) | We are familiar with these technologies, and we use JavaScript on both the frontend and the backend. A single backend simplifies development, but its failure affects most functionality. |
| PostgreSQL relational database | MongoDB | We are familiar with PostgreSQL, and it suits related data such as users, posts, and requests. Structural changes require adjustments to the database. |
| Google sign-in | Microsoft (Entra ID) | The user uses an existing account, and the application does not manage their Google password. Sign-in depends on an external service. |
| Leaflet + OpenStreetMap | MapLibre GL + MapTiler | Leaflet displays the OpenStreetMap base map. Map display depends on the availability of the map service. |
| Nominatim | MapTiler Geocoding | Nominatim converts addresses into coordinates. Address search depends on the availability of the geocoding service. |

## 4.2 Building Blocks and UML Component Diagram

The frontend displays data and collects user input. The backend validates data and permissions and communicates with the database. Google, OpenStreetMap, and Nominatim are outside the boundary of our application, while Leaflet is a library within the frontend.

**Component diagram:**

![Lost & Found component diagram](./assets/diagrams/component-diagram.svg)

**PlantUML source:** [Diagram source](./puml/component-diagram.puml)

| Component | Responsibility | Reason for this boundary |
| --- | --- | --- |
| Frontend | Displays posts, the map, forms, messages, and notifications. | Separates the user interface from data processing. |
| Backend | Handles requests, checks permissions, calculates matches, and accesses external services. | Application rules are checked on the server. |
| PostgreSQL database | Stores users, posts, requests, messages, and other related data. | Provides persistent storage and maintains relationships between data. |

The frontend receives Google's token and sends it to the backend for verification. The request to convert an address into coordinates also passes through the backend, which calls Nominatim. The frontend loads the OpenStreetMap base map through Leaflet. Matching is based on keyword scoring; the final threshold has not yet been agreed upon.

## 4.3 Data and Detailed Design

### 4.3.1 ER Diagram and Data Model

Lost & Found stores its data in PostgreSQL. The current schema contains twelve tables and defines their primary keys, foreign keys, uniqueness rules, and validation constraints.

**ER diagram:**

![Lost & Found ER diagram](./assets/diagrams/lostAndFoundERD.png)

**Diagram source:** [pgAdmin ERD source](./assets/diagrams/lostAndFoundERD.pgerd)

**Implementation:** [PostgreSQL schema](../database/schema.sql)

The diagram represents the stored data and relationships defined in the SQL schema. The main entities are users, item posts, return requests, and messages.

Each item post belongs to one author, one category, and one location. A user can publish multiple posts. The `type` attribute distinguishes lost and found posts, while `status` distinguishes items awaiting handover (`pending`) from items marked as handed over (`handed_over`).

A post can receive multiple return requests from different users. Each request belongs to one post and one requester. Messages belong to a request, which provides the context for the private conversation between the requester and the post author. Each message also references its sender. The backend must verify that the sender is a participant in that conversation.

The remaining tables support the following functions:

- `keyword_kinds`, `keywords`, and `item_keywords` store keyword types, predefined values, and the values associated with a post. A post can have one value per keyword type: either a predefined keyword or custom text entered under “Other”.
- `post_reports` stores reports of problematic posts, the users who submitted them, and moderation information. The reviewer and review time can remain empty until the report is reviewed.
- `notifications` links a recipient to a possible lost–found item match. A uniqueness constraint prevents duplicate notifications for the same recipient and pair of posts.
- `session` stores backend session data and expiration times. It has no foreign-key relationship to `users` in the current schema.

Return requests use the statuses `pending`, `accepted`, `rejected`, and `withdrawn`. Unique indexes allow at most one pending or accepted request per user and item, and at most one accepted request per item. Accepting a request does not automatically mark the item as handed over.

Posts can be removed from public view while their records remain stored. The `removed_at` and `removed_by` attributes record removal information. The `items_public` view excludes removed posts and the hidden item detail; the backend must use appropriate queries and authorization checks when serving public data.

The schema also defines automatic `updated_at` triggers for users and posts, a generated text-search field, and the `item_match_scores` view. This view calculates keyword-based matching scores; it does not include location or time scoring. These database mechanisms are defined in the SQL schema rather than represented as separate entities in the ER diagram.

### 4.3.2 Representative UML Class Diagram

The class-level design will be agreed with the backend team before the selected functionality is implemented. This section will then include the representative UML class diagram, its PlantUML source, and an explanation of the classes' responsibilities and relationships.

## 4.4 Runtime Behavior

### 4.4.1 Representative UML Sequence Diagram

**Scenario:** Submitting a return request — UC-007.

The user enters information supporting their ownership claim and submits the request. The backend first checks sign-in and the submitted data, then the item's availability and existing requests. It does not allow a request for the user's own item or an additional request while a previous request for the same item is pending or accepted. A new request can be submitted after rejection or withdrawal.

A valid request is saved with the status `pending`. Confirmation is displayed only after successful saving. Invalid data, an unavailable item, or a storage failure produces an error message without confirming success. After submission, the post author and the requester can exchange private messages.

**Sequence diagram:**

![Submitting a return request](./assets/diagrams/return-request-sequence.svg)

**PlantUML source:** [Sequence diagram source](./puml/return-request-sequence.puml)

### 4.4.2 Representative UML State Diagram

**State owner and reason for choosing it:** A return request. Its status indicates whether it is awaiting a decision, accepted, rejected, or withdrawn, making it important for tracking the return process.

| State | Meaning |
| --- | --- |
| `pending` | The request is awaiting the post author's decision. |
| `accepted` | The author has accepted the request. |
| `rejected` | The author has rejected the request. |
| `withdrawn` | The requester has permanently withdrawn the request. |

The author can accept or reject a request and change the decision before the item has been handed over. The requester can withdraw a request, including an accepted or rejected one. A withdrawn request is not reopened; a new one is submitted if needed. Accepting a request is not the physical handover; the post separately has the status `pending` or `handed_over`.

**State diagram:**

![Return request states](./assets/diagrams/return-request-state.svg)

**PlantUML source:** [State diagram source](./puml/return-request-state.puml)

The statuses and the restriction of one active request are defined in the [database schema](../database/schema.sql). Permission checks and allowed transitions must be implemented in the backend; the schema alone does not enforce all the described transitions.

## 4.5 Architecture Decision Records

**Objective:** Preserve the reasons for consequential architectural choices so a future developer can understand what was decided, what alternative was considered, and which trade-off the team accepted.

**Decision index:** [List important architectural decisions in one place. A short row is sufficient for a straightforward decision.]

| ID | Date | Decision | Alternative considered | Rationale and trade-off | Status |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

**Detailed ADR, when the decision needs more explanation:**

### ADR-[ID]: [Decision title]

| Field | Record of the decision |
| --- | --- |
| Context and goal | [Which architectural problem made this decision necessary?] |
| Decision criteria | [What actually mattered to the team?] |
| Alternatives considered | [Realistic options the team weighed, briefly.] |
| Decision and rationale | [Chosen option, why it won, and what is given up.] |
| Status | [Proposed, accepted, or superseded; link to the replacement when applicable.] |

Write an ADR only for a choice whose rationale will matter after the implementation changes. A significant change of decision can be recorded as a new ADR that supersedes the old one; routine tool choices do not need detailed records. Changes to agreed scope belong with requirements and their change history; feedback on a task stays with its issue.

<details>
<summary><strong>Choosing one backend instead of separately deployed services</strong></summary>

**Example — Crisis Guard, ADR-01:**

| ID | Date | Decision | Alternative considered | Rationale and trade-off | Status |
| --- | --- | --- | --- | --- | --- |
| ADR-01 | [Date of decision] | One backend API for report handling | Separate deployable report and resource services | Lower deployment and integration effort for the approved scope; a failure of the backend can affect both features. | Accepted |

### ADR-01: One backend API for report handling

| Field | Record of the decision |
| --- | --- |
| Context and goal | The team must deliver and publicly deploy reporting and a map-oriented view during one semester. |
| Decision criteria | The team can build, integrate, deploy, and explain the solution; components still have identifiable responsibilities. |
| Alternatives considered | **One backend:** modules share a deployable application. **Separate services:** each can run independently, but they require additional integration and deployment work. |
| Decision and rationale | Choose one backend, with distinguishable report responsibilities inside it. This limits deployment work but accepts that a failure of this backend may affect report operations together. |
| Status | Accepted. |

**Analysis of the example:** The solution strategy states the current approach; ADR-01 preserves the alternatives and criteria that led to it. The component and deployment diagrams should reflect the chosen approach as it develops. A separate ADR is useful for a consequential decision, not for every tool choice.

</details>

## 4.6 Crosscutting Concepts

**Objective:** Identify an important mechanism or design rule that applies to several parts of the application, describe where it is planned to apply, and update the explanation as the implementation takes shape. Include only concepts that matter to this project.

| Concern | Mechanism and where it applies | Evidence in the final implementation |
| --- | --- | --- |
|  |  |  |

<details>
<summary><strong>Describing a shared rule through its implementation</strong></summary>

**Example — Crisis Guard:**

| Concern | Mechanism and where it applies | Code or configuration reference |
| --- | --- | --- |
| System rule: authorization of report moderation | The backend checks the moderator's permissions before approving or rejecting a report; a login button in the client is insufficient protection. | At the final review, show the backend permission check and a test of unauthorized access. |
| Shared implementation rule: location validation | The report-submission boundary rejects missing or invalid coordinates before saving a report. | At the final review, show the validation rule and a test with invalid coordinates. |

**Analysis of the example:** The first row describes protection across the system boundary; the second describes a rule shared by report-submission paths. Choose concerns that actually affect your project.

Patterns such as Dependency Injection or Repository belong here only when the code uses them and they explain a shared design rule. “The system uses authentication” alone does not tell a reader where the check occurs or what it protects. Security, logging, and error handling need not each receive a subsection by default.

</details>

## 4.7 Architectural Risks and Technical Debt

**Objective:** State real technical or domain risks and consciously accepted design compromises, their consequences, and what the team will do about them.

**Technical risks and debt**

| Risk or compromise | Consequence | Current treatment |
| --- | --- | --- |
|  |  |  |

**Business or domain risks, if significant**

| Risk | Consequence | Current treatment |
| --- | --- | --- |
|  |  |  |

<details>
<summary><strong>Identifying a limitation without inventing production infrastructure</strong></summary>

**Example — Crisis Guard, technical risks:**

| Risk or compromise | Consequence | Current treatment |
| --- | --- | --- |
| One application instance handles report submissions. | Hosting failure temporarily prevents new reports. | Accepted within the course project; the team does not claim automatic failover. |
| External map tiles are unavailable. | The map view may fail even when stored reports remain available. | Explain the visible error or fallback that the implemented application actually provides. |

**Example — Crisis Guard, domain risk:** Readers may mistake an unverified citizen report for an official warning. The team can distinguish the report's verification status in the interface and direct readers to official channels.

**Analysis of the example:** The first technical risk accepts a realistic course-scope limitation; the domain risk concerns how a reader interprets a report. Record a limitation and a realistic response that belong to your own project. A missing mandatory feature is unfinished scope, not technical debt.

</details>

**Final consistency check:** Compare the component, data, class, sequence and state views with the implemented code, application behavior, and actual deployment. Update outdated design descriptions and explain any important difference that remains; links to relevant code or tests help when they resolve a concrete question.
