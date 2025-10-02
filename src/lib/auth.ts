import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { UserRole } from "@/types"
import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

// Mock user database
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "student@test.com",
    password: "password",
    role: "student" as UserRole,
    department: "Computer Science",
    year: 3,
    section: "A"
  },
  {
    id: "2",
    name: "Dr. Jane Smith",
    email: "faculty@test.com",
    password: "password",
    role: "faculty" as UserRole,
    department: "Computer Science",
    employeeId: "CS001",
    subjects: ["Data Structures", "Algorithms", "Database Systems"]
  },
  {
    id: "3",
    name: "Prof. Robert Wilson",
    email: "head@test.com",
    password: "password",
    role: "head" as UserRole,
    department: "Computer Science",
    employeeId: "CS101"
  },
  {
    id: "4",
    name: "Principal Smith",
    email: "principal@test.com",
    password: "password",
    role: "head" as UserRole,
    department: "Administration",
    employeeId: "PR001"
  },
  {
    id: "5",
    name: "Admin User",
    email: "admin@test.com",
    password: "password",
    role: "admin" as UserRole,
    department: "Administration"
  }
]

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: UserRole
      department?: string
      year?: number
      section?: string
      employeeId?: string
      subjects?: string[]
    }
  }

  interface User {
    id: string
    name: string
    email: string
    role: UserRole
    department?: string
    year?: number
    section?: string
    employeeId?: string
    subjects?: string[]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    department?: string
    year?: number
    section?: string
    employeeId?: string
    subjects?: string[]
  }
}

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing email or password")
            return null
          }

          const user = users.find(
            (user) => user.email === credentials.email && user.password === credentials.password
          )

          if (!user) {
            console.error("User not found or invalid credentials")
            return null
          }

          console.log("User authenticated successfully:", user.email, user.role)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            year: user.year,
            section: user.section,
            employeeId: user.employeeId,
            subjects: user.subjects
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      try {
        if (user) {
          token.role = user.role;
          token.department = user.department;
          token.year = user.year;
          token.section = user.section;
          token.employeeId = user.employeeId;
          token.subjects = user.subjects;
        }
        return token;
      } catch (error) {
        console.error("JWT callback error:", error)
        return token;
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      try {
        if (session.user) {
          session.user.id = token.sub as string;
          session.user.role = token.role;
          session.user.department = token.department;
          session.user.year = token.year;
          session.user.section = token.section;
          session.user.employeeId = token.employeeId;
          session.user.subjects = token.subjects;
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error)
        return session;
      }
    }
  },
  pages: {
    signIn: "/auth/login",
  }
}

export default NextAuth(authConfig)