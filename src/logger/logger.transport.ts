import path from "path";
import type { DestinationStream, TransportTargetOptions } from "pino";
import pino from "pino";
import { isProd, LOG_LEVEL } from "../constants/index.js";

const __dirname = import.meta.dirname;
const absoluteLogFilePath = path.normalize(
	path.join(__dirname, "..", "logs", "output.log"),
);

const target: string = isProd ? "pino/file" : "pino-pretty";

// output logs to log file (`output.log`)
const fileTransport: TransportTargetOptions = {
	target,
	options: {
		destination: absoluteLogFilePath,
		mkdir: true,
		colorize: false,
		translateTime: "HH:MM:ss.l",
		ignore: "pid,hostname",
	},
};

const targets: TransportTargetOptions[] = [fileTransport];

// output logs to console
if (!isProd) {
	targets.push({ target, level: LOG_LEVEL });
}

const loggerTransport: DestinationStream = pino.transport({ targets });

export { loggerTransport };

// destination : (default) 1-STDOUT, 2-STDERR
// REF : https://getpino.io/#/docs/transports?id=pinofile
// ADDITIONAL CONSIDERATIONS
// append: false, // if you do not want to append
// tokens in case of cloud loggers
