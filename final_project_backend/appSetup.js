const path = require("path")
const commander = require("commander");
const dotenv = require("dotenv");

// Configura y parsea los argumentos del CLI
commander
  .version("1.0.0", "-v, --version")
  .option("--dev", "Runs app in development mode")
  .option("-p, --port <number>", "Define service port", 8000)
  .option(
    "-b, --bind <string>",
    "Bind the service to the selected host",
    "127.0.0.1"
  )
  .parse(process.argv);

const cliArgs = commander.opts();

// Carga dotenv
const dotenvPath = path.join(
  __dirname,
  cliArgs.dev ? ".env.development" : ".env"
);
dotenv.config({ path: dotenvPath });

module.exports = cliArgs;
