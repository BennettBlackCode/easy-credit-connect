export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      automations: {
        Row: {
          agency_email: string
          city: string
          company_name: string
          country: string
          created_at: string
          domain: string
          email: string
          id: string
          industry: string
          last_name: string
          phone_number: string
          postal_code: string
          state: string
          street_address: string
          user_id: string | null
          web_url: string
        }
        Insert: {
          agency_email: string
          city: string
          company_name: string
          country: string
          created_at?: string
          domain: string
          email: string
          id?: string
          industry: string
          last_name: string
          phone_number: string
          postal_code: string
          state: string
          street_address: string
          user_id?: string | null
          web_url: string
        }
        Update: {
          agency_email?: string
          city?: string
          company_name?: string
          country?: string
          created_at?: string
          domain?: string
          email?: string
          id?: string
          industry?: string
          last_name?: string
          phone_number?: string
          postal_code?: string
          state?: string
          street_address?: string
          user_id?: string | null
          web_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "automations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_products: {
        Row: {
          active: boolean | null
          created_at: string
          credits: number
          description: string | null
          id: string
          name: string
          price_amount: number
          price_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          credits: number
          description?: string | null
          id?: string
          name: string
          price_amount: number
          price_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          credits?: number
          description?: string | null
          id?: string
          name?: string
          price_amount?: number
          price_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          credit_type: string | null
          id: string
          status: string | null
          stripe_payment_id: string | null
          stripe_price_id: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          credit_type?: string | null
          id?: string
          status?: string | null
          stripe_payment_id?: string | null
          stripe_price_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          credit_type?: string | null
          id?: string
          status?: string | null
          stripe_payment_id?: string | null
          stripe_price_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          permanent_credits: number | null
          remaining_runs: number | null
          stripe_customer_id: string | null
          subscription_credits: number | null
          subscription_renewal_date: string | null
          subscription_type: string | null
          total_credits: number | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          permanent_credits?: number | null
          remaining_runs?: number | null
          stripe_customer_id?: string | null
          subscription_credits?: number | null
          subscription_renewal_date?: string | null
          subscription_type?: string | null
          total_credits?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          permanent_credits?: number | null
          remaining_runs?: number | null
          stripe_customer_id?: string | null
          subscription_credits?: number | null
          subscription_renewal_date?: string | null
          subscription_type?: string | null
          total_credits?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_user_credits: {
        Args: {
          user_id: string
          amount: number
          credit_type: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
