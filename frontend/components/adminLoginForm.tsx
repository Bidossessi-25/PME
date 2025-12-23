"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { adminLoginSchema, AdminLoginInput } from "@/lib/schemas/auth.schema"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const AdminLoginForm = ({
  className,
  ...props
}: React.ComponentProps<"form">) => {
 
const router = useRouter();



  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
  })

  

  const onSubmit = async (data: AdminLoginInput) => {
    try {
        await api.post("/auth/login", data);
        router.push('/admin/dashboard');
        toast.success('Logged in successfully')
    } catch (error) {
        toast.error("Error while signing in your account")
        console.log("Error while login :", error);
    }
    
    
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground text-sm">
            Access your admin dashboard
          </p>
        </div>

        {/* Email */}
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input type="password" {...register("password")} />
          {errors.password && (
            <p className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </Field>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default AdminLoginForm
