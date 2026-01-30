import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse, HealthResponse, VersionResponse } from "shared/dist";
import type { CloudflareBindings } from "./env";

export const app = new Hono<{ Bindings: CloudflareBindings }>()

	.use(cors())

	.get("/", (c) => {
		return c.text("Hello Hono!");
	})

	.get("/hello", async (c) => {
		const data: ApiResponse = {
			message: "Hello BHVR!",
			success: true,
		};

		return c.json(data, { status: 200 });
	})

	.get("/version", (c) => {
		const data: VersionResponse = {
			version: c.env?.APP_VERSION ?? "0.0.0",
			name: c.env?.APP_NAME ?? "server",
		};
		return c.json(data, { status: 200 });
	})

	.get("/health", (c) => {
		const data: HealthResponse = {
			status: "ok",
		};
		return c.json(data, { status: 200 });
	});

export default app;
