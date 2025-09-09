let SQL;
let db;

// Embedded sample to avoid fetch issues when opened via file://
const HOSPITAL_DDL = `CREATE TABLE Unit (
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

-- Insert data into Unit
-- We insert Unit numbers, names, and addresses directly.
INSERT INTO Unit (UnitNo, UnitName, UnitAddress)
VALUES
    ('U1', 'General Surgery', 'Hospital road'),
    ('U2', 'Rehabilitation', 'Hospital road'),
    ('U3', 'Trauma', 'Care road');

-- Insert data into Employee
-- We insert Employee Number (EmpNo) and other details. EmployeeID is auto-generated.
INSERT INTO Employee (EmpNo, EmpName, EmpAddress, EmpPhoneNumber, EmpSalary, UnitID)
VALUES
    ('E1', 'Anna', 'Lund', '111', 25000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('E2', 'Eva', 'Eslöv', '222', 55000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('E3', 'Anna', 'Lund', '333', 37500, (SELECT UnitID FROM Unit WHERE UnitNo = 'U2')),
    ('E4', 'Hans', 'Eslöv', '444', 18000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U2')),
    ('E5', 'Eva', 'Malmö', '555', 279000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U3')),
    ('E6', 'Peter', 'Dalby', '666', 32000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U1'));

-- Insert data into Patient
-- We insert Patient Number (PatientNo) and other details. PatientID is auto-generated.
INSERT INTO Patient (PatientNo, PatientName, PatientAddress, PatientPhoneNumber, UnitID)
VALUES
    ('PP1', 'Anna', 'Lund', '111', (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('PP2', 'Hans', 'Dalby', '777', (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('PP3', 'Bo', 'Lund', '888', (SELECT UnitID FROM Unit WHERE UnitNo = 'U3')),
    ('PP4', 'Peter', 'Lund', '999', (SELECT UnitID FROM Unit WHERE UnitNo = 'U3')),
    ('PP5', 'Anna', 'London', '100', (SELECT UnitID FROM Unit WHERE UnitNo = 'U2')),
    ('PP6', 'Anna', 'Berlin', '111', (SELECT UnitID FROM Unit WHERE UnitNo = 'U1'));

-- Insert data into Examines
-- Links Employees and Patients. We use subqueries to fetch EmployeeID and PatientID.
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

-- Insert data into Illness
-- We insert illness names directly. IllnessID is auto-generated.
INSERT INTO Illness (IllnessName)
VALUES
    ('Insomnia'),
    ('Love sickness'),
    ('Cough'),
    ('Amnesia'),
    ('Incontinence'),
    ('Chickenpox');

-- Insert data into Suffers
-- Links Illnesses and Patients with start dates. Using subqueries for IDs.
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

-- Insert data into HasSuffered
-- Links Illnesses and Patients without start dates.
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

    -- Insert data into Car
-- We insert License Number (LicenseNo), Brand, Price, and link to Employee if applicable.
INSERT INTO Car (LicenseNo, Brand, Price, EmployeeID)
VALUES
    ('C1', 'saab', 30000, NULL),
    ('C2', 'saab', 40000, (SELECT EmployeeID FROM Employee WHERE EmpNo = 'E1')),
    ('C3', 'volvo', 50000, (SELECT EmployeeID FROM Employee WHERE EmpNo = 'E2')),
    ('C4', 'volvo', 60000, (SELECT EmployeeID FROM Employee WHERE EmpNo = 'E3')),
    ('C5', 'audi', 70000, (SELECT EmployeeID FROM Employee WHERE EmpNo = 'E4')),
    ('C6', 'audi', 30000, NULL),
    ('C7', 'saab', 30000, (SELECT EmployeeID FROM Employee WHERE EmpNo = 'E5'));

-- Drop tables (uncomment to drop)
/*
DROP TABLE HasSuffered;
DROP TABLE Suffers;
DROP TABLE Examines;
DROP TABLE Car;
DROP TABLE Patient;
DROP TABLE Employee;
DROP TABLE Illness;
DROP TABLE Unit;
*/`;

function ensureDb() {
  if (!db) db = new SQL.Database();
}

