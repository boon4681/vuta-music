import { check } from "$lib/utils";
import type { RequestHandler } from "@sveltejs/kit";
const api = (id: string, option: string) => `http://i.ytimg.com/vi/${id}/${option}`

export const GET: RequestHandler = async ({ params }) => {
    const headers = new Headers()
    headers.set("Location", "https://i.ytimg.com/vi/hello/mqdefault.jpg")
    try {
        if (params['videoId']) {
            for (const url of ['hq720.jpg', 'hqdefault.jpg', 'mqdefault.jpg']) {
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