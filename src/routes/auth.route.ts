import { Router } from "express";
import { zodValidator } from "../middlewares/zodValidate.middleware.js";
import { AuthSchema } from "../schemas/index.js";
import { authHandlers } from "../controllers/index.js";

const router = Router();

router.post(
	"/register",
	zodValidator(AuthSchema.registerSchema),
	authHandlers.registerHandler,
);

router.post(
	"/login",
	zodValidator(AuthSchema.loginSchema),
	authHandlers.loginHandler,
);

router.post("/logout", authHandlers.logoutHandler);

export default router;