function transformTsqlToSqlite(inputSql) {
  let sql = inputSql.replace(/\r\n/g, '\n');

  // Replace SQL Server functions with SQLite equivalents
  sql = sql.replace(/\bISNULL\s*\(/gi, 'IFNULL(')
           .replace(/\bGETDATE\s*\(\s*\)/gi, "datetime('now')")
           .replace(/\bLEN\s*\(/gi, 'LENGTH(')
           .replace(/\bNEWID\s*\(\s*\)/gi, "hex(randomblob(16))")
           .replace(/\bCONVERT\s*\(([^,]+),\s*([^)]+)\)/gi, '$2') // crude: just use the value
           .replace(/\bCAST\s*\(([^)]+)\s+AS\s+[^)]+\)/gi, '$1') // crude: just use the value
           .replace(/\bGETUTCDATE\s*\(\s*\)/gi, "datetime('now')")
           .replace(/\bDATEADD\s*\(([^,]+),\s*([^,]+),\s*([^)]+)\)/gi, '$3') // crude: just use the date
           .replace(/\bDATENAME\s*\(([^,]+),\s*([^)]+)\)/gi, '$2') // crude: just use the date
           .replace(/\bDATEPART\s*\(([^,]+),\s*([^)]+)\)/gi, '$2') // crude: just use the date
           .replace(/\bGETDATE\b/gi, "datetime('now')");

  // Map common types globally first
  sql = sql.replace(/\bNVARCHAR\s*\(\s*\d+\s*\)/gi, 'TEXT')
           .replace(/\bVARCHAR\s*\(\s*\d+\s*\)/gi, 'TEXT')
           .replace(/\bCHAR\s*\(\s*\d+\s*\)/gi, 'TEXT')
           .replace(/\bDATETIME\b/gi, 'TEXT')
           .replace(/\bINT\b/gi, 'INTEGER')
           .replace(/\bBIT\b/gi, 'INTEGER')
           .replace(/\bMONEY\b/gi, 'REAL')
           .replace(/\bSMALLINT\b/gi, 'INTEGER')
           .replace(/\bUNIQUEIDENTIFIER\b/gi, 'TEXT');

  // Remove GO statements (batch separator in SQL Server)
  sql = sql.replace(/^GO$/gim, '');

  // Transform: SELECT ... INTO newtable FROM ...
  // Regex breakdown:
  //   ^SELECT(.*?)INTO\s+(\w+)\s+(FROM\s+.*?;)
  // Handles multi-line and ignores case
  sql = sql.replace(
    /SELECT([\s\S]*?)INTO\s+(\w+)\s+(FROM[\s\S]*?;)/gi,
    (match, selectCols, tableName, fromRest) => {
      // Clean up whitespace and ensure space after SELECT
      return `CREATE TABLE ${tableName} AS SELECT ${selectCols.trim()} ${fromRest.trim()}`;
    }
  );

  // Process each CREATE TABLE block so we can reliably remove duplicate PK constraints
  sql = sql.replace(/CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)\)\s*;/gi, (full, tableName, body) => {
    let newBody = body;
    const identityCols = [];

    // Replace IDENTITY columns
    newBody = newBody.replace(/(\b\w+\b)\s+INTEGER\s+IDENTITY\s*\(\s*\d+\s*,\s*\d+\s*\)/gi, (m, col) => {
      identityCols.push(col);
      return `${col} INTEGER PRIMARY KEY AUTOINCREMENT`;
    });

    // Remove duplicate table-level PRIMARY KEY(col) constraints for those columns
    for (const col of identityCols) {
      newBody = newBody.replace(new RegExp(`CONSTRAINT\\s+\\w+\\s+PRIMARY\\s+KEY\\s*\\(\\s*${col}\\s*\\)\\s*,?`, 'gi'), '');
    }

    // If any inline PRIMARY KEY exists, remove any remaining table-level PRIMARY KEY(...) to avoid duplicates
    if (/\bPRIMARY\s+KEY\b/i.test(newBody)) {
      newBody = newBody.replace(/CONSTRAINT\s+\w+\s+PRIMARY\s+KEY\s*\([^)]*\)\s*,?/gi, '');
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
    const ddlRaw = window.ddlEditor ? window.ddlEditor.getValue() : document.getElementById('ddl').value;
    const ddl = transformTsqlToSqlite(ddlRaw);
    db.exec(ddl);
    setStatus('ddl-status', 'DDL executed');
    if (window.ddlEditor) {
      window.ddlEditor.setValue(ddlRaw); // Ensure the editor visually reflects the executed content
    }
  } catch (e) {
    setStatus('ddl-status', e.message || 'Error', true);
  }
}

function getSingleValue(sql, defaultValue) {
  try {
    const res = db.exec(sql);
    if (res && res[0] && res[0].values && res[0].values[0] && res[0].values[0][0] !== undefined) {
      return res[0].values[0][0];
    }
  } catch (_) {}
  return defaultValue;
}

