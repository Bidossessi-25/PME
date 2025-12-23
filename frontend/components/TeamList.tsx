'use client'

import { User } from '@/typess'
import React from 'react'
import TeamElement from './TeamElement'
import { toast } from 'sonner'
import api from '@/lib/api'

type TeamListProps = {
  filteredUsers: User[]
   onUserUpdated: (id: string, data: Partial<User>) => Promise<void>
  onUserDeleted?: (id: string) => void
}

const TeamList = ({
  filteredUsers,
  onUserUpdated,
  onUserDeleted,
}: TeamListProps) => {

  // 🔄 Update user (role, isActive, etc.)
  const handleUpdate = async (id: string, data: Partial<User>) => {
    try {
      const res = await api.put(`/users/${id}`, data)

      toast.success('User updated successfully')

      // Optionnel : prévenir le parent (TeamPage)
      // onUserUpdated?.(res.data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to update user')
      throw error 
    }
  }

  // 🗑 Delete user
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`)

      toast.success('User deleted successfully')

      // Optionnel : prévenir le parent
      onUserDeleted?.(id)
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete user')
      throw error
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">First Name</th>
            <th className="p-3 text-left">Last Name</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Active</th>
            <th className="p-3 text-left">Created At</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <TeamElement
                key={user.id}
                user={user}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="text-center py-10 text-2xl font-medium text-gray-500"
              >
                Aucun utilisateur correspondant
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TeamList
