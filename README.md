In-Browser SQL Playground (SQLite)

What is this?
A single static web page that lets you paste SQL DDL (e.g., CREATE TABLE ...) and run queries entirely in your browser using SQLite (via sql.js). No install, no server.

Open locally
- Double-click `public/index.html` to open it in your browser.

GitHub Pages
- Push this repository and enable Pages, with the site root pointing to `public/`.

Usage
- Left panel: paste DDL (CREATE TABLE/INSERT/etc.), click "Execute DDL".
- Right panel: write queries (SELECT/INSERT/UPDATE/DELETE), click "Run Query".
- "Reset DB" clears the in-memory database.

Notes
- The page adapts common T‑SQL constructs to SQLite (IDENTITY → AUTOINCREMENT, NVARCHAR/VARCHAR/CHAR → TEXT, DATETIME → TEXT).
- Foreign keys are enabled; everything runs in memory and is lost on refresh unless you copy your statements out.



