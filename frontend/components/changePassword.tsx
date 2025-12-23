import { useForm } from "react-hook-form"
import api from "@/lib/api"
import { User } from "@/typess"

type PasswordFormData = {
  currentPassword: string
  newPassword: string
}



export const ChangePasswordSection = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<PasswordFormData>()

  const currentPassword = watch("currentPassword")

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await api.put(`/auth/change-password`, data)
      reset()
      alert("Password updated successfully")
    } catch (error) {
      console.error("Password update failed", error)
      alert("Invalid current password")
    }
  }

  return (
    <div className="rounded-2xl border bg-background p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Security</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Change your password
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current password */}
        <div>
          <label className="text-sm font-medium">Current password</label>
          <input
            type="password"
            {...register("currentPassword", { required: true })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Enter current password"
          />
        </div>

        {/* New password (shown only if current password exists) */}
        {currentPassword && currentPassword.length >= 4 && (
          <div>
            <label className="text-sm font-medium">New password</label>
            <input
              type="password"
              {...register("newPassword", {
                required: true,
                minLength: 8,
              })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="New password (min 8 characters)"
            />
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            Update password
          </button>
        </div>
      </form>
    </div>
  )
}
