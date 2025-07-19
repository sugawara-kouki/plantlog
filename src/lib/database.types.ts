export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          variables?: Json
          operationName?: string
          query?: string
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      edit_history: {
        Row: {
          created_at: string | null
          field_name: string
          id: number
          new_value: string | null
          observation_id: number
          old_value: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          field_name: string
          id?: number
          new_value?: string | null
          observation_id: number
          old_value?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          field_name?: string
          id?: number
          new_value?: string | null
          observation_id?: number
          old_value?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edit_history_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "observation_records"
            referencedColumns: ["id"]
          },
        ]
      }
      observation_records: {
        Row: {
          created_at: string | null
          height: number | null
          id: number
          memo: string | null
          observation_date: string
          plant_id: number
          status: string
          updated_at: string | null
          user_id: string
          watered: boolean | null
        }
        Insert: {
          created_at?: string | null
          height?: number | null
          id?: number
          memo?: string | null
          observation_date?: string
          plant_id: number
          status: string
          updated_at?: string | null
          user_id: string
          watered?: boolean | null
        }
        Update: {
          created_at?: string | null
          height?: number | null
          id?: number
          memo?: string | null
          observation_date?: string
          plant_id?: number
          status?: string
          updated_at?: string | null
          user_id?: string
          watered?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "observation_records_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          id: number
          mime_type: string
          observation_id: number | null
          plant_id: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          id?: number
          mime_type: string
          observation_id?: number | null
          plant_id?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          id?: number
          mime_type?: string
          observation_id?: number | null
          plant_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "observation_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      plant_types: {
        Row: {
          care_difficulty: string | null
          created_at: string | null
          id: number
          name: string
          scientific_name: string | null
        }
        Insert: {
          care_difficulty?: string | null
          created_at?: string | null
          id?: number
          name: string
          scientific_name?: string | null
        }
        Update: {
          care_difficulty?: string | null
          created_at?: string | null
          id?: number
          name?: string
          scientific_name?: string | null
        }
        Relationships: []
      }
      plants: {
        Row: {
          created_at: string | null
          current_status: string | null
          height: number | null
          id: number
          last_watering_date: string | null
          memo: string | null
          name: string
          next_watering_date: string | null
          purchase_date: string | null
          type_id: number | null
          updated_at: string | null
          user_id: string
          watering_schedule: number
        }
        Insert: {
          created_at?: string | null
          current_status?: string | null
          height?: number | null
          id?: number
          last_watering_date?: string | null
          memo?: string | null
          name: string
          next_watering_date?: string | null
          purchase_date?: string | null
          type_id?: number | null
          updated_at?: string | null
          user_id: string
          watering_schedule: number
        }
        Update: {
          created_at?: string | null
          current_status?: string | null
          height?: number | null
          id?: number
          last_watering_date?: string | null
          memo?: string | null
          name?: string
          next_watering_date?: string | null
          purchase_date?: string | null
          type_id?: number | null
          updated_at?: string | null
          user_id?: string
          watering_schedule?: number
        }
        Relationships: [
          {
            foreignKeyName: "plants_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "plant_types"
            referencedColumns: ["id"]
          },
        ]
      }
      watering_records: {
        Row: {
          created_at: string | null
          id: number
          plant_id: number
          user_id: string
          watering_date: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          plant_id: number
          user_id: string
          watering_date: string
        }
        Update: {
          created_at?: string | null
          id?: number
          plant_id?: number
          user_id?: string
          watering_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "watering_records_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

