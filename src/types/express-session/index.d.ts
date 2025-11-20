import "express-session";
import type { ISessionUser } from "../auth.interface.ts";

// tell TS that we are augmenting express-session not declaring it
declare module "express-session" {
	interface SessionData {
		user?: ISessionUser;
	}
}
