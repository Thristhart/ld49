import preact from "@preact/preset-vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import viteInkPlugin from "./vite-ink-plugin";

export default defineConfig(({ command, mode }) => {
    if (mode === "development") {
        return {
            // server: {
            //     hmr: {
            //         port: 443,
            //     },
            // },
            plugins: [tsconfigPaths(), viteInkPlugin(), preact()],
        };
    } else {
        return {};
    }
});
