import Dexie, { type EntityTable } from 'dexie'

interface Todo {
  id: number
  date: string // yyyy-mm-dd
  name: string
  description: string
  time: number
  remindTime?: number
}

const db = new Dexie('CalendarDatabase') as Dexie & {
  todos: EntityTable<
    Todo,
    'id' // primary key "id" (for the typings only)
  >
}

// Schema declaration:
db.version(1).stores({
  todos: '++id, date, name, description, time, remindTime', // primary key "id" (for the runtime!)
})

export type { Todo }
export { db }
