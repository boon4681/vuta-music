import { error, json, type RequestHandler } from "@sveltejs/kit";

const API_BASE_URL = "https://music.youtube.com/youtubei/v1/";
const API_ORIGIN = "https://music.youtube.com";
const ANDROID_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";

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
                        "clientVersion": "19.29.1",
                        "hl": "en",
                        "gl":"jp",
                        "timeZone":"UTC",
                        "platform": "DESKTOP",
                        "utcOffsetMinutes": - new Date().getTimezoneOffset(),
                        "originalUrl": "https://music.youtube.com/",
                        userAgent: "com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)"
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
            console.log(response.statusText)
            throw error(response.status, response.statusText);
        }
        const data = await response.json();

        return json(data);
    } catch (err: any) {
        throw error(500, err);
    }
};