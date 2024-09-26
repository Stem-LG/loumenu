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
          operationName?: string
          query?: string
          variables?: Json
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
      menu_items: {
        Row: {
          description: string | null
          id: string
          ingredients: string[] | null
          menu_section_id: string
          name: string
          position: number | null
          price: number
        }
        Insert: {
          description?: string | null
          id?: string
          ingredients?: string[] | null
          menu_section_id: string
          name: string
          position?: number | null
          price: number
        }
        Update: {
          description?: string | null
          id?: string
          ingredients?: string[] | null
          menu_section_id?: string
          name?: string
          position?: number | null
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_menu_section_id_fkey"
            columns: ["menu_section_id"]
            isOneToOne: false
            referencedRelation: "menu_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_sections: {
        Row: {
          id: string
          menu_id: string
          name: string
          position: number | null
        }
        Insert: {
          id?: string
          menu_id: string
          name: string
          position?: number | null
        }
        Update: {
          id?: string
          menu_id?: string
          name?: string
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_sections_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          description: string | null
          enabled: boolean
          id: string
          name: string
          restaurant_id: string
          slug: string | null
        }
        Insert: {
          description?: string | null
          enabled?: boolean
          id?: string
          name: string
          restaurant_id: string
          slug?: string | null
        }
        Update: {
          description?: string | null
          enabled?: boolean
          id?: string
          name?: string
          restaurant_id?: string
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menus_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          description: string | null
          id: string
          name: string
          owner_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          owner_id?: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_menu_section_items_by_owner: {
        Args: {
          user_id: string
        }
        Returns: {
          description: string | null
          id: string
          ingredients: string[] | null
          menu_section_id: string
          name: string
          position: number | null
          price: number
        }[]
      }
      get_menu_sections_by_owner: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          menu_id: string
          name: string
          position: number | null
        }[]
      }
      get_menus_by_owner: {
        Args: {
          user_id: string
        }
        Returns: {
          description: string | null
          enabled: boolean
          id: string
          name: string
          restaurant_id: string
          slug: string | null
        }[]
      }
      get_restaurants_by_owner: {
        Args: {
          user_id: string
        }
        Returns: {
          description: string | null
          id: string
          name: string
          owner_id: string
        }[]
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
