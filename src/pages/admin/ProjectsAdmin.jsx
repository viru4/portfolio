import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Plus, Pencil, Trash2, Loader2, FolderKanban,
} from 'lucide-react'

const empty = {
  title: '',
  description: '',
  tech_stack: '',
  github_link: '',
  demo_link: '',
  ml_pipeline: '',
  results: '',
  icon: 'Code',
  color: 'violet',
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
      if (!ignore) {
        setProjects(data ?? [])
        setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [])

  const openNew = () => {
    setEditing(null)
    setForm(empty)
    setDialogOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p.id)
    setForm({
      title: p.title || '',
      description: p.description || '',
      tech_stack: (p.tech_stack || []).join(', '),
      github_link: p.github_link || '',
      demo_link: p.demo_link || '',
      ml_pipeline: (p.ml_pipeline || []).join('\n'),
      results: JSON.stringify(p.results || [], null, 2),
      icon: p.icon || 'Code',
      color: p.color || 'violet',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)

    let parsedResults = []
    try {
      parsedResults = JSON.parse(form.results || '[]')
    } catch {
      parsedResults = []
    }

    const row = {
      title: form.title,
      description: form.description,
      tech_stack: form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
      github_link: form.github_link || null,
      demo_link: form.demo_link || null,
      ml_pipeline: form.ml_pipeline.split('\n').map((s) => s.trim()).filter(Boolean),
      results: parsedResults,
      icon: form.icon,
      color: form.color,
    }

    if (editing) {
      await supabase.from('projects').update(row).eq('id', editing)
    } else {
      await supabase.from('projects').insert([row])
    }

    setSaving(false)
    setDialogOpen(false)
    fetchProjects()
  }

  const handleDelete = async (id) => {
    await supabase.from('projects').delete().eq('id', id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">{projects.length} projects</p>
        </div>
        <Button size="sm" className="gap-2" onClick={openNew}>
          <Plus className="h-3.5 w-3.5" /> Add Project
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <FolderKanban className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">No projects yet. Add your first one.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden rounded-lg border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Tech Stack</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(p.tech_stack || []).slice(0, 4).map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                        ))}
                        {(p.tech_stack || []).length > 4 && (
                          <Badge variant="secondary" className="text-[10px]">+{p.tech_stack.length - 4}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {p.github_link && <span className="mr-2">GitHub</span>}
                      {p.demo_link && <span>Demo</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {projects.map((p) => (
              <Card key={p.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{p.title}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(p.tech_stack || []).slice(0, 3).map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Project' : 'New Project'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" value={form.title} onChange={onChange} placeholder="Project name" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" value={form.description} onChange={onChange} rows={3} placeholder="Problem statement / what it does" />
            </div>
            <div className="space-y-2">
              <Label>Tech Stack <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
              <Input name="tech_stack" value={form.tech_stack} onChange={onChange} placeholder="Python, Pandas, Scikit-learn" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>GitHub Link</Label>
                <Input name="github_link" value={form.github_link} onChange={onChange} placeholder="https://github.com/..." />
              </div>
              <div className="space-y-2">
                <Label>Demo Link</Label>
                <Input name="demo_link" value={form.demo_link} onChange={onChange} placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>ML Pipeline <span className="text-xs text-muted-foreground">(one step per line)</span></Label>
              <Textarea name="ml_pipeline" value={form.ml_pipeline} onChange={onChange} rows={4} placeholder={"Step 1\nStep 2\nStep 3"} />
            </div>
            <div className="space-y-2">
              <Label>Results <span className="text-xs text-muted-foreground">(JSON array)</span></Label>
              <Textarea
                name="results"
                value={form.results}
                onChange={onChange}
                rows={4}
                className="font-mono text-xs"
                placeholder={'[\n  { "label": "Accuracy", "value": "95%" }\n]'}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Icon name</Label>
                <Input name="icon" value={form.icon} onChange={onChange} placeholder="Code" />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input name="color" value={form.color} onChange={onChange} placeholder="violet" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="gap-2" onClick={handleSave} disabled={saving || !form.title}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
