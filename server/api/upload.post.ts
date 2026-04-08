import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import { mkdir } from 'fs/promises'

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

    // Ensure uploads directory exists
    const uploadsDir = resolve(process.cwd(), 'public/uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Save file
    const filePath = resolve(uploadsDir, uniqueName)
    await writeFile(filePath, file.data)

    // Return public URL
    return {
      success: true,
      url: `/uploads/${uniqueName}`
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload file'
    })
  }
})
