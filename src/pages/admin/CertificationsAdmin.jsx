import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Plus, Pencil, Trash2, Loader2, Award,
} from 'lucide-react'

const empty = { title: '', platform: '', description: '', date: '', url: '', color: 'violet' }

export default function CertificationsAdmin() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const fetchCerts = async () => {
    setLoading(true)
    const { data } = await supabase.from('certifications').select('*').order('created_at', { ascending: false })
    setCerts(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      const { data } = await supabase.from('certifications').select('*').order('created_at', { ascending: false })
      if (!ignore) {
        setCerts(data ?? [])
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

  const openEdit = (c) => {
    setEditing(c.id)
    setForm({
      title: c.title || '',
      platform: c.platform || '',
      description: c.description || '',
      date: c.date || '',
      url: c.url || '',
      color: c.color || 'violet',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const row = {
      title: form.title,
      platform: form.platform,
      description: form.description,
      date: form.date || null,
      url: form.url || null,
      color: form.color,
    }

    if (editing) {
      await supabase.from('certifications').update(row).eq('id', editing)
    } else {
      await supabase.from('certifications').insert([row])
    }

    setSaving(false)
    setDialogOpen(false)
    fetchCerts()
  }

  const handleDelete = async (id) => {
    await supabase.from('certifications').delete().eq('id', id)
    setCerts((prev) => prev.filter((c) => c.id !== id))
  }

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certifications</h1>
          <p className="text-sm text-muted-foreground">{certs.length} certificates</p>
        </div>
        <Button size="sm" className="gap-2" onClick={openNew}>
          <Plus className="h-3.5 w-3.5" /> Add Certificate
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : certs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <Award className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">No certifications yet. Add your first one.</p>
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
                  <TableHead>Platform</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certs.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">{c.platform}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(c.id)}>
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
            {certs.map((c) => (
              <Card key={c.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.platform} · {c.date}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(c.id)}>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Certificate' : 'New Certificate'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Certificate Title</Label>
              <Input name="title" value={form.title} onChange={onChange} placeholder="The Complete Python Bootcamp" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Input name="platform" value={form.platform} onChange={onChange} placeholder="Udemy" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input name="date" value={form.date} onChange={onChange} placeholder="2025" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" value={form.description} onChange={onChange} rows={3} placeholder="Short description of the certification" />
            </div>
            <div className="space-y-2">
              <Label>Certificate URL</Label>
              <Input name="url" value={form.url} onChange={onChange} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Color <span className="text-xs text-muted-foreground">(violet, sky, emerald, amber)</span></Label>
              <Input name="color" value={form.color} onChange={onChange} placeholder="violet" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="gap-2" onClick={handleSave} disabled={saving || !form.title || !form.platform}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
