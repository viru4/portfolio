import ContactForm from '@/components/ContactForm'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Linkedin, Github, Terminal, ArrowUpRight, Network } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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

const socials = [
  {
    label: 'Email',
    value: 'vkprajapativiru@gmail.com',
    href: 'mailto:vkprajapativiru@gmail.com',
    icon: Mail,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/virendra-kumar04',
    href: 'https://www.linkedin.com/in/virendra-kumar04/',
    icon: Linkedin,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'GitHub',
    value: 'github.com/viru4',
    href: 'https://github.com/viru4',
    icon: Github,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
]

export default function Contact() {
  const headerRef = useRef(null)
  const headerVisible = useInView(headerRef)
  const socialsRef = useRef(null)
  const socialsVisible = useInView(socialsRef)
  const formRef = useRef(null)
  const formVisible = useInView(formRef)

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
          <Network className="h-3 w-3" /> Connect
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Contact Me</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Have an ML project in mind, want to collaborate on research, or just say hello? Let's connect the nodes.
        </p>
        <div className="mx-auto mt-4 h-1 w-12 rounded bg-gradient-to-r from-primary to-emerald-500" />
      </div>

      {/* Social Links */}
      <div
        ref={socialsRef}
        className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ${
          socialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {socials.map((s, idx) => {
          const Icon = s.icon
          return (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <span
                  className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full ${s.bg} opacity-30 blur-2xl transition-opacity group-hover:opacity-50`}
                />
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${s.bg}`}>
                    <Icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                    <p className="truncate text-sm font-medium">{s.value}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </CardContent>
              </Card>
            </a>
          )
        })}
      </div>

      {/* Contact Form */}
      <div
        ref={formRef}
        className={`mx-auto max-w-2xl transition-all duration-700 ${
          formVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <Card className="relative overflow-hidden">
          <span className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          <CardContent className="p-6 sm:p-8">
            <h2 className="mb-1 text-xl font-semibold">Send a Signal</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Fill out the form below and I'll backpropagate a response as soon as possible.
            </p>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
