import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, User, Sparkles, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ─────────────────────────────────────────────────
   Knowledge‑base — edit these to match YOUR info
   ───────────────────────────────────────────────── */
const KNOWLEDGE = {
  name: 'Virendra Kumar',
  role: 'ML Engineer & Neural Network Architect',
  education: 'Final Year B.Tech in AI & ML',
  about:
    "I'm a passionate ML engineer in my final year of B.Tech (AI & ML). I build production-grade machine learning systems — from data pipelines & model training to neural network deployment. Specializing in deep learning, computer vision & NLP.",

  skills: {
    'Machine Learning': [
      'Linear Regression',
      'Logistic Regression',
      'Decision Trees',
      'Random Forest',
      'SVM',
      'K-Means',
      'PCA',
      'Cross-Validation',
      'Hyper-parameter Tuning',
    ],
    'Deep Learning': [
      'CNNs',
      'RNNs / LSTMs',
      'Transfer Learning',
      'GANs',
      'Transformers',
      'Attention Mechanisms',
    ],
    'Libraries & Tools': [
      'NumPy',
      'Pandas',
      'Scikit-learn',
      'PyTorch',
      'TensorFlow / Keras',
      'OpenCV',
      'NLTK',
      'Matplotlib',
      'Seaborn',
    ],
    'Web & Deployment': [
      'React',
      'Tailwind CSS',
      'Flask',
      'FastAPI',
      'Docker',
      'REST APIs',
      'Git & GitHub',
    ],
  },

  projects: [
    {
      name: 'House Price Prediction',
      tech: 'Python, Pandas, Scikit-learn, XGBoost',
      desc: 'Ensemble ML model predicting property prices from 30+ features. R² score: 0.91, RMSE: $21K.',
    },
    {
      name: 'Handwritten Digit Recognition (CNN)',
      tech: 'Python, TensorFlow, Keras, OpenCV',
      desc: 'Deep CNN architecture classifying MNIST digits — 99.2% test accuracy with dropout & batch norm.',
    },
    {
      name: 'QuickHire — AI Job Portal',
      tech: 'React, Supabase, Tailwind CSS, Clerk Auth',
      desc: 'Full-stack job portal with real-time matching, role-based auth, and ML-themed recruiter dashboards.',
    },
  ],

  certifications: [
    'The Complete Python Bootcamp — Udemy',
    'Intro to Machine Learning — Kaggle',
    'Data Science Job Simulation — BCG (Forage)',
  ],

  contact: {
    email: 'vkprajapativiru@gmail.com',
    linkedin: 'linkedin.com/in/virendra-kumar04',
    github: 'github.com/viru4',
  },
}

/* ─────────────────────────────────────────────────
   Rule‑based reply engine
   ───────────────────────────────────────────────── */
