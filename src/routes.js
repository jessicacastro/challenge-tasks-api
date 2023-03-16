import { randomUUID } from 'node:crypto'
import { Database } from './database/database.js'
import { runImport } from './streams/import-csv.js'
import { buildRoutePath } from './utils/build-route-path.js'

const db = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = db.select('tasks')

      res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title) {
        return res
        .writeHead(400, { 'Content-Type': 'text/plain' })
        .end('Title is required! 🤷‍♂️')
      }

      if (!description) {
        return res
        .writeHead(400, { 'Content-Type': 'text/plain' })
        .end('Description is required! 🤷‍♂️')
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      db.insert('tasks', task)

      res.end(JSON.stringify(task))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks/import'),
    handler: async (req, res) => {
      await runImport()

      res.writeHead(200, { 'Content-Type': 'text/plain'}).end('Import finished! 🚀')
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const task = db.selectById('tasks', id)

      if (!task) {
        return res
        .writeHead(404, { 'Content-Type': 'text/plain' })
        .end('Task not found! 🤷‍♂️')
      }

      const updatedTask = {
        ...task,
        title,
        description,
        updated_at: new Date().toISOString()
      }
      

      db.update('tasks', id, updatedTask)

      res.end(JSON.stringify(updatedTask))
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const task = db.selectById('tasks', id)

      if (!task) {
        return res
        .writeHead(404, { 'Content-Type': 'text/plain' })
        .end('Task not found! 🤷‍♂️')
      }

      const updatedTask = {
        ...task,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      db.update('tasks', id, updatedTask)

      res.end(JSON.stringify(updatedTask))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const task = db.selectById('tasks', id)

      if (!task) {
        return res
        .writeHead(404, { 'Content-Type': 'text/plain' })
        .end('Task not found! 🤷‍♂️')
      }

      db.delete('tasks', id)

      res.writeHead(204).end()
    }
  },
  

]