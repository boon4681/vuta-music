import { text, type RequestHandler } from '@sveltejs/kit';
import { check } from '$lib/utils';
import photon from '@silvia-odwyer/photon-node'
const api = (id: string, option: string) => `http://i.ytimg.com/vi/${id}/${option}`
const utaface = "https://vuta-face.boon4681.com/anime"

const getImageURL = async (id: string): Promise<string | undefined> => {
    for (const url of ['hq720.jpg', 'hqdefault.jpg', 'mqdefault.jpg']) {
        if (await check(api(id, url))) {
            return api(id, url)
        }
    }
    return undefined
}

const getFaces = async (fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>, id: string) => {
    return new Promise<{ w: number, h: number, x: number, y: number }[]>(async (res, rev) => {
        try {
            res(await fetch(`${utaface}/${id}`).then(a => a.json()))
        } catch (err) {
            res([])
        }
    })
}

export const GET: RequestHandler = async ({ params, fetch }) => {
    if (params["videoId"]) {
        const imageURL = await getImageURL(params["videoId"])
        if (imageURL) {
            // let t = performance.now()
            const blob = await fetch(imageURL).then(a => a.arrayBuffer())
            const faces = (await getFaces(fetch, params["videoId"]))
            console.log(faces)
            let im = photon.PhotonImage.new_from_byteslice(new Uint8Array(blob))
            let w = im.get_width()
            let h = im.get_height()
            let size = Math.min(w, h);
            const face = faces.length ? (size == h ? faces.sort((a, b) => a.x - b.x)[0] : faces.sort((a, b) => a.y - b.y)[0]) : undefined
            let left = (w - size) / 2;
            let top = (h - size) / 2;
            if (face) {
                if (size == h) left = Math.max(0, Math.min((face.x > left) ? face.x : face.x - face.w, (w - size) * 2)) / 2;
                if (size == w) top = Math.max(0, Math.min((face.y > top) ? face.y : face.y - face.h, (h - size) * 2)) / 2;
            }
            im = photon.crop(im, left, top, left + size, top + size);
            im = photon.resize(im, 512, 512, 2)
            // console.log(`Loaded Image in ${performance.now() - t}`)
            // t = performance.now()
            // let im = (await vips).Image.newFromBuffer(blob)
            // let size = Math.min(im.width, im.height);
            // let left = (im.width - size) / 2;
            // let top = (im.height - size) / 2;
            // im = im.crop(left, top, size, size);
            // im = im.resize(512 / size)
            // const save = im.writeToBuffer(".jpg")
            // console.log(`Croped Image in ${performance.now() - t}`)
            const save = im.get_bytes_jpeg(100)
            const headers = new Headers();
            headers.set("content-Type", "image/jpeg")
            return new Response(save, {
                headers
            })
        }
    }
    return text("")
};