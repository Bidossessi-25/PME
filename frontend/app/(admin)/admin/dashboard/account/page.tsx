'use client'

import React, { useState } from "react"
import { User } from "@/typess"
import { withAuth } from "@/components/withAuth"
import { ChangePasswordSection } from "@/components/changePassword"
type Props = {
  user: User
}

const AccountPage = ({ user }: Props) => {
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email,
    
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSave = async () => {
    try {
      // TODO: appeler PUT /auth/me
      console.log("Updated data:", formData)
      setIsEditing(false)
    } catch (error) {
      console.error("Update failed", error)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground">
          Manage your personal information and security settings
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Avatar + Infos */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {user.firstName?.[0] ?? user.email[0]}
            </div>

            <div>
              <p className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <span className="mt-1 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium">
                {user.role}
              </span>
            </div>
          </div>

          {/* Action */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition"
          >
            {isEditing ? "Cancel" : "Edit profile"}
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-border" />

        {/* Form */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">First name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm disabled:bg-muted"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Last name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm disabled:bg-muted"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-muted"
            />
          </div>
  
  <ChangePasswordSection />
         
        </div>

        {/* Save button */}
        {isEditing && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Save changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default withAuth(AccountPage)
