import { Request } from "express";
import type { ISessionUser } from "../auth.interface.ts";
declare global {
	namespace Express {
		interface Request {
			user?: ISessionUser; // ensure req.user is always avaiable/undefined
		}
	}
}
