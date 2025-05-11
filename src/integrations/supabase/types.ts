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
      appointments: {
        Row: {
          artist_id: string | null
          client_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration: number | null
          end_date: string
          id: string
          price: number
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          artist_id?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: number | null
          end_date: string
          id?: string
          price: number
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          artist_id?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: number | null
          end_date?: string
          id?: string
          price?: number
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          available: boolean
          created_at: string
          id: string
          name: string
          specialty: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          available?: boolean
          created_at?: string
          id?: string
          name: string
          specialty?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          available?: boolean
          created_at?: string
          id?: string
          name?: string
          specialty?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      billing_addresses: {
        Row: {
          city: string
          complement: string | null
          country: string
          created_at: string
          customer_id: string | null
          id: string
          is_default: boolean | null
          number: string
          state: string
          street: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          city: string
          complement?: string | null
          country?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          is_default?: boolean | null
          number: string
          state: string
          street: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          city?: string
          complement?: string | null
          country?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          is_default?: boolean | null
          number?: string
          state?: string
          street?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          parent_id: string | null
          post_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_draft: boolean | null
          meta_description: string | null
          meta_keywords: string | null
          published_at: string | null
          reading_time: number | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_draft?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_draft?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_blog_posts_author"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_id: string | null
          created_at: string
          id: string
          price: number
          product_id: string | null
          quantity: number
          updated_at: string
        }
        Insert: {
          cart_id?: string | null
          created_at?: string
          id?: string
          price: number
          product_id?: string | null
          quantity?: number
          updated_at?: string
        }
        Update: {
          cart_id?: string | null
          created_at?: string
          id?: string
          price?: number
          product_id?: string | null
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_custom_fields: {
        Row: {
          client_id: string | null
          created_at: string
          field_id: string | null
          id: string
          updated_at: string
          value: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          field_id?: string | null
          id?: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          field_id?: string | null
          id?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_custom_fields_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_custom_fields_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "custom_client_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      client_custom_sections: {
        Row: {
          client_id: string | null
          content: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_custom_sections_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_documents: {
        Row: {
          client_id: string | null
          created_by: string | null
          file_size: number | null
          file_type: string | null
          id: string
          name: string
          storage_path: string
          type: string
          uploaded_at: string
        }
        Insert: {
          client_id?: string | null
          created_by?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          name: string
          storage_path: string
          type: string
          uploaded_at?: string
        }
        Update: {
          client_id?: string | null
          created_by?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          name?: string
          storage_path?: string
          type?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_notes: {
        Row: {
          client_id: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          birthdate: string | null
          created_at: string
          created_by: string | null
          email: string | null
          engagement_level: string | null
          funnel_stage: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          status: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          birthdate?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          engagement_level?: string | null
          funnel_stage?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          birthdate?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          engagement_level?: string | null
          funnel_stage?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      crm_funnel_stages: {
        Row: {
          color: string
          conversion_probability: number | null
          created_at: string
          id: string
          name: string
          order: number
          updated_at: string
        }
        Insert: {
          color: string
          conversion_probability?: number | null
          created_at?: string
          id: string
          name: string
          order: number
          updated_at?: string
        }
        Update: {
          color?: string
          conversion_probability?: number | null
          created_at?: string
          id?: string
          name?: string
          order?: number
          updated_at?: string
        }
        Relationships: []
      }
      custom_client_fields: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          name: string
          options: string[] | null
          order: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          name: string
          options?: string[] | null
          order: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          name?: string
          options?: string[] | null
          order?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_accounts: {
        Row: {
          created_at: string | null
          current_balance: number
          description: string | null
          enabled: boolean
          id: string
          initial_balance: number
          is_default: boolean
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_balance?: number
          description?: string | null
          enabled?: boolean
          id?: string
          initial_balance?: number
          is_default?: boolean
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_balance?: number
          description?: string | null
          enabled?: boolean
          id?: string
          initial_balance?: number
          is_default?: boolean
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          enabled: boolean
          icon: string | null
          id: string
          is_system: boolean
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean
          icon?: string | null
          id?: string
          is_system?: boolean
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean
          icon?: string | null
          id?: string
          is_system?: boolean
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      interactions: {
        Row: {
          client_id: string | null
          content: string | null
          created_at: string
          created_by: string | null
          date: string
          description: string | null
          id: string
          type: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          date: string
          description?: string | null
          id?: string
          type: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category: string | null
          cost: number | null
          created_at: string
          created_by: string | null
          id: string
          min_quantity: number
          name: string
          price: number
          quantity: number
          unit: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          min_quantity: number
          name: string
          price: number
          quantity: number
          unit?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          min_quantity?: number
          name?: string
          price?: number
          quantity?: number
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address_id: string | null
          created_at: string
          customer_id: string | null
          id: string
          payment_method: string
          reference_code: string
          shipping_address_id: string | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          billing_address_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          payment_method: string
          reference_code: string
          shipping_address_id?: string | null
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          billing_address_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          payment_method?: string
          reference_code?: string
          shipping_address_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_billing_address_id_fkey"
            columns: ["billing_address_id"]
            isOneToOne: false
            referencedRelation: "billing_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "shipping_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          artist_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          images: string[]
          name: string
          price: number
          status: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          artist_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          name: string
          price: number
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          artist_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          name?: string
          price?: number
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          tattoo_preferences: Json | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string
          tattoo_preferences?: Json | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          tattoo_preferences?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      project_appointments: {
        Row: {
          appointment_id: string
          created_at: string | null
          project_id: string
        }
        Insert: {
          appointment_id: string
          created_at?: string | null
          project_id: string
        }
        Update: {
          appointment_id?: string
          created_at?: string | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_appointments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_appointments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_columns: {
        Row: {
          created_at: string | null
          id: string
          name: string
          order_index: number
          project_id: string | null
          updated_at: string | null
          wip_limit: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          order_index: number
          project_id?: string | null
          updated_at?: string | null
          wip_limit?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          order_index?: number
          project_id?: string | null
          updated_at?: string | null
          wip_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_columns_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_template_columns: {
        Row: {
          created_at: string | null
          id: string
          name: string
          order_index: number
          template_id: string | null
          wip_limit: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          order_index: number
          template_id?: string | null
          wip_limit?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          order_index?: number
          template_id?: string | null
          wip_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_template_columns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      project_template_tasks: {
        Row: {
          column_id: string | null
          created_at: string | null
          description: string | null
          estimated_hours: number | null
          id: string
          name: string
          order_index: number
          parent_task_id: string | null
          template_id: string | null
        }
        Insert: {
          column_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          name: string
          order_index?: number
          parent_task_id?: string | null
          template_id?: string | null
        }
        Update: {
          column_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          name?: string
          order_index?: number
          parent_task_id?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_template_tasks_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "project_template_columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_template_tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "project_template_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_template_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      project_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_transaction_links: {
        Row: {
          created_at: string | null
          project_id: string
          transaction_id: string
        }
        Insert: {
          created_at?: string | null
          project_id: string
          transaction_id: string
        }
        Update: {
          created_at?: string | null
          project_id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_transaction_links_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_transaction_links_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          responsible_id: string | null
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          responsible_id?: string | null
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          responsible_id?: string | null
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          created_at: string
          id: string
          name: string
          price: number
          quantity: number
          sale_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price: number
          quantity: number
          sale_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price?: number
          quantity?: number
          sale_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          artist_id: string | null
          client_id: string | null
          commission: number | null
          created_at: string
          created_by: string | null
          date: string
          description: string | null
          discount: number | null
          id: string
          payment_method: string | null
          payment_status: string
          taxes: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          artist_id?: string | null
          client_id?: string | null
          commission?: number | null
          created_at?: string
          created_by?: string | null
          date: string
          description?: string | null
          discount?: number | null
          id?: string
          payment_method?: string | null
          payment_status?: string
          taxes?: number | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          artist_id?: string | null
          client_id?: string | null
          commission?: number | null
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string | null
          discount?: number | null
          id?: string
          payment_method?: string | null
          payment_status?: string
          taxes?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduling_preferences: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_id: string | null
          preferred_date_1: string | null
          preferred_date_2: string | null
          preferred_date_3: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          preferred_date_1?: string | null
          preferred_date_2?: string | null
          preferred_date_3?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          preferred_date_1?: string | null
          preferred_date_2?: string | null
          preferred_date_3?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduling_preferences_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_addresses: {
        Row: {
          city: string
          complement: string | null
          country: string
          created_at: string
          customer_id: string | null
          id: string
          is_default: boolean | null
          number: string
          state: string
          street: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          city: string
          complement?: string | null
          country?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          is_default?: boolean | null
          number: string
          state: string
          street: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          city?: string
          complement?: string | null
          country?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          is_default?: boolean | null
          number?: string
          state?: string
          street?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: []
      }
      task_attachments: {
        Row: {
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          name: string
          task_id: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          name: string
          task_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          name?: string
          task_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_checklist_items: {
        Row: {
          checklist_id: string | null
          completed: boolean | null
          created_at: string | null
          description: string
          id: string
          order_index: number
          updated_at: string | null
        }
        Insert: {
          checklist_id?: string | null
          completed?: boolean | null
          created_at?: string | null
          description: string
          id?: string
          order_index?: number
          updated_at?: string | null
        }
        Update: {
          checklist_id?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string
          id?: string
          order_index?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "task_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      task_checklists: {
        Row: {
          created_at: string | null
          id: string
          name: string
          task_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          task_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          task_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_checklists_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          task_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_inventory_items: {
        Row: {
          created_at: string | null
          id: string
          inventory_item_id: string | null
          quantity: number
          task_id: string | null
          updated_at: string | null
          used: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_item_id?: string | null
          quantity: number
          task_id?: string | null
          updated_at?: string | null
          used?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_item_id?: string | null
          quantity?: number
          task_id?: string | null
          updated_at?: string | null
          used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "task_inventory_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_inventory_items_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          column_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          name: string
          order_index: number
          parent_task_id: string | null
          priority: string | null
          project_id: string | null
          responsible_id: string | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          column_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          name: string
          order_index?: number
          parent_task_id?: string | null
          priority?: string | null
          project_id?: string | null
          responsible_id?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          column_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          name?: string
          order_index?: number
          parent_task_id?: string | null
          priority?: string | null
          project_id?: string | null
          responsible_id?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "project_columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tattoo_materials: {
        Row: {
          created_at: string
          id: string
          inventory_item_id: string | null
          product_id: string | null
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_item_id?: string | null
          product_id?: string | null
          quantity?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          inventory_item_id?: string | null
          product_id?: string | null
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tattoo_materials_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tattoo_materials_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          appointment_id: string | null
          artist_id: string | null
          attachments: Json | null
          category: string | null
          category_id: string | null
          created_at: string
          created_by: string | null
          date: string
          description: string | null
          id: string
          notes: string | null
          payment_method: string | null
          reconciled: boolean
          reference_number: string | null
          tags: string[] | null
          type: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          appointment_id?: string | null
          artist_id?: string | null
          attachments?: Json | null
          category?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          date: string
          description?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          reconciled?: boolean
          reference_number?: string | null
          tags?: string[] | null
          type: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          appointment_id?: string | null
          artist_id?: string | null
          attachments?: Json | null
          category?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          reconciled?: boolean
          reference_number?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_blog_author: {
        Args: { user_id: string }
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
