"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, User, BookOpen } from "lucide-react"
import type { TimeSlot } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatTime, weekDays, timeSlots } from "@/lib/utils"
import React from "react"

interface WeeklyTimetableProps {
  slots: TimeSlot[]
  viewMode?: "week" | "day"
  selectedDay?: string
}

export function WeeklyTimetable({ slots, viewMode = "week", selectedDay }: WeeklyTimetableProps) {
  const displayDays = viewMode === "day" && selectedDay ? [selectedDay] : weekDays
  
  const getSlotForDayAndTime = (day: string, time: string) => {
    return slots.find(slot => slot.day === day && slot.time === time)
  }

  const getSlotStyle = (slot: TimeSlot) => {
    const duration = slot.duration || 60
    const height = duration === 120 ? "h-24" : "h-11"
    return {
      height,
      backgroundColor: slot.color || "#3b82f6",
      className: `${height} text-white rounded-md p-2 text-xs font-medium shadow-sm`
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {viewMode === "week" ? "Weekly Schedule" : `Schedule for ${selectedDay}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-8 gap-2 min-w-[800px]">
            {/* Header */}
            <div className="font-medium text-center p-2 text-sm text-gray-500">Time</div>
            {displayDays.map(day => (
              <div key={day} className="font-medium text-center p-2 text-sm text-gray-700 dark:text-gray-300">
                {day}
              </div>
            ))}
            
            {/* Time slots */}
            {timeSlots.map(time => (
              <React.Fragment key={time}>
                <div className="text-xs text-gray-500 p-2 text-center font-medium">
                  {formatTime(time)}
                </div>
                {displayDays.map(day => {
                  const slot = getSlotForDayAndTime(day, time)
                  return (
                    <motion.div
                      key={`${day}-${time}`}
                      className="p-1"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {slot ? (
                        <div
                          className={getSlotStyle(slot).className}
                          style={{ backgroundColor: slot.color }}
                        >
                          <div className="font-semibold truncate">{slot.subject}</div>
                          <div className="flex items-center gap-1 mt-1 opacity-90">
                            <User className="w-3 h-3" />
                            <span className="truncate">{slot.faculty}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-90">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{slot.room}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-11 border border-dashed border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center text-xs text-gray-400">
                          Free
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface TodayScheduleProps {
  slots: TimeSlot[]
}

export function TodaySchedule({ slots }: TodayScheduleProps) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todaySlots = slots.filter(slot => slot.day === today).sort((a, b) => a.time.localeCompare(b.time))
  
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  
  const getSlotStatus = (slot: TimeSlot) => {
    const slotTime = slot.time
    const slotEndTime = new Date()
    const [hours, minutes] = slotTime.split(':').map(Number)
    slotEndTime.setHours(hours, minutes + (slot.duration || 60))
    const slotEndTimeStr = `${slotEndTime.getHours().toString().padStart(2, '0')}:${slotEndTime.getMinutes().toString().padStart(2, '0')}`
    
    if (currentTime < slotTime) return 'upcoming'
    if (currentTime >= slotTime && currentTime <= slotEndTimeStr) return 'ongoing'
    return 'completed'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Today&apos;s Schedule
          <Badge variant="secondary">{today}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todaySlots.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No classes scheduled for today</p>
            <p className="text-sm">Enjoy your free day!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySlots.map((slot, index) => {
              const status = getSlotStatus(slot)
              return (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    status === 'ongoing' 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500' 
                      : status === 'upcoming'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{slot.subject}</h3>
                        <Badge 
                          variant={status === 'ongoing' ? 'default' : 'secondary'}
                          className={status === 'ongoing' ? 'bg-green-500' : ''}
                        >
                          {status === 'ongoing' ? 'Live' : status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(slot.time)} ({slot.duration || 60} min)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{slot.faculty}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{slot.room}</span>
                        </div>
                      </div>
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: slot.color }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}