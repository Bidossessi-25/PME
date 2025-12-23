'use client'

import React, { useEffect, useState, useMemo } from 'react'
import api from '@/lib/api'
import { User, Role } from '@/typess'
import { toast } from 'sonner'
import TeamList from '@/components/TeamList'

/* ================= TYPES ================= */

type Filters = {
  role: Role | 'all'
  isActive: boolean | 'all'
  date: 'all' | 'week' | 'month' | 'year'
}



const TeamPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState<Filters>({
    role: 'all',
    isActive: 'all',
    date: 'all',
  })

  const [sortRecent, setSortRecent] = useState(true)

  useEffect(()=>{
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await api.get<User[]>('/users')
      setUsers(data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  fetchUsers();
  },[])

  




  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await api.delete(`/users/${id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
      toast.success('User deleted')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete user')
    }
  }

  const handleUpdate = async (id: string, data: Partial<User>) => {
    try {
      const { data: updatedUser } = await api.put<User>(
        `/users/${id}`,
        data
      )

      setUsers(prev =>
        prev.map(user =>
          user.id === id ? { ...user, ...updatedUser } : user
        )
      )

      toast.success('User updated')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update user')
      throw error
    }
  }

  /* ================= FILTERS & SORT ================= */

  const filteredUsers = useMemo(() => {
    const now = new Date()

    return users
      .filter(user =>
        filters.role === 'all' ? true : user.role === filters.role
      )
      .filter(user =>
        filters.isActive === 'all'
          ? true
          : user.isActive === filters.isActive
      )
      .filter(user => {
        if (filters.date === 'all') return true

        const createdAt = new Date(user.createdAt)

        switch (filters.date) {
          case 'week': {
            const weekAgo = new Date(now)
            weekAgo.setDate(now.getDate() - 7)
            return createdAt >= weekAgo
          }

          case 'month':
            return (
              createdAt.getMonth() === now.getMonth() &&
              createdAt.getFullYear() === now.getFullYear()
            )

          case 'year':
            return createdAt.getFullYear() === now.getFullYear()

          default:
            return true
        }
      })
      .sort((a, b) =>
        sortRecent
          ? new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
      )
  }, [users, filters, sortRecent])

  /* ================= RENDER ================= */

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Team Management</h1>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 mb-6">

        {/* ROLE */}
        <select
          value={filters.role}
          onChange={e =>
            setFilters(prev => ({
              ...prev,
              role: e.target.value as Role | 'all',
            }))
          }
          className="border p-2 rounded"
        >
          <option value="all">All Roles</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          <option value="ADMIN">ADMIN</option>
          <option value="PME">PME</option>
          <option value="FINANCIER">FINANCIER</option>
        </select>

        {/* STATUS */}
        <select
          value={filters.isActive.toString()}
          onChange={e =>
            setFilters(prev => ({
              ...prev,
              isActive:
                e.target.value === 'all'
                  ? 'all'
                  : e.target.value === 'true',
            }))
          }
          className="border p-2 rounded"
        >
          <option value="all">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* DATE */}
        <select
          value={filters.date}
          onChange={e =>
            setFilters(prev => ({
              ...prev,
              date: e.target.value as Filters['date'],
            }))
          }
          className="border p-2 rounded"
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>

        {/* SORT */}
        <button
          onClick={() => setSortRecent(prev => !prev)}
          className="border p-2 rounded"
        >
          Sort: {sortRecent ? 'Recent' : 'Oldest'}
        </button>
      </div>

      {/* LIST */}
      <TeamList
        filteredUsers={filteredUsers}
        onUserDeleted={handleDelete}
        onUserUpdated={handleUpdate}
      />
    </div>
  )
}

export default TeamPage
