"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  BookOpen, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Building,
  GraduationCap,
  BarChart3,
  FileCheck,
  UserCheck,
  Settings,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/ui/navbar"
import { LoadingPage } from "@/components/ui/loading"
import { Modal } from "@/components/ui/modal"
import { mockApi } from "@/data/mockData"
import type { TimeSlot, Subject, Faculty } from "@/types"

interface DepartmentStats {
  totalFaculty: number
  totalSubjects: number
  totalStudents: number
  utilizationRate: number
  pendingApprovals: number
  activeClasses: number
}

interface ApprovalRequest {
  id: string
  type: "leave" | "schedule_change" | "resource_request"
  faculty: string
  subject: string
  date: string
  status: "pending" | "approved" | "rejected"
  priority: "high" | "medium" | "low"
  description: string
}

export default function HeadDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DepartmentStats | null>(null)
  const [facultyList, setFacultyList] = useState<Faculty[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([])
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/login")
      return
    }

    if (!["head", "admin"].includes(session.user.role)) {
      router.push("/dashboard")
      return
    }

    loadData()
  }, [session, status, router])

  const loadData = async () => {
    try {
      // Load department data
      const [subjectsData, facultyData] = await Promise.all([
        mockApi.getSubjects(),
        mockApi.getFaculty()
      ])
      
      setSubjects(subjectsData)
      setFacultyList(facultyData)
      
      // Calculate department stats
      const departmentStats: DepartmentStats = {
        totalFaculty: facultyData.length,
        totalSubjects: subjectsData.length,
        totalStudents: 450, // Mock total students in department
        utilizationRate: 87, // Mock utilization rate
        pendingApprovals: 8,
        activeClasses: 120 // Mock active classes
      }
      setStats(departmentStats)
      
      // Generate mock approval requests
      const mockApprovals: ApprovalRequest[] = [
        {
          id: "1",
          type: "leave",
          faculty: "Dr. Sarah Johnson",
          subject: "Data Structures",
          date: "2024-02-15",
          status: "pending",
          priority: "high",
          description: "Medical leave for surgery, requires substitute arrangement"
        },
        {
          id: "2",
          type: "schedule_change",
          faculty: "Prof. Michael Chen",
          subject: "Machine Learning",
          date: "2024-02-10",
          status: "pending",
          priority: "medium",
          description: "Request to swap Tuesday 10 AM slot with Thursday 2 PM slot"
        },
        {
          id: "3",
          type: "resource_request",
          faculty: "Dr. Emily Davis",
          subject: "Database Systems",
          date: "2024-02-08",
          status: "approved",
          priority: "low",
          description: "Additional projector for practical sessions"
        },
        {
          id: "4",
          type: "leave",
          faculty: "Dr. James Wilson",
          subject: "Computer Networks",
          date: "2024-02-12",
          status: "rejected",
          priority: "medium",
          description: "Personal leave during exam period"
        },
        {
          id: "5",
          type: "schedule_change",
          faculty: "Prof. Lisa Anderson",
          subject: "Software Engineering",
          date: "2024-02-14",
          status: "pending",
          priority: "high",
          description: "Emergency schedule change due to conference attendance"
        }
      ]
      setApprovals(mockApprovals)
      
      setLoading(false)
    } catch (error) {
      console.error("Error loading data:", error)
      setLoading(false)
    }
  }

  const handleApprovalAction = (approvalId: string, action: "approve" | "reject") => {
    setApprovals(prev => prev.map(approval => 
      approval.id === approvalId 
        ? { ...approval, status: action === "approve" ? "approved" : "rejected" }
        : approval
    ))
    setSelectedApproval(null)
    
    // Update pending approvals count
    setStats(prev => prev ? { 
      ...prev, 
      pendingApprovals: prev.pendingApprovals + (action === "approve" ? -1 : -1) 
    } : null)
  }

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || approval.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading || status === "loading") {
    return <LoadingPage />
  }

  if (!session || !stats) {
    return null
  }

  const user = session.user
  
  const dashboardStats = [
    {
      title: "Total Faculty",
      value: stats.totalFaculty.toString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      change: "+2 this month"
    },
    {
      title: "Active Subjects",
      value: stats.totalSubjects.toString(),
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      change: `${stats.activeClasses} classes`
    },
    {
      title: "Department Students",
      value: stats.totalStudents.toString(),
      icon: GraduationCap,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      change: "4 batches active"
    },
    {
      title: "Utilization Rate",
      value: `${stats.utilizationRate}%`,
      icon: BarChart3,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      change: "+5% from last week"
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "approved": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "leave": return Clock
      case "schedule_change": return Calendar
      case "resource_request": return Settings
      default: return FileCheck
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
                Department Overview
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {user.department} • {user.role === "head" ? "Department Head" : "Administrator"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-3 py-1">
                <Building className="w-4 h-4 mr-1" />
                {user.role === "head" ? "Head" : "Admin"}
              </Badge>
              {stats.pendingApprovals > 0 && (
                <Badge variant="destructive" className="px-3 py-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {stats.pendingApprovals} Pending
                </Badge>
              )}
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
          {dashboardStats.map((stat, index) => {
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
            {/* Approval Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5" />
                      Approval Requests
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredApprovals.length > 0 ? (
                      filteredApprovals.map((approval) => {
                        const TypeIcon = getTypeIcon(approval.type)
                        return (
                          <div
                            key={approval.id}
                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${
                                approval.type === "leave" ? "bg-blue-50 dark:bg-blue-900/20" :
                                approval.type === "schedule_change" ? "bg-purple-50 dark:bg-purple-900/20" :
                                "bg-orange-50 dark:bg-orange-900/20"
                              }`}>
                                <TypeIcon className={`w-5 h-5 ${
                                  approval.type === "leave" ? "text-blue-500" :
                                  approval.type === "schedule_change" ? "text-purple-500" :
                                  "text-orange-500"
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {approval.faculty}
                                  </h4>
                                  <Badge className={getPriorityColor(approval.priority)}>
                                    {approval.priority}
                                  </Badge>
                                  <Badge variant="secondary" className={getStatusColor(approval.status)}>
                                    {approval.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {approval.subject} • {approval.date}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {approval.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedApproval(approval)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              {approval.status === "pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                    onClick={() => handleApprovalAction(approval.id, "approve")}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => handleApprovalAction(approval.id, "reject")}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-8">
                        <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No approval requests found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Faculty Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Faculty Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {facultyList.slice(0, 6).map((faculty) => (
                      <div
                        key={faculty.id}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {faculty.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {faculty.department} • {faculty.subjects?.length || 0} subjects
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            Math.random() > 0.3 ? 'bg-green-400' : 'bg-yellow-400'
                          }`} />
                          <span className="text-sm text-gray-500">
                            {Math.random() > 0.3 ? 'Active' : 'Busy'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Faculty
                  </Button>
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
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Link href={"/demo"}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Generate Timetable
                    </Link>
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Faculty
                  </Button>
                  <Button className="w-full" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Department Report
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Approved leave request from Dr. Smith
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      <span className="text-gray-600 dark:text-gray-400">
                        New faculty member added to department
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-orange-400 rounded-full" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Timetable updated for next semester
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Resource request approved for Lab 3
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Department Performance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Department Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Faculty Attendance</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">94%</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Student Satisfaction</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">4.3/5</span>
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resource Utilization</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">87%</span>
                      <BarChart3 className="w-4 h-4 text-orange-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Course Completion</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">91%</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Approval Details Modal */}
      {selectedApproval && (
        <Modal
          isOpen={!!selectedApproval}
          onClose={() => setSelectedApproval(null)}
          title="Approval Request Details"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Request Information
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Faculty:</span>
                  <span className="text-sm">{selectedApproval.faculty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Subject:</span>
                  <span className="text-sm">{selectedApproval.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Date:</span>
                  <span className="text-sm">{selectedApproval.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Priority:</span>
                  <Badge className={getPriorityColor(selectedApproval.priority)}>
                    {selectedApproval.priority}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge className={getStatusColor(selectedApproval.status)}>
                    {selectedApproval.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Description
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                {selectedApproval.description}
              </p>
            </div>

            {selectedApproval.status === "pending" && (
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1"
                  onClick={() => handleApprovalAction(selectedApproval.id, "approve")}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleApprovalAction(selectedApproval.id, "reject")}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}