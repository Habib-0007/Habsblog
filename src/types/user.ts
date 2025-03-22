export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  role: "user" | "admin"
  bio?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  refreshToken?: string
  user?: User
  message?: string
}

