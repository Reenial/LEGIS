# 2. Requirement Analysis

The requirements for the **Lost & Found** application are based on the [project assignment](./assets/Lost_and_Found_Projektni_zadatak_261012_155026.pdf) (Sections 1–3), the [project scope](./1-Project-Scope.md), and the [use cases](./3-use-cases.md). Each requirement has an identifier, a priority, and an acceptance criterion. Significant changes are recorded in Section 2.5.

**High** indicates core functionality and data protection, while **Medium** indicates matching and notifications. All requirements remain within scope, regardless of their priority.

## 2.1 Functional Requirements

| ID | Description | Priority | Source | Acceptance criteria |
| --- | --- | --- | --- | --- |
| F-001 | The system allows users to browse and search posts without signing in and to filter them by type, category, location, and time. | High | Project assignment, Section 2; elaboration in Section 2.5. | The user selects suggested keywords for the item they are looking for; if no suitable keyword is available, they enter their own text under “Other”. Combined criteria return only matching posts; if there are none, the system displays a message and allows the user to change the criteria. |
| F-002 | The system displays the public information of a post and its location on a map. | High | Project assignment, Section 2; elaboration in Section 2.5. | The type, category, title, description, date or approximate time, return status, location, and photograph, if available, are accessible. The post type is “lost” or “found”; the “pending” status means that the item has been found but has not been handed over, while “handed over” means that the finder has marked it as handed over. |
| F-003 | The system allows users to sign in through an external identity provider using OAuth 2.0. | High | Project assignment, Section 2; elaboration in Section 2.5. | Successful validation of the provider's response establishes a session and enables actions according to the user's role. Cancellation or failure does not grant access to protected actions; public browsing remains available. |
| F-004 | A signed-in user can publish a lost or found item post. | High | Project assignment, Section 2; elaboration in Section 2.5. | The type, category, title, description, date or approximate time, and location are saved; a photograph and a hidden detail are optional. When describing the item, the user selects suggested keywords or enters their own text under “Other” if no suitable keyword is available; the selection and entered text are saved with the post. Incomplete or invalid required information must be corrected and does not result in a new post. |
| F-005 | The user can specify the location using GPS or by selecting it manually on a map. | High | Project assignment, Section 2; elaboration in Section 2.5. | The selected location is saved with the post and displayed in its details; denied permission or unavailable GPS does not prevent manual selection. |
| F-006 | The author can edit their own post. | High | Project assignment, Section 2; elaboration in Section 2.5. | Valid changes made by the author are visible when the post is reopened; invalid changes and attempts by another user are rejected without changing the data. The hidden detail remains private. |
| F-007 | The author can remove their own post from public view. | High | Project assignment, Section 2; elaboration in Section 2.5. | Confirmed removal makes the post publicly inaccessible; cancellation leaves it unchanged. Another user cannot remove the post through this action. |
| F-008 | A signed-in user can submit a return request for an available found item, providing information to support their ownership claim. | High | Project assignment, Section 2; elaboration in Section 2.5. | A valid request is accessible to the author and the requester with a status indicating that a decision is pending; it is not public. Missing required information or an unavailable post prevents the request from being saved. The requester can withdraw their request; the withdrawal is visible to both participants. |
| F-009 | The author of the associated post can review the information in a request, compare the item's characteristics with the hidden detail if one exists, and accept or reject the request. | High | Project assignment, Section 2; elaboration in Section 2.5. | Only the author can make and change the decision; both participants can see the current status. Acceptance does not automatically indicate that the physical handover has been completed; the finder separately marks the item as handed over. |
| F-010 | Participants can view their sent and received requests and their statuses. | High | Project assignment, Section 2; elaboration in Section 2.5. | The overview contains only requests in which the user participates and their current statuses; an empty overview displays an appropriate message. Direct access to another user's request is denied. |
| F-011 | The post author and the requester who has submitted a request can exchange private messages to verify ownership and arrange the handover. | High | Project assignment, Section 2; elaboration in Section 2.5. | Once saved, a message is available to the other participant; the conversation is available even before the request is accepted. A third party cannot read or send messages in that conversation. |
| F-012 | The system suggests possible matches between lost and found items based on category, description, time, and location. | Medium | Project assignment, Section 2. | The user can browse suggested posts and open their details. If there are no possible matches, the system displays an appropriate message. A suggested match does not confirm ownership. Comparison rules must be elaborated during design. |
| F-013 | The user can enable in-app notifications about possible matches for their lost items. | Medium | Project assignment, Section 2. | When notifications are enabled, the user receives an in-app notification about a new post that matches their lost item post based on category, description, time, or location. No notification is created if notifications are not enabled or there is no new corresponding match. |
| F-014 | A signed-in user can report a suspicious, inaccurate, or inappropriate post and provide a reason. | High | Project assignment, Section 2; team agreement of 28 October 2026. | A report containing a reason becomes available to the administrator; an empty reason requires completion. A user who is not signed in cannot submit a report. Submitting a report does not itself remove the post. |
| F-015 | The administrator can review reports and remove inappropriate posts. | High | Project assignment, Section 2; elaboration in Section 2.5. | The administrator can see the reason and the associated post; confirmed removal makes the post publicly inaccessible. An unjustified report does not require removal. A user without the administrator role cannot access moderation. |

