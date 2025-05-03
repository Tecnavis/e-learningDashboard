import { useEffect, useState } from "react"
import {
  BookOpen,
  Calendar,
  ImageIcon,
  TrendingUp,
  User
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useGetAllUserQuery } from "@/app/service/userData"
import { useGetAllSyllbusQuery } from "@/app/service/syllbusData"
import { useGetAllSpecialDaysQuery } from "@/app/service/specialDayData"
import { useGetAllBannerQuery } from "@/app/service/bannderData"

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

  const {
    data: usersData,
    isLoading: usersLoading
  } = useGetAllUserQuery()

  const {
    data: syllabusData,
    isLoading: syllabusLoading
  } = useGetAllSyllbusQuery()

  const {
    data: specialDaysData,
    isLoading: specialLoading
  } = useGetAllSpecialDaysQuery()

  const {
    data: bannerData,
    isLoading: bannerLoading
  } = useGetAllBannerQuery()

  useEffect(() => {
    if (usersData && Array.isArray(usersData)) {
      animateValue(0, usersData.length, 1500, setUsersCount)
    }
    if (syllabusData && Array.isArray(syllabusData)) {
      animateValue(0, syllabusData.length, 1500, setSyllabusCount)
    }
    if (specialDaysData && Array.isArray(specialDaysData)) {
      animateValue(0, specialDaysData.length, 1500, setSpecialDaysCount)
    }
    if (bannerData && Array.isArray(bannerData)) {
      animateValue(0, bannerData.length, 1500, setCarouselCount)
    }

    setTimeout(() => setProgress(100), 500)
  }, [usersData, syllabusData, specialDaysData, bannerData])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your e-learning admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Users Card */}
        <StatCard
          title="Total Users"
          icon={<User className="h-4 w-4 text-muted-foreground" />}
          value={usersCount}
          change="+12%"
          footer="from last month"
          progress={75}
        />

        {/* Carousel Images Card */}
        <StatCard
          title="Carousel Images"
          icon={<ImageIcon className="h-4 w-4 text-muted-foreground" />}
          value={carouselCount}
          change="+2"
          footer="new this week"
          progress={60}
        />

        {/* Syllabus Card */}
        <StatCard
          title="Syllabus Items"
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
          value={syllabusCount}
          change="+8"
          footer="from last week"
          progress={85}
        />

        {/* Special Days Card */}
        <StatCard
          title="Special Days"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          value={specialDaysCount}
          change="+1"
          footer="new this month"
          progress={40}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Weekly Activity Chart */}
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
                          transform: progress ? "translateY(0)" : "translateY(20px)"
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

            {/* Recent Activities */}
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
                    { action: "User profile updated", time: "2 days ago", type: "user" }
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
      </Tabs>
    </div>
  )
}

// Reusable StatCard component
function StatCard({ title, icon, value, change, footer, progress }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
          <span className="text-emerald-500">{change}</span>
          <span className="ml-1">{footer}</span>
        </div>
        <Progress value={progress} className="h-1 mt-3" />
      </CardContent>
    </Card>
  )
}