function getReply(input) {
  const q = input.toLowerCase().trim()

  // Greetings
  if (/^(hi|hello|hey|howdy|sup|yo)\b/.test(q)) {
    return `Hey there! 👋 I'm ${KNOWLEDGE.name}'s AI assistant. Ask me about skills, projects, experience, or how to get in touch!`
  }

  // Name / who
  if (/who (are you|is|r u)|your name|about (you|him|yourself)/i.test(q)) {
    return `I'm the AI assistant for **${KNOWLEDGE.name}** — ${KNOWLEDGE.role}. ${KNOWLEDGE.about}`
  }

  // Skills / tech stack
  if (/skill|tech|stack|technolog|what (do|can) (you|he) (know|use|work)/i.test(q)) {
    const cats = Object.entries(KNOWLEDGE.skills)
      .map(([cat, items]) => `**${cat}:** ${items.join(', ')}`)
      .join('\n\n')
    return `Here's the tech stack:\n\n${cats}`
  }

  // Specific skill queries
  if (/python|pandas|numpy|scikit|sklearn/i.test(q)) {
    return `Yes! Python is a primary language — along with NumPy, Pandas, Scikit‑learn, and more. It's used across all ML projects.`
  }
  if (/react|tailwind|supabase|web|frontend|full.?stack/i.test(q)) {
    return `Absolutely! The web stack includes React, Tailwind CSS, Supabase, Node.js, and Clerk Auth. This very portfolio is built with it! 🚀`
  }
  if (/pytorch|tensorflow|keras|deep.?learn|neural|cnn|rnn/i.test(q)) {
    return `Yes — PyTorch and TensorFlow/Keras are used for deep learning projects, including a CNN that achieved 99.2% accuracy on digit recognition.`
  }

  // Projects
  if (/project|portfolio|work|built|made|create/i.test(q)) {
    const list = KNOWLEDGE.projects
      .map((p, i) => `**${i + 1}. ${p.name}**\n   _${p.tech}_\n   ${p.desc}`)
      .join('\n\n')
    return `Here are the featured projects:\n\n${list}\n\nVisit the **Projects** page for full details!`
  }

  // Specific projects
  if (/house|price|predict|regression/i.test(q)) {
    const p = KNOWLEDGE.projects[0]
    return `**${p.name}** — ${p.desc}\nTech: ${p.tech}`
  }
  if (/digit|handwrit|cnn|mnist/i.test(q)) {
    const p = KNOWLEDGE.projects[1]
    return `**${p.name}** — ${p.desc}\nTech: ${p.tech}`
  }
  if (/quickhire|job.?portal|hire/i.test(q)) {
    const p = KNOWLEDGE.projects[2]
    return `**${p.name}** — ${p.desc}\nTech: ${p.tech}`
  }

  // Experience / education
  if (/experience|education|study|college|university|degree|btech|b\.tech|qualification/i.test(q)) {
    return `🎓 **Education:** ${KNOWLEDGE.education}\n\n${KNOWLEDGE.about}`
  }

  // Certifications
  if (/certif|course|learn|training/i.test(q)) {
    const list = KNOWLEDGE.certifications.map((c) => `• ${c}`).join('\n')
    return `Here are the certifications:\n\n${list}\n\nCheck the **Certifications** page for more details!`
  }

  // Contact
  if (/contact|email|mail|reach|connect|linkedin|github|hire|collab/i.test(q)) {
    return `You can get in touch via:\n\n📧 **Email:** ${KNOWLEDGE.contact.email}\n🔗 **LinkedIn:** ${KNOWLEDGE.contact.linkedin}\n💻 **GitHub:** ${KNOWLEDGE.contact.github}\n\nOr use the **Contact** page form!`
  }

  // Resume
  if (/resume|cv|download/i.test(q)) {
    return `You can download the resume from the **Home** page — just click the "Download Resume" button! 📄`
  }

  // Thanks
  if (/thank|thanks|thx/i.test(q)) {
    return `You're welcome! 😊 Let me know if you have any other questions.`
  }

  // Bye
  if (/bye|goodbye|see you|later/i.test(q)) {
    return `Goodbye! 👋 Thanks for visiting the portfolio. Feel free to come back anytime!`
  }

  // Help
  if (/help|what can you|how to use|options|menu/i.test(q)) {
    return `I can help you with:\n\n• **Skills & Tech Stack**\n• **Projects & Work**\n• **Education & Experience**\n• **Certifications**\n• **Contact Info**\n• **Resume**\n\nJust ask away! 💬`
  }

  // Fallback
  return `Hmm, I'm not sure about that. 🤔 Try asking about **skills**, **projects**, **experience**, **certifications**, or **contact info**!\n\nType **"help"** to see what I can answer.`
}

/* ─────────────────────────────────────────────────
   Simple markdown‑lite renderer (bold + newlines)
   ───────────────────────────────────────────────── */
function renderText(text) {
  // Split into lines, then render bold (**...**) and italic (_..._)
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).map((seg, j) => {
      if (seg.startsWith('**') && seg.endsWith('**')) {
        return (
          <strong key={j} className="font-semibold">
            {seg.slice(2, -2)}
          </strong>
        )
      }
      if (seg.startsWith('_') && seg.endsWith('_')) {
        return (
          <em key={j} className="text-muted-foreground">
            {seg.slice(1, -1)}
          </em>
        )
      }
      return seg
    })
    return (
      <span key={i}>
        {i > 0 && <br />}
        {parts}
      </span>
    )
  })
}

/* ─────────────────────────────────────────────────
   Chat component
   ───────────────────────────────────────────────── */
const INITIAL_MESSAGE = {
  from: 'bot',
  text: `Hey! 👋 I'm the AI assistant for this portfolio.\n\nAsk me about **skills**, **projects**, **experience**, or anything else!\n\nType **"help"** to see all topics.`,
}

