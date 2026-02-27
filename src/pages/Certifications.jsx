import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Award, ExternalLink, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, threshold])
  return visible
}

const colorMap = {
  violet:  { color: 'text-violet-500',  bg: 'bg-violet-500/10' },
  sky:     { color: 'text-sky-500',     bg: 'bg-sky-500/10' },
  emerald: { color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  amber:   { color: 'text-amber-500',   bg: 'bg-amber-500/10' },
  cyan:    { color: 'text-cyan-500',    bg: 'bg-cyan-500/10' },
  teal:    { color: 'text-teal-500',    bg: 'bg-teal-500/10' },
}

const fallbackCertifications = [
  {
    title: 'The Complete Python Bootcamp',
    platform: 'Udemy',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    date: '2025',
    description:
      'Comprehensive Python for ML — fundamentals, OOP, decorators, generators, NumPy integration & building real data-processing scripts.',
    url: '#',
  },
  {
    title: 'Intro to Machine Learning',
    platform: 'Kaggle',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    date: '2025',
    description:
      'Hands-on ML fundamentals — decision trees, random forests, model validation, and underfitting vs overfitting with real Kaggle datasets.',
    url: '#',
  },
  {
    title: 'Data Science Job Simulation',
    platform: 'BCG (Forage)',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    date: '2025',
    description:
      'Real BCG data-science engagement — customer churn analysis, feature engineering, random forest modelling & executive ML summary.',
    url: '#',
  },
]

function CertCard({ cert, delay }) {
  const ref = useRef(null)
  const visible = useInView(ref)

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Accent bar */}
        <div className={`h-1.5 w-full ${cert.bg}`} />

        {/* Glow */}
        <span
          className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full ${cert.bg} opacity-30 blur-3xl transition-opacity group-hover:opacity-50`}
        />

        <CardHeader className="relative pb-2">
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${cert.bg}`}>
              <Award className={`h-5 w-5 ${cert.color}`} />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg leading-tight">{cert.title}</CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary" className="text-[11px]">
                  {cert.platform}
                </Badge>
                <span className="text-xs text-muted-foreground">{cert.date}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4 pt-1">
          <CardDescription className="text-sm leading-relaxed">
            {cert.description}
          </CardDescription>

          {cert.url && (
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <a href={cert.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" /> View Certificate
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function Certifications() {
  const headerRef = useRef(null)
  const headerVisible = useInView(headerRef)
  const [certifications, setCertifications] = useState(fallbackCertifications)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('certifications').select('*').order('created_at', { ascending: false })
      if (data && data.length > 0) {
        setCertifications(
          data.map((c) => {
            const cm = colorMap[c.color] || colorMap.violet
            return {
              title: c.title,
              platform: c.platform,
              color: cm.color,
              bg: cm.bg,
              date: c.date || '',
              description: c.description || '',
              url: c.url,
            }
          }),
        )
      }
    }
    load()
  }, [])

  return (
    <div className="container mx-auto max-w-5xl space-y-10 sm:space-y-14 lg:space-y-16 px-4 py-12 sm:py-16 lg:py-20">
      {/* Header */}
      <div
        ref={headerRef}
        className={`text-center transition-all duration-700 ${
          headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1 text-xs">
          <Award className="h-3 w-3" /> ML Credentials
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Certifications</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          ML courses, data science simulations & deep learning programs that shaped my neural network expertise.
        </p>
        <div className="mx-auto mt-4 h-1 w-12 rounded bg-gradient-to-r from-primary to-emerald-500" />
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, idx) => (
          <CertCard key={cert.title} cert={cert} delay={idx * 120} />
        ))}
      </div>
    </div>
  )
}
