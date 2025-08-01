import type session from "express-session";
import { isProd } from "../constants/index.js";

const cookieOptions: session.CookieOptions = {
	httpOnly: true,
	secure: isProd,
	path: "/",
	sameSite: isProd ? "lax" : "strict",
	maxAge: 1000 * 60 * 15,
};

export { cookieOptions };
