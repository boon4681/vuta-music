import type { RequestHandler } from "@sveltejs/kit";
import http from 'node:http'

const api = (id: string, option: string) => `http://i.ytimg.com/vi/${id}/${option}`

async function check(url: string) {
    const Url = new URL(url)
    const options = {
        method: 'HEAD',
        host: Url.host,
        port: 80,
        path: Url.pathname
    };
    return new Promise<boolean>((res, rev) => {
        try {
            const req = http.request(options, function (r) {
                res(r.statusCode == 200);
            });
            req.end();
        } catch (error) {
            console.log(error)
            rev(error)
        }
    })
}

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