function populateHospitalCarIfEmpty() {
  try {
    ensureDb();
    const count = getSingleValue('SELECT COUNT(*) FROM Car;', 0) || 0;
    if (count > 0) return; // already populated

    // Resolve EmployeeIDs by EmpNo
    const e1 = getSingleValue("SELECT EmployeeID FROM Employee WHERE EmpNo = 'E1';", null);
    const e2 = getSingleValue("SELECT EmployeeID FROM Employee WHERE EmpNo = 'E2';", null);
    const e3 = getSingleValue("SELECT EmployeeID FROM Employee WHERE EmpNo = 'E3';", null);
    const e4 = getSingleValue("SELECT EmployeeID FROM Employee WHERE EmpNo = 'E4';", null);
    const e5 = getSingleValue("SELECT EmployeeID FROM Employee WHERE EmpNo = 'E5';", null);

    const inserts = [
      `INSERT INTO Car (LicenseNo, Brand, Price, EmployeeID) VALUES ('C1', 'saab', 30000, NULL);`,
      e1 !== null ? `INSERT INTO Car (LicenseNo, Brand, Price, EmployeeID) VALUES ('C2', 'saab', 40000, ${e1});` : null,
      e2 !== null ? `INSERT INTO Car (LicenseNo, Brand, Price, EmployeeID) VALUES ('C3', 'volvo', 50000, ${e2});` : null,
      e3 !== null ? `INSERT INTO Car (LicenseNo, Brand, Price, EmployeeID) VALUES ('C4', 'volvo', 60000, ${e3});` : null,
      e4 !== null ? `INSERT INTO Car (LicenseNo, Brand, Price, EmployeeID) VALUES ('C5', 'audi', 70000, ${e4});` : null,
      `INSERT INTO Car (LicenseNo, Brand, Price, EmployeeID) VALUES ('C6', 'audi', 30000, NULL);`,
      e5 !== null ? `INSERT INTO Car (LicenseNo, Brand, Price, EmployeeID) VALUES ('C7', 'saab', 30000, ${e5});` : null,
    ].filter(Boolean).join('\n');

    if (inserts) db.exec(inserts);
  } catch (_) {
    // ignore; best-effort population
  }
}

function runQuery() {
  try {
    ensureDb();
    const sqlRaw = window.sqlEditor ? window.sqlEditor.getValue() : document.getElementById('sql').value;
    const sql = transformTsqlToSqlite(sqlRaw);
    const results = db.exec(sql);
    renderResults(results);
    setStatus('query-status', 'Query executed');
    if (window.sqlEditor) {
      window.sqlEditor.setValue(sqlRaw); // Ensure the editor visually reflects the executed content
    }
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

async function loadSample(key) {
  if (!key) return;

  resetDb();
  setStatus('ddl-status', 'Loading sample…');

  try {
    if (key === 'hospital-ddl') {
      if (window.ddlEditor) {
        window.ddlEditor.setValue(HOSPITAL_DDL);
      } else {
        document.getElementById('ddl').value = HOSPITAL_DDL;
      }
      // Wait a moment for the editor to update, then execute
      setTimeout(() => {
        execDDL();
        populateHospitalCarIfEmpty();
        if (window.sqlEditor) {
          window.sqlEditor.setValue('SELECT * FROM Car;');
        } else {
          document.getElementById('sql').value = 'SELECT * FROM Car;';
        }
        setStatus('ddl-status', 'Sample loaded and executed');
      }, 100);
      return;
    }

    const response = await fetch(`${key}.sql`);
    if (!response.ok) {
      throw new Error(`Failed to fetch sample: ${response.statusText}`);
    }
    const text = await response.text();
    if (window.ddlEditor) {
      window.ddlEditor.setValue(text);
    } else {
      document.getElementById('ddl').value = text;
    }
    setTimeout(() => {
      execDDL();
      setStatus('ddl-status', 'Sample loaded and executed');
    }, 100);
  } catch (e) {
    setStatus('ddl-status', `Failed to load sample: ${e.message}`, true);
  }
}

// Replace textareas with CodeMirror instances
function initializeCodeMirror() {
  const ddlTextarea = document.getElementById('ddl');
  const sqlTextarea = document.getElementById('sql');

  if (ddlTextarea) {
    window.ddlEditor = CodeMirror.fromTextArea(ddlTextarea, {
      mode: 'text/x-sql',
      lineNumbers: true,
      theme: 'default',
      viewportMargin: Infinity,
      lineWrapping: false,
      scrollbarStyle: 'native'
    });
    
    // Force width constraints
    window.ddlEditor.getWrapperElement().style.width = '100%';
    window.ddlEditor.getWrapperElement().style.maxWidth = '100%';
    window.ddlEditor.getScrollerElement().style.maxWidth = '100%';
    
    window.ddlEditor.on('change', () => {
      ddlTextarea.value = window.ddlEditor.getValue();
    });
  }

  if (sqlTextarea) {
    window.sqlEditor = CodeMirror.fromTextArea(sqlTextarea, {
      mode: 'text/x-sql',
      lineNumbers: true,
      theme: 'default',
      viewportMargin: Infinity,
      lineWrapping: false,
      scrollbarStyle: 'native'
    });
    
    // Force width constraints
    window.sqlEditor.getWrapperElement().style.width = '100%';
    window.sqlEditor.getWrapperElement().style.maxWidth = '100%';
    window.sqlEditor.getScrollerElement().style.maxWidth = '100%';
    
    window.sqlEditor.on('change', () => {
      sqlTextarea.value = window.sqlEditor.getValue();
    });
  }
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
  
  // Add event listener for sample selector
  const sampleSelect = document.getElementById('sample-select');
  if (sampleSelect) {
    sampleSelect.addEventListener('change', (e) => loadSample(e.target.value));
  }

  initializeCodeMirror();
});
