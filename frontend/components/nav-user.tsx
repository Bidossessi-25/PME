"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconHistory,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { User } from "@/typess"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
export function NavUser({
  user,
}: {
  user: User
}) {
  const { isMobile } = useSidebar()
    
   const router =useRouter()
  const handleLogout = async () =>{
 try {
 
  await api.post('/auth/logout');
  toast.success("Deconnected")
  router.push('/admin/auth/login')
 } catch (error) {
  toast.error('Une erreur est survenue lors de la deconnexion')
  console.log(error);
 }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">

                <AvatarFallback>{user?.firstName?.substring(0 , 2).toUpperCase()}</AvatarFallback>
              </Avatar>

           
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{`${user?.firstName }  ${user?.lastName}`}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {/* <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar> */}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{`${user?.firstName }  ${user?.lastName}`}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                <Link href={`/admin/dashboard/account`}>
                Mon compte
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
          
                <IconHistory />
                Historique des activites
              </DropdownMenuItem>
              
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
             Se Deconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
