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
      alerts: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_resolved: boolean | null
          printer_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_resolved?: boolean | null
          printer_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_resolved?: boolean | null
          printer_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_printer_id_fkey"
            columns: ["printer_id"]
            isOneToOne: false
            referencedRelation: "printers"
            referencedColumns: ["id"]
          },
        ]
      }
      printer_activities: {
        Row: {
          action: string
          details: string | null
          id: string
          printer_id: string | null
          printer_name: string
          status: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          details?: string | null
          id?: string
          printer_id?: string | null
          printer_name: string
          status?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          details?: string | null
          id?: string
          printer_id?: string | null
          printer_name?: string
          status?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "printer_activities_printer_id_fkey"
            columns: ["printer_id"]
            isOneToOne: false
            referencedRelation: "printers"
            referencedColumns: ["id"]
          },
        ]
      }
      printer_logs: {
        Row: {
          file_name: string
          id: string
          pages: number
          printer_id: string | null
          size: string
          status: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          file_name: string
          id?: string
          pages: number
          printer_id?: string | null
          size: string
          status: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          file_name?: string
          id?: string
          pages?: number
          printer_id?: string | null
          size?: string
          status?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "printer_logs_printer_id_fkey"
            columns: ["printer_id"]
            isOneToOne: false
            referencedRelation: "printers"
            referencedColumns: ["id"]
          },
        ]
      }
      printers: {
        Row: {
          added_date: string | null
          department: string | null
          id: string
          ink_level: number
          ip_address: string | null
          job_count: number | null
          last_active: string | null
          location: string
          model: string
          name: string
          paper_level: number
          serial_number: string | null
          stats: Json | null
          status: string
          sub_status: string | null
          supplies: Json | null
        }
        Insert: {
          added_date?: string | null
          department?: string | null
          id?: string
          ink_level: number
          ip_address?: string | null
          job_count?: number | null
          last_active?: string | null
          location: string
          model: string
          name: string
          paper_level: number
          serial_number?: string | null
          stats?: Json | null
          status: string
          sub_status?: string | null
          supplies?: Json | null
        }
        Update: {
          added_date?: string | null
          department?: string | null
          id?: string
          ink_level?: number
          ip_address?: string | null
          job_count?: number | null
          last_active?: string | null
          location?: string
          model?: string
          name?: string
          paper_level?: number
          serial_number?: string | null
          stats?: Json | null
          status?: string
          sub_status?: string | null
          supplies?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          id: string
          last_active: string | null
          name: string | null
          phone: string | null
          profile_image: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          id: string
          last_active?: string | null
          name?: string | null
          phone?: string | null
          profile_image?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          last_active?: string | null
          name?: string | null
          phone?: string | null
          profile_image?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
      servers: {
        Row: {
          added_date: string | null
          cpu_usage: number
          created_at: string | null
          department: string | null
          disk_usage: number
          hostname: string
          id: string
          ip_address: string
          last_active: string | null
          location: string
          memory_usage: number
          name: string
          operating_system: string
          server_type: string
          specs: Json | null
          status: string
          sub_status: string | null
          updated_at: string | null
          uptime: string | null
        }
        Insert: {
          added_date?: string | null
          cpu_usage?: number
          created_at?: string | null
          department?: string | null
          disk_usage?: number
          hostname: string
          id?: string
          ip_address: string
          last_active?: string | null
          location: string
          memory_usage?: number
          name: string
          operating_system: string
          server_type: string
          specs?: Json | null
          status?: string
          sub_status?: string | null
          updated_at?: string | null
          uptime?: string | null
        }
        Update: {
          added_date?: string | null
          cpu_usage?: number
          created_at?: string | null
          department?: string | null
          disk_usage?: number
          hostname?: string
          id?: string
          ip_address?: string
          last_active?: string | null
          location?: string
          memory_usage?: number
          name?: string
          operating_system?: string
          server_type?: string
          specs?: Json | null
          status?: string
          sub_status?: string | null
          updated_at?: string | null
          uptime?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
