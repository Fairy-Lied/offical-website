import { createClient } from '@supabase/supabase-js'

/**
 * Supabase 客户端配置
 *
 * 使用 service_role key 进行服务端操作（绕过 RLS）
 * 注意：service_role key 只能在服务端使用，不能暴露到前端！
 */
export function useSupabase() {
  const config = useRuntimeConfig()

  const supabaseUrl = config.supabaseUrl as string
  const supabaseServiceKey = config.supabaseServiceKey as string

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase 配置缺失：请在 .env 文件中设置 NUXT_SUPABASE_URL 和 NUXT_SUPABASE_SERVICE_KEY')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * 数据库类型定义
 */
export interface Database {
  public: {
    Tables: {
      hero: {
        Row: {
          id: number
          title: string
          subtitle: string
          description: string
          background_image: string | null
          video: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['hero']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['hero']['Insert']>
      }
      legend: {
        Row: {
          id: number
          title: string
          subtitle: string
          image: string | null
          content: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['legend']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['legend']['Insert']>
      }
      members: {
        Row: {
          id: number
          name: string
          role: string
          image: string | null
          is_current: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['members']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['members']['Insert']>
      }
      albums: {
        Row: {
          id: number
          title: string
          year: string
          cover: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['albums']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['albums']['Insert']>
      }
      album_tracks: {
        Row: {
          id: number
          album_id: number
          title: string
          track_number: number
          audio_url: string | null
          lyrics: string | null
        }
        Insert: Omit<Database['public']['Tables']['album_tracks']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['album_tracks']['Insert']>
      }
      tours: {
        Row: {
          id: number
          date: string
          city: string
          venue: string
          status: string
          ticket_url: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tours']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tours']['Insert']>
      }
      gallery: {
        Row: {
          id: number
          url: string
          alt: string | null
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['gallery']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['gallery']['Insert']>
      }
      contacts: {
        Row: {
          id: number
          email: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['contacts']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['contacts']['Insert']>
      }
      social_links: {
        Row: {
          id: number
          platform: string
          url: string
          icon: string | null
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['social_links']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['social_links']['Insert']>
      }
      settings: {
        Row: {
          id: number
          key: string
          value: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['settings']['Insert']>
      }
    }
  }
}
