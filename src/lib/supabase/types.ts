export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          avatar_url: string | null;
          role: 'admin' | 'customer';
          whatsapp: string | null;
          business_name: string | null;
          provider: 'google' | 'form' | 'whatsapp';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          avatar_url?: string | null;
          role?: 'admin' | 'customer';
          whatsapp?: string | null;
          business_name?: string | null;
          provider?: 'google' | 'form' | 'whatsapp';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          avatar_url?: string | null;
          role?: 'admin' | 'customer';
          whatsapp?: string | null;
          business_name?: string | null;
          provider?: 'google' | 'form' | 'whatsapp';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          product: string;
          brand: string;
          name: string;
          wa: string;
          email: string | null;
          total: string;
          date: string;
          status: 'Verifikasi' | 'Pengerjaan' | 'QC & Training' | 'Selesai';
          addons: string[];
          notes: string | null;
          tracking_number: string | null;
          document_link: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id?: string | null;
          product: string;
          brand: string;
          name: string;
          wa: string;
          email?: string | null;
          total: string;
          date?: string;
          status?: 'Verifikasi' | 'Pengerjaan' | 'QC & Training' | 'Selesai';
          addons?: string[];
          notes?: string | null;
          tracking_number?: string | null;
          document_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          product?: string;
          brand?: string;
          name?: string;
          wa?: string;
          email?: string | null;
          total?: string;
          date?: string;
          status?: 'Verifikasi' | 'Pengerjaan' | 'QC & Training' | 'Selesai';
          addons?: string[];
          notes?: string | null;
          tracking_number?: string | null;
          document_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      products: {
        Row: {
          id: string;
          name: string;
          category: 'website' | 'pos' | 'legalitas' | 'bundling';
          price: number;
          original_price: number | null;
          discount_pct: number | null;
          price_unit: string;
          description: string;
          badge: string | null;
          badge_type: 'primary' | 'popular' | 'super' | 'bonus' | 'hardware' | 'best' | null;
          bonus: string | null;
          features: string[];
          icon_name: string;
          popular: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          category: 'website' | 'pos' | 'legalitas' | 'bundling';
          price: number;
          original_price?: number | null;
          discount_pct?: number | null;
          price_unit?: string;
          description?: string;
          badge?: string | null;
          badge_type?: 'primary' | 'popular' | 'super' | 'bonus' | 'hardware' | 'best' | null;
          bonus?: string | null;
          features?: string[];
          icon_name?: string;
          popular?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: 'website' | 'pos' | 'legalitas' | 'bundling';
          price?: number;
          original_price?: number | null;
          discount_pct?: number | null;
          price_unit?: string;
          description?: string;
          badge?: string | null;
          badge_type?: 'primary' | 'popular' | 'super' | 'bonus' | 'hardware' | 'best' | null;
          bonus?: string | null;
          features?: string[];
          icon_name?: string;
          popular?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          title: string;
          category: 'legalitas' | 'digital' | 'keuangan' | 'pemasaran' | 'operasional' | 'skala-usaha';
          category_label: string;
          date: string;
          read_time: string;
          image: string;
          excerpt: string;
          content_html: string;
          author: string;
          author_role: string | null;
          featured: boolean;
          views: number;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          category: 'legalitas' | 'digital' | 'keuangan' | 'pemasaran' | 'operasional' | 'skala-usaha';
          category_label?: string;
          date?: string;
          read_time?: string;
          image?: string;
          excerpt?: string;
          content_html?: string;
          author?: string;
          author_role?: string | null;
          featured?: boolean;
          views?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: 'legalitas' | 'digital' | 'keuangan' | 'pemasaran' | 'operasional' | 'skala-usaha';
          category_label?: string;
          date?: string;
          read_time?: string;
          image?: string;
          excerpt?: string;
          content_html?: string;
          author?: string;
          author_role?: string | null;
          featured?: boolean;
          views?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      rfqs: {
        Row: {
          id: string;
          user_id: string | null;
          nama: string;
          perusahaan: string | null;
          whatsapp: string;
          email: string | null;
          kategori: string;
          lokasi: string | null;
          detail: string;
          jumlah: string | null;
          waktu: string | null;
          status: 'Baru' | 'Diproses' | 'Penawaran Terkirim' | 'Deal' | 'Batal';
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id?: string | null;
          nama: string;
          perusahaan?: string | null;
          whatsapp: string;
          email?: string | null;
          kategori: string;
          lokasi?: string | null;
          detail: string;
          jumlah?: string | null;
          waktu?: string | null;
          status?: 'Baru' | 'Diproses' | 'Penawaran Terkirim' | 'Deal' | 'Batal';
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          nama?: string;
          perusahaan?: string | null;
          whatsapp?: string;
          email?: string | null;
          kategori?: string;
          lokasi?: string | null;
          detail?: string;
          jumlah?: string | null;
          waktu?: string | null;
          status?: 'Baru' | 'Diproses' | 'Penawaran Terkirim' | 'Deal' | 'Batal';
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'rfqs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
