import { vitePreprocess } from '@sveltejs/kit/vite';
import adapterCfw from "@sveltejs/adapter-cloudflare-workers";
import adapterCf from "@sveltejs/adapter-cloudflare";
import vercel from "@sveltejs/adapter-vercel";
import node from "@sveltejs/adapter-node";
import dotenv from "dotenv";

dotenv.config();

const dev = process.env["NODE_ENV"] === "development";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: dev ? node() : {
            "cloudflare-workers": adapterCfw({}),
            cloudflare: adapterCf(),
            vercel: vercel({ edge: false, split: false }),
            node: node({ precompress: true }),
        }
    }
};

export default config;
