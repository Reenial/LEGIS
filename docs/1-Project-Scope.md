# 1. Project Scope

## 1.1 Problem and Project Objective

**Lost And Found:** Students and university staff lose and find personal belongings every day, such as student ID cards, keys, wallets, headphones, and clothing. Information about lost and found items is posted in various student groups and on social media, making it difficult to review all relevant posts and connect a found item with its owner.

An additional problem is *ownership verification*. Publicly disclosing all identifying characteristics of an item may allow someone who does not own it to request its return. It is therefore necessary to support the verification of certain details without displaying them in the public post.

***The objective of the Lost & Found project*** is to develop a web application that brings together lost and found item posts in one place. The application should enable users to browse and search posts, view the location where an item was found on a map, submit and process return requests, and privately arrange collection.

*The expected benefit* is easier discovery of relevant posts and coordination of item returns, with less need to publicly share personal contact information. The application helps assess return requests but does not guarantee that the requester is the actual owner.

## 1.2 Intended Users and Stakeholders

| User or stakeholder group | Need or interest relevant to this project |
| --- | --- |
| Students / staff who have lost an item | Find the lost item, contact the finder, and arrange collection. |
| Students / staff who have found an item | Find the item's owner, verify their ownership, and arrange the handover. |
| Visitors who are not signed in | Access information about lost and found items without having to sign in. |
| Administrator | Keep content reliable and appropriate and prevent misuse of the system. |
| Project team | Successfully complete the project assignment and develop teamwork and software development skills. |
| Course teaching staff | Monitor the project team's work and assess whether the project assignment requirements have been met. |

## 1.3 Project Boundaries

**Included:**

- Creating, browsing, and searching lost and found item posts, with locations displayed on a map
- The return process → return requests, verification of hidden item details, and private arrangements for collection
- Suggestions of possible matches
- In-app notifications
- Reporting and moderating inappropriate posts

**Excluded or deferred:**

- Physical storage, delivery, and collection of items (users arrange the handover themselves)
- The application helps assess ownership but does not guarantee it
- A separate mobile application is not planned; the project provides a web application adapted for mobile devices

**External dependencies:**

- An external identity provider enables sign-in through OAuth 2.0
- An external mapping or geocoding service enables location selection and display
- GPS location detection depends on the device's capabilities and the user's permission, with manual selection on the map available as an alternative

## 1.4 Existing Approaches and Project Rationale

According to the project assignment, information about found items is currently shared in student groups and on social media. This approach enables users to inform others but requires browsing different channels to find a relevant post. Lost & Found aims to bring this information together in one place and enable searches based on item characteristics, location, and time.

Source: “Lost & Found” project assignment, Sections 1 and 2.
