declare global {
  namespace Express {
    interface User {
      id: number
      role: string
      username?: string
      email?: string
    }
  }
}
