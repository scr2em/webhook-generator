export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      "generated-urls": {
        Row: {
          created_at: string
          id: number
          soft_delete: boolean
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          soft_delete?: boolean
          url?: string
        }
        Update: {
          created_at?: string
          id?: number
          soft_delete?: boolean
          url?: string
        }
      }
      url_requests: {
        Row: {
          body: Json | null
          created_at: string
          headers: Json
          id: number
          method: string
          query: Json | null
          webhook_uuid: string
        }
        Insert: {
          body?: Json | null
          created_at?: string
          headers: Json
          id?: number
          method?: string
          query?: Json | null
          webhook_uuid: string
        }
        Update: {
          body?: Json | null
          created_at?: string
          headers?: Json
          id?: number
          method?: string
          query?: Json | null
          webhook_uuid?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
