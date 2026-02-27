import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Github, FileDown, ArrowRight, BrainCircuit, Terminal, Activity, Cpu, Database, FlaskConical, Binary, Sigma, Network } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

/* ── Animated Typewriter ── */
function TypeWriter({ words, speed = 80, pause = 1800 }) {
  const [text, setText] = useState('')
  const wordIdxRef = useRef(0)
  const charIdxRef = useRef(0)
  const deletingRef = useRef(false)

  useEffect(() => {
    let timeout
    function tick() {
      const current = words[wordIdxRef.current]
      const charIdx = charIdxRef.current
      const deleting = deletingRef.current
      if (!deleting && charIdx < current.length) {
        charIdxRef.current = charIdx + 1
        setText(current.slice(0, charIdx + 1))
        timeout = setTimeout(tick, speed)
      } else if (!deleting && charIdx === current.length) {
        deletingRef.current = true
        timeout = setTimeout(tick, pause)
      } else if (deleting && charIdx > 0) {
        charIdxRef.current = charIdx - 1
        setText(current.slice(0, charIdx - 1))
        timeout = setTimeout(tick, speed / 2)
      } else if (deleting && charIdx === 0) {
        deletingRef.current = false
        wordIdxRef.current = (wordIdxRef.current + 1) % words.length
        timeout = setTimeout(tick, speed)
      }
    }
    tick()
    return () => clearTimeout(timeout)
  }, [words, speed, pause])

  return (
    <span className="text-primary font-mono">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  )
}

