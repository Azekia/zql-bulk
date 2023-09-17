import { TWconnect, TWrequest } from "./tedwait.mjs";

function addItemToCommaList(list, item, newline) {
  if (!list) {
    return item;
  } else {
    return list + "," + (newline ? "\n" : "") + item;
  }
}

function sqlClauseForCreateTable(tablename, columnclauses) {
  return `CREATE TABLE [${tablename}] (\n${columnclauses}\n) `;
}

function sqlClauseForCreateColumn(col) {
  let nullable = "NOT NULL"; // TODO: col.nullable?
  switch (col.type.id) {
    case 173: // binary ¿timestamp?
      if (col.colName == "timestamp") {
        return `[timestamp] TIMESTAMP`;
      } else {
        return `[${col.colName}] BYNARY NULL`;
      }
    case 106:
      return `[${col.colName}] DECIMAL(${col.precision},${col.scale}) ${nullable}`;
    case 48:
      return `[${col.colName}] TINYINT ${nullable}`;
    case 52:
      return `[${col.colName}] SMALLINT ${nullable}`;
    case 56:
      return `[${col.colName}] INT ${nullable}`;
    case 167:
      return `[${col.colName}] NVARCHAR(${col.dataLength}) ${nullable}`;
    case 61:
      return `[${col.colName}] DATETIME ${nullable}`;
    case 34:
      return `[${col.colName}] IMAGE NULL`;
    default:
      return `[${col.colName}] ${col.type.id} ${col.type.type} ${col.type.name} ======================================================`;
  }
}

async function doCreateFromSelect(argumentos) {
  const conOptions = {
    server: argumentos.server,
    database: argumentos.database,
    user: argumentos.user,
    password: argumentos.password,
  };
  const sqlConnection = await TWconnect(conOptions);
  const queryText = `SELECT TOP 0 ${argumentos.columns} from [${argumentos.table}]`;
  const result = await TWrequest(sqlConnection, queryText);
  let columnclauses = "";
  for (let column in result.columns) {
    let cfcc = '    '+sqlClauseForCreateColumn(result.columns[column]);
    columnclauses = addItemToCommaList(columnclauses, cfcc, true);
  }
  let cfct = sqlClauseForCreateTable(
    argumentos.totable || argumentos.table,
    columnclauses
  );
  sqlConnection.close();
  return cfct;
}

export default doCreateFromSelect;
