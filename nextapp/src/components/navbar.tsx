"use client"

import { useState } from "react"
import { Menu, RefreshCw, Search, MessageSquare, User, Settings, BarChart, LogOut } from 'lucide-react'
import Link from "next/link"
import { motion } from "framer-motion"
import Image from 'next/image'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isRefreshHovered, setIsRefreshHovered] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] lg:w-[300px]">
            <nav className="grid gap-4 py-4">
              <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/inbox" className="text-lg font-medium hover:text-primary transition-colors">
                Inbox
              </Link>
              <Link href="/projects" className="text-lg font-medium hover:text-primary transition-colors">
                Projects
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="mr-4 flex flex-1 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <Image 
                src="/pixelcut-export_(2)_upscaled.jpeg" 
                alt="Elevare Logo" 
                width={120} 
                height={30} 
                className="object-contain"
              />
            </div>
          </Link>
          <nav className="hidden lg:flex space-x-4">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/inbox" className="text-sm font-medium hover:text-primary transition-colors">
              Inbox
            </Link>
            <Link href="/projects" className="text-sm font-medium hover:text-primary transition-colors">
              Projects
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          {isSearchOpen ? (
            <motion.div 
              className="relative w-full max-w-sm"
              initial={{ width: 40 }}
              animate={{ width: 200 }}
              transition={{ duration: 0.3 }}
            >
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search conversations" 
                className="pl-8 pr-4 py-2 w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
                onBlur={() => setIsSearchOpen(false)}
                autoFocus
              />
            </motion.div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Open search</span>
            </Button>
          )}
          <motion.div 
            className="relative hidden lg:block w-full max-w-sm"
            animate={{ width: isSearchFocused ? 300 : 200 }}
            transition={{ duration: 0.3 }}
          >
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search conversations" 
              className="pl-8 transition-all duration-300 focus:ring-2 focus:ring-primary"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setIsRefreshHovered(true)}
            onHoverEnd={() => setIsRefreshHovered(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
              onClick={() => window.location.reload()}
            >
              <motion.div
                animate={{ rotate: isRefreshHovered ? 360 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <RefreshCw className="h-5 w-5" />
              </motion.div>
              <span className="sr-only">Refresh</span>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className="flex items-center space-x-2 h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">Chat AI</span>
            </Button>
          </motion.div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="h-8 w-8 rounded-full bg-primary p-0 text-primary-foreground"
                  size="icon"
                >
                  <User className="h-4 w-4" />
                  <span className="sr-only">Open user menu</span>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>John Doe</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/analytics" className="flex items-center">
                  <BarChart className="mr-2 h-4 w-4" />
                  <span>Analytics</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button className="flex items-center text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}