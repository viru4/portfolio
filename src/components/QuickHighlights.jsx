import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { BrainCircuit, Network, Database, Cpu, FlaskConical, BarChart3 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const highlights = [
  {
    icon: BrainCircuit,
    title: 'Deep Learning Models',
    description:
      'Built CNNs, RNNs & transformer-based models for computer vision, NLP & time-series forecasting tasks.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Database,
    title: 'Data Pipelines',
    description:
      'End-to-end ML pipelines — from data ingestion & feature engineering to model training & deployment.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: BarChart3,
    title: 'Model Optimization',
    description:
      'Hyper-parameter tuning, cross-validation & ensemble methods to maximize prediction accuracy.',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
]

function useInView(ref) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])
  return visible
}

export default function QuickHighlights() {
  const sectionRef = useRef(null)
  const visible = useInView(sectionRef)

  return (
    <section ref={sectionRef} className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
      <div className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-primary/10 bg-muted/50 px-3 py-1 font-mono text-xs text-muted-foreground">
          <Cpu className="h-3 w-3 text-primary/60" />
          <span className="text-emerald-500/60">$</span> model.summary()
        </div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Core ML Capabilities</h2>
        <p className="mt-2 text-muted-foreground">What my neural network is trained on</p>
        <div className="mx-auto mt-3 h-1 w-12 rounded bg-gradient-to-r from-primary to-emerald-500" />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item, idx) => {
          const Icon = item.icon
          return (
            <Card
              key={item.title}
              className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
                visible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Decorative corner glow */}
              <span
                className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full ${item.bg} blur-2xl transition-opacity group-hover:opacity-80 opacity-40`}
              />

              <CardHeader>
                <div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg ${item.bg}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
