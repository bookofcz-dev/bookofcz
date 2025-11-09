export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      book_views: {
        Row: {
          book_id: string
          created_at: string
          id: string
          updated_at: string
          view_count: number
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      governance_proposals: {
        Row: {
          created_at: string
          created_by: string
          description: string
          id: string
          metadata: Json | null
          proposal_type: Database["public"]["Enums"]["proposal_type"]
          quorum_required: number
          status: Database["public"]["Enums"]["proposal_status"]
          title: string
          total_votes_against: number
          total_votes_for: number
          updated_at: string
          voting_ends_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          id?: string
          metadata?: Json | null
          proposal_type: Database["public"]["Enums"]["proposal_type"]
          quorum_required?: number
          status?: Database["public"]["Enums"]["proposal_status"]
          title: string
          total_votes_against?: number
          total_votes_for?: number
          updated_at?: string
          voting_ends_at: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          metadata?: Json | null
          proposal_type?: Database["public"]["Enums"]["proposal_type"]
          quorum_required?: number
          status?: Database["public"]["Enums"]["proposal_status"]
          title?: string
          total_votes_against?: number
          total_votes_for?: number
          updated_at?: string
          voting_ends_at?: string
        }
        Relationships: []
      }
      governance_votes: {
        Row: {
          created_at: string
          id: string
          proposal_id: string
          transaction_hash: string
          vote_for: boolean
          vote_power: number
          voter_wallet: string
        }
        Insert: {
          created_at?: string
          id?: string
          proposal_id: string
          transaction_hash: string
          vote_for: boolean
          vote_power: number
          voter_wallet: string
        }
        Update: {
          created_at?: string
          id?: string
          proposal_id?: string
          transaction_hash?: string
          vote_for?: boolean
          vote_power?: number
          voter_wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "governance_votes_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "governance_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_books: {
        Row: {
          approval_status: string
          author: string
          average_rating: number | null
          category: string
          cover_url: string
          created_at: string
          creator_wallet: string
          description: string
          download_count: number | null
          id: string
          ipfs_hash: string | null
          is_public: boolean
          isbn: string | null
          pdf_url: string
          price_bnb: number
          price_usdt: number
          publication_date: string | null
          rejection_reason: string | null
          review_count: number | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          approval_status?: string
          author: string
          average_rating?: number | null
          category: string
          cover_url: string
          created_at?: string
          creator_wallet: string
          description: string
          download_count?: number | null
          id?: string
          ipfs_hash?: string | null
          is_public?: boolean
          isbn?: string | null
          pdf_url: string
          price_bnb?: number
          price_usdt?: number
          publication_date?: string | null
          rejection_reason?: string | null
          review_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          approval_status?: string
          author?: string
          average_rating?: number | null
          category?: string
          cover_url?: string
          created_at?: string
          creator_wallet?: string
          description?: string
          download_count?: number | null
          id?: string
          ipfs_hash?: string | null
          is_public?: boolean
          isbn?: string | null
          pdf_url?: string
          price_bnb?: number
          price_usdt?: number
          publication_date?: string | null
          rejection_reason?: string | null
          review_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_purchases: {
        Row: {
          book_id: string
          buyer_wallet: string
          creator_amount: number
          download_count: number
          id: string
          platform_fee: number
          price_paid: number
          purchase_date: string
          transaction_hash: string
        }
        Insert: {
          book_id: string
          buyer_wallet: string
          creator_amount: number
          download_count?: number
          id?: string
          platform_fee: number
          price_paid: number
          purchase_date?: string
          transaction_hash: string
        }
        Update: {
          book_id?: string
          buyer_wallet?: string
          creator_amount?: number
          download_count?: number
          id?: string
          platform_fee?: number
          price_paid?: number
          purchase_date?: string
          transaction_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_purchases_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "marketplace_books"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_reviews: {
        Row: {
          book_id: string
          created_at: string
          helpful_count: number | null
          id: string
          rating: number
          review_text: string | null
          reviewer_wallet: string
          updated_at: string
        }
        Insert: {
          book_id: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          rating: number
          review_text?: string | null
          reviewer_wallet: string
          updated_at?: string
        }
        Update: {
          book_id?: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          rating?: number
          review_text?: string | null
          reviewer_wallet?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "marketplace_books"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_signatures: {
        Row: {
          book_id: string
          buyer_wallet: string
          created_at: string | null
          id: string
          signature: string
          timestamp: number
        }
        Insert: {
          book_id: string
          buyer_wallet: string
          created_at?: string | null
          id?: string
          signature: string
          timestamp: number
        }
        Update: {
          book_id?: string
          buyer_wallet?: string
          created_at?: string | null
          id?: string
          signature?: string
          timestamp?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          wallet_address: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          wallet_address: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          wallet_address?: string
        }
        Relationships: []
      }
      wallet_sessions: {
        Row: {
          created_at: string | null
          id: string
          signature: string
          updated_at: string | null
          user_id: string
          wallet_address: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          signature: string
          updated_at?: string | null
          user_id: string
          wallet_address: string
        }
        Update: {
          created_at?: string | null
          id?: string
          signature?: string
          updated_at?: string | null
          user_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      close_expired_proposals: { Args: never; Returns: undefined }
      create_wallet_session: {
        Args: { _signature: string; _user_id: string; _wallet_address: string }
        Returns: undefined
      }
      delete_book_as_admin: {
        Args: { _admin_wallet: string; _book_id: string }
        Returns: undefined
      }
      get_marketplace_stats: {
        Args: never
        Returns: {
          bnb_volume: number
          total_sales: number
          usdt_volume: number
        }[]
      }
      get_user_wallet: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _wallet_address: string
        }
        Returns: boolean
      }
      increment_book_view: {
        Args: { book_identifier: string }
        Returns: undefined
      }
      update_book_approval_status: {
        Args: {
          _admin_wallet: string
          _approval_status: string
          _book_id: string
          _rejection_reason: string
        }
        Returns: undefined
      }
      update_book_as_creator:
        | {
            Args: {
              _author: string
              _book_id: string
              _category: string
              _cover_url: string
              _creator_wallet: string
              _description: string
              _is_public: boolean
              _isbn: string
              _pdf_url: string
              _price_usdt: number
              _title: string
            }
            Returns: undefined
          }
        | {
            Args: {
              _author: string
              _book_id: string
              _category: string
              _cover_url: string
              _creator_wallet: string
              _description: string
              _isbn: string
              _pdf_url: string
              _price_usdt: number
              _title: string
            }
            Returns: undefined
          }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      proposal_status: "active" | "passed" | "rejected" | "expired"
      proposal_type:
        | "book_approval"
        | "fee_structure"
        | "platform_feature"
        | "other"
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
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      proposal_status: ["active", "passed", "rejected", "expired"],
      proposal_type: [
        "book_approval",
        "fee_structure",
        "platform_feature",
        "other",
      ],
    },
  },
} as const
