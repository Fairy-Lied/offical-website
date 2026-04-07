import { readFile } from 'fs/promises'
import { resolve } from 'path'

export default defineEventHandler(async () => {
  try {
    const filePath = resolve(process.cwd(), 'data/band-data.json')
    const data = await readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to read data file'
    })
  }
})
