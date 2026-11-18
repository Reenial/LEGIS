# Lost & Found

Lost & Found helps people find and return lost belongings.

This is a student project for the Software Engineering course at the Faculty of Electrical Engineering and Computing (FER), University of Zagreb.

## App Description

If you lose something, it can be hard to know where to look or who to ask. Lost & Found gives people one place to post found items and search for their belongings.

- Visitors can browse lost and found posts and search by keyword.
- Item details can show where the item was found on a map.
- Signed-in users can create their own posts.

Return requests and private chats are planned for the next stage.

See the [project documentation](docs/Home.md) for the scope, requirements, design, and testing.

<a id="deployment"></a>
## Deployment

The application is available at [ferlostandfound.onrender.com](https://ferlostandfound.onrender.com/). You can try Google Sign-In, browse posts, and create your own post.

Browsing does not require an account. Creating a post requires Google Sign-In.

After inactivity, the application may take a little longer to load while the backend starts automatically.

<a id="quick-start"></a>
## Quick Start / Installation

Install Docker with Docker Compose and Git. Start Docker, then run the following commands:

```bash
git clone --branch develop https://github.com/Reenial/LEGIS.git
cd LEGIS
docker compose up --build
```

Docker Compose starts the frontend, backend, and PostgreSQL database. On the first start with an empty database volume, it loads the schema and sample data. Open [http://localhost](http://localhost) and check that sample posts appear.

To enable Google Sign-In, create a `.env` file in the repository root before building and set `GOOGLE_CLIENT_ID` to the team's Google OAuth client ID. The client must allow `http://localhost` as an authorized JavaScript origin. Keep this local configuration out of Git.

To stop the application, run `docker compose down`. The team confirmed that local startup, Google Sign-In, browsing posts, and creating posts work.

## Technologies

| Technology | Role | Reason or constraint |
| --- | --- | --- |
| HTML, CSS, JavaScript, and Vite | Build the browser interface. | The interface uses plain JavaScript, and Vite handles the frontend build. |
| Node.js and Express | Serve the API. | One backend handles item posts, searches, and return requests. |
| PostgreSQL | Stores users, items, and return requests. | It keeps each return request linked to its item and sender. |
| Google Sign-In | Lets users sign in with a Google account. | It requires an OAuth client configured for the application origin. |
| Leaflet and OpenStreetMap | Display the map and found item locations. | Map tiles come from an external service. |
| Nominatim | Converts addresses to coordinates through the backend. | Address lookup depends on an external service. |

## Team Members

| Member | Main contribution |
| --- | --- |
| Daniel Božulić | Backend, DevOps, and project topic development. |
| Lea Lendić | Frontend and database design. |
| Lovre Galov | Backend development and project presentation. |
| Nika Kožul | Documentation. |
| Iva Puljak | Database and documentation. |
| Mihael Jurković | Frontend development. |
| Ivan Jović | Backend development. |

## Contributing

The team coordinates tasks through WhatsApp and uses Git to manage code changes.

<a id="license"></a>
## License

The repository includes the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International license](LICENSE). Third-party libraries and assets retain their own licenses.

<a id="ai-usage"></a>
## AI Usage

ChatGPT, Gemini, and Claude were used responsibly as supporting tools during development, testing, and documentation. The team manually reviewed the results.

<a id="code-of-conduct-and-support"></a>
## Code of Conduct and Support

See the [Code of Conduct](CODE_OF_CONDUCT.md).

---

The documentation structure was adapted from the FER Software Engineering course template by [Vlado Sruk](https://www.fer.unizg.hr/en/vlado.sruk), licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
