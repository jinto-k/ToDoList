import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, getErrorMessage } from '@/lib/api'
import type { ToDo, ToDoCreate, ToDoUpdate } from '@/types/todo'

const keys = {
  all: ['todos'] as const,
}

export function useTodos() {
  const qc = useQueryClient()

  const list = useQuery({
    queryKey: keys.all,
    queryFn: async (): Promise<ToDo[]> => {
      const res = await api.get('/api/ToDo')
      return res.data
    },
  })

  const save = useMutation({
    mutationFn: async (payload: ToDoCreate | ToDoUpdate) => {
      const res = await api.post('/api/ToDo/save', payload)
      return res.data as number
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
    onError: (e) => {
      console.error('Save failed', getErrorMessage(e))
    },
  })

  const remove = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/ToDo/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
    onError: (e) => {
      console.error('Delete failed', getErrorMessage(e))
    },
  })

  const setCompleted = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: number; isCompleted: boolean }) => {
      await api.patch(`/api/ToDo/${id}/completed`, undefined, { params: { isCompleted } })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
    onError: (e) => {
      console.error('Update status failed', getErrorMessage(e))
    },
  })

  return { list, save, remove, setCompleted }
}
