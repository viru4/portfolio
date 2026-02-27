import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, CheckCircle2, User } from 'lucide-react'

export default function AboutAdmin() {
  const [form, setForm] = useState({ bio: '', career_goal: '', learning_focus: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [rowId, setRowId] = useState(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('about').select('*').limit(1).single()
      if (data) {
        setRowId(data.id)
        setForm({
          bio: data.bio || '',
          career_goal: data.career_goal || '',
          learning_focus: data.learning_focus || '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)

    const row = {
      bio: form.bio,
      career_goal: form.career_goal,
      learning_focus: form.learning_focus,
      updated_at: new Date().toISOString(),
    }

    if (rowId) {
      await supabase.from('about').update(row).eq('id', rowId)
    } else {
      const { data } = await supabase.from('about').insert([row]).select().single()
      if (data) setRowId(data.id)
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">About Me</h1>
        <p className="text-sm text-muted-foreground">Edit your bio, career goal, and learning focus.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" /> Bio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-xs text-muted-foreground">
                Your main introduction — who you are, what you study, your strengths.
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={form.bio}
                onChange={onChange}
                rows={6}
                placeholder="I'm a final-year B.Tech student..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Career Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="career_goal" className="text-xs text-muted-foreground">
                The role you're seeking and the impact you want to create.
              </Label>
              <Textarea
                id="career_goal"
                name="career_goal"
                value={form.career_goal}
                onChange={onChange}
                rows={4}
                placeholder="Seeking an AI/ML Engineer role..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Learning Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="learning_focus" className="text-xs text-muted-foreground">
                What you're currently learning or deepening your skills in.
              </Label>
              <Textarea
                id="learning_focus"
                name="learning_focus"
                value={form.learning_focus}
                onChange={onChange}
                rows={4}
                placeholder="Currently deepening my skills in..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Button className="gap-2" onClick={handleSave} disabled={saving}>
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="h-4 w-4" /> Save Changes</>
          )}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Saved successfully
          </span>
        )}
      </div>
    </div>
  )
}