## 2.2 Non-Functional Requirements

The checks below represent the expected quality criteria. Verification results are recorded in the testing chapter.

| ID | Description | Priority | Source |
| --- | --- | --- | --- |
| NF-001 | Hidden item details, request contents, and private messages must not be accessible to unauthorized users through either the interface or direct requests to the server. Verification: compare access as the author, a participant, a third-party user, and a visitor who is not signed in. | High | Project assignment, Sections 1–2; Scope, Sections 1.1 and 1.3; UC-002, UC-007–UC-010. |
| NF-002 | The server must verify identity and permissions for every protected action. Verification: attempt editing, removal, request processing, and moderation without a session, with an invalid session, and as another user; access is denied without changing the data. | High | UC-003, UC-005, UC-006, UC-008, UC-014; elaboration of access restrictions. |
| NF-003 | Basic browsing, searching, posting, and request submission must be usable in a mobile browser. Verification: all required inputs and actions are accessible in the mobile view without horizontal page scrolling. | High | Project assignment, Section 3; Scope, Section 1.3. |
| NF-004 | Denying GPS permission must not prevent posting: the user can select a location manually. If the map in the post details fails to load, the other public information remains visible, accompanied by a message stating that the map is unavailable. | High | Project assignment, Section 2; Scope, Section 1.3; UC-002, UC-004. |
| NF-005 | Failure to save a post, request, decision, or message must produce a visible error without falsely confirming success. Verification: cause a save failure in a test environment for each listed action and check both the message and the stored state. | High | Alternative flows of UC-004, UC-007, UC-008, UC-010. |

Numerical targets for response time, concurrent users, and availability have not been established in the existing sources; values from teaching examples are not adopted.

## 2.3 Stakeholders and Actors

| Role or actor ID | Relation to the system | Relevant requirements |
| --- | --- | --- |
| A-01 Visitor | A user who is not signed in browses public posts and initiates sign-in. | F-001–F-003 |
| A-02 Signed-in user | A student or staff member; depending on the action, they act as the post author, finder, or requester. Author and requester are not separate permanent account roles. | F-001–F-014; NF-001–NF-005. |
| A-03 Administrator | Signs in, reviews reports, and removes inappropriate content. The administrator role does not itself grant access to private conversations. | F-003, F-015; NF-001, NF-002. |
| A-04 External identity provider | An external system participates in user sign-in. | F-003; NF-002. |
| A-05 Map service | An external system enables location display and selection. GPS also depends on the browser or device. | F-002, F-005; NF-004. |
| S-01 Project team | A stakeholder responsible for development and requirements alignment; has no special application role. | All requirements. |
| S-02 Course teaching staff | A stakeholder that monitors and evaluates the project; has no special application role. | Project scope and requirement verifiability. |

