import type { SessionOptions } from "express-session";
import { isProd, sessionSecret } from "../constants/index.js";
import { randomUUID } from "node:crypto";
import { cookieOptions } from "./index.js";

const sessionConfig: SessionOptions = {
	secret: sessionSecret,
	name: isProd ? "__Host-sid" : "sid777", // display name of the cookie
	genid: () => randomUUID(), // session id generation
	cookie: cookieOptions,
	unset: "destroy",
	resave: false,
	saveUninitialized: false,
	// rolling: true, // resets maxAge on every request
};

export { sessionConfig };

// REF - https://github.com/expressjs/session
// stored - sessionId in cookie, rest in server-side
// cookie-parser - causes issues on secret mismatch
// MemoryStore - only for dev/debug
// last(expires, maxAge) is used, so prefer maxAge > expires
// saveUninitialized affects rolling=true
// uninitialized = new but not modified : false is better for permissions, parallel requests
// DEBUG=express-session - view internal logs
