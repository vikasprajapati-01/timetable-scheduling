"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, RefreshCw, Settings } from "lucide-react"
import { motion } from "framer-motion"

interface DemoSlot {
  day: string
  time: string
  subject: string
  faculty: string
  room: string
}

const DEFAULT_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"]
const DEFAULT_TIMES = ["09:00-10:00","10:00-11:00","11:00-12:00","14:00-15:00","15:00-16:00"]
const DEFAULT_SUBJECTS = [
  { name: "Data Structures", faculty: "Dr. Jane Smith" },
  { name: "Algorithms", faculty: "Dr. Jane Smith" },
  { name: "Database Systems", faculty: "Prof. Robert Wilson" },
  { name: "Operating Systems", faculty: "Dr. Emily Johnson" },
  { name: "Computer Networks", faculty: "Dr. Michael Chen" },
  { name: "AI Fundamentals", faculty: "Dr. Sarah Lee" },
  { name: "Software Engineering", faculty: "Dr. Alan Brown" }
]
const DEFAULT_ROOMS = ["CS-101","CS-203","Lab-1","Lab-2","Seminar Hall"]

function generateDemoTimetable(params: {
  days: string[]
  times: string[]
  subjects: { name: string; faculty: string }[]
  rooms: string[]
}): DemoSlot[] {
  const timetable: DemoSlot[] = []
  const usedPerDay: Record<string, Set<string>> = {}

  const { days, times, subjects, rooms } = params

  days.forEach(day => {
    usedPerDay[day] = new Set()
    times.forEach(time => {
      const subject = subjects[Math.floor(Math.random()*subjects.length)]
      let room = rooms[Math.floor(Math.random()*rooms.length)]
      let guard = 0
      while (usedPerDay[day].has(room) && guard < 10) {
        room = rooms[Math.floor(Math.random()*rooms.length)]
        guard++
      }
      usedPerDay[day].add(room)
      timetable.push({
        day,
        time,
        subject: subject.name,
        faculty: subject.faculty,
        room
      })
    })
  })
  return timetable
}

