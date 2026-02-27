import SkillCard from '@/components/SkillCard'
import { Badge } from '@/components/ui/badge'
import { BrainCircuit, Library, Globe, Cpu, Sparkles, Network, Database, BarChart3 } from 'lucide-react'
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

const categoryMeta = {
  'Machine Learning':  { icon: BrainCircuit, color: 'text-cyan-500',    bg: 'bg-cyan-500/10' },
  'Deep Learning':     { icon: Network,      color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  'Libraries & Tools': { icon: Library,      color: 'text-teal-500',    bg: 'bg-teal-500/10' },
  'Data Science':      { icon: BarChart3,    color: 'text-sky-500',     bg: 'bg-sky-500/10' },
  'Web Development':   { icon: Globe,        color: 'text-violet-500',  bg: 'bg-violet-500/10' },
  'Core CS':           { icon: Cpu,          color: 'text-amber-500',   bg: 'bg-amber-500/10' },
}

const fallbackCategories = [
  {
    icon: BrainCircuit,
    title: 'Machine Learning',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    skills: [
      'Linear Regression', 'Logistic Regression', 'Decision Trees',
      'Random Forest', 'SVM', 'K-Means', 'PCA',
      'Cross-Validation', 'Hyper-parameter Tuning',
    ],
  },
  {
    icon: Network,
    title: 'Deep Learning',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    skills: [
      'CNNs', 'RNNs / LSTMs', 'Transfer Learning',
      'GANs', 'Attention Mechanisms', 'Transformers',
      'Batch Normalization', 'Dropout',
    ],
  },
  {
    icon: Library,
    title: 'Libraries & Tools',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    skills: [
      'NumPy', 'Pandas', 'Scikit-learn', 'PyTorch',
      'TensorFlow / Keras', 'OpenCV', 'NLTK',
      'Matplotlib', 'Seaborn', 'Jupyter',
    ],
  },
  {
    icon: Globe,
    title: 'Web & Deployment',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    skills: [
      'React', 'Tailwind CSS', 'Flask', 'FastAPI',
      'Docker', 'REST APIs', 'Git & GitHub',
    ],
  },
]

export default function Skills() {
  const headerRef = useRef(null)
  const headerVisible = useInView(headerRef)
  const [categories, setCategories] = useState(fallbackCategories)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('skills').select('*').order('category').order('name')
      if (data && data.length > 0) {
        // Group by category
        const grouped = {}
        data.forEach((s) => {
          if (!grouped[s.category]) grouped[s.category] = []
          grouped[s.category].push(s.name)
        })
        setCategories(
          Object.entries(grouped).map(([cat, skills]) => {
            const meta = categoryMeta[cat] || { icon: BrainCircuit, color: 'text-violet-500', bg: 'bg-violet-500/10' }
            return { icon: meta.icon, title: cat, color: meta.color, bg: meta.bg, skills }
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
          <Cpu className="h-3 w-3" /> Neural Toolkit
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">ML Tech Stack</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          From classical ML algorithms to deep neural networks — the tools I use to build intelligent systems.
        </p>
        <div className="mx-auto mt-4 h-1 w-12 rounded bg-gradient-to-r from-primary to-emerald-500" />
      </div>

      {/* Skill Cards Grid */}
      <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
        {categories.map((cat, idx) => (
          <SkillCard key={cat.title} {...cat} delay={idx * 120} />
        ))}
      </div>
    </div>
  )
}