/* ─────────────────────────────────────────────────
   Mini Robot SVG — walking, waving mascot
   ───────────────────────────────────────────────── */
function MiniRobot({ waving, walking }) {
  return (
    <svg viewBox="0 0 80 96" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Antenna */}
      <line x1="40" y1="10" x2="40" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary" />
      <circle cx="40" cy="2" r="2.5" className="fill-primary animate-pulse" />

      {/* Head */}
      <rect x="18" y="10" width="44" height="30" rx="10" className="fill-primary/15 stroke-primary" strokeWidth="2" />

      {/* Eyes — blink every few seconds via CSS */}
      <g className="robot-eyes">
        <circle cx="31" cy="25" r="5" className="fill-primary" />
        <circle cx="49" cy="25" r="5" className="fill-primary" />
        {/* Pupils */}
        <circle cx="32.5" cy="23.5" r="1.5" className="fill-primary-foreground" />
        <circle cx="50.5" cy="23.5" r="1.5" className="fill-primary-foreground" />
      </g>

      {/* Mouth — happy smile */}
      <path d="M32 33 Q40 39 48 33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" className="text-primary" />

      {/* Body */}
      <rect x="24" y="42" width="32" height="20" rx="6" className="fill-primary/20 stroke-primary" strokeWidth="2" />

      {/* Body screen */}
      <rect x="33" y="46" width="14" height="10" rx="2" className="fill-primary/30" />
      <text x="40" y="54" textAnchor="middle" fontSize="7" className="fill-primary" fontWeight="bold">AI</text>

      {/* Left arm — waves when waving=true */}
      <g
        style={{
          transformOrigin: '22px 46px',
          animation: waving ? 'robotWaveArm 0.5s ease-in-out infinite alternate' : 'none',
        }}
      >
        <line x1="22" y1="46" x2="8" y2={waving ? '34' : '52'} stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary" />
        {/* Hand */}
        <circle cx={waving ? '8' : '8'} cy={waving ? '34' : '52'} r="3" className="fill-primary/30 stroke-primary" strokeWidth="1.5" />
        {/* Fingers when waving */}
        {waving && (
          <g style={{ animation: 'robotFingers 0.3s ease-in-out infinite alternate' }}>
            <line x1="6" y1="32" x2="4" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary" />
            <line x1="8" y1="31" x2="8" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary" />
            <line x1="10" y1="32" x2="12" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary" />
          </g>
        )}
      </g>

      {/* Right arm — slight swing when walking */}
      <g style={{
        transformOrigin: '58px 46px',
        animation: walking ? 'robotArmSwing 0.4s ease-in-out infinite alternate' : 'none',
      }}>
        <line x1="58" y1="46" x2="72" y2="54" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary" />
        <circle cx="72" cy="54" r="3" className="fill-primary/30 stroke-primary" strokeWidth="1.5" />
      </g>

      {/* Left leg — walking animation */}
      <g style={{
        transformOrigin: '34px 62px',
        animation: walking ? 'robotLeftLeg 0.35s ease-in-out infinite alternate' : 'none',
      }}>
        <line x1="34" y1="62" x2="30" y2="78" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary" />
        {/* Foot */}
        <ellipse cx="28" cy="79" rx="5" ry="2.5" className="fill-primary/30 stroke-primary" strokeWidth="1.5" />
      </g>

      {/* Right leg — walking animation (opposite phase) */}
      <g style={{
        transformOrigin: '46px 62px',
        animation: walking ? 'robotRightLeg 0.35s ease-in-out infinite alternate' : 'none',
      }}>
        <line x1="46" y1="62" x2="50" y2="78" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary" />
        {/* Foot */}
        <ellipse cx="52" cy="79" rx="5" ry="2.5" className="fill-primary/30 stroke-primary" strokeWidth="1.5" />
      </g>

      {/* Shadow on the ground */}
      <ellipse cx="40" cy="86" rx="18" ry="3" className="fill-foreground/10" style={{ animation: walking ? 'robotShadow 0.35s ease-in-out infinite alternate' : 'none' }} />
    </svg>
  )
}

/* ─────────────────────────────────────────────────
   Chat component with roaming robot
   ───────────────────────────────────────────────── */
