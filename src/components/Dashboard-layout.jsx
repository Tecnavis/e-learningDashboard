import { useState, useEffect } from "react"
import {
  Bell,
  BookOpen,
  Calendar,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"


function NavItem({ href, icon, title, isActive, isMobile = false, onClick }) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              isMobile ? "justify-start" : "justify-center xl:justify-start",
            )}
          >
            {icon}
            <span className={cn("text-base font-medium", !isMobile && "hidden xl:inline-flex")}>{title}</span>
          </NavLink>
        </TooltipTrigger>
        {!isMobile && (
          <TooltipContent side="right" className="xl:hidden">
            {title}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

export default function DashboardLayout({ children }) {
const location = useLocation();
const pathname = location.pathname;

  const router = useNavigate()
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("admin")
    navigate("/sign-in")
  }

  const navItems = [
    { href: "/", icon: <LayoutDashboard className="h-5 w-5" />, title: "Dashboard" },
    { href: "/users", icon: <User className="h-5 w-5" />, title: "Users" },
    { href: "/carousel", icon: <ImageIcon className="h-5 w-5" />, title: "Carousel" },
    { href: "/syllabus", icon: <BookOpen className="h-5 w-5" />, title: "Syllabus" },
    { href: "/special-days", icon: <Calendar className="h-5 w-5" />, title: "Special Days" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed hidden h-full w-16 flex-col border-r bg-card px-2 py-4 xl:w-64 md:flex">
        <div className="flex h-14 items-center justify-center xl:justify-start xl:px-4">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden text-lg font-bold xl:inline-flex">E-Learning</span>
          </NavLink>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={item.title}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 px-2">
          <Button
            variant="ghost"
            size="icon"
            className="justify-center xl:justify-start xl:w-full xl:px-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {isMounted && theme === "dark" ? (
              <>
                <Sun className="h-5 w-5 xl:mr-2" />
                <span className="hidden xl:inline-flex">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5 xl:mr-2" />
                <span className="hidden xl:inline-flex">Dark Mode</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="justify-center xl:justify-start xl:w-full xl:px-2"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 xl:mr-2" />
            <span className="hidden xl:inline-flex">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <NavLink to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">E-Learning</span>
            </NavLink>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="mt-4 flex flex-col gap-1 px-2">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                title={item.title}
                isActive={pathname === item.href}
                isMobile
                onClick={() => setIsMobileNavOpen(false)}
              />
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-2 p-4 border-t">
            <Button
              variant="ghost"
              className="cursor-pointer justify-start w-full"
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark")
                setIsMobileNavOpen(false)
              }}
            >
              {isMounted && theme === "dark" ? (
                <>
                  <Sun className="h-5 w-5 mr-2 cursor-pointer" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 mr-2 cursor-pointer" />
                  Dark Mode
                </>
              )}
            </Button>

            <Button variant="ghost" className="cursor-pointer justify-start w-full" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-2 cursor-pointer"  />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 md:ml-16 xl:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex-1 md:hidden"></div>

          <div className="flex items-center gap-4 md:ml-auto">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="font-medium text-sm">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@example.com</p>
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <NavLink to="#">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6"> <Outlet /></div>
      </main>
    </div>
  )
}
