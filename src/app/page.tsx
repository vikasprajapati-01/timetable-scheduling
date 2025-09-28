"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Calendar, 
  Users, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  Zap, 
  BookOpen, 
  UserCheck, 
  Settings, 
  GraduationCap, 
  ArrowRight, 
  Star, 
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/ui/navbar"

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "AI-powered timetable generation with conflict resolution and optimization algorithms.",
    color: "text-blue-500"
  },
  {
    icon: Users,
    title: "Multi-Role Support",
    description: "Tailored dashboards for students, faculty, administrators, and heads of departments.",
    color: "text-green-500"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Real-time insights into resource utilization, faculty workload, and scheduling efficiency.",
    color: "text-purple-500"
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Instant notifications for schedule changes, conflicts, and important announcements.",
    color: "text-orange-500"
  },
  {
    icon: CheckCircle,
    title: "Conflict Detection",
    description: "Automatic identification and resolution of scheduling conflicts before they occur.",
    color: "text-red-500"
  },
  {
    icon: Zap,
    title: "Quick Generation",
    description: "Generate optimized timetables in seconds, not hours, with our advanced algorithms.",
    color: "text-yellow-500"
  }
]

const userRoles = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Access your personalized timetable, track classes, and stay updated with schedule changes.",
    features: ["Personal timetable view", "Subject tracking", "Mobile notifications", "Calendar integration"]
  },
  {
    icon: BookOpen,
    title: "Faculty",
    description: "Manage your teaching schedule, view workload distribution, and track free periods.",
    features: ["Teaching schedule", "Workload analytics", "Free slot tracking", "Class management"]
  },
  {
    icon: UserCheck,
    title: "Department Heads",
    description: "Oversee department schedules, manage faculty allocation, and approve timetables.",
    features: ["Department overview", "Faculty management", "Resource allocation", "Approval workflows"]
  },
  {
    icon: Settings,
    title: "Administrators",
    description: "Complete system control with institution-wide analytics and user management.",
    features: ["System management", "User administration", "Institution analytics", "Configuration control"]
  }
]

const stats = [
  { number: "50+", label: "Educational Institutions" },
  { number: "10,000+", label: "Active Users" },
  { number: "95%", label: "Efficiency Improvement" },
  { number: "24/7", label: "System Uptime" }
]

const testimonials = [
  {
    name: "Dr. Priya Sharma",
    role: "Head of Department, Computer Science",
    institution: "Tech University",
    content: "Smart Timetable Scheduler has revolutionized our scheduling process. What used to take weeks now takes minutes.",
    rating: 5
  },
  {
    name: "Prof. Rajesh Kumar",
    role: "Dean of Engineering",
    institution: "Engineering College",
    content: "The conflict resolution feature is incredible. Our scheduling conflicts have reduced by 90%.",
    rating: 5
  },
  {
    name: "Sarah Johnson",
    role: "Student Council President",
    institution: "Liberal Arts College",
    content: "As a student, I love how easy it is to access my schedule and get notified about changes instantly.",
    rating: 5
  }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-4">
              ✨ AI-Powered Scheduling Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Smart Timetable
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Scheduler</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your educational institution with intelligent scheduling.
              Our AI-powered platform creates optimized timetables, eliminates conflicts,
              and provides insights that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="px-8 py-4 text-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  Sign In
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="secondary" size="lg" className="px-8 py-4 text-lg bg-blue-600 text-white hover:bg-blue-700">
                  Live Demo Timetable
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-20 animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern Education
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to create, manage, and optimize timetables for your educational institution.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${feature.color} mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built for Everyone in Education
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Tailored experiences for every role in your educational institution.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userRoles.map((role, index) => {
              const Icon = role.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                        <Icon className="w-8 h-8" />
                      </div>
                      <CardTitle>{role.title}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {role.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Educational Leaders
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See what educators and administrators say about our platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardDescription className="text-base italic">
                      &quot;{testimonial.content}&quot;
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">{testimonial.institution}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Scheduling?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of educational institutions already using Smart Timetable Scheduler to optimize their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href={"/demo"}>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-lg">Smart Timetable</span>
              </div>
              <p className="text-gray-400">
                Intelligent scheduling solutions for modern educational institutions.
              </p>
              <div className="flex space-x-4 text-gray-400">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Secure & Reliable</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-gray-400">
                <div>Features</div>
                <div>Pricing</div>
                <div>Documentation</div>
                <div>API</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-gray-400">
                <div>About</div>
                <div>Contact</div>
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Community</div>
                <div>Status</div>
                <div>Contact Support</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Smart Timetable Scheduler. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}