"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Bell, 
  TrendingUp,
  Users,
  MapPin,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Timetable } from "@/components/ui/timetable"
import { Navbar } from "@/components/ui/navbar"
import { LoadingPage } from "@/components/ui/loading"
import { sampleTimeSlots, subjects } from "@/data/mockData"
import { motion } from "framer-motion"
import type { TimeSlot, Notification } from "@/types"

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Class Rescheduled",
    message: "Database Management Systems class moved from Room 102 to Room 101",
    type: "warning",
    timestamp: new Date("2024-01-20T10:30:00"),
    read: false,
    userId: "1"
  },
  {
    id: "2",
    title: "New Assignment Posted",
    message: "Data Structures assignment due next Friday",
    type: "info",
    timestamp: new Date("2024-01-19T14:00:00"),
    read: false,
    userId: "1"
  },
  {
    id: "3",
    title: "Lab Session Confirmed",
    message: "Computer Networks Lab scheduled for tomorrow at 2:00 PM",
    type: "success",
    timestamp: new Date("2024-01-18T16:45:00"),
    read: true,
    userId: "1"
  }
]

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const [timetableView, setTimetableView] = useState<"daily" | "weekly">("weekly")
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [todaysClasses, setTodaysClasses] = useState<TimeSlot[]>([])

  useEffect(() => {
    // Get today's classes (assuming today is Monday for demo)
    const today = "Monday"
    const classes = sampleTimeSlots.filter(slot => slot.day === today)
    setTodaysClasses(classes.sort((a, b) => a.time.localeCompare(b.time)))
  }, [])

  if (status === "loading") {
    return <LoadingPage />
  }

  if (!session) {
    return <div>Please log in to access your dashboard.</div>
  }

  const upcomingClass = todaysClasses.find(cls => cls.time > new Date().toTimeString().slice(0, 5))
  const unreadNotifications = notifications.filter(n => !n.read)
  const userSubjects = subjects.filter(subject => subject.department === session.user.department)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's your academic schedule and updates for today.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todaysClasses.length}</div>
                <p className="text-xs text-muted-foreground">
                  {todaysClasses.length > 0 ? `Next at ${todaysClasses[0]?.time}` : "No classes today"}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrolled Subjects</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userSubjects.length}</div>
                <p className="text-xs text-muted-foreground">
                  {userSubjects.reduce((total, subject) => total + subject.credits, 0)} total credits
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unreadNotifications.length}</div>
                <p className="text-xs text-muted-foreground">
                  {unreadNotifications.length > 0 ? "Unread notifications" : "All caught up!"}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">
                  Above average
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Class */}
            {upcomingClass && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Next Class</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{upcomingClass.subject}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{upcomingClass.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{upcomingClass.room}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{upcomingClass.faculty}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {upcomingClass.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Timetable */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">My Timetable</h2>
                <div className="flex space-x-2">
                  <Button
                    variant={timetableView === "daily" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimetableView("daily")}
                  >
                    Daily
                  </Button>
                  <Button
                    variant={timetableView === "weekly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimetableView("weekly")}
                  >
                    Weekly
                  </Button>
                </div>
              </div>
              <Timetable slots={sampleTimeSlots} view={timetableView} />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Notifications</span>
                    <Badge variant="destructive" className="text-xs">
                      {unreadNotifications.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border transition-colors ${
                          !notification.read 
                            ? "bg-muted/50 border-primary/20" 
                            : "bg-muted/20 border-muted"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {notification.type === "warning" && (
                            <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                          )}
                          {notification.type === "success" && (
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          )}
                          {notification.type === "info" && (
                            <Bell className="w-4 h-4 text-blue-500 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(notification.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View All Notifications
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* My Subjects */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>My Subjects</CardTitle>
                  <CardDescription>Current semester subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userSubjects.slice(0, 5).map((subject, index) => (
                      <div key={subject.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div>
                          <p className="font-medium text-sm">{subject.name}</p>
                          <p className="text-xs text-muted-foreground">{subject.code}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ borderColor: subject.color, color: subject.color }}
                          >
                            {subject.credits} credits
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1 capitalize">
                            {subject.type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View All Subjects
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Export Timetable
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Bell className="w-4 h-4 mr-2" />
                      Notification Settings
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Academic Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}