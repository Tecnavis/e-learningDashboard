
import { useEffect, useState } from "react"
import { BookOpen, Calendar, ChevronUp, ImageIcon, TrendingUp, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Animation utility
const animateValue = (start, end, duration, setter) => {
  let startTimestamp = null
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp
    const progress = Math.min((timestamp - startTimestamp) / duration, 1)
    setter(Math.floor(progress * (end - start) + start))
    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }
  window.requestAnimationFrame(step)
}

export default function DashboardPage() {
  const [usersCount, setUsersCount] = useState(0)
  const [carouselCount, setCarouselCount] = useState(0)
  const [syllabusCount, setSyllabusCount] = useState(0)
  const [specialDaysCount, setSpecialDaysCount] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate stats on load
    animateValue(0, 1250, 2000, setUsersCount)
    animateValue(0, 12, 2000, setCarouselCount)
    animateValue(0, 48, 2000, setSyllabusCount)
    animateValue(0, 8, 2000, setSpecialDaysCount)

    // Animate progress bars
    setTimeout(() => setProgress(75), 500)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your e-learning admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">+12%</span>
              <span className="ml-1">from last month</span>
            </div>
            <Progress value={75} className="h-1 mt-3" />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Carousel Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carouselCount}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ChevronUp className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">+2</span>
              <span className="ml-1">new this week</span>
            </div>
            <Progress value={60} className="h-1 mt-3" />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Syllabus Items</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syllabusCount}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">+8</span>
              <span className="ml-1">from last week</span>
            </div>
            <Progress value={85} className="h-1 mt-3" />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Special Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{specialDaysCount}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ChevronUp className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">+1</span>
              <span className="ml-1">new this month</span>
            </div>
            <Progress value={40} className="h-1 mt-3" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>User engagement over the past 7 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-end justify-between p-6">
                  {[40, 65, 50, 80, 60, 55, 75].map((height, i) => (
                    <div key={i} className="relative h-full flex items-end">
                      <div
                        className="w-8 bg-primary rounded-t-sm transition-all duration-500"
                        style={{
                          height: `${height}%`,
                          opacity: progress ? 1 : 0,
                          transform: progress ? "translateY(0)" : "translateY(20px)",
                        }}
                      />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest actions in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New user registered", time: "2 minutes ago", type: "user" },
                    { action: "Carousel image updated", time: "1 hour ago", type: "carousel" },
                    { action: "New syllabus added", time: "3 hours ago", type: "syllabus" },
                    { action: "Special day created", time: "Yesterday", type: "special" },
                    { action: "User profile updated", time: "2 days ago", type: "user" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className={`rounded-full p-2 ${
                          item.type === "user"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                            : item.type === "carousel"
                              ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                              : item.type === "syllabus"
                                ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
                                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                        }`}
                      >
                        {item.type === "user" ? (
                          <User className="h-4 w-4" />
                        ) : item.type === "carousel" ? (
                          <ImageIcon className="h-4 w-4" />
                        ) : item.type === "syllabus" ? (
                          <BookOpen className="h-4 w-4" />
                        ) : (
                          <Calendar className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{item.action}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analytics will be displayed here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Reports dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
