"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { HomeIcon } from "lucide-react";

export default function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Remove empty items & split by "/"
  const segments = pathname
    .split("/")
    .filter((s) => s.length > 0);

  // Build href for each segment
  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin/dashboard"><HomeIcon size={17}/></Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.length > 0 && <BreadcrumbSeparator />}

        {/* Dynamic breadcrumbs */}
       {crumbs.map((crumb, index) => (
  <React.Fragment key={crumb.href}>
    <BreadcrumbItem>
      {index === crumbs.length - 1 ? (
        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
      ) : (
        <BreadcrumbLink asChild>
          <Link href={crumb.href}>{crumb.label}</Link>
        </BreadcrumbLink>
      )}
    </BreadcrumbItem>

    {index < crumbs.length - 1 && <BreadcrumbSeparator />}
  </React.Fragment>
))}

      </BreadcrumbList>
    </Breadcrumb>
  );
}
