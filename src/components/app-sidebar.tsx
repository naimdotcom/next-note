"use client";

import * as React from "react";
import {
  Command,
  LifeBuoy,
  Send,
  Settings2,
  Trash2,
  Archive,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { usePathname, useRouter } from "next/navigation";
import supabase from "@/utils/supebase/client";
import { getActiveUser, getLoggedinUserIndex } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
// const data = ;
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [data, setData] = React.useState({
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
      items: [],
    },
    navMain: [
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
      },
    ],
    navSecondary: [
      {
        title: "Archive",
        url: "#",
        icon: Archive,
      },
      {
        title: "Trash",
        url: "#",
        icon: Trash2,
      },
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: [
      // {
      //   name: "Design Engineering",
      //   url: "#",
      //   icon: Frame,
      // },
      // {
      //   name: "Sales & Marketing",
      //   url: "#",
      //   icon: PieChart,
      // },
      // {
      //   name: "Travel",
      //   url: "#",
      //   icon: Map,
      // },
    ],
  });
  const [user, setUser] = React.useState<any>({});
  const activeUser = getActiveUser();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        router.push("/signin"); // Redirect to login if not authenticated
      } else {
        const userIndex = getLoggedinUserIndex(
          data.user.email ? data.user.email : ""
        );

        if (userIndex == -1) {
          toast({
            title: "something went wrong",
            variant: "destructive",
          });
          return;
        }
        setUser(data.user); // Set user details
      }
    };

    fetchUser();
  }, [router]);
  // console.log("user and active", user, activeUser, pathname);s
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Note App</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user?.user_metadata ? user?.user_metadata : {}} />
      </SidebarFooter>
    </Sidebar>
  );
}
