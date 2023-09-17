import tedious from 'tedious';


async function doCreate(argumentos) 
{
    console.log("doCreate: ", argumentos);
    const sqlConnection =  new tedious.Connection({
        server: argumentos.server,
        
        options: {
            database: argumentos.database,
            rowCollectionOnDone: true,
            useColumnNames: true,
            encrypt: false,
            trustServerCertificate: true,
            cryptoCredentialsDetails: {
                minVersion: 'TLSv1',
                ciphers: 'DEFAULT@SECLEVEL=0'
            },                
        },
        authentication: {
            type: "default",
            options: {
                userName: argumentos.user,
                password: argumentos.password
            },


        }
    });


    sqlConnection.connect();

    sqlConnection.on("connect", function (err) {
        if (err) {
            console.error("Error: ", err);
        }
        else {
            let queryText =`SELECT ${argumentos.columns} from [${argumentos.table}]`;
            console.log("Query: ", queryText);
            let request = new tedious.Request(queryText, function (err, rowCount, rows) {   
                console.dir('ROWCOUNT:', rowCount,rows);
             
             });
            request.on("done", function (rowCount, more, rows) {
                console.dir('ROWS:', rows);
            });
            request.on("columnMetadata", function (columns) {
                console.dir('COLUMNS:', columns);
            });
            /*request.on("row", function (columns) {
                console.dir('ON.ROW:', columns);
            });*/
            request.on("error", function (err) {
                console.log('ERROR:', err);
            });
            sqlConnection.execSql(request);
            
        }
    });
    
    
}

export default doCreate;
