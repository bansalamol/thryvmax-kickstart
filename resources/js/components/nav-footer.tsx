import { useState } from 'react';
import { Icon } from '@/components/icon';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Settings, Users, ChevronDown, ListFilterPlus, Settings2, Key, Shield, KeyIcon, KeyRound } from 'lucide-react';
import { type ComponentPropsWithoutRef } from 'react';

export function NavFooter({
    items,
    className,
    can = { viewRole: false, viewPermission: false, viewUser: false },
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const subMenuItems = [
        ...(can.viewRole ? [{
            title: 'Roles',
            href: '/roles',
            icon: Shield,
        }] : []),
        ...(can.viewPermission ? [{
            title: 'Permissions',
            href: '/permissions',
            icon: KeyRound,
        }] : []),
        ...(can.viewUser ? [{
            title: 'Users',
            href: '/users',
            icon: Users,
        }] : []),
    ];
    return (
        <SidebarGroup {...props} className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                            >
                                <a href={item.href} target="_blank" rel="noopener noreferrer">
                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex justify-between items-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100 w-full"
                        >
                            <div className="flex items-center gap-2">
                                <Icon iconNode={Settings} className="h-5 w-5" />
                                <span>Setup</span>
                            </div>
                            <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </SidebarMenuButton>

                        {/* Submenu for Setup */}
                        {isOpen && (
                            <div className="ml-6 mt-1 space-y-1">
                                {/* Dynamically render submenu items based on permissions */}
                                {subMenuItems.map((subItem) => (
                                    <SidebarMenuItem key={subItem.title}>
                                        <SidebarMenuButton asChild>
                                            <a
                                                href={subItem.href}
                                                className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                                            >
                                                <Icon iconNode={subItem.icon} className="h-4 w-4" />
                                                <span>{subItem.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </div>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
