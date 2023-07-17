import { error, json, type RequestHandler } from "@sveltejs/kit";

const API_BASE_URL = "https://music.youtube.com/youtubei/v1/";
const API_ORIGIN = "https://music.youtube.com";
const ANDROID_KEY = "AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w";

export const GET: RequestHandler = async ({ url, locals }) => {
    const query = url.searchParams;
    const videoId = query.get("videoId") || "";
    try {
        const response = await fetch(API_BASE_URL + "player" + `?key=${ANDROID_KEY}`, {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Origin: API_ORIGIN,
            },
            body: JSON.stringify({
                videoId,
                "racyCheckOk": true,
                "contentCheckOk": true,
                "params": "",
                "context": {
                    "client": {
                        "clientName": "IOS",
                        "clientVersion": "17.13.3",
                        "hl": "en",
                        "utcOffsetMinutes": - new Date().getTimezoneOffset(),
                    },
                    "request": {
                        "useSsl": true
                    },
                    "user": {
                        "lockedSafetyMode": false
                    },
                    "captionParams": {}
                }
            }),
            method: "POST",
            keepalive: true,
        });

        if (!response.ok) {
            throw error(response.status, response.statusText);
        }
        const data = await response.json();

        return json(data);
    } catch (err: any) {
        throw error(500, err);
    }
};