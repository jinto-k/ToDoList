export interface ToDo {
  id: number
  name: string
  description: string
  dueDate: string // ISO string
  isCompleted: boolean
}

export interface ToDoCreate {
  name: string
  description: string
  dueDate: string
  isCompleted?: boolean
}

export interface ToDoUpdate extends ToDo {}
