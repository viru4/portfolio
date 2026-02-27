import ProjectCard from '@/components/ProjectCard'
import { Badge } from '@/components/ui/badge'
import { Home, PenTool, Briefcase, Sparkles, Code, BrainCircuit, FlaskConical, Network } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

/* ── icon map for DB projects ── */
const iconMap = { Home, PenTool, Briefcase, Code, BrainCircuit }
const colorMap = {
  sky:     { color: 'text-sky-500',     bg: 'bg-sky-500/10' },
  violet:  { color: 'text-violet-500',  bg: 'bg-violet-500/10' },
  emerald: { color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  amber:   { color: 'text-amber-500',   bg: 'bg-amber-500/10' },
  cyan:    { color: 'text-cyan-500',    bg: 'bg-cyan-500/10' },
  teal:    { color: 'text-teal-500',    bg: 'bg-teal-500/10' },
}

/* ── scroll reveal hook ── */
function useInView(ref, threshold = 0.1) {
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

/* ── hardcoded fallback ── */
const fallbackProjects = [
  {
    icon: Home,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    title: 'House Price Prediction',
    problem:
      'Predict residential property prices from structured features using ensemble ML models for informed real-estate decisions.',
    techStack: [
      'Python',
      'Pandas',
      'Scikit-learn',
      'XGBoost',
      'Matplotlib',
      'Seaborn',
    ],
    pipeline: [
      'Used the Ames Housing dataset with 80+ features',
      'Handled missing values, outliers & feature encoding',
      'Engineered new features (total area, age, quality index)',
      'Trained Linear Regression, Ridge, Lasso, Random Forest & XGBoost',
      'Hyper-parameter tuning with GridSearchCV & Bayesian Optimization',
      'Evaluated with MAE, RMSE & R² score on held-out test set',
    ],
    results: [
      { label: 'R² Score', value: '0.91' },
      { label: 'RMSE', value: '$21K' },
      { label: 'Best Model', value: 'XGBoost' },
      { label: 'Features', value: '30+' },
    ],
    repoUrl: '#',
    liveUrl: null,
  },
  {
    icon: PenTool,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    title: 'Handwritten Digit Recognition (CNN)',
    problem:
      'Classify 0-9 handwritten digits from images using deep convolutional neural networks, enabling automated form & cheque processing.',
    techStack: [
      'Python',
      'TensorFlow',
      'Keras',
      'NumPy',
      'OpenCV',
      'Matplotlib',
    ],
    pipeline: [
      'MNIST dataset — 60K training, 10K test images (28×28 grayscale)',
      'Normalised pixel values & reshaped for Conv2D input',
      'Built CNN: Conv → ReLU → MaxPool → Conv → Dense → Softmax',
      'Used Dropout & BatchNorm to reduce overfitting',
      'Trained for 15 epochs with Adam optimizer & LR scheduling',
      'Evaluated with accuracy, confusion matrix & classification report',
    ],
    results: [
      { label: 'Test Accuracy', value: '99.2%' },
      { label: 'Loss', value: '0.03' },
      { label: 'Epochs', value: '15' },
      { label: 'Architecture', value: '3-layer CNN' },
    ],
    repoUrl: '#',
    liveUrl: '#',
  },
  {
    icon: Briefcase,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    title: 'QuickHire — AI Job Portal',
    problem:
      'A full-stack job portal where recruiters post ML/AI openings and candidates apply in real time, with intelligent matching.',
    techStack: [
      'React',
      'Supabase',
      'Tailwind CSS',
      'Clerk Auth',
      'Shadcn UI',
      'React Router',
    ],
    pipeline: [
      'Designed relational schema in Supabase (Postgres RLS)',
      'Implemented real-time job feed with Supabase Realtime',
      'Built recruiter dashboard: create / edit / close listings',
      'Candidate flow: search, filter, apply & track status',
      'Real-time notifications on application status changes',
      'Role-based auth with Clerk (recruiter vs candidate)',
    ],
    results: [
      { label: 'Auth', value: 'Clerk' },
      { label: 'Database', value: 'Supabase' },
      { label: 'Real-time', value: 'Yes' },
      { label: 'Dashboards', value: '2 Roles' },
    ],
    repoUrl: '#',
    liveUrl: '#',
  },
]

/* ── animated wrapper (hooks at component level) ── */
function AnimatedCard({ children, delay = 0 }) {
  const ref = useRef(null)
  const visible = useInView(ref)
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function Projects() {
  const headerRef = useRef(null)
  const headerVisible = useInView(headerRef)
  const [projects, setProjects] = useState(fallbackProjects)
  useEffect(() => {
    let ignore = false
    async function load() {
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
      if (!ignore && data && data.length > 0) {
        setProjects(
          data.map((p) => {
            const cm = colorMap[p.color] || colorMap.violet
            return {
              icon: iconMap[p.icon] || Code,
              color: cm.color,
              bg: cm.bg,
              title: p.title,
              problem: p.description,
              techStack: p.tech_stack || [],
              pipeline: p.ml_pipeline || [],
              results: p.results || [],
              repoUrl: p.github_link,
              liveUrl: p.demo_link,
            }
          }),
        )
      }
    }
    load()
    return () => { ignore = true }
  }, [])

  return (
    <div className="container mx-auto max-w-6xl space-y-10 sm:space-y-14 lg:space-y-16 px-4 py-12 sm:py-16 lg:py-20">
      {/* ── Header ── */}
      <div
        ref={headerRef}
        className={`text-center transition-all duration-700 ${
          headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1 text-xs">
          <FlaskConical className="h-3 w-3" /> ML Experiments
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Experiments & Projects</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Real-world ML models &amp; neural network experiments — each card walks you
          through the problem, training pipeline and model results.
        </p>
        <div className="mx-auto mt-4 h-1 w-12 rounded bg-gradient-to-r from-primary to-emerald-500" />
      </div>

      {/* ── Project Grid ── */}
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, idx) => (
          <AnimatedCard key={project.title} delay={idx * 120}>
            <ProjectCard {...project} />
          </AnimatedCard>
        ))}
      </div>

      {/* ── "More coming" teaser ── */}
      <div className="text-center">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-emerald-500/60">$</span> More models in training — stay tuned for new experiments!
        </p>
      </div>
    </div>
  )
}