Sources: Scope, Section 1.2, and the use case diagram and descriptions.

## 2.4 Constraints and Assumptions

| ID | Constraint or assumption | Source | Consequence or way to verify |
| --- | --- | --- | --- |
| C-01 | Sign-in is provided through an external identity provider using OAuth 2.0. | Project assignment, Section 2; Scope, Section 1.3; UC-003. | The team selects the provider during design; verify successful, cancelled, and failed sign-in. |
| C-02 | Location functionality depends on an external map service; GPS depends on the device and the user's permission. | Project assignment, Sections 2–3; Scope, Section 1.3. | Provide manual location selection and verify denied GPS permission and map unavailability according to NF-004. |
| C-03 | Item handover, delivery, and physical storage are outside the system. | Project assignment, Section 2; Scope, Section 1.3; UC-008, UC-010. | The system enables coordination; an accepted request is not proof that the handover has been completed. |
| C-04 | The system helps assess ownership but does not guarantee it. | Scope, Sections 1.1 and 1.3; UC-011. | The post author decides on the request; a suggested match does not confirm ownership. |
| C-05 | The project develops a web application adapted for mobile devices, without a separate mobile application. | Project assignment, Section 3; Scope, Section 1.3. | Verify the mobile view according to NF-003. |
| C-06 | Reporting problematic posts is available only to signed-in users. | Team agreement, 28 October 2026. | Verify that a signed-in user can submit a report and a user who is not signed in cannot. |
| AS-03 | The selected external services will be available in the development and demonstration environments. | External dependencies from Scope, Section 1.3. | Verify configuration, terms of use, and availability during integration; the current sources do not specify providers or availability guarantees. |

## 2.5 Significant Requirement Changes

Significant additions made during requirements elaboration are recorded below.

| Date | Requirement ID | Change and reason | Agreed with / evidence |
| --- | --- | --- | --- |
| 2026-10-28 | F-014, C-06 | It was established that only signed-in users can report problematic posts. | Project team agreement. |

Keywords and the “Other” input are used when posting and searching for items. The team periodically reviews “Other” entries to improve the filters; automatically adding keywords is not a requirement. Rules for multiple requests and requests for one's own post have not yet been defined.

## 2.6 Requirement Traceability

