import path from "path";

const __dirname = path.join(import.meta.dirname, "..");

const PORT = Number(process.env.PORT);

if (isNaN(PORT)) {
	throw new Error("check for PORT (it's not a number)");
}

const isProd: boolean = process.env.NODE_ENV === "production";

const sessionSecret = process.env.SESSION_SECRET || "lokeshwar777";

// dev - debug/trace, prod - info/warn
const LOG_LEVEL = process.env.PINO_LOG_LEVEL || (isProd ? "info" : "debug");

export { __dirname, PORT, isProd, LOG_LEVEL, sessionSecret };
export { ERRORS } from "./error.constants.js";
export { RESPONSES } from "./response.constants.js";
export { DATABASE_URI, DATABASE_NAME } from "./db.constants.js";

// use this to generate any strong secret - node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))" and store the secret in .env
