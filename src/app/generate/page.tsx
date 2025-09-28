"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  RefreshCw,
  Play,
  Pause,
  Settings,
  FileText,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "@/components/ui/navbar"
import { LoadingPage } from "@/components/ui/loading"
import { Modal } from "@/components/ui/modal"
import { mockApi } from "@/data/mockData"
import type { Subject, Faculty, TimeSlot } from "@/types"

interface GenerationConfig {
  department: string
  semester: number
  startDate: string
  endDate: string
  workingDays: string[]
  timeSlots: string[]
  constraints: {
    maxHoursPerDay: number
    maxConsecutiveHours: number
    lunchBreakDuration: number
    facultyMaxHours: number
  }
}

interface ConflictItem {
  id: string
  type: "faculty" | "room" | "subject"
  severity: "high" | "medium" | "low"
  description: string
  affectedSlots: string[]
  suggestions: string[]
}

interface GenerationStep {
  id: number
  title: string
  status: "pending" | "running" | "completed" | "error"
  description: string
  progress?: number
}

export default function TimetableGenerator() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [config, setConfig] = useState<GenerationConfig>({
    department: "Computer Science",
    semester: 5,
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    timeSlots: ["09:00-10:00", "10:00-11:00", "11:00-12:00", "14:00-15:00", "15:00-16:00"],
    constraints: {
      maxHoursPerDay: 6,
      maxConsecutiveHours: 3,
      lunchBreakDuration: 60,
      facultyMaxHours: 20
    }
  })
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [generatedTimetable, setGeneratedTimetable] = useState<TimeSlot[]>([])
  const [conflicts, setConflicts] = useState<ConflictItem[]>([])
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedConflict, setSelectedConflict] = useState<ConflictItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/login")
      return
    }

    // Allow access to faculty, head, and admin roles
    if (!["faculty", "head", "admin"].includes(session.user.role)) {
      router.push("/dashboard")
      return
    }

    loadData()
  }, [session, status, router])

  const loadData = async () => {
    try {
      const [subjectsData, facultyData] = await Promise.all([
        mockApi.getSubjects(),
        mockApi.getFaculty()
      ])
      
      setSubjects(subjectsData)
      setFaculty(facultyData)
      
      // Initialize generation steps
      const steps: GenerationStep[] = [
        {
          id: 1,
          title: "Initialize Configuration",
          status: "pending",
          description: "Setting up generation parameters and constraints"
        },
        {
          id: 2,
          title: "Load Data",
          status: "pending",
          description: "Loading subjects, faculty, and resource information"
        },
        {
          id: 3,
          title: "Generate Base Schedule",
          status: "pending",
          description: "Creating initial timetable structure"
        },
        {
          id: 4,
          title: "Assign Faculty",
          status: "pending",
          description: "Mapping faculty to subjects and time slots"
        },
        {
          id: 5,
          title: "Resolve Conflicts",
          status: "pending",
          description: "Identifying and resolving scheduling conflicts"
        },
        {
          id: 6,
          title: "Optimize Schedule",
          status: "pending",
          description: "Applying optimization algorithms"
        },
        {
          id: 7,
          title: "Validate Results",
          status: "pending",
          description: "Final validation and quality checks"
        }
      ]
      setGenerationSteps(steps)
      setLoading(false)
    } catch (error) {
      console.error("Error loading data:", error)
      setLoading(false)
    }
  }

  const startGeneration = async () => {
    setIsGenerating(true)
    setCurrentStep(0)
    
    // Reset steps
    setGenerationSteps(prev => prev.map(step => ({ ...step, status: "pending", progress: 0 })))
    
    for (let i = 0; i < generationSteps.length; i++) {
      setCurrentStep(i)
      
      // Update current step to running
      setGenerationSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: "running", progress: 0 } : step
      ))
      
      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setGenerationSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, progress } : step
        ))
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // Complete step
      setGenerationSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: "completed", progress: 100 } : step
      ))
      
      // Small delay between steps
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    // Generate mock timetable
    const mockTimetable = generateMockTimetable()
    setGeneratedTimetable(mockTimetable)
    
    // Generate mock conflicts
    const mockConflicts = generateMockConflicts()
    setConflicts(mockConflicts)
    
    setIsGenerating(false)
  }

  const generateMockTimetable = (): TimeSlot[] => {
    const mockSlots: TimeSlot[] = []
    const days = config.workingDays
    const times = ["09:00", "10:00", "11:00", "14:00", "15:00"]
    
    days.forEach((day, dayIndex) => {
      times.forEach((time, timeIndex) => {
        if (subjects[dayIndex * times.length + timeIndex]) {
          const subject = subjects[dayIndex * times.length + timeIndex]
          mockSlots.push({
            id: `${day}-${time}`,
            day,
            time,
            duration: 60,
            subject: subject.name,
            faculty: subject.faculty?.[0] || "TBA",
            room: `Room ${101 + timeIndex}`,
            type: subject.type === "lab" ? "lab" : "lecture",
            color: subject.color
          })
        }
      })
    })
    
    return mockSlots
  }

  const generateMockConflicts = (): ConflictItem[] => {
    return [
      {
        id: "1",
        type: "faculty",
        severity: "high",
        description: "Dr. Sarah Johnson scheduled for multiple classes at the same time",
        affectedSlots: ["Monday 10:00", "Monday 10:00"],
        suggestions: ["Reassign one class to another faculty", "Move one class to different time slot"]
      },
      {
        id: "2",
        type: "room",
        severity: "medium",
        description: "Room 101 double-booked for Lab sessions",
        affectedSlots: ["Tuesday 14:00"],
        suggestions: ["Use alternative lab room", "Split lab session into two groups"]
      },
      {
        id: "3",
        type: "subject",
        severity: "low",
        description: "Machine Learning scheduled too close to prerequisite course",
        affectedSlots: ["Wednesday 09:00"],
        suggestions: ["Adjust sequence of courses", "Add buffer time between related subjects"]
      }
    ]
  }

  const handleConfigChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setConfig(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }))
    } else {
      setConfig(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const exportTimetable = () => {
    const data = JSON.stringify(generatedTimetable, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'timetable.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-blue-100 text-blue-800 border-blue-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle
      case "running": return RefreshCw
      case "error": return AlertTriangle
      default: return Clock
    }
  }

  if (loading || status === "loading") {
    return <LoadingPage />
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Timetable Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create optimized schedules with conflict resolution
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <Settings className="w-4 h-4 mr-1" />
                Advanced
              </Button>
              {generatedTimetable.length > 0 && (
                <Button variant="outline" size="sm" onClick={exportTimetable}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Department</label>
                    <select
                      value={config.department}
                      onChange={(e) => handleConfigChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Mathematics">Mathematics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Semester</label>
                    <select
                      value={config.semester}
                      onChange={(e) => handleConfigChange('semester', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    >
                      {[1,2,3,4,5,6,7,8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={config.startDate}
                      onChange={(e) => handleConfigChange('startDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <Input
                      type="date"
                      value={config.endDate}
                      onChange={(e) => handleConfigChange('endDate', e.target.value)}
                    />
                  </div>

                  {/* Advanced Settings */}
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2">Max Hours Per Day</label>
                        <Input
                          type="number"
                          min="4"
                          max="10"
                          value={config.constraints.maxHoursPerDay}
                          onChange={(e) => handleConfigChange('constraints.maxHoursPerDay', parseInt(e.target.value))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Max Consecutive Hours</label>
                        <Input
                          type="number"
                          min="1"
                          max="4"
                          value={config.constraints.maxConsecutiveHours}
                          onChange={(e) => handleConfigChange('constraints.maxConsecutiveHours', parseInt(e.target.value))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Faculty Max Hours</label>
                        <Input
                          type="number"
                          min="10"
                          max="30"
                          value={config.constraints.facultyMaxHours}
                          onChange={(e) => handleConfigChange('constraints.facultyMaxHours', parseInt(e.target.value))}
                        />
                      </div>
                    </motion.div>
                  )}

                  <Button 
                    className="w-full" 
                    onClick={startGeneration}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Timetable
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Generation Progress */}
            {generationSteps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Generation Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {generationSteps.map((step, index) => {
                        const Icon = getStepIcon(step.status)
                        const isActive = index === currentStep && isGenerating
                        
                        return (
                          <div
                            key={step.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                              isActive 
                                ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20' 
                                : step.status === 'completed' 
                                ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                            }`}
                          >
                            <div className={`p-2 rounded-full ${
                              step.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20' :
                              step.status === 'running' ? 'bg-blue-100 dark:bg-blue-900/20' :
                              'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              <Icon className={`w-4 h-4 ${
                                step.status === 'completed' ? 'text-green-500' :
                                step.status === 'running' ? 'text-blue-500 animate-spin' :
                                'text-gray-500'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{step.title}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {step.description}
                              </p>
                              {step.status === 'running' && step.progress !== undefined && (
                                <div className="mt-2">
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                    <div 
                                      className="bg-blue-500 h-1 rounded-full transition-all duration-200"
                                      style={{ width: `${step.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Conflicts */}
            {conflicts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Scheduling Conflicts ({conflicts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {conflicts.map((conflict) => (
                        <div
                          key={conflict.id}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${
                              conflict.severity === "high" ? "bg-red-50 dark:bg-red-900/20" :
                              conflict.severity === "medium" ? "bg-yellow-50 dark:bg-yellow-900/20" :
                              "bg-blue-50 dark:bg-blue-900/20"
                            }`}>
                              <AlertTriangle className={`w-5 h-5 ${
                                conflict.severity === "high" ? "text-red-500" :
                                conflict.severity === "medium" ? "text-yellow-500" :
                                "text-blue-500"
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {conflict.type.charAt(0).toUpperCase() + conflict.type.slice(1)} Conflict
                                </h4>
                                <Badge className={getSeverityColor(conflict.severity)}>
                                  {conflict.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {conflict.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Affects: {conflict.affectedSlots.join(', ')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedConflict(conflict)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Resolve
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Generated Timetable */}
            {generatedTimetable.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Generated Timetable
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={exportTimetable}>
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-800">
                            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">
                              Time
                            </th>
                            {config.workingDays.map(day => (
                              <th key={day} className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">
                                {day}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"].map(time => (
                            <tr key={time}>
                              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium bg-gray-50 dark:bg-gray-800">
                                {time}
                              </td>
                              {config.workingDays.map(day => {
                                const slot = generatedTimetable.find(s => s.day === day && s.time === time)
                                return (
                                  <td key={`${day}-${time}`} className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                    {slot ? (
                                      <div 
                                        className="p-2 rounded text-sm"
                                        style={{ backgroundColor: slot.color + '20', borderLeft: `3px solid ${slot.color}` }}
                                      >
                                        <div className="font-medium">{slot.subject}</div>
                                        <div className="text-xs text-gray-600">{slot.faculty}</div>
                                        <div className="text-xs text-gray-500">{slot.room}</div>
                                      </div>
                                    ) : time === "12:00" ? (
                                      <div className="p-2 rounded text-sm bg-yellow-50 dark:bg-yellow-900/20 border-l-3 border-yellow-400">
                                        <div className="font-medium text-center">Lunch Break</div>
                                      </div>
                                    ) : (
                                      <div className="text-gray-400 text-center text-sm">Free</div>
                                    )}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Empty State */}
            {!isGenerating && generatedTimetable.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Timetable Generated
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Configure your parameters and click "Generate Timetable" to create a schedule
                      </p>
                      <Button onClick={startGeneration}>
                        <Play className="w-4 h-4 mr-2" />
                        Start Generation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Conflict Resolution Modal */}
      {selectedConflict && (
        <Modal
          isOpen={!!selectedConflict}
          onClose={() => setSelectedConflict(null)}
          title="Resolve Scheduling Conflict"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Conflict Details
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getSeverityColor(selectedConflict.severity)}>
                    {selectedConflict.severity}
                  </Badge>
                  <span className="text-sm font-medium">
                    {selectedConflict.type.charAt(0).toUpperCase() + selectedConflict.type.slice(1)} Conflict
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedConflict.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Affected slots: {selectedConflict.affectedSlots.join(', ')}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Suggested Solutions
              </h4>
              <div className="space-y-2">
                {selectedConflict.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{suggestion}</span>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1">
                Auto-Resolve
              </Button>
              <Button variant="outline" className="flex-1">
                Manual Edit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}