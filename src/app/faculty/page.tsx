"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  Calendar, 
  BookOpen, 
  Clock, 
  Users, 
  BarChart3,
  TrendingUp,
  CheckCircle,
  User,
  Coffee,
  Target
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/ui/navbar"
import { LoadingPage } from "@/components/ui/loading"
import { TodaySchedule, WeeklyTimetable } from "@/components/dashboard/timetable"
import { mockApi } from "@/data/mockData"
import type { TimeSlot, Subject } from "@/types"

interface WorkloadData {
  totalHours: number
  maxHours: number
  subjects: string[]
  freeSlots: string[]
  utilizationRate: number
}

export default function FacultyDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [timetableSlots, setTimetableSlots] = useState<TimeSlot[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [workloadData, setWorkloadData] = useState<WorkloadData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/login")
      return
    }
    if (session.user.role !== "faculty") {
      router.push("/dashboard")
      return
    }
    // Load faculty-specific data
    const loadData = async () => {
      try {
        const [timetableData, subjectsData] = await Promise.all([
          mockApi.getUserTimetable(session.user.id, "faculty"),
          mockApi.getSubjects()
        ])
        
        if (timetableData) {
          setTimetableSlots(timetableData.slots)
        }
        
        // Filter subjects taught by this faculty
        const facultySubjects = subjectsData.filter(subject => 
          subject.faculty?.includes(session.user.name || "")
        )
        setSubjects(facultySubjects)
        
        // Calculate workload data
        const totalHours = timetableSlots.reduce((acc, slot) => acc + (slot.duration || 60), 0) / 60
        const workload: WorkloadData = {
          totalHours: totalHours,
          maxHours: 20, // Mock max hours per week
          subjects: facultySubjects.map(s => s.name),
          freeSlots: generateFreeSlots(timetableSlots),
          utilizationRate: Math.min((totalHours / 20) * 100, 100)
        }
        setWorkloadData(workload)
        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [session, status, router])

  const generateFreeSlots = (slots: TimeSlot[]): string[] => {
    const allSlots = [
      'Monday 09:00', 'Monday 10:00', 'Monday 11:00', 'Monday 14:00', 'Monday 15:00',
      'Tuesday 09:00', 'Tuesday 10:00', 'Tuesday 11:00', 'Tuesday 14:00', 'Tuesday 15:00',
      'Wednesday 09:00', 'Wednesday 10:00', 'Wednesday 11:00', 'Wednesday 14:00', 'Wednesday 15:00',
    ]
    const occupiedSlots = slots.map(slot => `${slot.day} ${slot.time}`)
    return allSlots.filter(slot => !occupiedSlots.includes(slot)).slice(0, 5)
  }

  if (loading || status === "loading") {
    return <LoadingPage />
  }

  if (!session) {
    return null
  }

  const user = session.user
  
  // Calculate stats
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todayClasses = timetableSlots.filter(slot => slot.day === today).length
  // const totalWeeklyClasses = timetableSlots.length
  const totalStudents = 180 // Mock total students across all classes
  const utilizationRate = workloadData?.utilizationRate || 0

  const stats = [
    {
      title: "Today's Classes",
      value: todayClasses.toString(),
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      change: "+2 from yesterday"
    },
    {
      title: "Weekly Load",
      value: `${workloadData?.totalHours || 0}h`,
      icon: Clock,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      change: `${utilizationRate.toFixed(0)}% utilized`
    },
    {
      title: "Students",
      value: totalStudents.toString(),
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      change: "Across all classes"
    },
    {
      title: "Subjects",
      value: subjects.length.toString(),
      icon: BookOpen,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      change: `${user.subjects?.length || 0} assigned`
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Hello, {user.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {user.department} • Employee ID: {user.employeeId}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-3 py-1">
                <Target className="w-4 h-4 mr-1" />
                Faculty
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TodaySchedule slots={timetableSlots} />
            </motion.div>

            {/* Weekly Timetable */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <WeeklyTimetable slots={timetableSlots} />
            </motion.div>

            {/* Workload Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Workload Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {workloadData && (
                    <div className="space-y-6">
                      {/* Workload Progress Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Weekly Hours</span>
                          <span className="text-sm text-gray-500">
                            {workloadData.totalHours}h / {workloadData.maxHours}h
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              utilizationRate > 90 
                                ? 'bg-red-500' 
                                : utilizationRate > 70 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0h</span>
                          <span>{utilizationRate.toFixed(1)}% utilized</span>
                          <span>{workloadData.maxHours}h</span>
                        </div>
                      </div>

                      {/* Subject Distribution */}
                      <div>
                        <h4 className="font-medium mb-3">Teaching Subjects</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {subjects.map((subject, index) => (
                            <div
                              key={subject.id}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-sm">{subject.name}</p>
                                <p className="text-xs text-gray-500">{subject.code}</p>
                              </div>
                              <Badge variant="secondary">
                                {subject.credits} credits
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Free Time Slots */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="w-5 h-5" />
                    Available Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {workloadData?.freeSlots && workloadData.freeSlots.length > 0 ? (
                    <div className="space-y-2">
                      {workloadData.freeSlots.map((slot, index) => (
                        <div
                          key={slot}
                          className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400"
                        >
                          <span className="text-sm font-medium">{slot}</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Free
                          </Badge>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full mt-3" size="sm">
                        Schedule Meeting
                      </Button>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No free slots available
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Student Attendance</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">89%</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Course Completion</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">76%</span>
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Feedback Rating</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">4.6/5</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-yellow-400 text-sm">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    View All Classes
                  </Button>
                  <Button className="w-full" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Workload Report
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Request Time Off
                  </Button>
                  <Button className="w-full" variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}