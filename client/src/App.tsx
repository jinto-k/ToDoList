import { useMemo, useState } from 'react'
import { useTodos } from '@/hooks/useTodos'
import type { ToDo, ToDoCreate, ToDoUpdate } from '@/types/todo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { CalendarDays, Plus, Save, Pencil } from 'lucide-react'

function formatDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const yyyy = d.getFullYear()
  const mm = `${d.getMonth() + 1}`.padStart(2, '0')
  const dd = `${d.getDate()}`.padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function isOverdue(iso?: string) {
  if (!iso) return false
  return new Date(iso) < new Date()
}

export default function App() {
  const { list, save, remove, setCompleted } = useTodos()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ToDo | null>(null)
  const [form, setForm] = useState<ToDoCreate | ToDoUpdate>({
    id: 0,
    name: '',
    description: '',
    dueDate: new Date().toISOString(),
  } as ToDoUpdate)

  const items = list.data ?? []

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }, [items])

  function openCreate() {
    setEditing(null)
    setForm({ name: '', description: '', dueDate: new Date().toISOString() })
    setOpen(true)
  }

  function openEdit(item: ToDo) {
    setEditing(item)
    setForm({ ...item })
    setOpen(true)
  }

  function updateField<K extends keyof (ToDoCreate | ToDoUpdate)>(key: K, value: any) {
    setForm((f) => ({ ...(f as any), [key]: value }))
  }

  async function onSubmit() {
    try {
      await save.mutateAsync(form)
      toast({ title: 'Saved', description: 'Your to-do was saved successfully.' })
      setOpen(false)
    } catch (e) {
      toast({ title: 'Save failed', description: 'Please try again later.', variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ToDo Dashboard</h1>
            <p className="text-sm text-muted-foreground">Organize tasks, stay on schedule, and ship with style.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} className="gap-2">
                <Plus className="h-4 w-4" /> New ToDo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {editing ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {editing ? 'Edit ToDo' : 'Create ToDo'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Title" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Details" rows={4} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" /> Due Date
                  </label>
                  <Input type="date" value={formatDate(form.dueDate)} onChange={(e) => {
                    const date = new Date(e.target.value)
                    updateField('dueDate', date.toISOString())
                  }} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={onSubmit} disabled={save.isPending} className="gap-2">
                  <Save className="h-4 w-4" /> {save.isPending ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
            <CardDescription>Your tasks in chronological order.</CardDescription>
          </CardHeader>
          <CardContent>
            {list.isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">No todos yet. Click "New ToDo" to get started.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Due</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((t) => (
                    <TableRow key={t.id} className="hover:bg-muted/50">
                      <TableCell className={`font-medium flex items-center gap-2 ${t.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        <input
                          aria-label="Complete"
                          type="checkbox"
                          className="h-4 w-4 accent-indigo-600 mr-2"
                          checked={t.isCompleted}
                          onChange={(e) => setCompleted.mutate({ id: t.id, isCompleted: e.target.checked })}
                        />
                        <button className="text-left truncate" onClick={() => openEdit(t)}>
                          {t.name}
                        </button>
                        {isOverdue(t.dueDate) && !t.isCompleted ? (
                          <Badge variant="destructive">Overdue</Badge>
                        ) : null}
                      </TableCell>
                      <TableCell className={`text-muted-foreground ${t.isCompleted ? 'line-through' : ''}`}>{t.description}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatDate(t.dueDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="destructive" size="sm" onClick={() => remove.mutate(t.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
