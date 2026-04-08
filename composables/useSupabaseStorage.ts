/**
 * Supabase Storage 前端直传
 *
 * 用于大文件（视频、图片）直接上传到 Supabase，
 * 绕过 Vercel Serverless 的 4.5MB 限制
 */

import { createClient } from '@supabase/supabase-js'

// Supabase 配置（仅前端使用，使用 anon key）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export function useSupabaseStorage() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  /**
   * 上传文件到 Supabase Storage
   *
   * @param file - 要上传的文件
   * @param bucket - bucket 名称，默认 'uploads'
   * @param folder - 文件夹路径，默认 ''
   * @returns 文件的公开 URL
   */
  const uploadFile = async (
    file: File,
    bucket: string = 'uploads',
    folder: string = ''
  ): Promise<{ url: string; path: string }> => {
    // 生成唯一文件名
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
    const fileName = folder
      ? `${folder}/${timestamp}-${sanitizedName}`
      : `${timestamp}-${sanitizedName}`

    // 上传文件
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      throw new Error(`Upload failed: ${error.message}`)
    }

    // 获取公开 URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return {
      url: urlData.publicUrl,
      path: fileName
    }
  }

  /**
   * 上传视频文件
   */
  const uploadVideo = async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; path: string }> => {
    // 验证文件类型
    if (!file.type.startsWith('video/')) {
      throw new Error('Only video files are allowed')
    }

    // 验证文件大小（最大 500MB）
    const maxSize = 500 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('File size exceeds 500MB limit')
    }

    return uploadFile(file, 'uploads', 'videos')
  }

  /**
   * 上传图片文件
   */
  const uploadImage = async (
    file: File
  ): Promise<{ url: string; path: string }> => {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed')
    }

    // 验证文件大小（最大 20MB）
    const maxSize = 20 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('File size exceeds 20MB limit')
    }

    return uploadFile(file, 'uploads', 'images')
  }

  /**
   * 删除文件
   */
  const deleteFile = async (
    path: string,
    bucket: string = 'uploads'
  ): Promise<void> => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      throw new Error(`Delete failed: ${error.message}`)
    }
  }

  /**
   * 获取文件公开 URL
   */
  const getPublicUrl = (
    path: string,
    bucket: string = 'uploads'
  ): string => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  }

  return {
    uploadFile,
    uploadVideo,
    uploadImage,
    deleteFile,
    getPublicUrl
  }
}
