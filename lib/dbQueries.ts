import supabase from "./db";
import { NextApiRequest } from "next";
import { Json } from "../types/supabase";
import { WebhookRequest } from "../types";

export function generateWebhookUrl() {
    return supabase.from("generated-urls").insert({}).select();
}

export function saveReq(req: NextApiRequest) {
    return supabase.from("url_requests").insert({
        webhook_uuid: req.query.id as string,
        method: req.method,
        query: req.query as Json,
        headers: req.headers as Json,
        body: req.body,
    });
}

export function getWebhookRequests(url: string) {
    return supabase.from("url_requests").select().eq("webhook_uuid", url);
}

export function subscribeToWebhookRequests(url: string, callback: (request: WebhookRequest) => void) {
    return supabase
        .channel("requests")
        .on<WebhookRequest>(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "url_requests", filter: "webhook_uuid=eq." + url },
            (payload) => {
                callback(payload.new);
            },
        )
        .subscribe();
}
