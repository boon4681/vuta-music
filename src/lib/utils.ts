import http from 'node:http'

export async function check(url: string) {
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