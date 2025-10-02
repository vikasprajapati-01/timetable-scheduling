import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Add error handling for the auth handler
const handler = NextAuth({
  ...authConfig,
  debug: process.env.NODE_ENV === "development",
  logger: {
    error: (code, metadata) => {
      console.error("NextAuth Error:", code, metadata)
    },
    warn: (code) => {
      console.warn("NextAuth Warning:", code)
    },
    debug: (code, metadata) => {
      if (process.env.NODE_ENV === "development") {
        console.log("NextAuth Debug:", code, metadata)
      }
    }
  }
})

export { handler as GET, handler as POST }