export default function DemoTimetablePage() {
  const [slots, setSlots] = useState<DemoSlot[]>([])
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null)
  // Config state
  const [days, setDays] = useState<string[]>(DEFAULT_DAYS)
  const [times, setTimes] = useState<string[]>(DEFAULT_TIMES)
  const [subjects, setSubjects] = useState<string>(DEFAULT_SUBJECTS.map(s => `${s.name} :: ${s.faculty}`).join('\n'))
  const [rooms, setRooms] = useState<string>(DEFAULT_ROOMS.join('\n'))

  function parseSubjects(): { name: string; faculty: string }[] {
    const lines = subjects.split(/\n+/).map(l => l.trim()).filter(Boolean)
    const parsed = lines.map(line => {
      const [name, faculty] = line.split(/::|-/).map(p => p.trim())
      return { name: name || 'Subject', faculty: faculty || 'Faculty' }
    })
    return parsed.length ? parsed : DEFAULT_SUBJECTS
  }
  function parseRooms(): string[] { return rooms.split(/\n+/).map(r=>r.trim()).filter(Boolean).length? rooms.split(/\n+/).map(r=>r.trim()).filter(Boolean): DEFAULT_ROOMS }

  function regenerate() {
    const timetable = generateDemoTimetable({ days, times, subjects: parseSubjects(), rooms: parseRooms() })
    setSlots(timetable)
    setGeneratedAt(new Date())
  }

  useEffect(() => {
    const timetable = generateDemoTimetable({ days, times, subjects: parseSubjects(), rooms: parseRooms() })
    setSlots(timetable)
    setGeneratedAt(new Date())
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{opacity:0, y:15}} animate={{opacity:1,y:0}} transition={{duration:0.35}} className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Calendar className="h-8 w-8 text-primary"/> Demo Timetable Generator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm">Lightweight public demo – configure basic parameters and generate a sample schedule layout. Colors & theme stay consistent with the platform.</p>
      </motion.div>
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Configuration */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Settings className="h-5 w-5 text-primary"/> Configuration</CardTitle>
                {generatedAt && <span className="text-[10px] text-muted-foreground">{generatedAt.toLocaleTimeString()}</span>}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Classrooms</label>
                  <Input type="number" min={1} value={parseRooms().length} onChange={e => {
                    const count = parseInt(e.target.value||'0');
                    if (count>0) {
                      const current = parseRooms();
                      while (current.length < count) current.push(`Room-${current.length+1}`)
                      setRooms(current.slice(0,count).join('\n'))
                    }
                  }} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Classes / Day</label>
                  <Input type="number" min={1} value={times.length} onChange={e => {
                    const desired = parseInt(e.target.value||'0');
                    if (desired>0) {
                      const list = [...times];
                      while(list.length < desired) list.push(`X${(list.length+1).toString().padStart(2,'0')}:00-${(list.length+2).toString().padStart(2,'0')}:00`)
                      setTimes(list.slice(0,desired))
                    }
                  }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Working Days</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(d => {
                    const active = days.includes(d)
                    return <button key={d} type="button" onClick={() => setDays(prev => prev.includes(d)? prev.filter(x=>x!==d): [...prev,d])} className={`px-2.5 py-1 rounded-md text-xs border transition ${active? 'bg-primary text-primary-foreground border-primary shadow-sm':'border-border hover:bg-accent'}`}>{d.slice(0,3)}</button>
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Special Constraints (demo only, not enforced)</label>
                <Textarea rows={2} placeholder="e.g. Avoid last slot on Friday" />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Subjects (Subject :: Faculty)</label>
                  <Textarea rows={5} value={subjects} onChange={e => setSubjects(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Rooms</label>
                  <Textarea rows={4} value={rooms} onChange={e => setRooms(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={regenerate} className="flex-1 flex items-center gap-2"><Calendar className="h-4 w-4"/> Generate</Button>
                <Button type="button" variant="outline" onClick={() => { setDays(DEFAULT_DAYS); setTimes(DEFAULT_TIMES); setSubjects(DEFAULT_SUBJECTS.map(s => `${s.name} :: ${s.faculty}`).join('\n')); setRooms(DEFAULT_ROOMS.join('\n')); regenerate(); }}>Reset</Button>
              </div>
              <p className="text-[10px] text-muted-foreground">This is a non-optimized random allocation for demonstration only.</p>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Panel */}
        <div className="lg:col-span-8 space-y-8">
          {slots.length === 0 && (
            <Card className="h-full flex items-center justify-center min-h-[420px]">
              <CardContent className="text-center py-16">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Calendar className="h-8 w-8 text-primary"/>
                </div>
                <h2 className="text-xl font-semibold mb-2">Ready to Generate</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">Configure your subjects, faculty, and schedule preferences, then click generate to create a sample timetable.</p>
                <Button onClick={regenerate} className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Generate Your First Timetable</Button>
              </CardContent>
            </Card>
          )}

          {slots.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2"><Calendar className="h-5 w-5 text-primary"/> Generated Schedule</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={regenerate} className="flex items-center gap-1"><RefreshCw className="h-3 w-3"/> Regenerate</Button>
                  <Button variant="outline" size="sm">Export</Button>
                </div>
              </div>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="p-2 text-left w-32">Time</th>
                      {days.map(d => <th key={d} className="p-2 text-left">{d}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {times.map(t => (
                      <tr key={t} className="border-t">
                        <td className="p-2 font-medium bg-muted/30">{t}</td>
                        {days.map(d => {
                          const slot = slots.find(s => s.day===d && s.time===t)
                          if(!slot) return <td key={d+t} className="p-2 text-xs text-muted-foreground">Free</td>
                          return <td key={d+t} className="p-2 align-top">
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-primary hover:underline cursor-default">{slot.subject}</p>
                              <p className="text-[10px] text-muted-foreground">{slot.faculty}</p>
                              <p className="text-[10px] text-foreground/70">{slot.room}</p>
                            </div>
                          </td>
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Existing role perspectives & info */}
          {slots.length > 0 && (
            <div className="space-y-12">
              <div>
                <h3 className="text-base font-semibold mb-3">Faculty Load Summary</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(slots.reduce((acc, s) => { acc[s.faculty] = (acc[s.faculty]||0)+1; return acc }, {} as Record<string,number>))
                    .sort((a,b)=>b[1]-a[1])
                    .map(([faculty,count]) => (
                      <Card key={faculty} className="border bg-background/60">
                        <CardContent className="py-3 px-4">
                          <p className="font-medium text-xs mb-0.5">{faculty}</p>
                          <p className="text-[10px] text-muted-foreground">{count} slot{count>1?'s':''}</p>
                        </CardContent>
                      </Card>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-3">Admin Overview</h3>
                <div className="grid md:grid-cols-4 gap-3 text-sm">
                  <Card><CardContent className="py-3"><p className="font-semibold text-xs">Total Slots</p><p className="text-[11px] text-muted-foreground">{slots.length}</p></CardContent></Card>
                  <Card><CardContent className="py-3"><p className="font-semibold text-xs">Subjects</p><p className="text-[11px] text-muted-foreground">{[...new Set(slots.map(s=>s.subject))].length}</p></CardContent></Card>
                  <Card><CardContent className="py-3"><p className="font-semibold text-xs">Faculty</p><p className="text-[11px] text-muted-foreground">{[...new Set(slots.map(s=>s.faculty))].length}</p></CardContent></Card>
                  <Card><CardContent className="py-3"><p className="font-semibold text-xs">Rooms</p><p className="text-[11px] text-muted-foreground">{[...new Set(slots.map(s=>s.room))].length}</p></CardContent></Card>
                </div>
              </div>
              <div className="prose dark:prose-invert max-w-none text-xs">
                <p className="text-muted-foreground">This demo is intentionally simplified: no advanced optimization, conflict weight balancing, or resource constraints. Visit the full authenticated generator for multi-step optimized runs.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