The associated use cases are listed below. All listed checks are **planned and have not been performed**. Project tests and manual procedures should be documented in [Section 5.2](./5-Testing.md#52-test-cases), and results in Section 5.3. Teaching examples in that chapter are not project tests.

| Requirement ID | Use case or design location | Test or verification location |
| --- | --- | --- |
| F-001 | UC-001 — [description](./3-use-cases.md#uc-001-browse-search-and-filter-posts). | Browsing without signing in, searching, combining filters by type, category, location, and time, and displaying an empty result. |
| F-002 | UC-002 — [description](./3-use-cases.md#uc-002-view-post-details). | Display of public details, status, location, and a photograph if available; the hidden detail is not public; a removed post is unavailable. |
| F-003 | UC-003 — [description](./3-use-cases.md#uc-003-sign-in). | Successful, cancelled, and failed sign-in through OAuth 2.0; availability of actions according to the user's role. |
| F-004 | UC-004 — [description](./3-use-cases.md#uc-004-publish-a-lost-or-found-item-post). | Valid lost and found item posts; missing required information; posting with and without a photograph and a hidden detail. |
| F-005 | UC-004, UC-005 — [descriptions](./3-use-cases.md). | Specifying a location using GPS and manual selection on a map; checking the saved location after posting or editing. |
| F-006 | UC-005 — [description](./3-use-cases.md#uc-005-edit-own-post). | Editing as the author; rejecting another user's attempt to edit; rejecting invalid data without changing the existing post. |
| F-007 | UC-006 — [description](./3-use-cases.md#uc-006-remove-own-post). | Confirmed and cancelled removal; rejecting another user's attempt to remove the post; unavailability of the removed post in public view. |
| F-008 | UC-007 — [description](./3-use-cases.md#uc-007-request-the-return-of-an-item). | Submitting a valid request; rejecting an incomplete request and a request for an unavailable post; privacy of request contents. |
| F-009 | UC-008 — [description](./3-use-cases.md#uc-008-accept-or-reject-a-return-request). | Accepting and rejecting requests; reviewing information used to assess ownership; displaying the decision to both participants; rejecting unauthorized attempts to process a request. |
| F-010 | UC-009 — [description](./3-use-cases.md#uc-009-track-request-status). | Viewing sent and received requests and their statuses; an empty list; denying access to another user's request. |
| F-011 | UC-010 — [description](./3-use-cases.md#uc-010-exchange-private-messages). | Exchanging messages after a request has been submitted, including before acceptance; making a saved message available to the other participant; denying access to a third party. |
| F-012 | UC-011 — [description](./3-use-cases.md#uc-011-view-possible-matches). | Displaying possible matches and opening their details; displaying a message when there are no matches. Add specific test cases after the comparison rules have been elaborated. |
| F-013 | UC-012 — [description](./3-use-cases.md#uc-012-enable-notifications-and-view-match-notifications). | Enabling notifications; displaying a notification about a new possible match; no new notification when notifications are not enabled or there is no corresponding match. |
| F-014 | UC-013 — [description](./3-use-cases.md#uc-013-report-a-problematic-post). | Submitting a report as a signed-in user; rejecting submission without signing in; requiring a reason; no automatic removal of the reported post. |
| F-015 | UC-014 — [description](./3-use-cases.md#uc-014-review-reports-and-remove-inappropriate-content). | Reviewing reports and removing content as an administrator; handling justified and unjustified reports; denying access to a user without administrator privileges. |
| NF-001 | UC-002, UC-007–UC-010 — [descriptions](./3-use-cases.md). | Verify access to hidden details, requests, and private messages as the author, a participant, a third-party user, and a visitor who is not signed in. Check both the interface and direct requests to the server. |
| NF-002 | UC-003, UC-005, UC-006, UC-008, UC-014 — [descriptions](./3-use-cases.md). | Attempt protected actions without a session, with an invalid session, and as a user without the required permissions; confirm rejection and the absence of data changes. |
| NF-003 | Project assignment, Section 3; UC-001, UC-004, UC-007. | Verify browsing, searching, posting, and request submission in a mobile browser. Record the device and viewport width and verify that the required inputs and actions are accessible without horizontal page scrolling. |
| NF-004 | UC-002, UC-004 — [descriptions](./3-use-cases.md). | Deny GPS permission and select a location manually. Separately prevent the map from loading in the post details and verify that the remaining public information is available with an error message. |
| NF-005 | UC-004, UC-007, UC-008, UC-010 — [descriptions](./3-use-cases.md). | Cause a save failure in a test environment for a post, request, decision, and message. Verify the error message, stored state, and absence of a false success confirmation. |

## 2.7 Review of Requirements

Use cases must be kept consistent with the requirements, and actual project tests must be linked once they have been created.

| Checkpoint | Feedback or finding | Resulting requirement or scope decision |
| --- | --- | --- |
| First formal checkpoint | Feedback has not yet been documented. | After the review, link the actual conclusions and any changes in Section 2.5. |
| Final formal checkpoint | Feedback has not yet been documented. | Align the requirements with the agreed scope and verification evidence. |

Checkpoint dates should be verified against the course instructions. Use cases should be aligned with the elaboration in Section 2.5, particularly UC-013, which still requires sign-in, and actual project tests should be linked.
