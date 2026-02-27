import { BrainCircuit, Github, Linkedin, Mail, Binary } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-primary/10 overflow-hidden">
      {/* Subtle grid bg */}
      <div className="ml-grid-bg pointer-events-none absolute inset-0" />

      <div className="container relative mx-auto flex flex-col items-center gap-4 px-4 py-8 text-center">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" strokeWidth={1.8} />
          <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent font-mono font-bold">neural.dev</span>
        </div>

        {/* Tagline */}
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-emerald-500/60">$</span> Building intelligent systems, one epoch at a time.
        </p>

        {/* Social links */}
        <div className="flex items-center gap-5">
          <a href="https://github.com/viru4" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
            <Github className="h-4 w-4" />
          </a>
          <a href="https://www.linkedin.com/in/virendra-kumar04/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
            <Linkedin className="h-4 w-4" />
          </a>
          <a href="mailto:vkprajapativiru@gmail.com" className="text-muted-foreground transition-colors hover:text-primary">
            <Mail className="h-4 w-4" />
          </a>
        </div>

        {/* Copyright */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Binary className="h-3 w-3 text-primary/40" />
          <p>&copy; {new Date().getFullYear()} Virendra Kumar. Trained with passion.</p>
          <Binary className="h-3 w-3 text-primary/40" />
        </div>
      </div>
    </footer>
  )
}
