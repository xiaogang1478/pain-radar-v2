'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mainNav, dashboardNav } from '@/config/navigation';

export function Header() {
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();
  
  const handleLogout = async () => {
    await logout.mutateAsync();
    window.location.href = '/';
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            痛点雷达
          </div>
          <Badge variant="secondary" className="text-xs">
            中国版 PainHunt
          </Badge>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        
        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      {user.nickname?.[0] || user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="text-sm font-medium">{user.nickname || user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {dashboardNav.map((item) => (
                  <DropdownMenuItem key={item.href}>
                    <Link href={item.href} className="w-full">{item.title}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" href="/login">登录</Button>
              <Button href="/register">注册</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
