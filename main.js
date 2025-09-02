// Copied from public/main.js, unchanged except for sample path now root/samples
let SQL;
let db;

function ensureDb() { if (!db) db = new SQL.Database(); }

const BUILT_IN_SAMPLES = {
  'hospital-ddl': `CREATE TABLE Unit (
    UnitID      INTEGER IDENTITY(1,1),
    UnitNo      CHAR(5) NOT NULL,
    UnitName    VARCHAR(50),
    UnitAddress VARCHAR(100),
    CONSTRAINT PK_Unit_UnitID PRIMARY KEY(UnitID),
    CONSTRAINT UQ_Unit_UnitNo UNIQUE(UnitNo)
);

CREATE TABLE Employee (
    EmployeeID      INTEGER IDENTITY(1,1),
    EmpNo           CHAR(11) NOT NULL,
    EmpName         VARCHAR(50),
    EmpAddress      VARCHAR(100),
    EmpPhoneNumber  CHAR(10),
    EmpSalary       INT,
    UnitID          INTEGER,
    CONSTRAINT PK_Employee_EmployeeID PRIMARY KEY(EmployeeID),
    CONSTRAINT UQ_Employee_EmpNo UNIQUE(EmpNo),
    CONSTRAINT FK_Employee_Unit_UnitID FOREIGN KEY(UnitID) REFERENCES Unit(UnitID)
);

CREATE TABLE Patient (
    PatientID       INTEGER IDENTITY(1,1),
    PatientNo       CHAR(11) NOT NULL,
    PatientName     VARCHAR(50) NOT NULL,
    PatientAddress  VARCHAR(100),
    PatientPhoneNumber CHAR(10),
    UnitID          INTEGER,
    CONSTRAINT PK_Patient_PatientID PRIMARY KEY(PatientID),
    CONSTRAINT UQ_Patient_PatientNo UNIQUE(PatientNo),
    CONSTRAINT FK_Patient_Unit_UnitID FOREIGN KEY(UnitID) REFERENCES Unit(UnitID)
);

CREATE TABLE Illness (
    IllnessID       INTEGER IDENTITY(1,1),
    IllnessName     NVARCHAR(50) NOT NULL,
    CONSTRAINT PK_Illness_IllnessID PRIMARY KEY(IllnessID),
    CONSTRAINT UQ_Illness_IllnessName UNIQUE(IllnessName)
);

CREATE TABLE Examines (
    EmployeeID  INTEGER,
    PatientID   INTEGER,
    CONSTRAINT PK_Examines PRIMARY KEY(EmployeeID, PatientID),
    CONSTRAINT FK_Examines_Employee FOREIGN KEY(EmployeeID) REFERENCES Employee(EmployeeID),
    CONSTRAINT FK_Examines_Patient FOREIGN KEY(PatientID) REFERENCES Patient(PatientID)
);

CREATE TABLE Suffers (
    IllnessID   INTEGER NOT NULL,
    PatientID   INTEGER NOT NULL,
    StartDate   DATETIME,
    CONSTRAINT PK_Suffers PRIMARY KEY(IllnessID, PatientID),
    CONSTRAINT FK_Suffers_Illness FOREIGN KEY(IllnessID) REFERENCES Illness(IllnessID),
    CONSTRAINT FK_Suffers_Patient FOREIGN KEY(PatientID) REFERENCES Patient(PatientID)
);

CREATE TABLE HasSuffered (
    IllnessID   INTEGER NOT NULL,
    PatientID   INTEGER NOT NULL,
    CONSTRAINT PK_HasSuffered PRIMARY KEY(IllnessID, PatientID),
    CONSTRAINT FK_HasSuffered_Illness FOREIGN KEY(IllnessID) REFERENCES Illness(IllnessID),
    CONSTRAINT FK_HasSuffered_Patient FOREIGN KEY(PatientID) REFERENCES Patient(PatientID)
);

CREATE TABLE Car (
    CarID           INTEGER IDENTITY(1,1),
    LicenseNo       CHAR(10) NOT NULL,
    Brand           VARCHAR(50),
    Price           INT,
    EmployeeID      INTEGER NULL,
    CONSTRAINT PK_Car_CarID PRIMARY KEY(CarID),
    CONSTRAINT UQ_Car_LicenseNo UNIQUE(LicenseNo),
    CONSTRAINT FK_Car_Employee FOREIGN KEY(EmployeeID) REFERENCES Employee(EmployeeID)
);

-- Inserts
INSERT INTO Unit (UnitNo, UnitName, UnitAddress)
VALUES
    ('U1', 'General Surgery', 'Hospital road'),
    ('U2', 'Rehabilitation', 'Hospital road'),
    ('U3', 'Trauma', 'Care road');

INSERT INTO Employee (EmpNo, EmpName, EmpAddress, EmpPhoneNumber, EmpSalary, UnitID)
VALUES
    ('E1', 'Anna', 'Lund', '111', 25000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('E2', 'Eva', 'Eslöv', '222', 55000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('E3', 'Anna', 'Lund', '333', 37500, (SELECT UnitID FROM Unit WHERE UnitNo = 'U2')),
    ('E4', 'Hans', 'Eslöv', '444', 18000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U2')),
    ('E5', 'Eva', 'Malmö', '555', 279000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U3')),
    ('E6', 'Peter', 'Dalby', '666', 32000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U1'));

INSERT INTO Patient (PatientNo, PatientName, PatientAddress, PatientPhoneNumber, UnitID)
VALUES
    ('PP1', 'Anna', 'Lund', '111', (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('PP2', 'Hans', 'Dalby', '777', (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('PP3', 'Bo', 'Lund', '888', (SELECT UnitID FROM Unit WHERE UnitNo = 'U3')),
    ('PP4', 'Peter', 'Lund', '999', (SELECT UnitID FROM Unit WHERE UnitNo = 'U3')),
    ('PP5', 'Anna', 'London', '100', (SELECT UnitID FROM Unit WHERE UnitNo = 'U2')),
    ('PP6', 'Anna', 'Berlin', '111', (SELECT UnitID FROM Unit WHERE UnitNo = 'U1'));

INSERT INTO Examines (EmployeeID, PatientID)
VALUES
    ((SELECT EmployeeID FROM Employee WHERE EmpNo = 'E1'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP1')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo = 'E1'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP2')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo = 'E1'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP3')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo = 'E2'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP1')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo = 'E2'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP3')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo = 'E3'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP3')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo = 'E3'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP4')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo = 'E3'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP5')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo = 'E4'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP5')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo = 'E4'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP3')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo = 'E4'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP4'));

INSERT INTO Illness (IllnessName)
VALUES ('Insomnia'), ('Love sickness'), ('Cough'), ('Amnesia'), ('Incontinence'), ('Chickenpox');

INSERT INTO Suffers (IllnessID, PatientID, StartDate)
VALUES
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP1'), '1953-01-12'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP2'), '2006-10-16'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP3'), '1978-01-05'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP1'), '2008-08-08'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP2'), '2003-01-22'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Cough'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP4'), '1998-06-07'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Cough'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP3'), '1978-05-23'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Incontinence'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP6'), '1989-11-11'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Amnesia'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP6'), '2010-12-09');

INSERT INTO HasSuffered (IllnessID, PatientID)
VALUES
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP1')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP2')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Cough'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP3')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Cough'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP1')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP3')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Cough'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP4')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP3')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP6')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName = 'Amnesia'), (SELECT PatientID FROM Patient WHERE PatientNo = 'PP6'));
`
};

