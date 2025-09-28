export type UserRole = 'student' | 'faculty' | 'head' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  department?: string
  year?: number
  section?: string
  employeeId?: string
  subjects?: string[]
}

export interface TimeSlot {
  id: string
  day: string
  time: string
  duration: number
  subject?: string
  faculty?: string
  room?: string
  type?: 'lecture' | 'lab' | 'tutorial' | 'break'
  color?: string
}

export interface Subject {
  id: string
  name: string
  code: string
  credits: number
  type: 'theory' | 'lab' | 'tutorial'
  department: string
  semester: number
  faculty?: string[]
  color?: string
}

export interface Faculty {
  id: string
  name: string
  email: string
  department: string
  employeeId: string
  subjects: string[]
  maxHoursPerWeek: number
  preferences?: {
    preferredTimeSlots?: string[]
    unavailableSlots?: string[]
  }
}

export interface Classroom {
  id: string
  name: string
  capacity: number
  type: 'lecture' | 'lab' | 'seminar'
  equipment: string[]
  department?: string
  floor: number
  building: string
}

export interface Department {
  id: string
  name: string
  code: string
  head: string
  facultyCount: number
  studentCount: number
  subjects: string[]
}

export interface Timetable {
  id: string
  name: string
  department: string
  semester: number
  section?: string
  year: number
  slots: TimeSlot[]
  createdAt: Date
  updatedAt: Date
  status: 'draft' | 'published' | 'archived'
}

export interface TimetableConstraint {
  id: string
  type: 'hard' | 'soft'
  description: string
  weight: number
  facultyId?: string
  subjectId?: string
  roomId?: string
  timeSlot?: string
  day?: string
}

export interface WorkloadAnalytics {
  facultyId: string
  facultyName: string
  totalHours: number
  maxHours: number
  utilization: number
  subjects: string[]
  freeSlots: string[]
  overloaded: boolean
}

export interface ClassroomUtilization {
  roomId: string
  roomName: string
  totalSlots: number
  occupiedSlots: number
  utilization: number
  schedule: TimeSlot[]
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  timestamp: Date
  read: boolean
  userId: string
  actionUrl?: string
}

export interface DashboardStats {
  totalClasses: number
  totalFaculty: number
  totalRooms: number
  totalStudents: number
  activeSchedules: number
  conflicts: number
  utilization: number
  satisfaction: number
}

export interface ScheduleConflict {
  id: string
  type: 'faculty' | 'room' | 'student'
  description: string
  severity: 'high' | 'medium' | 'low'
  affectedSlots: TimeSlot[]
  suggestions: string[]
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'ical'
  scope: 'personal' | 'department' | 'institution'
  dateRange: {
    start: Date
    end: Date
  }
  includeBreaks: boolean
  includeEmptySlots: boolean
}

export interface Language {
  code: string
  name: string
  flag: string
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  accentColor: string
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export interface Settings {
  theme: ThemeConfig
  language: string
  notifications: {
    email: boolean
    browser: boolean
    mobile: boolean
    conflicts: boolean
    updates: boolean
  }
  timetable: {
    defaultView: 'daily' | 'weekly' | 'monthly'
    showWeekends: boolean
    startTime: string
    endTime: string
    timeFormat: '12h' | '24h'
  }
  privacy: {
    profileVisibility: 'public' | 'department' | 'private'
    scheduleVisibility: 'public' | 'department' | 'private'
  }
}