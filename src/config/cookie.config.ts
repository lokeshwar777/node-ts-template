import type { CookieOptions } from "express-session";
import { isProd } from "../constants/index.js";

const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: isProd,
	path: "/",
	sameSite: isProd ? "lax" : "strict",
	maxAge: 1000 * 60 * 15,
};

export { cookieOptions };
