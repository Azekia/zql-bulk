import { TWconnect, TWrequest, addItem2ListComma, sqlClauseForCreateTable,sqlClauseForCreateColumn } from "./zedious.mjs";



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
    let cfcc = sqlClauseForCreateColumn(result.columns[column]);
    columnclauses = addItem2ListComma(columnclauses, cfcc, '    ');
  }
  let cfct = sqlClauseForCreateTable(
    argumentos.totable || argumentos.table,
    columnclauses
  );
  sqlConnection.close();
  return cfct;
}

export {doCreateFromSelect};
