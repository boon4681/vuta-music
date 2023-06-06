import { text, type RequestHandler } from '@sveltejs/kit';
import Vips from 'wasm-vips';
import { check } from '$lib/utils';

const api = (id: string, option: string) => `http://i.ytimg.com/vi/${id}/${option}`

const getImageURL = async (id: string): Promise<string | undefined> => {
    for (const url of ['hq720.jpg', 'hqdefault.jpg', 'mqdefault.jpg']) {
        if (await check(api(id, url))) {
            return api(id, url)
        }
    }
    return undefined
}

export const GET: RequestHandler = async ({ params, fetch }) => {
    try {
        await Vips()
    } catch (error) {
        throw new Error("BOON ERROR")
    }
    // if (params["videoId"]) {
    //     const imageURL = await getImageURL(params["videoId"])
    //     if (imageURL) {
    //         // let t = performance.now()
    //         const blob = await fetch(imageURL).then(a => a.arrayBuffer())
    //         // console.log(`Loaded Image in ${performance.now() - t}`)
    //         // t = performance.now()
    //         let im = (await vips).Image.newFromBuffer(blob)
    //         let size = Math.min(im.width, im.height);
    //         let left = (im.width - size) / 2;
    //         let top = (im.height - size) / 2;
    //         im = im.crop(left, top, size, size);
    //         im = im.resize(512 / size)
    //         const save = im.writeToBuffer(".jpg")
    //         // console.log(`Croped Image in ${performance.now() - t}`)
    //         const headers = new Headers();
    //         headers.set("content-Type", "image/jpeg")
    //         return new Response(save, {
    //             headers
    //         })
    //     }
    // }
    return text("")
};