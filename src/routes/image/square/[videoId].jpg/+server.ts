import { text, type RequestHandler } from '@sveltejs/kit';
import { check } from '$lib/utils';
import photon from '@silvia-odwyer/photon-node'

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
    if (params["videoId"]) {
        const imageURL = await getImageURL(params["videoId"])
        if (imageURL) {
            // let t = performance.now()
            const blob = await fetch(imageURL).then(a => a.arrayBuffer())
            let im = photon.PhotonImage.new_from_byteslice(new Uint8Array(blob))
            let w = im.get_width()
            let h = im.get_height()
            let size = Math.min(w, h);
            let left = (w - size) / 2;
            let top = (h - size) / 2;
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