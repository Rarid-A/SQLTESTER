# SQLTESTER

A modern, in-browser SQL playground for learning and experimenting with SQL using SQLite. Instantly run DDL statements, execute queries, and view results—all without installing any software.

## Features

- **SQLite Engine in Browser:** Powered by [sql.js](https://github.com/sql-js/sql.js), runs entirely client-side.
- **Sample Hospital Database:** Preloaded schema and data for quick experimentation.
- **DDL & Query Editors:** Separate panels for schema (DDL) and SQL queries.
- **Instant Results:** View query results in a responsive, styled table.
- **Reset & Sample Loader:** Easily reset the database or load the sample schema.
- **Responsive UI:** Works well on desktop and mobile devices.

## Live Demo

Try it now on GitHub Pages:  
[https://rarid-a.github.io/SQLTESTER/](https://rarid-a.github.io/SQLTESTER/)

## Usage

1. **Schema (DDL):**  
   Paste or edit your `CREATE TABLE` statements in the left panel.  
   Click **Execute DDL** to apply changes.

2. **Query:**  
   Write your SQL queries (SELECT, INSERT, UPDATE, DELETE, etc.) in the right panel.  
   Click **Run Query** to execute and view results.

3. **Reset DB:**  
   Click **Reset DB** to clear all tables and start fresh.

4. **Sample Loader:**  
   Use the **Sample** dropdown to load the hospital schema and data.

## Technologies

- HTML, CSS, JavaScript
- [sql.js](https://github.com/sql-js/sql.js) (SQLite compiled to WebAssembly)
- Responsive design with modern CSS