function transformTsqlToSqlite(inputSql) {
  let sql = inputSql.replace(/\r\n/g, '\n');
  sql = sql.replace(/\bNVARCHAR\s*\(\s*\d+\s*\)/gi, 'TEXT')
           .replace(/\bVARCHAR\s*\(\s*\d+\s*\)/gi, 'TEXT')
           .replace(/\bCHAR\s*\(\s*\d+\s*\)/gi, 'TEXT')
           .replace(/\bDATETIME\b/gi, 'TEXT')
           .replace(/\bINT\b/gi, 'INTEGER');
  sql = sql.replace(/CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)\)\s*;/gi, (full, tableName, body) => {
    let newBody = body;
    const identityCols = [];
    newBody = newBody.replace(/(\b\w+\b)\s+INTEGER\s+IDENTITY\s*\(\s*\d+\s*,\s*\d+\s*\)/gi, (m, col) => {
      identityCols.push(col.toLowerCase());
      return `${col} INTEGER PRIMARY KEY AUTOINCREMENT`;
    });
    for (const col of identityCols) {
      const pattern = new RegExp(`(,\x20*)?(?:CONSTRAINT\x20+\w+\x20+)?PRIMARY\x20+KEY\x20*\(\x20*${col}\x20*\)\x20*(,\x20*)?`, 'gi');
      newBody = newBody.replace(pattern, (match, leadingComma, trailingComma) => (leadingComma || trailingComma ? ',' : ''));
    }
    if (/\bPRIMARY\s+KEY\b/i.test(newBody)) {
      newBody = newBody.replace(/(,\s*)?(?:CONSTRAINT\s+\w+\s+)?PRIMARY\s+KEY\s*\([^)]*\)\s*(,\s*)?/gi, (m, l, t) => (l || t ? ',' : ''));
    }
    newBody = newBody.replace(/\s+,\s+,/g, ', ').replace(/,\s*\)/g, ')').replace(/\n{2,}/g, '\n').trim();
    return `CREATE TABLE ${tableName} (${newBody});`;
  });
  return sql;
}

