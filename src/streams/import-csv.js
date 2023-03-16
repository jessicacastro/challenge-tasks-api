import fs from 'fs'
import { parse } from 'csv-parse'

const csvPath = new URL('tasks.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
})

export const runImport = async () => {
  const lineParse = stream.pipe(csvParse)

  for await (const line of lineParse) {
    const [title, description] = line

    await fetch('http://localhost:3334/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description
      })
    })
  }
}