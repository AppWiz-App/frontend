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
      Application: {
        Row: {
          app_data: Json
          application_cycle_id: number
          created_at: string
          id: number
        }
        Insert: {
          app_data: Json
          application_cycle_id: number
          created_at?: string
          id?: number
        }
        Update: {
          app_data?: Json
          application_cycle_id?: number
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Application_application_cycle_id_fkey"
            columns: ["application_cycle_id"]
            isOneToOne: false
            referencedRelation: "ApplicationCycle"
            referencedColumns: ["id"]
          },
        ]
      }
      ApplicationCycle: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          due_date: string
          id: number
          name: string
          num_apps: number
          reads_per_app: number
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          due_date: string
          id?: number
          name?: string
          num_apps: number
          reads_per_app: number
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          due_date?: string
          id?: number
          name?: string
          num_apps?: number
          reads_per_app?: number
        }
        Relationships: []
      }
      Rating: {
        Row: {
          application_id: number
          created_at: string
          id: number
          rating: Json
          reviewer_id: number
        }
        Insert: {
          application_id: number
          created_at?: string
          id?: number
          rating: Json
          reviewer_id: number
        }
        Update: {
          application_id?: number
          created_at?: string
          id?: number
          rating?: Json
          reviewer_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Rating_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "Application"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Rating_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "Reviewer"
            referencedColumns: ["id"]
          },
        ]
      }
      Reviewer: {
        Row: {
          club_id: number
          created_at: string
          email: string
          id: number
          name: string
        }
        Insert: {
          club_id: number
          created_at?: string
          email: string
          id?: number
          name: string
        }
        Update: {
          club_id?: number
          created_at?: string
          email?: string
          id?: number
          name?: string
        }
        Relationships: []
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
