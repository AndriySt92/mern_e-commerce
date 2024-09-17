import { create } from 'zustand'
import axios from '../config/axios'
import { toast } from 'react-hot-toast'
import { ISignUpData, IUser } from '../interfaces/userInterface'

interface UserState {
  user: IUser | null
  loading: boolean
  checkingAuth: boolean
  signUp: (data: ISignUpData) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  refreshToken: () => Promise<string | null>
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signUp: async ({ username, email, password, confirmPassword }: ISignUpData): Promise<void> => {
    set({ loading: true })

    if (password !== confirmPassword) {
      set({ loading: false })
      toast.error('Passwords do not match')
      return
    }

    try {
      const res = await axios.post<IUser>('/auth/register', { username, email, password, confirmPassword })
      set({ user: res.data, loading: false })
    } catch (error: any) {
      set({ loading: false })
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true })

    try {
      const res = await axios.post<IUser>('/auth/login', { email, password })
      set({ user: res.data, loading: false })
    } catch (error: any) {
      set({ loading: false })
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout')
      set({ user: null })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred during logout')
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true })
    try {
      const res = await axios.get<IUser>('/auth/profile')
      set({ user: res.data, checkingAuth: false })
    } catch (error: any) {
      console.log(error.message)
      set({ checkingAuth: false, user: null })
    }
  },

  refreshToken: async (): Promise<string | null> => {
    if (get().checkingAuth) return null

    set({ checkingAuth: true })
    try {
      const res = await axios.post<{ token: string }>('/auth/refresh-token')
      set({ checkingAuth: false })
      return res.data.token
    } catch (error: any) {
      set({ user: null, checkingAuth: false })
      throw error
    }
  },
}))

// Axios interceptor for token refresh
let refreshPromise: Promise<string | null> | null = null

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise
          return axios(originalRequest)
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken()
        await refreshPromise
        refreshPromise = null

        return axios(originalRequest)
      } catch (refreshError) {
        // If refresh fails, logout the user
        useUserStore.getState().logout()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)
