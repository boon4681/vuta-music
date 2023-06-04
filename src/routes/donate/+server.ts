import { text, type RequestHandler, redirect, json, error } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
    throw redirect(302, "https://buy.stripe.com/5kAcNMfhk8Fm3AYbIK")
}