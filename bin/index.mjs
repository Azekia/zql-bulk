#!  /usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import dotenv from "dotenv";
import readline from "readline";
import {doCreateFromSelect} from "./doCreateFromSelect.mjs";
import {doInsertsFromSelect} from "./doInsertsFromSelect.mjs";

async function main() {
  // ****************************************************************************************
  // GET ARGUMENTS (AND ENVs)
  // ****************************************************************************************
  dotenv.config();
  const usageTxt = "\nUsage: zql-bulk [options] (or use ZQLBULK_ env vars)\n\n";

  const argv = yargs(hideBin(process.argv))
    .usage(usageTxt)
    .option("action", {
      describe: "Actions to execute (create, inserts...) ",
      type: "string",
      demandOption: true,
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
    .option("where", {
      describe: "Where clause to filter input rows",
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
    action: argv.action,
    server: argv.server || process.env.ZQLBULK_SERVER,
    port: argv.port || process.env.ZQLBULK_PORT || 1433,
    user: argv.user || process.env.ZQLBULK_USER,
    password: argv.password || process.env.ZQLBULK_PASSWORD,
    database: argv.database || process.env.ZQLBULK_DATABASE,
    table: argv.table || process.env.ZQLBULK_TABLE,
    columns: argv.columns || process.env.ZQLBULK_COLUMNS || "*",
    totable: argv.totable || undefined,
    where: argv.where || undefined,
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
    inputLineFromUser.close();
  }
  doAction(argumentos);
}

// ****************************************************************************************
// doAction
// ****************************************************************************************
async function doAction(argumentos) {
  let done = false;
  console.log(`--zql-bulk running... --action ${argumentos.action}`);
  if (argumentos.action == "create" || argumentos.action == "migrate") {
    let cfs = await doCreateFromSelect(argumentos);
    if (cfs) {
      console.log(`-- CREATE TABLE ${argumentos.totable || argumentos.table} =================================================`);
      console.log(cfs);
      done = true;
    } else console.log("--doCreateFromSelect returns nothing");
  }

  if (argumentos.action == "insert" || argumentos.action == "migrate") {
    let ifs = await doInsertsFromSelect(argumentos);
    if (ifs) {
      console.log(`-- INSERTS ON TABLE ${argumentos.totable || argumentos.table} =============================================`);
      console.log(ifs);
      done = true;
    } else console.log("--doInsertsFromSelect returns nothing");
  }
  if (!done) console.log("--zql-bulk has done nothing (no --action?)");
  return done;
}

main();
