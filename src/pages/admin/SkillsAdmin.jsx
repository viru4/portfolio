import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Plus, Pencil, Trash2, Loader2, BrainCircuit,
} from 'lucide-react'

const CATEGORIES = [
  'Machine Learning',
  'Libraries & Tools',
  'Web Development',
  'Core CS',
]

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', category: CATEGORIES[0] })
  const [saving, setSaving] = useState(false)

  const fetchSkills = async () => {
    setLoading(true)
    const { data } = await supabase.from('skills').select('*').order('category').order('name')
    setSkills(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      const { data } = await supabase.from('skills').select('*').order('category').order('name')
      if (!ignore) {
        setSkills(data ?? [])
        setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', category: CATEGORIES[0] })
    setDialogOpen(true)
  }

  const openEdit = (s) => {
    setEditing(s.id)
    setForm({ name: s.name, category: s.category })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const row = { name: form.name, category: form.category }

    if (editing) {
      await supabase.from('skills').update(row).eq('id', editing)
    } else {
      await supabase.from('skills').insert([row])
    }

    setSaving(false)
    setDialogOpen(false)
    fetchSkills()
  }

  const handleDelete = async (id) => {
    await supabase.from('skills').delete().eq('id', id)
    setSkills((prev) => prev.filter((s) => s.id !== id))
  }

  // Group by category
  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skills</h1>
          <p className="text-sm text-muted-foreground">{skills.length} skills across {Object.keys(grouped).length} categories</p>
        </div>
        <Button size="sm" className="gap-2" onClick={openNew}>
          <Plus className="h-3.5 w-3.5" /> Add Skill
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : skills.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <BrainCircuit className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">No skills yet. Add your first one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {Object.entries(grouped).map(([category, items]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <Badge
                      key={s.id}
                      variant="secondary"
                      className="group gap-1.5 pr-1"
                    >
                      {s.name}
                      <span className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          className="rounded p-0.5 hover:bg-muted"
                          title="Edit"
                          onClick={() => openEdit(s)}
                        >
                          <Pencil className="h-2.5 w-2.5" />
                        </button>
                        <button
                          className="rounded p-0.5 text-red-500 hover:bg-red-500/10"
                          title="Delete"
                          onClick={() => handleDelete(s.id)}
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Skill Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. TensorFlow"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm({ ...form, category: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="gap-2" onClick={handleSave} disabled={saving || !form.name}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
