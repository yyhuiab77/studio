"use client";
import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/app-logo';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  FileText,
  Building,
  Calendar,
  Users,
  HardHat,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/incidents', icon: FileText, label: 'Incidents' },
  { href: '/assets', icon: Building, label: 'Assets' },
  { href: '/schedule', icon: Calendar, label: 'Schedule' },
  { href: '/users', icon: Users, label: 'Users', requiredRole: 'Operations Manager' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredNavItems = useMemo(() => {
    if (!user) return [];
    return navItems.filter(item => {
      if (!item.requiredRole) return true;
      return user.role === item.requiredRole;
    });
  }, [user]);

  if (!user) {
    // AuthProvider will handle redirect, this is a fallback
    return null;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <AppLogo className="size-8 text-primary" />
            <span className="text-xl font-headline font-semibold">Lift Dashboard</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <Separator className="my-2" />
        <SidebarFooter>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <HardHat /> <span>Help & Support</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
