import {TWconnect,TWrequest} from "./zedious.mjs";

export async function doJsonFromSelect(argumentos) {
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

  const jsonArray = result.rows.map((row) => {
    const jsonObject = {};
    for (let c in result.columns) {
      const columnName = result.columns[c].colName;
      let value = row[c];

      if (columnName !== "timestamp") {
        if (Buffer.isBuffer(value)) {
          if (argumentos.blobAsSqlHex) {
            value = `0x${value.toString("hex").toUpperCase()}`;
          } else if (argumentos.blobAsBase64) {
            value = value.toString("base64");
          } else if (argumentos.blobAsArray) {
           //console.log(Array.from(value))
            value = Array.from(value);
          }
        }
        jsonObject[columnName] = value;
      }
    }
    return jsonObject;
  });

  sqlConnection.close();
  return (argumentos.prettyJson) ?  JSON.stringify(jsonArray,null,2) : JSON.stringify(jsonArray);
}
