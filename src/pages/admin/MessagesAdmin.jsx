import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Mail, Trash2, CheckCheck, Eye, Loader2, RefreshCw,
} from 'lucide-react'

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  const fetchMessages = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
      if (!ignore) {
        setMessages(data ?? [])
        setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [])

  const markRead = async (id) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', id)
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)))
  }

  const deleteMsg = async (id) => {
    await supabase.from('messages').delete().eq('id', id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-sm text-muted-foreground">
            {messages.filter((m) => !m.is_read).length} unread of {messages.length} total
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={fetchMessages}>
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <Mail className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">No messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden rounded-lg border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10" />
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((m) => (
                  <TableRow key={m.id} className={m.is_read ? 'opacity-60' : ''}>
                    <TableCell>
                      {!m.is_read && (
                        <span className="flex h-2.5 w-2.5 rounded-full bg-primary" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell className="text-sm">{m.email}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {m.message}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(m.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="View"
                          onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {!m.is_read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Mark read"
                            onClick={() => markRead(m.id)}
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          title="Delete"
                          onClick={() => deleteMsg(m.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Expanded message */}
          {expanded && (
            <Card className="border-primary/30">
              <CardContent className="space-y-2 p-5">
                {(() => {
                  const m = messages.find((x) => x.id === expanded)
                  if (!m) return null
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{m.name} <span className="font-normal text-muted-foreground">({m.email})</span></p>
                        <Badge variant={m.is_read ? 'secondary' : 'default'}>
                          {m.is_read ? 'Read' : 'Unread'}
                        </Badge>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(m.created_at).toLocaleString()}
                      </p>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          )}

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {messages.map((m) => (
              <Card key={m.id} className={m.is_read ? 'opacity-60' : ''}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                    {!m.is_read && <span className="mt-1 flex h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{m.message}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">
                      {new Date(m.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1">
                      {!m.is_read && (
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => markRead(m.id)}>
                          <CheckCheck className="h-3 w-3" /> Read
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500" onClick={() => deleteMsg(m.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
