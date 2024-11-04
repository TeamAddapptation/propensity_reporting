import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			output: {
				// Name JavaScript entry files as "propensity-reporting.js"
				entryFileNames: "assets/propensity-reporting.js",

				// Name CSS and other assets consistently as "propensity-reporting.css" or "propensity-reporting.png"
				assetFileNames: (chunkInfo) => {
					const extension = chunkInfo.name ? chunkInfo.name.split(".").pop() : "";
					return `assets/propensity-reporting.${extension}`;
				},
			},
		},
	},
});
