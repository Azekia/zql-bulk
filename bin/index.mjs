#!  /usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import dotenv from "dotenv";
import readline from "readline";
import doCreateFromSelect from "./doCreateFromSelect.mjs";

async function main() {
  dotenv.config();

  const usageTxt = "\nUsage: zql-bulk [options] (or use ZQLBULK_ env vars)\n\n";

  const argv = yargs(hideBin(process.argv))
    .usage(usageTxt)
    .option("action", {
      describe: "Actions to execute (create, inserts...) ",
      type: "string",
      demandOption: false,
    })
    .option("server", {
      describe: "Server name or IP address",
      type: "string",
      demandOption: !process.env.ZQLBULK_SERVER,
    })
    .option("port", {
      describe: "Port number",
      type: "number",
      demandOption: false,
    })
    .option("user", {
      describe: "User name",
      type: "string",
      demandOption: !process.env.ZQLBULK_USER,
    })
    .option("password", {
      describe: "Password",
      type: "string",
      demandOption: false,
    })
    .option("database", {
      describe: "Database name",
      type: "string",
      default: process.env.ZQLBULK_DATABASE,
      demandOption: !process.env.ZQLBULK_DATABASE,
    })
    .option("table", {
      describe: "Table name",
      type: "string",
      demandOption: !process.env.ZQLBULK_TABLE,
    })
    .option("columns", {
      describe: "Column names (can be *)",
      type: "string",
      demandOption: false,
    })
    .option("totable", {
      describe: "Destination Table name",
      type: "string",
      demandOption: false,
    })
    .parse();

  const argumentos = {
    server: argv.server || process.env.ZQLBULK_SERVER,
    port: argv.port || process.env.ZQLBULK_PORT || 1433,
    user: argv.user || process.env.ZQLBULK_USER,
    password: argv.password || process.env.ZQLBULK_PASSWORD,
    database: argv.database || process.env.ZQLBULK_DATABASE,
    table: argv.table || process.env.ZQLBULK_TABLE,
    columns: argv.columns || process.env.ZQLBULK_COLUMNS || "*",
    totable: argv.totable || undefined,
  };

  if (!argumentos.password) {
    const inputLineFromUser = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("Enter password:");
    for await (const line of inputLineFromUser) {
      console.log(`Received: ${line}`);
      argumentos.password = line;
      break;
    }
    console.log(JSON.stringify(argumentos, null, 4));
    inputLineFromUser.close();
  }
  console.log('--zql-bulk running...')
  let cfs = await doCreateFromSelect(argumentos);
  if (cfs) console.log(cfs)
  else console.log('--doCreateFromSelect returns nothing')
  
}

main();
