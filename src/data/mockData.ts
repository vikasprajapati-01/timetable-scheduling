import type { Subject, Faculty, Classroom, Department, TimeSlot, Timetable } from "@/types"

export const subjects: Subject[] = [
  {
    id: "1",
    name: "Data Structures and Algorithms",
    code: "CS201",
    credits: 4,
    type: "theory",
    department: "Computer Science",
    semester: 3,
    faculty: ["Dr. Sarah Wilson", "Prof. Michael Chen"],
    color: "#3b82f6"
  },
  {
    id: "2",
    name: "Database Management Systems",
    code: "CS301",
    credits: 4,
    type: "theory",
    department: "Computer Science",
    semester: 3,
    faculty: ["Dr. Emily Johnson"],
    color: "#10b981"
  },
  {
    id: "3",
    name: "Computer Networks Lab",
    code: "CS302L",
    credits: 2,
    type: "lab",
    department: "Computer Science",
    semester: 3,
    faculty: ["Prof. David Kumar"],
    color: "#f59e0b"
  },
  {
    id: "4",
    name: "Software Engineering",
    code: "CS401",
    credits: 3,
    type: "theory",
    department: "Computer Science",
    semester: 4,
    faculty: ["Dr. Lisa Anderson"],
    color: "#8b5cf6"
  },
  {
    id: "5",
    name: "Machine Learning",
    code: "CS501",
    credits: 4,
    type: "theory",
    department: "Computer Science",
    semester: 5,
    faculty: ["Prof. James Martinez"],
    color: "#ef4444"
  },
  {
    id: "6",
    name: "Digital Signal Processing",
    code: "EC301",
    credits: 4,
    type: "theory",
    department: "Electronics & Communication",
    semester: 3,
    faculty: ["Dr. Priya Sharma"],
    color: "#06b6d4"
  },
  {
    id: "7",
    name: "Microprocessors Lab",
    code: "EC302L",
    credits: 2,
    type: "lab",
    department: "Electronics & Communication",
    semester: 3,
    faculty: ["Prof. Raj Patel"],
    color: "#84cc16"
  },
  {
    id: "8",
    name: "Engineering Mathematics III",
    code: "MA301",
    credits: 3,
    type: "theory",
    department: "Mathematics",
    semester: 3,
    faculty: ["Dr. Anita Gupta"],
    color: "#f97316"
  }
]

export const faculty: Faculty[] = [
  {
    id: "1",
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@university.edu",
    department: "Computer Science",
    employeeId: "CS001",
    subjects: ["Data Structures and Algorithms", "Object Oriented Programming"],
    maxHoursPerWeek: 20,
    preferences: {
      preferredTimeSlots: ["09:00", "10:00", "11:00"],
      unavailableSlots: ["16:00", "17:00"]
    }
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    email: "michael.chen@university.edu",
    department: "Computer Science",
    employeeId: "CS002",
    subjects: ["Data Structures and Algorithms", "Computer Graphics"],
    maxHoursPerWeek: 18,
    preferences: {
      preferredTimeSlots: ["10:00", "11:00", "14:00"],
      unavailableSlots: ["09:00"]
    }
  },
  {
    id: "3",
    name: "Dr. Emily Johnson",
    email: "emily.johnson@university.edu",
    department: "Computer Science",
    employeeId: "CS003",
    subjects: ["Database Management Systems", "Web Technologies"],
    maxHoursPerWeek: 16,
    preferences: {
      preferredTimeSlots: ["11:00", "12:00", "15:00"]
    }
  },
  {
    id: "4",
    name: "Prof. David Kumar",
    email: "david.kumar@university.edu",
    department: "Computer Science",
    employeeId: "CS004",
    subjects: ["Computer Networks", "Cybersecurity"],
    maxHoursPerWeek: 20,
    preferences: {
      preferredTimeSlots: ["14:00", "15:00", "16:00"]
    }
  },
  {
    id: "5",
    name: "Dr. Lisa Anderson",
    email: "lisa.anderson@university.edu",
    department: "Computer Science",
    employeeId: "CS005",
    subjects: ["Software Engineering", "Human Computer Interaction"],
    maxHoursPerWeek: 18,
    preferences: {
      preferredTimeSlots: ["09:00", "10:00", "13:00"]
    }
  },
  {
    id: "6",
    name: "Prof. James Martinez",
    email: "james.martinez@university.edu",
    department: "Computer Science",
    employeeId: "CS006",
    subjects: ["Machine Learning", "Artificial Intelligence"],
    maxHoursPerWeek: 16,
    preferences: {
      preferredTimeSlots: ["11:00", "12:00", "14:00"]
    }
  }
]

