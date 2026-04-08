import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    const file = formData[0]
    const filename = file.filename || `upload-${Date.now()}`
    const uniqueName = `${Date.now()}-${filename}`

    // Supabase Storage 配置
    const supabase = useSupabase()
    const bucketName = 'uploads'

    // 上传文件到 Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(uniqueName, file.data, {
        contentType: file.type || 'application/octet-stream',
        upsert: false
      })

    if (error) {
      console.error('Supabase Storage 上传失败:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Upload failed: ${error.message}`
      })
    }

    // 获取公开 URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(uniqueName)

    return {
      success: true,
      url: urlData.publicUrl
    }
  } catch (error: any) {
    console.error('上传错误:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to upload file'
    })
  }
})
