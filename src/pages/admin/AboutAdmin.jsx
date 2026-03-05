import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, CheckCircle2, User, Upload, FileText, Trash2 } from 'lucide-react'

export default function AboutAdmin() {
  const [form, setForm] = useState({ bio: '', career_goal: '', learning_focus: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [rowId, setRowId] = useState(null)
  const [resumeUrl, setResumeUrl] = useState(null)
  const [resumeName, setResumeName] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef(null)

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
        setResumeUrl(data.resume_url || null)
        setResumeName(data.resume_name || null)
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

      {/* Resume Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" /> Resume
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label className="text-xs text-muted-foreground">
            Upload your resume (PDF). It will be stored in Supabase Storage and used for the download button on the home page.
          </Label>

          {resumeUrl ? (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{resumeName || 'resume.pdf'}</p>
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                    View uploaded resume
                  </a>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Replacing…</>
                  ) : (
                    <><Upload className="h-3.5 w-3.5" /> Replace Resume</>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  disabled={deleting}
                  onClick={async () => {
                    setDeleting(true)
                    await supabase.storage.from('resumes').remove(['resume.pdf'])
                    if (rowId) {
                      await supabase.from('about').update({ resume_url: null, resume_name: null }).eq('id', rowId)
                    }
                    setResumeUrl(null)
                    setResumeName(null)
                    setDeleting(false)
                  }}
                >
                  {deleting ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Deleting…</>
                  ) : (
                    <><Trash2 className="h-3.5 w-3.5" /> Delete</>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/30"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">Click to upload resume</p>
              <p className="text-xs text-muted-foreground/60">PDF files only</p>
              {uploading && (
                <div className="flex items-center gap-2 pt-1">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs text-primary">Uploading…</span>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              setUploading(true)
              const { error } = await supabase.storage
                .from('resumes')
                .upload('resume.pdf', file, { upsert: true, contentType: 'application/pdf' })
              if (!error) {
                const { data: urlData } = supabase.storage.from('resumes').getPublicUrl('resume.pdf')
                const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`
                if (rowId) {
                  await supabase.from('about').update({ resume_url: publicUrl, resume_name: file.name }).eq('id', rowId)
                }
                setResumeUrl(publicUrl)
                setResumeName(file.name)
              }
              setUploading(false)
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
          />
        </CardContent>
      </Card>

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
