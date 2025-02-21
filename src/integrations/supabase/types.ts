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
          {
            foreignKeyName: "automations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_calculated_credits"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "automations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_credits"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          created_at: string | null
          credit_amount: number
          credit_type: string | null
          description: string | null
          id: string
          related_purchase_id: string | null
          related_usage_id: string | null
          status: string | null
          stripe_payment_id: string | null
          stripe_price_id: string | null
          transaction_date: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credit_amount: number
          credit_type?: string | null
          description?: string | null
          id?: string
          related_purchase_id?: string | null
          related_usage_id?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          stripe_price_id?: string | null
          transaction_date?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          credit_amount?: number
          credit_type?: string | null
          description?: string | null
          id?: string
          related_purchase_id?: string | null
          related_usage_id?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          stripe_price_id?: string | null
          transaction_date?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_calculated_credits"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_credits"
            referencedColumns: ["id"]
          },
        ]
      }
      credits_usage: {
        Row: {
          created_at: string
          credits_used: number
          feature_used: string | null
          id: string
          usage_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_used: number
          feature_used?: string | null
          id?: string
          usage_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_used?: number
          feature_used?: string | null
          id?: string
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      stripe_products: {
        Row: {
          active: boolean | null
          created_at: string
          credits_amount: number
          description: string | null
          id: string
          name: string
          price_amount: number
          stripe_price_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          credits_amount: number
          description?: string | null
          id?: string
          name: string
          price_amount: number
          stripe_price_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          credits_amount?: number
          description?: string | null
          id?: string
          name?: string
          price_amount?: number
          stripe_price_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          permanent_credits: number | null
          remaining_runs: number | null
          status: string | null
          stripe_customer_id: string | null
          subscription_credits: number | null
          subscription_renewal_date: string | null
          subscription_type: string | null
          user_name: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          permanent_credits?: number | null
          remaining_runs?: number | null
          status?: string | null
          stripe_customer_id?: string | null
          subscription_credits?: number | null
          subscription_renewal_date?: string | null
          subscription_type?: string | null
          user_name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          permanent_credits?: number | null
          remaining_runs?: number | null
          status?: string | null
          stripe_customer_id?: string | null
          subscription_credits?: number | null
          subscription_renewal_date?: string | null
          subscription_type?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      users_with_calculated_credits: {
        Row: {
          email: string | null
          remaining_credits: number | null
          status: string | null
          total_credits: number | null
          updated_at: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          email?: string | null
          remaining_credits?: never
          status?: string | null
          total_credits?: never
          updated_at?: never
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          email?: string | null
          remaining_credits?: never
          status?: string | null
          total_credits?: never
          updated_at?: never
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      users_with_credits: {
        Row: {
          email: string | null
          id: string | null
          remaining_credits: number | null
          total_credits: number | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_user_credits: {
        Args: {
          _user_id: string
          _credits_amount: number
          _transaction_type: string
          _description?: string
          _related_purchase_id?: string
        }
        Returns: undefined
      }
      deduct_user_credits: {
        Args: {
          _user_id: string
          _credits_amount: number
          _transaction_type: string
          _description?: string
          _related_usage_id?: string
        }
        Returns: undefined
      }
      get_user_credits: {
        Args: {
          p_user_id: string
        }
        Returns: {
          total_credits: number
          remaining_credits: number
        }[]
      }
      increment_user_credits: {
        Args: {
          user_id: string
          amount: number
          credit_type: string
        }
        Returns: undefined
      }
      is_disposable_email: {
        Args: {
          email: string
        }
        Returns: boolean
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
