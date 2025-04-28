import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock syllabus data
const syllabusData = [
  {
    id: 1,
    class: "Class 1",
    subject: "Mathematics",
    chapter: "Numbers",
    description: "Introduction to numbers and counting",
    status: "Active",
  },
  {
    id: 2,
    class: "Class 1",
    subject: "English",
    chapter: "Alphabets",
    description: "Learning the English alphabet",
    status: "Active",
  },
  {
    id: 3,
    class: "Class 2",
    subject: "Science",
    chapter: "Plants",
    description: "Introduction to plant life",
    status: "Active",
  },
  {
    id: 4,
    class: "Class 2",
    subject: "Mathematics",
    chapter: "Addition",
    description: "Basic addition operations",
    status: "Active",
  },
  {
    id: 5,
    class: "Class 3",
    subject: "Science",
    chapter: "Animals",
    description: "Introduction to animal kingdom",
    status: "Draft",
  },
  {
    id: 6,
    class: "Class 3",
    subject: "Social Studies",
    chapter: "Community",
    description: "Understanding communities",
    status: "Active",
  },
  {
    id: 7,
    class: "Class 4",
    subject: "Mathematics",
    chapter: "Fractions",
    description: "Introduction to fractions",
    status: "Active",
  },
  {
    id: 8,
    class: "Class 4",
    subject: "English",
    chapter: "Grammar",
    description: "Basic grammar rules",
    status: "Draft",
  },
  {
    id: 9,
    class: "Class 5",
    subject: "Science",
    chapter: "Solar System",
    description: "Introduction to solar system",
    status: "Active",
  },
  {
    id: 10,
    class: "Class 5",
    subject: "Mathematics",
    chapter: "Geometry",
    description: "Basic geometric shapes",
    status: "Active",
  },
  {
    id: 11,
    class: "Class 6",
    subject: "English",
    chapter: "Literature",
    description: "Introduction to literature",
    status: "Draft",
  },
  {
    id: 12,
    class: "Class 6",
    subject: "Social Studies",
    chapter: "History",
    description: "Ancient civilizations",
    status: "Active",
  },
]

export default function SyllabusPage() {
  const [syllabus, setSyllabus] = useState(syllabusData)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const itemsPerPage = 6

  // Filter syllabus based on search term
  const filteredSyllabus = syllabus.filter(
    (item) =>
      item.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.chapter.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredSyllabus.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSyllabus = filteredSyllabus.slice(startIndex, startIndex + itemsPerPage)

  const handleEdit = (item) => {
    setCurrentItem(item)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (item) => {
    setCurrentItem(item)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (currentItem) {
      setSyllabus(syllabus.filter((item) => item.id !== currentItem.id))
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Syllabus Management</h1>
        <p className="text-muted-foreground">Manage classes, subjects, and chapters for your curriculum</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search syllabus..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filter syllabus</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Syllabus
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Syllabus</DialogTitle>
                <DialogDescription>Add a new class, subject, or chapter to your curriculum.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="class">Class</Label>
                    <Select>
                      <SelectTrigger id="class">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="class1">Class 1</SelectItem>
                        <SelectItem value="class2">Class 2</SelectItem>
                        <SelectItem value="class3">Class 3</SelectItem>
                        <SelectItem value="class4">Class 4</SelectItem>
                        <SelectItem value="class5">Class 5</SelectItem>
                        <SelectItem value="class6">Class 6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="social">Social Studies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="chapter">Chapter</Label>
                  <Input id="chapter" placeholder="Enter chapter name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter chapter description" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="active">
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Add Syllabus</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSyllabus.length > 0 ? (
              paginatedSyllabus.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.class}</TableCell>
                  <TableCell>{item.subject}</TableCell>
                  <TableCell>{item.chapter}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.description}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Active" ? "success" : "secondary"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No syllabus items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredSyllabus.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredSyllabus.length)}</span> of{" "}
            <span className="font-medium">{filteredSyllabus.length}</span> items
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Syllabus</DialogTitle>
            <DialogDescription>Make changes to the syllabus item.</DialogDescription>
          </DialogHeader>
          {currentItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-class">Class</Label>
                  <Select defaultValue={currentItem.class.toLowerCase().replace(" ", "")}>
                    <SelectTrigger id="edit-class">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class1">Class 1</SelectItem>
                      <SelectItem value="class2">Class 2</SelectItem>
                      <SelectItem value="class3">Class 3</SelectItem>
                      <SelectItem value="class4">Class 4</SelectItem>
                      <SelectItem value="class5">Class 5</SelectItem>
                      <SelectItem value="class6">Class 6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-subject">Subject</Label>
                  <Select defaultValue={currentItem.subject.toLowerCase()}>
                    <SelectTrigger id="edit-subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="social">Social Studies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-chapter">Chapter</Label>
                <Input id="edit-chapter" defaultValue={currentItem.chapter} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" defaultValue={currentItem.description} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={currentItem.status.toLowerCase()}>
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this syllabus item. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
