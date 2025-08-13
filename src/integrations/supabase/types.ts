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
      accounts: {
        Row: {
          id: string
          user_id: string
          account_number: string
          account_name: string
          account_type: string
          parent_account_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_number: string
          account_name: string
          account_type: string
          parent_account_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_number?: string
          account_name?: string
          account_type?: string
          parent_account_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      customers: {
        Row: {
          id: string
          user_id: string
          customer_number: string
          company_name: string
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          org_number: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          customer_number: string
          company_name: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          org_number?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          customer_number?: string
          company_name?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          org_number?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      expenses: {
        Row: {
          id: string
          user_id: string | null
          expense_number: string | null
          supplier_name: string | null
          expense_date: string | null
          description: string | null
          kostnad_med_moms: number | null
          category: string | null
          receipt_url: string | null
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          expense_number?: string | null
          supplier_name?: string | null
          expense_date?: string | null
          description?: string | null
          kostnad_med_moms?: number | null
          category?: string | null
          receipt_url?: string | null
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          expense_number?: string | null
          supplier_name?: string | null
          expense_date?: string | null
          description?: string | null
          kostnad_med_moms?: number | null
          category?: string | null
          receipt_url?: string | null
          notes?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      feedback: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          id: string
          user_id: string
          item_number: string
          name: string
          description: string | null
          category: string | null
          current_stock: number
          min_stock: number
          max_stock: number | null
          cost_per_unit: number
          unit: string
          supplier_id: string | null
          location: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_number: string
          name: string
          description?: string | null
          category?: string | null
          current_stock?: number
          min_stock?: number
          max_stock?: number | null
          cost_per_unit?: number
          unit?: string
          supplier_id?: string | null
          location?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_number?: string
          name?: string
          description?: string | null
          category?: string | null
          current_stock?: number
          min_stock?: number
          max_stock?: number | null
          cost_per_unit?: number
          unit?: string
          supplier_id?: string | null
          location?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string | null
          description: string
          quantity: number | null
          unit_price: number | null
          vat_rate: number | null
          total: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          invoice_id?: string | null
          description: string
          quantity?: number | null
          unit_price?: number | null
          vat_rate?: number | null
          total?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          invoice_id?: string | null
          description?: string
          quantity?: number | null
          unit_price?: number | null
          vat_rate?: number | null
          total?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          }
        ]
      }
      invoices: {
        Row: {
          id: string
          user_id: string | null
          invoice_number: string
          customer_id: string | null
          issue_date: string
          due_date: string
          status: string | null
          subtotal: number | null
          vat_amount: number | null
          total_amount: number | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          invoice_number: string
          customer_id?: string | null
          issue_date: string
          due_date: string
          status?: string | null
          subtotal?: number | null
          vat_amount?: number | null
          total_amount?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          invoice_number?: string
          customer_id?: string | null
          issue_date?: string
          due_date?: string
          status?: string | null
          subtotal?: number | null
          vat_amount?: number | null
          total_amount?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          order_number: string | null
          customer_name: string | null
          customer_social_media: string | null
          customer_phone: string | null
          customer_address: string | null
          product_name: string | null
          product_details: string | null
          product_customizations: string | null
          price: number | null
          status: string | null
          order_date: string | null
          estimated_completion: string | null
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          order_number?: string | null
          customer_name?: string | null
          customer_social_media?: string | null
          customer_phone?: string | null
          customer_address?: string | null
          product_name?: string | null
          product_details?: string | null
          product_customizations?: string | null
          price?: number | null
          status?: string | null
          order_date?: string | null
          estimated_completion?: string | null
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          order_number?: string | null
          customer_name?: string | null
          customer_social_media?: string | null
          customer_phone?: string | null
          customer_address?: string | null
          product_name?: string | null
          product_details?: string | null
          product_customizations?: string | null
          price?: number | null
          status?: string | null
          order_date?: string | null
          estimated_completion?: string | null
          notes?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      production_tasks: {
        Row: {
          id: string
          user_id: string
          task_number: string
          title: string
          description: string | null
          order_id: string | null
          product_id: string | null
          status: string
          priority: string
          due_date: string | null
          estimated_hours: number | null
          actual_hours: number | null
          assigned_to: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_number: string
          title: string
          description?: string | null
          order_id?: string | null
          product_id?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          assigned_to?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_number?: string
          title?: string
          description?: string | null
          order_id?: string | null
          product_id?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          assigned_to?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          user_id: string
          product_number: string
          name: string
          description: string | null
          category: string | null
          price: number
          cost: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_number: string
          name: string
          description?: string | null
          category?: string | null
          price?: number
          cost?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_number?: string
          name?: string
          description?: string | null
          category?: string | null
          price?: number
          cost?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          user_id: string | null
          company_name: string | null
          company_org_number: string | null
          company_address: string | null
          company_phone: string | null
          company_email: string | null
          contact_person: string | null
          industry: string | null
          company_size: string | null
          vat_number: string | null
          bank_account: string | null
          currency: string | null
          timezone: string | null
          language: string | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          company_name?: string | null
          company_org_number?: string | null
          company_address?: string | null
          company_phone?: string | null
          company_email?: string | null
          contact_person?: string | null
          industry?: string | null
          company_size?: string | null
          vat_number?: string | null
          bank_account?: string | null
          currency?: string | null
          timezone?: string | null
          language?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          company_name?: string | null
          company_org_number?: string | null
          company_address?: string | null
          company_phone?: string | null
          company_email?: string | null
          contact_person?: string | null
          industry?: string | null
          company_size?: string | null
          vat_number?: string | null
          bank_account?: string | null
          currency?: string | null
          timezone?: string | null
          language?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      suppliers: {
        Row: {
          id: string
          user_id: string
          supplier_number: string
          company_name: string
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          org_number: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          supplier_number: string
          company_name: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          org_number?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          supplier_number?: string
          company_name?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          org_number?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transaction_lines: {
        Row: {
          id: string
          user_id: string
          transaction_id: string
          account_id: string
          description: string | null
          debit_amount: number | null
          credit_amount: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          transaction_id: string
          account_id: string
          description?: string | null
          debit_amount?: number | null
          credit_amount?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          transaction_id?: string
          account_id?: string
          description?: string | null
          debit_amount?: number | null
          credit_amount?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_lines_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_lines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          transaction_date: string
          reference_number: string | null
          description: string
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          transaction_date?: string
          reference_number?: string | null
          description: string
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          transaction_date?: string
          reference_number?: string | null
          description?: string
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string | null
          plan_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: string
          current_period_start: string | null
          current_period_end: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          plan_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          plan_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_usage: {
        Row: {
          id: string
          user_id: string | null
          month: string
          transactions_count: number | null
          customers_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          month: string
          transactions_count?: number | null
          customers_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          month?: string
          transactions_count?: number | null
          customers_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
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
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never