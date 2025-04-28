import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Edit, ImagePlus, MoreHorizontal, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
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
import { useGetAllBannerQuery } from "@/app/service/bannderData"


export default function CarouselPage() {
  const [images, setImages] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4


  const { data, isError, isLoading } = useGetAllBannerQuery()
  
  
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const slides = data?.[0]?.images || []
      setImages(slides)
    }
  }, [data])   

  if (isLoading) return <h1>Loading...</h1>
  if (isError || !Array.isArray(data)) return <h1>Oops! Something went wrong.</h1>


  // Calculate pagination
  const totalPages = Math.ceil(images.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedImages = images.slice(startIndex, startIndex + itemsPerPage)

  const handleEdit = (image) => {
    setCurrentImage(image)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (image) => {
    setCurrentImage(image)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (currentImage) {
        setImages(images.filter((img) => img.id !== currentImage.id))
        setIsDeleteDialogOpen(false)
    }
}

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Carousel Management</h1>
        <p className="text-muted-foreground">Manage the carousel images displayed on your website</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{images.length} total images</div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className={"cursor-pointer"}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Carousel Image</DialogTitle>
              <DialogDescription>Upload a new image for the carousel. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter image title" />
              </div> */}
              {/* <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter image description" />
              </div> */}
              <div className="grid gap-2">
                <Label htmlFor="image">Image</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button className={"cursor-pointer"} variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className={"cursor-pointer"} onClick={() => setIsAddDialogOpen(false)}>Save Image</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {paginatedImages.map((image, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative aspect-video">
              <img src={`${import.meta.env.VITE_API_URL}/images/${image}` || "/placeholder.svg"} alt={"carousel-img"} fill className="object-cover" />
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(image)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(image)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">{image.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{image.description}</p>
            </CardContent>
          </Card>
        ))}
      </div> */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {paginatedImages.map((image, index) => (
    <Card key={index} className="overflow-hidden">
      <div className="relative aspect-video">
        <img
          src={`${import.meta.env.VITE_API_URL}/images/${image}` || "/placeholder.svg"}
          alt="carousel-img"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm cursor-pointer">
                <MoreHorizontal className="h-4 w-4 " />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(image)} className={"cursor-pointer"}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => handleDelete(image)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  ))}
</div>


      {/* Pagination */}
      {images.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">{Math.min(startIndex + itemsPerPage, images.length)}</span> of{" "}
            <span className="font-medium">{images.length}</span> images
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Carousel Image</DialogTitle>
            <DialogDescription>Make changes to the carousel image. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {currentImage && (
            <div className="grid gap-4 py-4">
              {/* <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" defaultValue={currentImage.title} />
              </div> */}
              {/* <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" defaultValue={currentImage.description} />
              </div> */}
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Current Image</Label>
                <div className="relative aspect-video rounded-md overflow-hidden">
                  <img
                    src={currentImage.image || "/placeholder.svg"}
                    alt={currentImage.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Change Image
                </Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Current Image</Label>
                <div className="relative aspect-video rounded-md overflow-hidden">
                  <img
                    src={currentImage.image || "/placeholder.svg"}
                    alt={currentImage.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Change Image
                </Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Current Image</Label>
                <div className="relative aspect-video rounded-md overflow-hidden">
                  <img
                    src={currentImage.image || "/placeholder.svg"}
                    alt={currentImage.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Change Image
                </Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Current Image</Label>
                <div className="relative aspect-video rounded-md overflow-hidden">
                  <img
                    src={currentImage.image || "/placeholder.svg"}
                    alt={currentImage.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Change Image
                </Button>
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
              This will permanently delete the carousel image. This action cannot be undone.
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
