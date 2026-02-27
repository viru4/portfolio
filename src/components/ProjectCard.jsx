import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function ProjectCard({
  icon,
  color,
  bg,
  title,
  problem,
  techStack,
  pipeline,
  results,
  repoUrl,
  liveUrl,
}) {
  const [expanded, setExpanded] = useState(false)
  const Icon = icon

  return (
    <Card className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Top accent bar */}
      <div className={`h-1.5 w-full ${bg}`} />

      {/* Corner glow */}
      <span
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full ${bg} opacity-30 blur-3xl transition-opacity group-hover:opacity-50`}
      />

      <CardHeader className="relative pb-3">
        <div className="flex items-start gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg leading-tight">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative flex flex-1 flex-col gap-5 pt-0">
        {/* Problem Statement */}
        <div>
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Problem Statement
          </h4>
          <p className="text-sm leading-relaxed text-foreground/80">{problem}</p>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tech Stack
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-[11px]">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* ML Pipeline — expandable */}
        {pipeline && pipeline.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronRight
                className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`}
              />
              ML Pipeline
            </button>
            <div
              className={`grid transition-all duration-300 ${
                expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <ol className="space-y-1.5 border-l-2 border-primary/20 pl-4">
                  {pipeline.map((step, i) => (
                    <li key={i} className="relative text-sm text-foreground/80">
                      <span className="absolute -left-[1.3rem] top-1.5 h-2 w-2 rounded-full bg-primary" />
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results && results.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Results
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {results.map((r) => (
                <div
                  key={r.label}
                  className="rounded-lg border bg-background/60 px-3 py-2 text-center"
                >
                  <p className={`text-lg font-bold ${color}`}>{r.value}</p>
                  <p className="text-[11px] text-muted-foreground">{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons — pushed to bottom */}
        <div className="mt-auto flex gap-2 pt-2">
          {repoUrl && (
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" /> GitHub
              </a>
            </Button>
          )}
          {liveUrl && (
            <Button asChild size="sm" className="gap-1.5">
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
