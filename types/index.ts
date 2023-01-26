import { Database } from "./supabase";

export type WebhookRequest = Database["public"]["Tables"]["url_requests"]["Row"];