function setStatus(id, msg, isError) {
  const el = document.getElementById(id); if (!el) return;
  el.textContent = msg || ''; el.style.color = isError ? '#ff8888' : '#b7c7ff';
}

function renderTableFromResult(result) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  for (const c of result.columns) { const th = document.createElement('th'); th.textContent = c; trHead.appendChild(th); }
  thead.appendChild(trHead);
  const tbody = document.createElement('tbody');
  for (const row of result.values) { const tr = document.createElement('tr'); for (const cell of row) { const td = document.createElement('td'); td.textContent = cell == null ? '' : String(cell); tr.appendChild(td); } tbody.appendChild(tr); }
  table.appendChild(thead); table.appendChild(tbody); return table;
}

function renderResults(results) {
  const box = document.getElementById('results'); box.innerHTML = '';
  if (!results || results.length === 0) { const d = document.createElement('div'); d.textContent = 'No results'; box.appendChild(d); return; }
  for (const r of results) { if (r.columns && r.values) box.appendChild(renderTableFromResult(r)); else { const d = document.createElement('div'); d.textContent = 'Statement executed.'; box.appendChild(d); } }
}

async function loadSqlJs() { const config = { locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${f}` }; SQL = await initSqlJs(config); }

function execDDL() { try { ensureDb(); const ddl = transformTsqlToSqlite(document.getElementById('ddl').value); db.exec(ddl); setStatus('ddl-status', 'DDL executed'); } catch (e) { setStatus('ddl-status', e.message || 'Error', true); } }

function runQuery() { try { ensureDb(); const results = db.exec(document.getElementById('sql').value); renderResults(results); setStatus('query-status', 'Query executed'); } catch (e) { setStatus('query-status', e.message || 'Error', true); } }

function resetDb() { try { if (db) db.close(); } catch (_) {} db = new SQL.Database(); try { db.exec("PRAGMA encoding='UTF-8';"); } catch (_) {} try { db.exec('PRAGMA foreign_keys=ON;'); } catch (_) {} setStatus('ddl-status', 'DB reset'); }

async function loadSample(key) {
  if (!key) return; resetDb(); setStatus('ddl-status', 'Loading sample…');
  try {
    let text = BUILT_IN_SAMPLES[key];
    if (!text) { const res = await fetch(`samples/${key}.sql`); text = await res.text(); }
    document.getElementById('ddl').value = text || ''; execDDL(); setStatus('ddl-status', 'Sample loaded');
  } catch (e) { setStatus('ddl-status', 'Failed to load sample', true); }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadSqlJs(); db = new SQL.Database(); try { db.exec("PRAGMA encoding='UTF-8';"); } catch (_) {} try { db.exec('PRAGMA foreign_keys=ON;'); } catch (_) {}
  document.getElementById('exec-ddl').addEventListener('click', execDDL);
  document.getElementById('run-query').addEventListener('click', runQuery);
  document.getElementById('reset-db').addEventListener('click', resetDb);
  const sample = document.getElementById('sample-select'); if (sample) sample.addEventListener('change', e => loadSample(e.target.value));
});

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


