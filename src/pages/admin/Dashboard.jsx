import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MessageSquare,
  FolderKanban,
  BrainCircuit,
  Award,
} from 'lucide-react'

export default function Dashboard() {
  const [counts, setCounts] = useState({
    messages: 0,
    unread: 0,
    projects: 0,
    skills: 0,
    certs: 0,
  })

  useEffect(() => {
    async function load() {
      const [msgs, projects, skills, certs] = await Promise.all([
        supabase.from('messages').select('id, is_read'),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('skills').select('id', { count: 'exact', head: true }),
        supabase.from('certifications').select('id', { count: 'exact', head: true }),
      ])

      setCounts({
        messages: msgs.data?.length ?? 0,
        unread: msgs.data?.filter((m) => !m.is_read).length ?? 0,
        projects: projects.count ?? 0,
        skills: skills.count ?? 0,
        certs: certs.count ?? 0,
      })
    }
    load()
  }, [])

  const stats = [
    { label: 'Messages', value: counts.messages, sub: `${counts.unread} unread`, icon: MessageSquare, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Projects', value: counts.projects, icon: FolderKanban, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { label: 'Skills', value: counts.skills, icon: BrainCircuit, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Certifications', value: counts.certs, icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your portfolio content.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{s.value}</p>
                {s.sub && <p className="text-xs text-muted-foreground">{s.sub}</p>}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
