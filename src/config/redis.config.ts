import { RedisStore } from "connect-redis";
import type { RedisClientOptions } from "redis";
import { createClient } from "redis";
import { logger } from "../logger/index.js";
import { REDIS_HOST, REDIS_PORT } from "../constants/index.js";
import { connectionErrorHandler } from "../middlewares/error.middleware.js";
import { retryWithExponentialBackoff } from "../utils/retry.js";

const redisConfig: RedisClientOptions = {
	socket: {
		port: REDIS_PORT,
		host: REDIS_HOST,
		reconnectStrategy: false, // !!! VVIMP
	},
	// pingInterval: 10000,
	// disableOfflineQueue: true,
};

// got type of client from stackoverflow
const ensureRedisReady = async (
	client: ReturnType<typeof createClient>,
): Promise<void> => {
	// early exit if already connected and ready for commands
	if (client.isReady) {
		return;
	}
	// not connected + isReady=false -> auth/handshake failure, server pause (logical)

	await retryWithExponentialBackoff(
		async () => {
			if (client.isOpen) {
				// stale/bad conn, fresh connection required
				logger.info("socket is open. trying force reconnect ...");
				client.destroy();
			}
			// TCP socket closed, just connect() can do a fresh socket opening (physical)
			await client.connect();
		},
		5, // maximum retries
		500, // base delay in ms
		"connect to redis",
	)
		.then(() => logger.info("Redis Conn Sucessful!"))
		.catch((err) => {
			connectionErrorHandler(err, "Error connecting to redis ...!!!");
			// process.exit(1); // optional- for critical
		});
};

//  debounce - to prevent multiple reconnection tries leads to spamming
let isReconnecting = false;
const RECONNECT_COOLDOWN = 5000; // 5 seconds
const redisErrorReconnectHandler = async (err: unknown): Promise<void> => {
	if (isReconnecting) {
		return Promise.resolve();
	} // for type safety
	isReconnecting = true;

	connectionErrorHandler(
		err as Error | AggregateError,
		"redis is not ready. attempting to reconnect ...",
	);

	await ensureRedisReady(redisClient).finally(() =>
		setTimeout(() => (isReconnecting = false), RECONNECT_COOLDOWN),
	);
};

// TODO : connection pool
// const redisClient = await createClient(redisConfig)
// 	.on("error", redisErrorReconnectHandler)
// 	.connect();
const redisClient = createClient(redisConfig).on(
	"error",
	redisErrorReconnectHandler,
);

await ensureRedisReady(redisClient);

const redisStore = new RedisStore({
	client: redisClient,
	prefix: "auth-session:", // default="sess:"
	// ttl: , // default=86400 (1 day), uses cookie expiry if exists
	// disableTTL: true, // default=false
	// disableTouch: true, // default=false-keep session alive on activity
	// scanCount: , // count param
	// serializer: , // encode/decode - store/retrieve
});

export { redisStore, redisClient };

// some notes about redis client
/**
 * BLOCK_CAPS_METHODS - redis native commands
 * camelCaseMethods - node-redis API (abstaction), prefer this
 * info() -> server info
 * clientinfo() -> conn info
 * sendCommand() -> use raw redis commands unavailable through API
 * isOpen -> TCP socket open status, becomes true just after connect() call
 * isReady -> fully conn, send commands, becomes true after handshake/auth
 * isWatching -> transactions, client watch state
 * disconnect() -> deprecated so use destroy() -> Destroy the client. Rejects all commands immediately.
 * connection => connect() -> isOpen=true -> auth/handshake -> isReady=true
 * disconnection => disconnect() -> isOpen=false, isReady=false
 * reconnectStrategy - you are never going to forget this as it took 2 days to figure it out
 */
