"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { User } from "@/typess"

export function withAuth<P>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles?: User["role"][]
) {
  return function AuthComponent(props: P) {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await api.get<User>("/auth/me")
          const currentUser = res.data

          // Vérification des rôles
          if (
            allowedRoles &&
            !allowedRoles.includes(currentUser.role)
          ) {
            router.replace("/unauthorizedPage");
            return
          }

          setUser(currentUser)
        } catch (error) {
          router.replace("/login")
        } finally {
          setLoading(false)
        }
      }

      fetchUser()
    }, [router])

    if (loading) {
      return <div>Loading...</div>
    }

    if (!user) {
      return null
    }

    return <WrappedComponent {...props} user={user} />
  }
}