export const classrooms: Classroom[] = [
  {
    id: "1",
    name: "Room 101",
    capacity: 60,
    type: "lecture",
    equipment: ["Projector", "Whiteboard", "Audio System"],
    department: "Computer Science",
    floor: 1,
    building: "Academic Block A"
  },
  {
    id: "2",
    name: "Room 102",
    capacity: 40,
    type: "lecture",
    equipment: ["Projector", "Whiteboard"],
    department: "Computer Science",
    floor: 1,
    building: "Academic Block A"
  },
  {
    id: "3",
    name: "Lab 201",
    capacity: 30,
    type: "lab",
    equipment: ["Computers", "Projector", "Network Infrastructure"],
    department: "Computer Science",
    floor: 2,
    building: "Academic Block A"
  },
  {
    id: "4",
    name: "Lab 202",
    capacity: 25,
    type: "lab",
    equipment: ["Computers", "Software Tools", "Projector"],
    department: "Computer Science",
    floor: 2,
    building: "Academic Block A"
  },
  {
    id: "5",
    name: "Room 301",
    capacity: 80,
    type: "lecture",
    equipment: ["Projector", "Audio System", "Smart Board"],
    department: "Electronics & Communication",
    floor: 3,
    building: "Academic Block B"
  },
  {
    id: "6",
    name: "Seminar Hall",
    capacity: 120,
    type: "seminar",
    equipment: ["Projector", "Audio System", "Microphones", "Recording Equipment"],
    floor: 0,
    building: "Main Block"
  }
]

export const departments: Department[] = [
  {
    id: "1",
    name: "Computer Science",
    code: "CS",
    head: "Prof. Robert Wilson",
    facultyCount: 15,
    studentCount: 320,
    subjects: ["Data Structures", "Database Systems", "Software Engineering", "Machine Learning"]
  },
  {
    id: "2",
    name: "Electronics & Communication",
    code: "EC",
    head: "Dr. Priya Sharma",
    facultyCount: 12,
    studentCount: 280,
    subjects: ["Digital Signal Processing", "VLSI Design", "Communication Systems"]
  },
  {
    id: "3",
    name: "Mechanical Engineering",
    code: "ME",
    head: "Prof. Rajesh Kumar",
    facultyCount: 18,
    studentCount: 350,
    subjects: ["Thermodynamics", "Machine Design", "Manufacturing Technology"]
  },
  {
    id: "4",
    name: "Mathematics",
    code: "MA",
    head: "Dr. Anita Gupta",
    facultyCount: 8,
    studentCount: 150,
    subjects: ["Engineering Mathematics", "Statistics", "Numerical Methods"]
  }
]

