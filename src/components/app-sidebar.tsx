"use client";
import * as React from "react"
import {
  IconDashboard,
  IconInnerShadowTop,
  IconUsers,
  IconShoppingCart,
  IconTags,
  IconBox,
  IconTruck,
  IconCreditCard,
  IconDiscount,
  IconMessage,
  IconChartLine,
} from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: IconBox,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: IconTags,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: IconShoppingCart,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      title: "Shipping",
      url: "/admin/shipping",
      icon: IconTruck,
    },
    {
      title: "Payments",
      url: "/admin/payments",
      icon: IconCreditCard,
    },
    {
      title: "Discounts",
      url: "/admin/discounts",
      icon: IconDiscount,
    },
    {
      title: "Reviews",
      url: "/admin/reviews",
      icon: IconMessage,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: IconChartLine,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
