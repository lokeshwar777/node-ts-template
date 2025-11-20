import { logger } from "../logger/index.js";

const retryWithExponentialBackoff = async <T>(
	fn: () => Promise<T>,
	maxAttempts: number = 7,
	delayPeriodMs: number = 1000,
	connectionType: string = "UNKOWN",
): Promise<T | void> => {
	for (let attempts = 1; attempts <= maxAttempts + 1; attempts++) {
		// console.log("attempts", attempts, maxAttempts);
		try {
			return await fn(); // try connecting
		} catch (err) {
			if (attempts > maxAttempts) {
				logger.error(
					`${connectionType} failed after ${maxAttempts} attempts`,
				);
				throw err;
			}
			const delay = delayPeriodMs * (1 << (attempts - 1)); // exponential backoff

			logger.warn(
				`${connectionType} failed! retrying ${attempts} attempt after ${delay} ms`,
			);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	// shouldn't reach till here
	logger.error(
		"something went wrong in retry with exponential backoff logic",
	);
};

export { retryWithExponentialBackoff };