export const sampleTimeSlots: TimeSlot[] = [
  // Monday
  {
    id: "mon-1",
    day: "Monday",
    time: "09:00",
    duration: 60,
    subject: "Data Structures and Algorithms",
    faculty: "Dr. Sarah Wilson",
    room: "Room 101",
    type: "lecture",
    color: "#3b82f6"
  },
  {
    id: "mon-2",
    day: "Monday",
    time: "10:00",
    duration: 60,
    subject: "Database Management Systems",
    faculty: "Dr. Emily Johnson",
    room: "Room 102",
    type: "lecture",
    color: "#10b981"
  },
  {
    id: "mon-3",
    day: "Monday",
    time: "11:00",
    duration: 60,
    subject: "Engineering Mathematics III",
    faculty: "Dr. Anita Gupta",
    room: "Room 101",
    type: "lecture",
    color: "#f97316"
  },
  {
    id: "mon-4",
    day: "Monday",
    time: "14:00",
    duration: 120,
    subject: "Computer Networks Lab",
    faculty: "Prof. David Kumar",
    room: "Lab 201",
    type: "lab",
    color: "#f59e0b"
  },
  
  // Tuesday
  {
    id: "tue-1",
    day: "Tuesday",
    time: "09:00",
    duration: 60,
    subject: "Software Engineering",
    faculty: "Dr. Lisa Anderson",
    room: "Room 101",
    type: "lecture",
    color: "#8b5cf6"
  },
  {
    id: "tue-2",
    day: "Tuesday",
    time: "10:00",
    duration: 60,
    subject: "Machine Learning",
    faculty: "Prof. James Martinez",
    room: "Room 102",
    type: "lecture",
    color: "#ef4444"
  },
  {
    id: "tue-3",
    day: "Tuesday",
    time: "11:00",
    duration: 60,
    subject: "Data Structures and Algorithms",
    faculty: "Prof. Michael Chen",
    room: "Room 101",
    type: "tutorial",
    color: "#3b82f6"
  },
  {
    id: "tue-4",
    day: "Tuesday",
    time: "15:00",
    duration: 60,
    subject: "Database Management Systems",
    faculty: "Dr. Emily Johnson",
    room: "Room 102",
    type: "tutorial",
    color: "#10b981"
  },
  
  // Wednesday
  {
    id: "wed-1",
    day: "Wednesday",
    time: "09:00",
    duration: 60,
    subject: "Digital Signal Processing",
    faculty: "Dr. Priya Sharma",
    room: "Room 301",
    type: "lecture",
    color: "#06b6d4"
  },
  {
    id: "wed-2",
    day: "Wednesday",
    time: "10:00",
    duration: 60,
    subject: "Software Engineering",
    faculty: "Dr. Lisa Anderson",
    room: "Room 101",
    type: "lecture",
    color: "#8b5cf6"
  },
  {
    id: "wed-3",
    day: "Wednesday",
    time: "14:00",
    duration: 120,
    subject: "Microprocessors Lab",
    faculty: "Prof. Raj Patel",
    room: "Lab 202",
    type: "lab",
    color: "#84cc16"
  },
  
  // Thursday
  {
    id: "thu-1",
    day: "Thursday",
    time: "09:00",
    duration: 60,
    subject: "Machine Learning",
    faculty: "Prof. James Martinez",
    room: "Room 102",
    type: "lecture",
    color: "#ef4444"
  },
  {
    id: "thu-2",
    day: "Thursday",
    time: "11:00",
    duration: 60,
    subject: "Engineering Mathematics III",
    faculty: "Dr. Anita Gupta",
    room: "Room 101",
    type: "tutorial",
    color: "#f97316"
  },
  {
    id: "thu-3",
    day: "Thursday",
    time: "14:00",
    duration: 60,
    subject: "Digital Signal Processing",
    faculty: "Dr. Priya Sharma",
    room: "Room 301",
    type: "tutorial",
    color: "#06b6d4"
  },
  
  // Friday
  {
    id: "fri-1",
    day: "Friday",
    time: "09:00",
    duration: 60,
    subject: "Database Management Systems",
    faculty: "Dr. Emily Johnson",
    room: "Room 102",
    type: "lecture",
    color: "#10b981"
  },
  {
    id: "fri-2",
    day: "Friday",
    time: "10:00",
    duration: 60,
    subject: "Data Structures and Algorithms",
    faculty: "Dr. Sarah Wilson",
    room: "Room 101",
    type: "lecture",
    color: "#3b82f6"
  },
  {
    id: "fri-3",
    day: "Friday",
    time: "14:00",
    duration: 60,
    subject: "Software Engineering",
    faculty: "Dr. Lisa Anderson",
    room: "Seminar Hall",
    type: "lecture",
    color: "#8b5cf6"
  }
]

export const sampleTimetable: Timetable = {
  id: "1",
  name: "CS 3rd Semester - Section A",
  department: "Computer Science",
  semester: 3,
  section: "A",
  year: 2024,
  slots: sampleTimeSlots,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-20"),
  status: "published"
}

// Mock API functions
export const mockApi = {
  getSubjects: () => Promise.resolve(subjects),
  getFaculty: () => Promise.resolve(faculty),
  getClassrooms: () => Promise.resolve(classrooms),
  getDepartments: () => Promise.resolve(departments),
  getTimetable: (id: string) => {
    if (id === "1") return Promise.resolve(sampleTimetable)
    return Promise.resolve(null)
  },
  getUserTimetable: (userId: string, role: string) => {
    // Simulate different timetables based on user role
    return Promise.resolve(sampleTimetable)
  }
}