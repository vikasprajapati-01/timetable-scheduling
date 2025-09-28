"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Building, 
  BookOpen, 
  TrendingUp,
  TrendingDown,
  MapPin,
  GraduationCap,
  Award,
  Target,
  Activity,
  Database,
  Shield,
  RefreshCw,
  Download,
  BarChart3,
  Clock,
  Settings,
  Bell,
  AlertTriangle,
  CheckCircle,
  UserCheck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/ui/navbar"
import { LoadingPage } from "@/components/ui/loading"


interface SystemStats {
  totalUsers: number
  totalFaculty: number
  totalStudents: number
  totalDepartments: number
  activeClasses: number
  systemUptime: number
  storageUsed: number
  totalStorage: number
}

interface SystemHealth {
  cpu: number
  memory: number
  database: "healthy" | "warning" | "critical"
  backupStatus: "success" | "pending" | "failed"
  lastBackup: string
}

interface InstitutionMetrics {
  studentEnrollment: number
  facultyUtilization: number
  classroomOccupancy: number
  courseCompletion: number
  systemPerformance: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [metrics, setMetrics] = useState<InstitutionMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  // const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/login")
      return
    }

    if (session.user.role !== "admin") {
      router.push("/dashboard")
      return
    }

    loadSystemData()
  }, [session, status, router])

  const loadSystemData = async () => {
    try {
      // Simulate loading system data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const stats: SystemStats = {
        totalUsers: 1247,
        totalFaculty: 89,
        totalStudents: 1158,
        totalDepartments: 8,
        activeClasses: 342,
        systemUptime: 99.8,
        storageUsed: 2.4,
        totalStorage: 10.0
      }
      setSystemStats(stats)
      
      const health: SystemHealth = {
        cpu: 68,
        memory: 72,
        database: "healthy",
        backupStatus: "success",
        lastBackup: "2024-02-15 03:00 AM"
      }
      setSystemHealth(health)
      
      const institutionMetrics: InstitutionMetrics = {
        studentEnrollment: 94,
        facultyUtilization: 87,
        classroomOccupancy: 76,
        courseCompletion: 91,
        systemPerformance: 96
      }
      setMetrics(institutionMetrics)
      
      setLoading(false)
    } catch (error) {
      console.error("Error loading system data:", error)
      setLoading(false)
    }
  }

  if (loading || status === "loading") {
    return <LoadingPage />
  }

  if (!session || !systemStats || !systemHealth || !metrics) {
    return null
  }

  // const user = session.user
  
  const mainStats = [
    {
      title: "Total Users",
      value: systemStats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      change: "+23 this week",
      trend: "up"
    },
    {
      title: "Active Classes",
      value: systemStats.activeClasses.toString(),
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      change: "+12 this semester",
      trend: "up"
    },
    {
      title: "Departments",
      value: systemStats.totalDepartments.toString(),
      icon: Building,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      change: "No change",
      trend: "stable"
    },
    {
      title: "System Uptime",
      value: `${systemStats.systemUptime}%`,
      icon: Activity,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      change: "+0.2% this month",
      trend: "up"
    }
  ]

  const systemHealthData = [
    {
      title: "CPU Usage",
      value: `${systemHealth.cpu}%`,
      icon: Activity,
      status: systemHealth.cpu < 80 ? "healthy" : "warning",
      color: systemHealth.cpu < 80 ? "text-green-500" : "text-yellow-500"
    },
    {
      title: "Memory",
      value: `${systemHealth.memory}%`,
      icon: Database,
      status: systemHealth.memory < 85 ? "healthy" : "critical",
      color: systemHealth.memory < 85 ? "text-green-500" : "text-red-500"
    },
    {
      title: "Database",
      value: systemHealth.database,
      icon: Shield,
      status: systemHealth.database,
      color: systemHealth.database === "healthy" ? "text-green-500" : "text-red-500"
    },
    {
      title: "Storage",
      value: `${((systemStats.storageUsed / systemStats.totalStorage) * 100).toFixed(1)}%`,
      icon: Database,
      status: (systemStats.storageUsed / systemStats.totalStorage) < 0.8 ? "healthy" : "warning",
      color: (systemStats.storageUsed / systemStats.totalStorage) < 0.8 ? "text-green-500" : "text-yellow-500"
    }
  ]

  const institutionKPIs = [
    {
      title: "Student Enrollment",
      value: metrics.studentEnrollment,
      target: 95,
      icon: GraduationCap,
      color: "text-blue-500"
    },
    {
      title: "Faculty Utilization",
      value: metrics.facultyUtilization,
      target: 85,
      icon: Users,
      color: "text-green-500"
    },
    {
      title: "Classroom Occupancy",
      value: metrics.classroomOccupancy,
      target: 80,
      icon: MapPin,
      color: "text-purple-500"
    },
    {
      title: "Course Completion",
      value: metrics.courseCompletion,
      target: 90,
      icon: Award,
      color: "text-orange-500"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-100 text-green-800 border-green-200"
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "critical": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

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
                System Administration
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Institution-wide management and analytics
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-3 py-1">
                <Shield className="w-4 h-4 mr-1" />
                Administrator
              </Badge>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {mainStats.map((stat, index) => {
            const Icon = stat.icon
            const TrendIcon = stat.trend === "up" ? TrendingUp : stat.trend === "down" ? TrendingDown : Target
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
                      <div className="flex items-center gap-1 mt-1">
                        <TrendIcon className={`w-3 h-3 ${
                          stat.trend === "up" ? "text-green-500" : 
                          stat.trend === "down" ? "text-red-500" : 
                          "text-gray-500"
                        }`} />
                        <p className="text-xs text-gray-500">
                          {stat.change}
                        </p>
                      </div>
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
            {/* System Health */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {systemHealthData.map((item) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={item.title}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              item.status === "healthy" ? "bg-green-50 dark:bg-green-900/20" :
                              item.status === "warning" ? "bg-yellow-50 dark:bg-yellow-900/20" :
                              "bg-red-50 dark:bg-red-900/20"
                            }`}>
                              <Icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {item.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.value}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Backup Status */}
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Backup Status
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Last backup: {systemHealth.lastBackup}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(systemHealth.backupStatus)}>
                          {systemHealth.backupStatus}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Institution KPIs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Institution KPIs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {institutionKPIs.map((kpi) => {
                      const Icon = kpi.icon
                      const percentage = (kpi.value / kpi.target) * 100
                      const isOnTarget = kpi.value >= kpi.target
                      
                      return (
                        <div key={kpi.title} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className={`w-5 h-5 ${kpi.color}`} />
                              <span className="font-medium">{kpi.title}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold">{kpi.value}%</span>
                              <span className="text-sm text-gray-500 ml-1">/ {kpi.target}%</span>
                            </div>
                          </div>
                          
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 ${
                                isOnTarget ? 'bg-green-500' : 'bg-orange-500'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0%</span>
                            <span className={isOnTarget ? 'text-green-600' : 'text-orange-600'}>
                              {percentage.toFixed(1)}% of target
                            </span>
                            <span>{kpi.target}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent System Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent System Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "user", message: "New faculty member registered", time: "2 minutes ago", status: "success" },
                      { type: "system", message: "Database backup completed successfully", time: "1 hour ago", status: "success" },
                      { type: "warning", message: "High CPU usage detected on server-02", time: "3 hours ago", status: "warning" },
                      { type: "update", message: "Timetable generator updated to v2.1.0", time: "1 day ago", status: "info" },
                      { type: "user", message: "Bulk student enrollment completed", time: "2 days ago", status: "success" }
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === "success" ? "bg-green-400" :
                          activity.status === "warning" ? "bg-yellow-400" :
                          activity.status === "info" ? "bg-blue-400" :
                          "bg-gray-400"
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <Badge variant="outline" className={
                          activity.status === "success" ? "text-green-600 border-green-200" :
                          activity.status === "warning" ? "text-yellow-600 border-yellow-200" :
                          activity.status === "info" ? "text-blue-600 border-blue-200" :
                          "text-gray-600 border-gray-200"
                        }>
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>System Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Building className="w-4 h-4 mr-2" />
                    Department Settings
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Database Backup
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    System Settings
                  </Button>
                  <Button className="w-full" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Storage Usage */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Storage Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Used Storage</span>
                      <span className="text-sm text-gray-500">
                        {systemStats.storageUsed} GB / {systemStats.totalStorage} GB
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          (systemStats.storageUsed / systemStats.totalStorage) > 0.8 
                            ? 'bg-red-500' 
                            : (systemStats.storageUsed / systemStats.totalStorage) > 0.6
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${(systemStats.storageUsed / systemStats.totalStorage) * 100}%` }}
                      />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Database</span>
                        <span>1.2 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">User Files</span>
                        <span>0.8 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">System Logs</span>
                        <span>0.3 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Backups</span>
                        <span>0.1 GB</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Cleanup Storage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* System Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">High Memory Usage</p>
                        <p className="text-xs text-gray-600">Server-01 at 72%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Backup Completed</p>
                        <p className="text-xs text-gray-600">Daily backup successful</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                      <UserCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">System Update</p>
                        <p className="text-xs text-gray-600">v2.1.0 deployed successfully</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    View All Alerts
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