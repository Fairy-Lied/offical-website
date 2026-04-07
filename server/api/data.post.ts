import { writeFile } from 'fs/promises'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const filePath = resolve(process.cwd(), 'data/band-data.json')

    // Validate basic structure
    if (!body || typeof body !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid data format'
      })
    }

    // Write to file
    await writeFile(filePath, JSON.stringify(body, null, 2), 'utf-8')

    return { success: true, message: 'Data saved successfully' }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save data file'
    })
  }
})
