import { check } from "$lib/utils";
import type { RequestHandler } from "@sveltejs/kit";
const api = (id: string, option: string) => `https://i.ytimg.com/vi/${id}/${option}`

export const GET: RequestHandler = async ({ params }) => {
    const headers = new Headers()
    headers.set("Location", "/not_found.jpg")
    try {
        if (params['videoId']) {
            for (const url of ['default.jpg', 'mqdefault.jpg', 'sddefault.jpg']) {
                if (await check(api(params['videoId']!, url))) {
                    headers.set("Location", api(params['videoId']!, url))
                    break
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
    return new Response("", {
        status: 302,
        headers
    })
};