/* ── Terminal-style boot line ── */
function BootLine({ text, delay }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div
      className={`font-mono text-[10px] leading-relaxed text-primary/60 transition-all duration-500 sm:text-xs ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <span className="text-emerald-400/80">$</span> {text}
    </div>
  )
}

/* ── Live metric counter ── */
// eslint-disable-next-line no-unused-vars
function MetricCounter({ label, end, suffix = '', icon: Icon, duration = 2200 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(end / (duration / 16))
    const id = setInterval(() => {
      start += step
      if (start >= end) { start = end; clearInterval(id) }
      setVal(start)
    }, 16)
    return () => clearInterval(id)
  }, [end, duration])
  return (
    <div className="flex items-center gap-2 rounded-lg border border-primary/10 bg-primary/5 px-3 py-2 ml-glow">
      <Icon className="h-4 w-4 text-primary/70" strokeWidth={1.6} />
      <div>
        <p className="font-mono text-sm font-bold text-foreground tabular-nums sm:text-base">
          {val}{suffix}
        </p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

/* ── Floating data particles ── */
const PARTICLE_DATA = Array.from({ length: 18 }, () => ({
  width: `${Math.random() * 6 + 2}px`,
  height: `${Math.random() * 6 + 2}px`,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animation: `float ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 3}s infinite alternate`,
}))

function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLE_DATA.map((style, i) => (
        <span key={i} className="absolute rounded-full bg-primary/20" style={style} />
      ))}
    </div>
  )
}

/* ── Pre-computed Neural Network data (module level — pure) ── */
const NN_LAYERS = [
  [0.25, 0.5, 0.75],
  [0.15, 0.38, 0.62, 0.85],
  [0.15, 0.38, 0.62, 0.85],
  [0.35, 0.65],
]
const NN_LAYER_X = [0.12, 0.38, 0.62, 0.88]

const NN_CONNECTIONS = (() => {
  const arr = []
  for (let l = 0; l < NN_LAYERS.length - 1; l++) {
    for (const fromY of NN_LAYERS[l]) {
      for (const toY of NN_LAYERS[l + 1]) {
        arr.push({
          x1: NN_LAYER_X[l], y1: fromY,
          x2: NN_LAYER_X[l + 1], y2: toY,
          dur: `${(1.5 + Math.random() * 2).toFixed(2)}s`,
          begin: `${(Math.random() * 2).toFixed(2)}s`,
        })
      }
    }
  }
  return arr
})()

const NN_NODES = NN_LAYERS.flatMap((layer, l) =>
  layer.map((y, n) => ({
    key: `${l}-${n}`,
    cx: NN_LAYER_X[l],
    cy: y,
    pulseDur: `${(2 + Math.random()).toFixed(2)}s`,
  }))
)

/* ── Neural Network Visualization ── */
function NeuralNetSVG() {
  return (
    <svg viewBox="0 0 1 1" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="conn-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.08" />
          <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      {/* Connections with data-flow pulse */}
      {NN_CONNECTIONS.map((c, i) => (
        <g key={i}>
          <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke="url(#conn-grad)" strokeWidth="0.003" />
          <circle r="0.008" fill="var(--color-primary)" opacity="0.5">
            <animateMotion
              dur={c.dur}
              repeatCount="indefinite"
              begin={c.begin}
              path={`M${c.x1},${c.y1} L${c.x2},${c.y2}`}
            />
            <animate attributeName="opacity" values="0;0.6;0" dur={c.dur} repeatCount="indefinite" begin={c.begin} />
          </circle>
        </g>
      ))}
      {/* Nodes */}
      {NN_NODES.map((node) => (
        <g key={node.key}>
          <circle cx={node.cx} cy={node.cy} r="0.025" fill="var(--color-primary)" opacity="0.15" />
          <circle cx={node.cx} cy={node.cy} r="0.015" fill="var(--color-primary)" opacity="0.6">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur={node.pulseDur} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  )
}

/* ═══════════════════════════════════════════════
   HERO — "ML Neural Lab"
   ═══════════════════════════════════════════════ */
export default function Hero() {
  const roles = [
    'Neural Network Architect',
    'Deep Learning Engineer',
    'Data Pipeline Builder',
    'ML Model Optimizer',
  ]

  return (
    <section className="relative min-h-[80vh] overflow-hidden sm:min-h-[90vh]">
      <FloatingParticles />

      {/* ML Grid pattern background */}
      <div className="ml-grid-bg pointer-events-none absolute inset-0" />

      {/* Gradient blobs — cyan/teal */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:-left-32 sm:-top-32 sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl sm:-bottom-32 sm:-right-32 sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl" />

      {/* Faint scanline overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)' }}
      />

      <div className="container relative mx-auto flex min-h-[80vh] flex-col-reverse items-center justify-center gap-8 px-4 pt-20 sm:min-h-[90vh] sm:gap-12 lg:flex-row lg:gap-16 lg:pt-0">

        {/* ── Left — Text ── */}
        <div className="flex-1 space-y-5 text-center lg:text-left">
          {/* System status badge */}
          <Badge variant="secondary" className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Model Status: Trained &amp; Ready — Open to Opportunities
          </Badge>

          {/* Terminal-style intro */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-primary/10 bg-muted/50 px-4 py-2 font-mono text-xs text-muted-foreground">
            <Terminal className="h-3.5 w-3.5 text-primary/60" />
            <span className="text-emerald-500/80">$</span> python train_model.py --epochs=100 <span className="animate-pulse text-primary">▊</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl xl:text-6xl">
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Virendra Kumar
            </span>
          </h1>

          <p className="text-xl font-semibold tracking-wide text-foreground/80 sm:text-2xl md:text-3xl">
            Welcome to my{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                ML Neural Lab
              </span>
              <Network className="absolute -right-6 -top-1 h-5 w-5 text-cyan-400 animate-pulse" />
            </span>
          </p>

          <div className="text-base font-medium text-muted-foreground sm:text-lg md:text-xl">
            <span className="font-mono text-xs text-emerald-500/50 mr-2">model.predict(</span>
            <TypeWriter words={roles} />
            <span className="font-mono text-xs text-emerald-500/50 ml-1">)</span>
          </div>

          <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base lg:mx-0 lg:text-lg">
            Final-year B.Tech (AI&nbsp;&amp;&nbsp;ML) — I architect end-to-end machine
            learning pipelines, from raw data to production-ready models. Specializing in
            deep learning, computer vision &amp; NLP.
          </p>

          {/* Mini boot log */}
          <div className="mx-auto w-fit space-y-0.5 rounded-lg border border-primary/5 bg-muted/30 px-4 py-2.5 lg:mx-0">
            <BootLine text="import torch, tensorflow, sklearn  ✓" delay={400} />
            <BootLine text="model.fit(X_train, y_train)  ✓  loss: 0.023" delay={900} />
            <BootLine text="accuracy: 0.97 — deploying to production  ✓" delay={1400} />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            <Button asChild size="lg" className="gap-2">
              <Link to="/projects">
                View ML Projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href="/resume.pdf" download>
                <FileDown className="h-4 w-4" /> Download Resume
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg" className="gap-2">
              <a href="https://github.com/viru4" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" /> GitHub
              </a>
            </Button>
          </div>
        </div>

        {/* ── Right — Neural Network Visualization ── */}
        <div className="relative flex flex-1 items-center justify-center pb-20">
          {/* Outer orbital rings */}
          <div className="absolute h-72 w-72 animate-spin rounded-full border border-dashed border-primary/15 sm:h-80 sm:w-80 lg:h-96 lg:w-96"
            style={{ animationDuration: '30s' }} />
          <div className="absolute h-56 w-56 animate-spin rounded-full border border-dashed border-emerald-500/10 sm:h-64 sm:w-64 lg:h-80 lg:w-80"
            style={{ animationDuration: '20s', animationDirection: 'reverse' }} />

          {/* Center: Neural network + BrainCircuit */}
          <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 via-cyan-500/10 to-emerald-500/5 shadow-lg ring-1 ring-primary/10 sm:h-56 sm:w-56 lg:h-64 lg:w-64 ml-glow">
            {/* Neural net background */}
            <div className="absolute inset-4 opacity-40">
              <NeuralNetSVG />
            </div>
            {/* Center icon */}
            <BrainCircuit className="relative z-10 h-20 w-20 text-primary sm:h-24 sm:w-24 lg:h-28 lg:w-28" strokeWidth={1.2} />

            {/* Orbiting tech badges */}
            <span className="absolute -right-2 top-4 rounded-full border bg-background px-2.5 py-1 text-[10px] font-semibold shadow-sm animate-bounce"
              style={{ animationDuration: '3s' }}>
              🐍 Python
            </span>
            <span className="absolute -left-3 bottom-8 rounded-full border bg-background px-2.5 py-1 text-[10px] font-semibold shadow-sm animate-bounce"
              style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
              🔥 PyTorch
            </span>
            <span className="absolute -bottom-2 right-8 rounded-full border bg-background px-2.5 py-1 text-[10px] font-semibold shadow-sm animate-bounce"
              style={{ animationDuration: '4s', animationDelay: '1s' }}>
              🧠 TensorFlow
            </span>
            <span className="absolute -left-6 top-6 rounded-full border bg-background px-2.5 py-1 text-[10px] font-semibold shadow-sm animate-bounce"
              style={{ animationDuration: '3.8s', animationDelay: '1.5s' }}>
              📊 Scikit-learn
            </span>
          </div>

          {/* Live metrics row — hidden on small screens */}
          <div className="absolute -bottom-4 left-1/2 hidden -translate-x-1/2 gap-3 sm:flex">
            <MetricCounter label="Models Trained" end={15} suffix="+" icon={Cpu} />
            <MetricCounter label="Avg Accuracy" end={96} suffix="%" icon={Activity} />
            <MetricCounter label="Datasets" end={20} suffix="+" icon={Database} />
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes float {
          0%   { transform: translateY(0px) scale(1); opacity: 0.4; }
          100% { transform: translateY(-30px) scale(1.4); opacity: 0.8; }
        }
      `}</style>
    </section>
  )
}
