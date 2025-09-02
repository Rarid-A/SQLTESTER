let SQL;
let db;

function ensureDb() {
  if (!db) db = new SQL.Database();
}

function transformTsqlToSqlite(inputSql) {
  let sql = inputSql.replace(/\r\n/g, '\n');

  // Map common types globally first
  sql = sql.replace(/\bNVARCHAR\s*\(\s*\d+\s*\)/gi, 'TEXT')
           .replace(/\bVARCHAR\s*\(\s*\d+\s*\)/gi, 'TEXT')
           .replace(/\bCHAR\s*\(\s*\d+\s*\)/gi, 'TEXT')
           .replace(/\bDATETIME\b/gi, 'TEXT')
           .replace(/\bINT\b/gi, 'INTEGER');

  // Process each CREATE TABLE block so we can reliably remove duplicate PK constraints
  sql = sql.replace(/CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)\)\s*;/gi, (full, tableName, body) => {
    let newBody = body;
    const identityCols = [];

    // Replace IDENTITY columns
    newBody = newBody.replace(/(\b\w+\b)\s+INTEGER\s+IDENTITY\s*\(\s*\d+\s*,\s*\d+\s*\)/gi, (m, col) => {
      identityCols.push(col.toLowerCase());
      return `${col} INTEGER PRIMARY KEY AUTOINCREMENT`;
    });

    // Remove duplicate table-level PRIMARY KEY(col) constraints for those columns
    for (const col of identityCols) {
      // remove with or without a leading comma and with optional constraint name
      const pattern = new RegExp(
        `(,\s*)?(?:CONSTRAINT\s+\w+\s+)?PRIMARY\s+KEY\s*\(\s*${col}\s*\)\s*(,\s*)?`,
        'gi'
      );
      newBody = newBody.replace(pattern, (match, leadingComma, trailingComma) => {
        // if both sides have commas, keep a single comma
        return leadingComma || trailingComma ? ',' : '';
      });
    }

    // If any inline PRIMARY KEY exists, remove any remaining table-level PRIMARY KEY(...) to avoid duplicates
    if (/\bPRIMARY\s+KEY\b/i.test(newBody)) {
      newBody = newBody.replace(/(,\s*)?(?:CONSTRAINT\s+\w+\s+)?PRIMARY\s+KEY\s*\([^)]*\)\s*(,\s*)?/gi, (match, leadingComma, trailingComma) => {
        return leadingComma || trailingComma ? ',' : '';
      });
    }

    // Clean up double commas, commas before closing paren, and extra whitespace
    newBody = newBody.replace(/\s+,\s+,/g, ', ')
                     .replace(/,\s*\)/g, ')')
                     .replace(/\n{2,}/g, '\n')
                     .trim();

    return `CREATE TABLE ${tableName} (${newBody});`;
  });

  return sql;
}

function setStatus(id, msg, isError) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg || '';
  el.style.color = isError ? '#ff8888' : '#b7c7ff';
}

function renderTableFromResult(result) {
  // result: { columns: string[], values: any[][] }
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  for (const c of result.columns) {
    const th = document.createElement('th');
    th.textContent = c;
    trHead.appendChild(th);
  }
  thead.appendChild(trHead);
  const tbody = document.createElement('tbody');
  for (const row of result.values) {
    const tr = document.createElement('tr');
    for (const cell of row) {
      const td = document.createElement('td');
      td.textContent = cell === null || cell === undefined ? '' : String(cell);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

function renderResults(results) {
  const box = document.getElementById('results');
  box.innerHTML = '';
  if (!results || results.length === 0) {
    const div = document.createElement('div');
    div.textContent = 'No results';
    box.appendChild(div);
    return;
  }
  for (const r of results) {
    if (r.columns && r.values) {
      box.appendChild(renderTableFromResult(r));
    } else {
      const div = document.createElement('div');
      div.textContent = 'Statement executed.';
      box.appendChild(div);
    }
  }
}

async function loadSqlJs() {
  // Uses global initSqlJs from sql-wasm.js
  const config = { locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${f}` };
  SQL = await initSqlJs(config);
}

function execDDL() {
  try {
    ensureDb();
    const ddlRaw = document.getElementById('ddl').value;
    const ddl = transformTsqlToSqlite(ddlRaw);
    db.exec(ddl);
    setStatus('ddl-status', 'DDL executed');
  } catch (e) {
    setStatus('ddl-status', e.message || 'Error', true);
  }
}

function runQuery() {
  try {
    ensureDb();
    const sql = document.getElementById('sql').value;
    const results = db.exec(sql); // array of {columns, values}
    renderResults(results);
    setStatus('query-status', 'Query executed');
  } catch (e) {
    setStatus('query-status', e.message || 'Error', true);
  }
}

function resetDb() {
  try {
    if (db) db.close();
  } catch (_) {}
  db = new SQL.Database();
  try { db.exec("PRAGMA encoding='UTF-8';"); } catch (_) {}
  try { db.exec('PRAGMA foreign_keys=ON;'); } catch (_) {}
  setStatus('ddl-status', 'DB reset');
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadSqlJs();
  db = new SQL.Database();
  // Ensure UTF-8 text encoding behavior is well defined
  try { db.exec("PRAGMA encoding='UTF-8';"); } catch (_) {}
  try { db.exec('PRAGMA foreign_keys=ON;'); } catch (_) {}
  document.getElementById('exec-ddl').addEventListener('click', execDDL);
  document.getElementById('run-query').addEventListener('click', runQuery);
  document.getElementById('reset-db').addEventListener('click', resetDb);
});


