import path from "path";
import { RedisClientOptions } from "redis";

const __dirname = path.join(import.meta.dirname, "..");

const PORT = Number(process.env.PORT);

if (isNaN(PORT)) {
	const expressPortError = new Error("check for PORT (it's not a number)");
	throw expressPortError;
}

const REDIS_PORT = Number(process.env.REDIS_PORT);

if (isNaN(REDIS_PORT)) {
	const redisPortError = new Error(
		"check for redis PORT (it's not a number)",
	);
	throw redisPortError;
}

const REDIS_HOST = process.env.REDIS_HOST;

const isProd: boolean = process.env.NODE_ENV === "production";

const sessionSecret = process.env.SESSION_SECRET || "lokeshwar777";

// dev - debug/trace, prod - info/warn
const LOG_LEVEL = process.env.PINO_LOG_LEVEL || (isProd ? "info" : "debug");

export {
	__dirname,
	PORT,
	isProd,
	LOG_LEVEL,
	sessionSecret,
	REDIS_PORT,
	REDIS_HOST,
};
export { ERRORS } from "./error.constants.js";
export { RESPONSES } from "./response.constants.js";
export { DATABASE_URI, DATABASE_NAME } from "./db.constants.js";

// use this to generate any strong secret - node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))" and store the secret in .env
