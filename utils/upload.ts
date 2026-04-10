/**
 * 上传工具函数
 *
 * 用于替换原来的 /api/upload 方式，
 * 直接上传到 Supabase Storage，绕过 Vercel 限制
 */

import { createClient } from '@supabase/supabase-js'

// Supabase 客户端（前端使用）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface UploadResult {
  success: boolean
  url: string
  path?: string
  error?: string
}

/**
 * 上传文件到 Supabase Storage
 */
export async function uploadToSupabase(
  file: File,
  folder: string = '',
  isImage: boolean = false
): Promise<UploadResult> {
  try {
    // 生成唯一文件名
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const fileName = folder
      ? `${folder}/${timestamp}-${sanitizedName}`
      : `${timestamp}-${sanitizedName}`

    // 上传到 Supabase Storage
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return {
        success: false,
        url: '',
        error: error.message
      }
    }

    // 获取公开 URL
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName, {
        transform: isImage ? {} : undefined
      })

    return {
      success: true,
      url: urlData.publicUrl,
      path: fileName
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    return {
      success: false,
      url: '',
      error: error.message || 'Upload failed'
    }
  }
}

/**
 * 上传图片文件
 */
export async function uploadImage(file: File): Promise<UploadResult> {
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    return {
      success: false,
      url: '',
      error: '请选择图片文件'
    }
  }

  // 验证文件大小（最大 20MB）
  const maxSize = 20 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      success: false,
      url: '',
      error: '图片大小不能超过 20MB'
    }
  }

  return uploadToSupabase(file, 'images', true)
}

/**
 * 上传视频文件
 */
export async function uploadVideo(file: File): Promise<UploadResult> {
  // 验证文件类型
  if (!file.type.startsWith('video/')) {
    return {
      success: false,
      url: '',
      error: '请选择视频文件'
    }
  }

  // 验证文件大小（最大 500MB）
  const maxSize = 500 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      success: false,
      url: '',
      error: '视频大小不能超过 500MB'
    }
  }

  return uploadToSupabase(file, 'videos', false)
}

/**
 * 上传音频文件
 */
export async function uploadAudio(file: File): Promise<UploadResult> {
  // 验证文件类型
  if (!file.type.startsWith('audio/')) {
    return {
      success: false,
      url: '',
      error: '请选择音频文件'
    }
  }

  // 验证文件大小（最大 50MB）
  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      success: false,
      url: '',
      error: '音频文件大小不能超过 50MB'
    }
  }

  return uploadToSupabase(file, 'audio', false)
}
