import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import beaver from "../assets/beaver.svg";
import { hcWithType } from "server/dist/client";
import type { ApiResponse } from "shared/dist";
import "../App.css";

export const Route = createFileRoute("/")({
	component: Index,
});

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8787";

const client = hcWithType(SERVER_URL);

function Index() {
	const [data, setData] = useState<ApiResponse>();

	async function sendRequest() {
		try {
			const res = await client.hello.$get();
			if (!res.ok) {
				console.error("Error fetching data");
				return;
			}
			const json = await res.json();
			setData(json);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<>
			<div>
				<a
					href="https://github.com/stevedylandev/bhvr"
					target="_blank"
					rel="noopener"
				>
					<img src={beaver} className="logo" alt="beaver logo" />
				</a>
			</div>
			<h1>bhvr</h1>
			<h2>Bun + Hono + Vite + React</h2>
			<p>A typesafe fullstack monorepo</p>
			<p className="preview-test">Preview test: deployment fix verified</p>
			<div className="card">
				<div className="button-container">
					<button type="button" onClick={sendRequest}>
						Call API
					</button>
					<a
						className="docs-link"
						target="_blank"
						href="https://bhvr.dev"
						rel="noopener"
					>
						Docs
					</a>
				</div>
				{data && (
					<pre className="response">
						<code>
							Message: {data.message} <br />
							Success: {data.success.toString()}
						</code>
					</pre>
				)}
			</div>
		</>
	);
}

export default Index;
