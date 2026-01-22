import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse,VersionResponse } from "shared/dist";

export const app = new Hono()

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

.get("/version", async (c) => {
	// Use import.meta.dir to get the directory of this file, then navigate to package.json
	const packagePath = `${import.meta.dir}/../../package.json`;
	const packageJson = await Bun.file(packagePath).json();
	const data: VersionResponse = {
		version: packageJson.version,
		name: packageJson.name,
	};

	return c.json(data, { status: 200 });
});


export default app;
