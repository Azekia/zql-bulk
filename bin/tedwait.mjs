import { Connection, Request } from 'tedious';

 function bufToBigint (buf) {
    let ret = BigInt(0)
    for (const i of buf.values()) {
      const bi = BigInt(i)
      ret = (ret << 8n) + bi
    }
    return ret
  }

const TWconnect = (argumentos) =>
  new Promise((resolve, reject) => {
    const config = {
      server: argumentos.server,
      options: {
        database: argumentos.database,
        rowCollectionOnDone: true,
        useColumnNames: true,
        encrypt: false,
        trustServerCertificate: true,
        cryptoCredentialsDetails: {
          minVersion: "TLSv1",
          ciphers: "DEFAULT@SECLEVEL=0",
        },
      },
      authentication: {
        type: "default",
        options: {
          userName: argumentos.userName || argumentos.user,
          password: argumentos.password,
        },
      },
    };

    const connection = new Connection(config);
    connection.on("connect", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
    connection.connect();
  });

const TWrequest = (sqlConnection, queryText) =>
  new Promise((resolve, reject) => {
    let cuentaRows = 0;
    let result = { err: false, columns: [], rows: [] };
    const request = new Request(queryText, (err) => {
      if (err) {
        reject(err);
      } else {
        result.rows=result.rows.map((row) => {
            let rowsimplificada = {};
            for (let c in row) {
                if (c == 'timestamp') rowsimplificada[c] = bufToBigint(row[c].value).toString();
                else rowsimplificada[c] = row[c].value;
            }
            return rowsimplificada;
        })
        result.checkCount = cuentaRows;
        resolve(result);
      }
    });
    request.on("done", function (rowCount, more, rows) {
      if (rows && rows.length) result.rows = rows;
    });
    request.on("doneProc", function (rowCount, more, returnStatus, rows) {
      if (rows && rows.length) result.rows = rows;
    });
    request.on("doneInProc", function (rowCount, more, rows) {
      if (rows && rows.length) result.rows = rows;
    });
    request.on("columnMetadata", function (columns) {
      if (columns) result.columns = columns;
    });
    request.on("row", function (columns) {
      cuentaRows++;
    });
    request.on("error", function (err) {
      console.log("ERROR executeSQL:", err);
      result.err = true;
    });
    sqlConnection.execSql(request);
  });

export { TWconnect, TWrequest };