const ROBOT_SIZE = 72
const SPEECH_PROMPTS = [
  '💬 Ask me anything!',
  '🤖 Need help?',
  '👋 Hi there!',
  '🧠 Ask about skills!',
  '🚀 See my projects!',
  '✨ Click to chat!',
]

export default function AiChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSpeech, setShowSpeech] = useState(false)
  const [speechText, setSpeechText] = useState(SPEECH_PROMPTS[0])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Responsive: robot only on desktop (>=1024px)
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Robot position & movement — walks horizontally along the bottom
  const posRef = useRef({ x: 0, y: 0 })
  const vxRef = useRef(1.2)
  const robotRef = useRef(null)
  const frameRef = useRef(null)
  const [robotStyle, setRobotStyle] = useState({ transform: 'translate(0px, 0px)' })
  const [robotXY, setRobotXY] = useState({ x: 0, y: 0 })
  const [facingLeft, setFacingLeft] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const hoveredRef = useRef(false)

  // Initialize position to bottom-right
  useEffect(() => {
    const w = window.innerWidth
    const h = window.innerHeight
    const groundY = h - ROBOT_SIZE - 16
    posRef.current = { x: w - ROBOT_SIZE - 40, y: groundY }
    setRobotStyle({ transform: `translate(${posRef.current.x}px, ${groundY}px)` })
    setRobotXY({ x: posRef.current.x, y: groundY })
  }, [])

  // Store `open` in a ref so the animation loop always reads the latest value
  const openRef = useRef(open)
  useEffect(() => { openRef.current = open }, [open])

  // Walking animation loop — horizontal only, pauses when chat is open or hovered
  useEffect(() => {
    function step() {
      if (openRef.current || hoveredRef.current) {
        frameRef.current = requestAnimationFrame(step)
        return
      }

      const { x } = posRef.current
      let vx = vxRef.current
      const w = window.innerWidth - ROBOT_SIZE
      const groundY = window.innerHeight - ROBOT_SIZE - 16

      let nx = x + vx

      // Bounce off left/right edges
      if (nx <= 0 || nx >= w) {
        vx = -vx
        nx = Math.max(0, Math.min(nx, w))
      }

      // Occasional random speed tweak for organic feel
      if (Math.random() < 0.005) {
        const sign = vx > 0 ? 1 : -1
        vx = sign * (0.8 + Math.random() * 1.0)
      }

      vxRef.current = vx
      posRef.current = { x: nx, y: groundY }
      setRobotStyle({ transform: `translate(${nx}px, ${groundY}px)` })
      setRobotXY({ x: nx, y: groundY })
      setFacingLeft(vx < 0)

      frameRef.current = requestAnimationFrame(step)
    }

    frameRef.current = requestAnimationFrame(step)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [])

  // Periodic speech bubble
  useEffect(() => {
    if (open) return
    const interval = setInterval(() => {
      setSpeechText(SPEECH_PROMPTS[Math.floor(Math.random() * SPEECH_PROMPTS.length)])
      setShowSpeech(true)
      setTimeout(() => setShowSpeech(false), 3000)
    }, 8000)
    // Show first one after 3s
    const firstTimeout = setTimeout(() => {
      setShowSpeech(true)
      setTimeout(() => setShowSpeech(false), 3000)
    }, 3000)
    return () => { clearInterval(interval); clearTimeout(firstTimeout) }
  }, [open])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMsg = { from: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const reply = getReply(trimmed)
      setMessages((prev) => [...prev, { from: 'bot', text: reply }])
      setIsTyping(false)
    }, 400 + Math.random() * 600)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Compute chat window position — desktop follows robot, mobile uses fixed bottom-right
  const chatPos = (() => {
    if (!isDesktop) return null // mobile uses CSS positioning
    const { x } = robotXY
    const w = window.innerWidth
    const chatW = Math.min(384, w - 48)

    // Center horizontally on robot
    let left = x + ROBOT_SIZE / 2 - chatW / 2
    if (left < 8) left = 8
    if (left + chatW > w - 8) left = w - chatW - 8

    // Anchor above the robot using bottom positioning so it never clips off-screen
    const bottom = ROBOT_SIZE + 28

    return { bottom, left }
  })()

  return (
    <>
      {/* Robot keyframes */}
      <style>{`
        @keyframes robotWaveArm {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(-30deg); }
        }
        @keyframes robotFingers {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-2px); }
        }
        @keyframes robotArmSwing {
          0%   { transform: rotate(10deg); }
          100% { transform: rotate(-10deg); }
        }
        @keyframes robotLeftLeg {
          0%   { transform: rotate(18deg); }
          100% { transform: rotate(-18deg); }
        }
        @keyframes robotRightLeg {
          0%   { transform: rotate(-18deg); }
          100% { transform: rotate(18deg); }
        }
        @keyframes robotShadow {
          0%   { rx: 16; opacity: 0.08; }
          100% { rx: 20; opacity: 0.15; }
        }
        @keyframes robotBounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        @keyframes robotBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          95%            { transform: scaleY(0.1); }
        }
        .robot-eyes {
          animation: robotBlink 3.5s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>

      {/* ── Desktop: Roaming Robot ── */}
      {isDesktop && (
        <div
          ref={robotRef}
          onClick={() => { setOpen(!open); setShowSpeech(false) }}
          onMouseEnter={() => { hoveredRef.current = true; setIsHovered(true) }}
          onMouseLeave={() => { hoveredRef.current = false; setIsHovered(false) }}
          className="fixed left-0 top-0 z-50 cursor-pointer select-none"
          style={{
            ...robotStyle,
            width: ROBOT_SIZE,
            height: ROBOT_SIZE + 8,
            transition: open ? 'transform 0.3s ease' : 'none',
          }}
        >
          {/* Speech bubble */}
          <div
            className={`absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-lg transition-all duration-300 ${
              (showSpeech || isHovered) && !open ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'
            }`}
          >
            {isHovered && !open ? '💬 Click to chat!' : speechText}
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 border-b border-r bg-background" />
          </div>

          {/* Robot body — walking bounce + directional flip */}
          <div
            className="h-full w-full drop-shadow-lg transition-transform duration-200 hover:scale-110"
            style={{
              animation: !open && !isHovered ? 'robotBounce 0.35s ease-in-out infinite' : 'none',
              transform: facingLeft ? 'scaleX(-1)' : 'scaleX(1)',
            }}
          >
            <MiniRobot waving={isHovered || (showSpeech && !open)} walking={!open && !isHovered} />
          </div>
        </div>
      )}

      {/* ── Mobile / Tablet: Floating chat button ── */}
      {!isDesktop && (
        <button
          onClick={() => setOpen(!open)}
          className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
            open ? '' : 'animate-bounce'
          }`}
          style={{ animationDuration: '2s', animationDelay: '3s' }}
          aria-label="Toggle AI Chatbot"
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      )}

      {/* ── Chat window ── */}
      <div
        className={`fixed z-50 flex w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl transition-all duration-300 sm:w-96 ${
          open
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        } ${!isDesktop ? 'bottom-24 right-6' : ''}`}
        style={{
          maxHeight: 'min(32rem, calc(100vh - 7rem))',
          ...(isDesktop && chatPos
            ? { bottom: open ? chatPos.bottom : chatPos.bottom - 16, left: chatPos.left }
            : {}),
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b bg-primary/5 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">AI Assistant</p>
            <p className="text-[11px] text-muted-foreground">Ask me about skills & projects</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" style={{ minHeight: '12rem' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  msg.from === 'bot' ? 'bg-primary/10' : 'bg-secondary'
                }`}
              >
                {msg.from === 'bot' ? (
                  <Bot className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.from === 'bot'
                    ? 'rounded-tl-sm bg-muted text-foreground'
                    : 'rounded-tr-sm bg-primary text-primary-foreground'
                }`}
              >
                {renderText(msg.text)}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick suggestions (show only when just the initial message) */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-1.5 border-t px-4 py-2.5">
            {['Skills', 'Projects', 'Experience', 'Contact'].map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setInput(topic)
                  setTimeout(() => {
                    const userMsg = { from: 'user', text: topic }
                    setMessages((prev) => [...prev, userMsg])
                    setInput('')
                    setIsTyping(true)
                    setTimeout(() => {
                      const reply = getReply(topic)
                      setMessages((prev) => [...prev, { from: 'bot', text: reply }])
                      setIsTyping(false)
                    }, 400 + Math.random() * 600)
                  }, 50)
                }}
                className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
              >
                {topic}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="flex items-center gap-2 border-t px-3 py-2.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <Button
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
