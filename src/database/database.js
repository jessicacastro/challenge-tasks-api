import fs from 'node:fs'

const databasePath = new URL('database.json', import.meta.url)

export class Database {
  #database

  constructor() {
    fs.readFile(databasePath, 'utf8', (error, data) => {
      if (error) {
        this.#database = {}
        this.#persist()
      } else {
        this.#database = JSON.parse(data)
      }
    })
  }

  #persist() {
    fs.writeFileSync(databasePath, JSON.stringify(this.#database))
  }

  select(table) {
    return this.#database[table] || []
  }

  selectById(table, id) {
    return this.select(table).find(data => data.id === id)
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  delete(table, id) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table] = this.#database[table].filter(data => data.id !== id)
    }

    this.#persist()
  }

  update(table, id, data) {
    if (Array.isArray(this.#database[table])) {
      const index = this.#database[table].findIndex(data => data.id === id)

      if (index !== -1) {
        this.#database[table][index] = {
          id,
          ...data
        }
      }
    }

    this.#persist()
  }
}