import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Database,
  BrainCircuit,
  BarChart3,
  Globe,
  Target,
  CheckCircle2,
  GraduationCap,
  Code2,
  Layers,
  Network,
  FlaskConical,
  Cpu,
  Binary,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

/* ── tiny hook: fade-in on scroll ── */
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

/* ── section wrapper with scroll animation ── */
function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const visible = useInView(ref)
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ── data ── */
const whatIDo = [
  {
    icon: Database,
    label: 'Data Engineering',
    desc: 'Cleaning, feature engineering, transformation pipelines & exploratory data analysis',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: BrainCircuit,
    label: 'Model Architecture',
    desc: 'Designing CNNs, RNNs, transformers & ensemble models for real-world problems',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: BarChart3,
    label: 'Training & Tuning',
    desc: 'Hyper-parameter optimization, cross-validation, learning rate scheduling & regularization',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
  {
    icon: Globe,
    label: 'ML Deployment',
    desc: 'End-to-end deployment with Flask, FastAPI, Docker & cloud platforms',
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
  },
]

const techPills = [
  'Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
  'Keras', 'OpenCV', 'NLTK', 'Matplotlib', 'Flask', 'Docker',
]

export default function About() {
  const [about, setAbout] = useState(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('about').select('*').limit(1).single()
      if (data) setAbout(data)
    }
    load()
  }, [])

  return (
    <div className="container mx-auto max-w-5xl space-y-14 px-4 py-12 sm:space-y-20 sm:py-16 lg:space-y-24 lg:py-20">

      {/* ───── Who I Am ───── */}
      <AnimatedSection>
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">
          {/* Icon block */}
          <div className="relative flex-shrink-0">
            <div className="h-24 w-24 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-cyan-500/10 to-emerald-500/5 shadow-lg ring-1 ring-primary/10 sm:h-32 sm:w-32 ml-glow">
              <img src="/ai-avatar.png" alt="Virendra Kumar" className="h-full w-full object-cover object-top" />
            </div>
            <span className="absolute -bottom-2 -right-2 rounded-full border bg-background px-2 py-0.5 text-[10px] font-semibold shadow-sm">
              🧠 ML Engineer
            </span>
          </div>

          {/* Text */}
          <div className="space-y-4 text-center lg:text-left">
            <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-primary/10 bg-muted/50 px-3 py-1 font-mono text-xs text-muted-foreground">
              <Binary className="h-3 w-3 text-primary/60" />
              about_me.describe()
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Who I Am</h2>
            <div className="mx-auto h-1 w-12 rounded bg-gradient-to-r from-primary to-emerald-500 lg:mx-0" />
            <p className="max-w-xl leading-relaxed text-muted-foreground">
              {about?.bio || (
                <>
                  I'm a <span className="font-medium text-foreground">final-year B.Tech student</span> specializing
                  in <span className="font-medium text-foreground">Artificial Intelligence &amp; Machine Learning</span>.
                  I'm passionate about solving complex problems with neural networks — from
                  building custom model architectures to deploying production-ready ML systems.
                </>
              )}
            </p>
            {!about?.bio && (
              <p className="max-w-xl leading-relaxed text-muted-foreground">
                My strength lies in the full ML pipeline: understanding data,
                choosing the right model architecture, optimizing hyperparameters, and shipping it.
                I specialize in deep learning, computer vision, and NLP,
                with experience in end-to-end model deployment.
              </p>
            )}
            {about?.learning_focus && (
              <p className="max-w-xl leading-relaxed text-muted-foreground">
                {about.learning_focus}
              </p>
            )}

            {/* Tech pills */}
            <div className="flex flex-wrap justify-center gap-2 pt-2 lg:justify-start">
              {techPills.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ───── What I Do ───── */}
      <AnimatedSection delay={100}>
        <div className="text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-primary/10 bg-muted/50 px-3 py-1 font-mono text-xs text-muted-foreground">
            <Network className="h-3 w-3 text-primary/60" />
            pipeline.stages()
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">ML Pipeline Expertise</h2>
          <div className="mx-auto mt-2 h-1 w-12 rounded bg-gradient-to-r from-primary to-emerald-500" />
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            I work across the complete machine-learning lifecycle — from raw data to production inference.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {whatIDo.map((item, idx) => {
            const Icon = item.icon
            return (
              <Card
                key={item.label}
                className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* corner glow */}
                <span className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full ${item.bg} opacity-40 blur-2xl transition-opacity group-hover:opacity-70`} />

                <CardContent className="flex items-start gap-4 p-6">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${item.bg}`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-tight">{item.label}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </AnimatedSection>

      {/* ───── Career Goal ───── */}
      <AnimatedSection delay={200}>
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-cyan-500/3 to-emerald-500/3">
          {/* decorative circles */}
          <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <span className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-emerald-500/5 blur-2xl" />

          <CardContent className="relative flex flex-col items-center gap-5 p-6 text-center sm:gap-6 sm:p-8 md:p-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ml-glow">
              <Target className="h-7 w-7 text-primary" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight">Career Objective</h2>
            <div className="mx-auto h-1 w-12 rounded bg-gradient-to-r from-primary to-emerald-500" />

            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {about?.career_goal || (
                <>
                  I'm seeking an <span className="font-medium text-foreground">ML / Deep Learning Engineer</span> role
                  where I can design, train and deploy <span className="font-medium text-foreground">scalable
                  neural network solutions</span> that create measurable impact — while pushing the
                  boundaries of applied machine learning.
                </>
              )}
            </p>

            {/* value props */}
            <div className="mt-2 grid gap-3 text-left sm:grid-cols-2 md:grid-cols-3">
              {[
                { icon: GraduationCap, text: 'Strong ML & math foundations' },
                { icon: Code2, text: 'Deep learning specialist' },
                { icon: Layers, text: 'End-to-end pipeline builder' },
              ].map(({ icon: I, text }) => (
                <div key={text} className="flex items-center gap-2 rounded-lg border bg-background/60 px-4 py-3">
                  <I className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  )
}
