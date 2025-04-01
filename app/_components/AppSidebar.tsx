import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  CircleDollarSign,
  Home,
  Inbox,
  Paintbrush,
  Search,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

const items = [
  {
    title: "WorkSpace",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Design",
    url: "/designs",
    icon: Paintbrush,
  },
  {
    title: "Credits",
    url: "/credits",
    icon: CircleDollarSign,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const path = usePathname();
  console.log(path);
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="">
          <Link href="/">
            <Image
              src={"/logo22.png"}
              alt="logo"
              width={300}
              height={100}
              className="object-cover"
            />
          </Link>
          <h2 className="text-sm text-gray-400 text-center">
            WireFrame To Code
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-5">
              {items.map((item, index) => (
                <a
                  href={item.url}
                  key={index}
                  className={`p-2 text-lg flex gap-2 items-center
                                  hover:bg-gray-100 rounded-lg
                                  ${path == item.url && `bg-gray-200`}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </a>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
