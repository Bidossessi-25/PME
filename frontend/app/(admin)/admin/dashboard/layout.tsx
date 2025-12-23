'use client'

import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { useState, useEffect } from 'react'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { toast } from 'sonner'
import api from '@/lib/api'
import { AdminLayoutProps, User } from '@/typess'
import { withAuth } from '@/components/withAuth'


const AdminLayout = ({
  children,
  user
}: AdminLayoutProps) => {


  return (
   <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default withAuth(
  AdminLayout,
  ["ADMIN", "SUPER_ADMIN"]
)