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
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          converted: boolean
          id: string
          referral_date: string | null
          referred_user_id: string
          status: string | null
        }
        Insert: {
          affiliate_id: string
          converted?: boolean
          id?: string
          referral_date?: string | null
          referred_user_id: string
          status?: string | null
        }
        Update: {
          affiliate_id?: string
          converted?: boolean
          id?: string
          referral_date?: string | null
          referred_user_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          code: string
          commission_rate: number
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          code: string
          commission_rate?: number
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          code?: string
          commission_rate?: number
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action_type: Database["public"]["Enums"]["audit_action_type"]
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          log_type: string
          notified: boolean | null
          target_user: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action_type: Database["public"]["Enums"]["audit_action_type"]
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          log_type: string
          notified?: boolean | null
          target_user?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: Database["public"]["Enums"]["audit_action_type"]
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          log_type?: string
          notified?: boolean | null
          target_user?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs_archive: {
        Row: {
          action_type: Database["public"]["Enums"]["audit_action_type"] | null
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: string | null
          log_type: string | null
          notified: boolean | null
          target_user: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action_type?: Database["public"]["Enums"]["audit_action_type"] | null
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string | null
          log_type?: string | null
          notified?: boolean | null
          target_user?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: Database["public"]["Enums"]["audit_action_type"] | null
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string | null
          log_type?: string | null
          notified?: boolean | null
          target_user?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      automation_logs: {
        Row: {
          agency_email: string
          city: string
          company_name: string
          country: string
          created_at: string
          domain: string
          email: string
          google_drive: string | null
          id: string
          industry: string
          last_name: string
          phone_number: string
          postal_code: string
          state: string
          status: string | null
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
          google_drive?: string | null
          id?: string
          industry: string
          last_name: string
          phone_number: string
          postal_code: string
          state: string
          status?: string | null
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
          google_drive?: string | null
          id?: string
          industry?: string
          last_name?: string
          phone_number?: string
          postal_code?: string
          state?: string
          status?: string | null
          street_address?: string
          user_id?: string | null
          web_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "frontend_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "automation_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          created_at: string | null
          credit_amount: number | null
          description: string | null
          expires_at: string | null
          id: string
          promotion_code: string | null
          stripe_session_id: string | null
          transaction_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          credit_amount?: number | null
          description?: string | null
          expires_at?: string | null
          id?: string
          promotion_code?: string | null
          stripe_session_id?: string | null
          transaction_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          credit_amount?: number | null
          description?: string | null
          expires_at?: string | null
          id?: string
          promotion_code?: string | null
          stripe_session_id?: string | null
          transaction_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cron_job_logs: {
        Row: {
          end_time: string | null
          error_message: string | null
          jobid: number | null
          rows_affected: number | null
          run_time: string | null
          start_time: string | null
          status: string | null
        }
        Insert: {
          end_time?: string | null
          error_message?: string | null
          jobid?: number | null
          rows_affected?: number | null
          run_time?: string | null
          start_time?: string | null
          status?: string | null
        }
        Update: {
          end_time?: string | null
          error_message?: string | null
          jobid?: number | null
          rows_affected?: number | null
          run_time?: string | null
          start_time?: string | null
          status?: string | null
        }
        Relationships: []
      }
      daily_usage: {
        Row: {
          active_users: number | null
          churn_rate: number | null
          date: string
          new_users: number | null
          total_credits_used: number | null
          total_revenue: number | null
        }
        Insert: {
          active_users?: number | null
          churn_rate?: number | null
          date: string
          new_users?: number | null
          total_credits_used?: number | null
          total_revenue?: number | null
        }
        Update: {
          active_users?: number | null
          churn_rate?: number | null
          date?: string
          new_users?: number | null
          total_credits_used?: number | null
          total_revenue?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          priority: number | null
          read: boolean | null
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          priority?: number | null
          read?: boolean | null
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          priority?: number | null
          read?: boolean | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stripe_event_errors: {
        Row: {
          error: string
          event_id: string
          id: string
          occurred_at: string | null
        }
        Insert: {
          error: string
          event_id: string
          id?: string
          occurred_at?: string | null
        }
        Update: {
          error?: string
          event_id?: string
          id?: string
          occurred_at?: string | null
        }
        Relationships: []
      }
      stripe_events: {
        Row: {
          event_id: string
          event_type: string
          full_event: Json | null
          received_at: string | null
          status: string | null
        }
        Insert: {
          event_id: string
          event_type: string
          full_event?: Json | null
          received_at?: string | null
          status?: string | null
        }
        Update: {
          event_id?: string
          event_type?: string
          full_event?: Json | null
          received_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      stripe_products: {
        Row: {
          billing_cycle: string | null
          created_at: string | null
          credits_included: number | null
          currency: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          renewal_interval: unknown | null
          status: string | null
          stripe_price_id: string
          stripe_product_id: string
          unit_amount: number
          updated_at: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string | null
          credits_included?: number | null
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          renewal_interval?: unknown | null
          status?: string | null
          stripe_price_id: string
          stripe_product_id: string
          unit_amount: number
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string | null
          credits_included?: number | null
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          renewal_interval?: unknown | null
          status?: string | null
          stripe_price_id?: string
          stripe_product_id?: string
          unit_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          modified_by: string | null
          payment_method: string | null
          plan_id: string | null
          renewal_date: string | null
          start_date: string
          stripe_subscription_id: string | null
          type: Database["public"]["Enums"]["subscription_type"]
          user_id: string | null
        }
        Insert: {
          billing_cycle?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          modified_by?: string | null
          payment_method?: string | null
          plan_id?: string | null
          renewal_date?: string | null
          start_date: string
          stripe_subscription_id?: string | null
          type: Database["public"]["Enums"]["subscription_type"]
          user_id?: string | null
        }
        Update: {
          billing_cycle?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          modified_by?: string | null
          payment_method?: string | null
          plan_id?: string | null
          renewal_date?: string | null
          start_date?: string
          stripe_subscription_id?: string | null
          type?: Database["public"]["Enums"]["subscription_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      user_credit_balance_updates: {
        Row: {
          last_updated: string | null
          user_id: string
        }
        Insert: {
          last_updated?: string | null
          user_id: string
        }
        Update: {
          last_updated?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string | null
          id: string
          stripe_customer_id: string | null
          subscription_type: string | null
        }
        Insert: {
          email?: string | null
          id: string
          stripe_customer_id?: string | null
          subscription_type?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscription_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      frontend_users: {
        Row: {
          automation_runs: number | null
          current_product_name: string | null
          email: string | null
          end_date: string | null
          last_credit_transaction: string | null
          product_name: string | null
          remaining_credits: number | null
          start_date: string | null
          subscription_active: boolean | null
          subscription_plan:
            | Database["public"]["Enums"]["subscription_type"]
            | null
          subscription_type:
            | Database["public"]["Enums"]["subscription_type"]
            | null
          total_credits: number | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: []
      }
      user_summary: {
        Row: {
          credits_included: number | null
          email: string | null
          price_amount: number | null
          product_active: boolean | null
          product_name: string | null
          remaining_credits: number | null
          status: string | null
          subscription_type: string | null
          total_credits: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_grant_credits: {
        Args: {
          _user_id: string
          _amount: number
          _description: string
          _admin_actor: string
        }
        Returns: undefined
      }
      cancel_subscription: {
        Args: {
          event: Json
        }
        Returns: undefined
      }
      change_subscription: {
        Args: {
          _user_id: string
          _new_type: string
        }
        Returns: undefined
      }
      delete_user: {
        Args: {
          _user_id: string
        }
        Returns: undefined
      }
      delete_user_and_allow_email_reuse: {
        Args: {
          _user_id: string
        }
        Returns: undefined
      }
      delete_user_completely: {
        Args: {
          _user_id: string
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
      get_user_summary:
        | {
            Args: Record<PropertyKey, never>
            Returns: {
              user_id: string
              auth_email: string
              email_confirmed_at: string
              signup_date: string
              signup_method: string
              user_email: string
              subscription_type: string
              total_credits: number
              remaining_credits: number
              credit_tx_id: string
              credit_amount: number
              transaction_type: string
              credit_description: string
              credit_assigned_at: string
              product_name: string
              credits_included: number
              product_active: boolean
              price_amount: number
              billing_cycle: string
              product_status: string
            }[]
          }
        | {
            Args: {
              _user_id: string
            }
            Returns: Json
          }
      giveaway_credits: {
        Args: {
          _user_id: string
          _amount: number
          _giveaway_name: string
        }
        Returns: undefined
      }
      grant_free_tier: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      handle_failed_payment: {
        Args: {
          event: Json
        }
        Returns: undefined
      }
      handle_stripe_event: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      handle_stripe_payment: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      handle_stripe_purchase:
        | {
            Args: {
              _user_id: string
              _product_name: string
              _stripe_session_id: string
              _promotion_code?: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_user_id: string
              p_stripe_price_id: string
              p_description: string
            }
            Returns: undefined
          }
      handle_subscription_cancellation: {
        Args: {
          _subscription_id: string
        }
        Returns: undefined
      }
      handle_subscription_purchase: {
        Args: {
          user_id: string
          product_name: string
        }
        Returns: undefined
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
      log_automation_run: {
        Args: {
          _automation_id: string
          _user_id: string
          _credits_used: number
        }
        Returns: undefined
      }
      manage_credits: {
        Args: {
          _user_id: string
          _amount: number
          _type: Database["public"]["Enums"]["credit_type"]
          _reference_id?: string
        }
        Returns: Json
      }
      manual_add_credits: {
        Args: {
          _user_id: string
          _amount: number
        }
        Returns: {
          user_id: string
          total_credits: number
        }[]
      }
      manual_change_subscription_status:
        | {
            Args: {
              _user_id: string
              _is_active: boolean
            }
            Returns: {
              user_id: string
              subscription_status: string
            }[]
          }
        | {
            Args: {
              _user_id: string
              _is_active: boolean
              _new_type: string
            }
            Returns: {
              user_id: string
              subscription_status: string
            }[]
          }
        | {
            Args: {
              _user_id: string
              _new_type: string
            }
            Returns: {
              user_id: string
              subscription_status: string
              current_credits: number
            }[]
          }
      manual_deduct_credits: {
        Args: {
          _user_id: string
          _amount: number
        }
        Returns: {
          user_id: string
          remaining_credits: number
        }[]
      }
      manual_delete_user: {
        Args: {
          _user_id: string
        }
        Returns: {
          user_id: string
          status: string
        }[]
      }
      manual_reset_credits: {
        Args: {
          _user_id: string
        }
        Returns: {
          user_id: string
          new_balance: number
        }[]
      }
      manual_update_subscription:
        | {
            Args: {
              _user_id: string
              _new_type: string
            }
            Returns: {
              user_id: string
              subscription_type: string
            }[]
          }
        | {
            Args: {
              _user_id: string
              _new_type: string
              _admin_id: string
            }
            Returns: {
              user_id: string
              subscription_type: string
            }[]
          }
      process_payment: {
        Args: {
          event: Json
        }
        Returns: undefined
      }
      process_unhandled_stripe_events: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_all_user_credits: {
        Args: {
          new_amount: number
        }
        Returns: undefined
      }
      reset_to_free: {
        Args: {
          _user_id: string
        }
        Returns: undefined
      }
      reset_user_credits: {
        Args: {
          target_user_id: string
        }
        Returns: undefined
      }
      reset_user_credits_to_zero: {
        Args: {
          _user_id: string
        }
        Returns: {
          user_id: string
          previous_total_credits: number
          previous_remaining_credits: number
          new_total_credits: number
          new_remaining_credits: number
        }[]
      }
      reset_user_to_free_tier: {
        Args: {
          target_user_id: string
        }
        Returns: undefined
      }
      secure_user_deletion: {
        Args: {
          _user_id: string
        }
        Returns: undefined
      }
      set_stripe_secret: {
        Args: {
          secret: string
        }
        Returns: undefined
      }
      update_subscription_type_on_upgrade: {
        Args: {
          _user_id: string
          _new_subscription_type: string
        }
        Returns: {
          user_id: string
          new_subscription_type: string
        }[]
      }
      update_user_status_and_credits: {
        Args: {
          target_user_id: string
          new_status: string
        }
        Returns: undefined
      }
      update_user_stripe_id: {
        Args: {
          p_user_id: string
          p_stripe_customer_id: string
        }
        Returns: undefined
      }
      verify_stripe_event: {
        Args: {
          event: Json
        }
        Returns: boolean
      }
      wipe_expired_credits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      audit_action_type:
        | "create"
        | "update"
        | "delete"
        | "login"
        | "logout"
        | "user_creation_failed"
        | "credit_added"
        | "credit_deducted"
        | "subscription_changed"
        | "credit_reset"
        | "user_wiped"
      credit_transaction_type:
        | "purchase"
        | "automation"
        | "automation_run"
        | "subscription"
        | "manual_adjustment"
        | "reset"
      credit_type:
        | "purchase"
        | "admin_adjustment"
        | "automation"
        | "referral"
        | "subscription"
      subscription_type: "free" | "starter" | "growth" | "unlimited" | "owner"
      transaction_status:
        | "pending"
        | "completed"
        | "failed"
        | "refunded"
        | "expired"
      user_role: "free" | "starter" | "growth" | "unlimited" | "owner"
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
