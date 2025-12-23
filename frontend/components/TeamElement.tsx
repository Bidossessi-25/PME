import React, { useState } from "react"
import { User, Role } from "@/typess"
import { toast } from "sonner"
import Copy from "./Copy"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type TeamElementProps = {
  user: User
  onUpdate: (id: string, data: Partial<User>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const TeamElement = ({ user, onUpdate, onDelete }: TeamElementProps) => {
  const [role, setRole] = useState<Role>(user.role)
  const [isActive, setIsActive] = useState<boolean>(user.isActive)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const handleSave = async () => {
    try {
      await onUpdate(user.id, { role, isActive })
      toast.success("User updated")
      
      setOpenEdit(false)
      window.location.reload();
    } catch {
      toast.error("Update failed")
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(user.id)
      toast.success("User deleted")
      setOpenDelete(false)
      window.location.reload()
    } catch {
      toast.error("Delete failed")
    }
  }

  return (
    <>
      {/* TABLE ROW */}
      <tr className="border-t hover:bg-muted/50">
        <td className="p-3"><Copy title={user.id} /></td>
        <td className="p-3">{user.email}</td>
        <td className="p-3">{user.firstName ?? "-"}</td>
        <td className="p-3">{user.lastName ?? "-"}</td>
        <td className="p-3">{user.role}</td>
        <td className="p-3">
          {user.isActive ? (
            <span className="text-green-600">Active</span>
          ) : (
            <span className="text-red-500">Inactive</span>
          )}
        </td>
        <td className="p-3">
          {new Date(user.createdAt).toLocaleDateString()}
        </td>

        {/* ACTIONS */}
        <td className="p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">⋮</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setOpenDelete(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      {/* EDIT DIALOG */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              Modify role or activation status
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Role</Label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as Role)}
                className="w-full border rounded-md p-2 mt-1"
              >
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="ADMIN">ADMIN</option>
                <option value="PME">PME</option>
                <option value="FINANCIER">FINANCIER</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={isActive}
                onCheckedChange={val => setIsActive(Boolean(val))}
              />
              <Label>Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Delete user
            </DialogTitle>
            <DialogDescription>
              This action is irreversible.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TeamElement
