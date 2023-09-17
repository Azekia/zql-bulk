import { TWconnect, TWrequest, addItem2ListComma, value2sqlexpresion } from "./zedious.mjs";

async function doInsertsFromSelect(argumentos) {
  const conOptions = {
    server: argumentos.server,
    database: argumentos.database,
    user: argumentos.user,
    password: argumentos.password,
  };
  
  const sqlConnection = await TWconnect(conOptions);
  let queryText = `SELECT ${argumentos.columns} from [${argumentos.table}]`;
  if (argumentos.where) queryText += ` WHERE ${argumentos.where}`;
  const result = await TWrequest(sqlConnection, queryText);
  let listaCampos = "";
  for (let c in result.columns) {
    if (result.columns[c].colName == "timestamp") continue;
    listaCampos = addItem2ListComma(listaCampos, `[${result.columns[c].colName}]`);
  }
  let ifs = "";
  for (let r in result.rows) {
    let row = result.rows[r];
    let listaValores = "";
    for (let c in result.columns) {
      if (result.columns[c].colName == "timestamp") continue;
      listaValores = addItem2ListComma(listaValores, value2sqlexpresion(row[c]));
    }
    ifs += `INSERT INTO [${
      argumentos.totable || argumentos.table
    }] (${listaCampos})\n       VALUES (${listaValores})\n`;
  }
  sqlConnection.close();
  return ifs;
}

export { doInsertsFromSelect };
