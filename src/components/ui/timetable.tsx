"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatTime, weekDays, timeSlots } from "@/lib/utils"
import type { TimeSlot } from "@/types"
import { motion } from "framer-motion"

interface TimetableProps {
  slots: TimeSlot[]
  view?: "daily" | "weekly"
  className?: string
}

export function Timetable({ slots, view = "weekly", className }: TimetableProps) {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedDay, setSelectedDay] = useState("Monday")

  const getSlotForDayAndTime = (day: string, time: string) => {
    return slots.find(slot => slot.day === day && slot.time === time)
  }

  const getTodaySlots = () => {
    return slots.filter(slot => slot.day === selectedDay).sort((a, b) => a.time.localeCompare(b.time))
  }

  if (view === "daily") {
    const todaySlots = getTodaySlots()
    
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{selectedDay} Schedule</span>
            </CardTitle>
            <div className="flex space-x-1">
              {weekDays.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDay(day)}
                  className="hidden sm:inline-flex"
                >
                  {day.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todaySlots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No classes scheduled for {selectedDay}</p>
              </div>
            ) : (
              todaySlots.map((slot, index) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  style={{ borderLeft: `4px solid ${slot.color}` }}
                >
                  <div className="text-center min-w-[80px]">
                    <div className="font-semibold text-sm">{formatTime(slot.time)}</div>
                    <div className="text-xs text-muted-foreground">
                      {slot.duration} min
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{slot.subject}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{slot.faculty}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{slot.room}</span>
                      </div>
                      {slot.type && (
                        <Badge variant="outline" className="capitalize">
                          {slot.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Weekly Timetable</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentWeek(currentWeek - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-3">Week {currentWeek + 1}</span>
            <Button variant="outline" size="icon" onClick={() => setCurrentWeek(currentWeek + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="p-2 text-center font-semibold text-sm text-muted-foreground">
                Time
              </div>
              {weekDays.map((day) => (
                <div key={day} className="p-2 text-center font-semibold text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Time slots grid */}
            <div className="space-y-1">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 gap-2">
                  <div className="p-3 text-center text-sm text-muted-foreground font-medium bg-muted/50 rounded">
                    {formatTime(time)}
                  </div>
                  {weekDays.map((day) => {
                    const slot = getSlotForDayAndTime(day, time)
                    return (
                      <div
                        key={`${day}-${time}`}
                        className={cn(
                          "p-2 rounded border-2 border-dashed border-gray-200 dark:border-gray-700 min-h-[80px] transition-all hover:border-gray-300 dark:hover:border-gray-600",
                          slot && "border-solid bg-card shadow-sm hover:shadow-md"
                        )}
                        style={slot ? { borderColor: slot.color, backgroundColor: `${slot.color}10` } : {}}
                      >
                        {slot && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-full"
                          >
                            <div className="text-xs font-semibold mb-1 truncate" style={{ color: slot.color }}>
                              {slot.subject}
                            </div>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span className="truncate">{slot.faculty}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{slot.room}</span>
                              </div>
                              {slot.type && (
                                <Badge variant="outline" className="text-xs py-0 px-1 capitalize">
                                  {slot.type}
                                </Badge>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}