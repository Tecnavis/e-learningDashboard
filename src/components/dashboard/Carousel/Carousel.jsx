import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  ImagePlus,
  MoreHorizontal,
  Plus,
  Trash,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useAddNewBannerMutation,
  useDeleteABannerMutation,
  useDeleteAllBannerMutation,
  useGetAllBannerQuery,
  useUpdateBannerMutation,
} from "@/app/service/bannderData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CarouselPage() {
  const [images, setImages] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [editImage, setEditImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const fileInputRef = useRef(null);

  const { data, isError, isLoading, refetch } = useGetAllBannerQuery();
  const [addNewBanner, { isLoading: isPosting }] = useAddNewBannerMutation();
  const [updateBanner, { isLoading: isEditing }] = useUpdateBannerMutation();
  const [deleteABanner, { isLoading: isDeleting }] = useDeleteABannerMutation();
  const [deleteAllBanner, { isLoading: isDeleteAll }] =
    useDeleteAllBannerMutation();

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const slides = data?.[0]?.images || [];
      setImages(slides);
    }
  }, [data]);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError || !Array.isArray(data))
    return <h1>Oops! Something went wrong.</h1>;

  const totalPages = Math.ceil(images.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedImages = images.slice(startIndex, startIndex + itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedImages.length === 0) return;

    const formData = new FormData();
    selectedImages.forEach((file) => formData.append("images", file));

    try {
      // Send the form data to the backend
      const response = await addNewBanner(formData);

      // Ensure the backend response contains the images array
      if (response?.data?.status === 200) {
        setIsAddDialogOpen(false);
        setSelectedImages([]);
        // Append the newly uploaded images to the existing list
        setImages((prevImages) => [...prevImages, ...response.data.images]);
      }
      refetch();
    } catch (error) {
      console.error("Failed to upload images:", error);
    }
  };

  // edit  image

  const previewSrc = editImage
    ? URL.createObjectURL(editImage)
    : `${import.meta.env.VITE_API_URL}/images/${currentImage?.image}`;

  const handleEdit = (image, index) => {
    setCurrentImage({ image, index });
    setIsEditDialogOpen(true);
  };

  // Trigger file input when the button is clicked
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
    }
  };

  const handleEditImage = async (e) => {
    e.preventDefault();
    if (editImage === null) return;

    const formData = new FormData();
    formData.append("image", editImage);

    try {
      const response = await updateBanner({
        id: data?.[0]?._id,
        index: currentImage?.index,
        updateBanner: formData,
      });

      if (response?.data?.status === 200) {
        setIsAddDialogOpen(false);
        setEditImage(null);
        setIsEditDialogOpen(false);
        refetch();
      }
    } catch (error) {
      console.error("Failed to edit images:", error);
    }
  };

  const handleCancel = () => {
    setEditImage(null);
    setIsEditDialogOpen(false);
    setIsAddDialogOpen(false);
  };

  // end edit

  // delete a bannere
  const handleDelete = (image, index) => {
    setCurrentImage({ image, index });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await deleteABanner({
        id: data?.[0]?._id,
        index: currentImage?.index,
      });

      if (response?.data?.status === 200) {
        setIsDeleteDialogOpen(false);
        refetch(); // Refresh the banners
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };
  // end delete

  // delete all banner

  const handleDeleteAll = () => {
    setIsDeleteAllDialogOpen(true);
  };

  const confirmDeleteAll = async (e) => {
    e.preventDefault();

    try {
      const response = await deleteAllBanner();

      if (response?.data?.status === 200) {
        setIsDeleteAllDialogOpen(false);
        refetch(); // Refresh the banners
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  // end dlelete all

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Carousel Management
        </h1>
        <p className="text-muted-foreground">
          Manage the carousel images displayed on your website
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {images.length} images
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <div className="flex gap-1">
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4 bgre" />
                Add New Image
              </Button>
            </DialogTrigger>

            <div>
              <Button
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                onClick={handleDeleteAll}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete All
              </Button>
            </div>
          </div>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Carousel Image</DialogTitle>
              <DialogDescription>
                Upload new images for the carousel. Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="images">Upload Images</Label>
                <label className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload
                  </p>
                  <Upload className="h-4 w-4" />

                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        setSelectedImages((prevImages) => [
                          ...prevImages,
                          ...Array.from(e.target.files),
                        ]);
                      }
                    }}
                  />
                </label>

                {selectedImages.length > 0 && (
                  <div className="grid gap-2 mt-4">
                    <Label>Preview</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedImages.map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-32 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className={"cursor-pointer"}
              >
                Cancel
              </Button>
              <Button
                className={"cursor-pointer"}
                onClick={handleSubmit}
                disabled={isPosting}
              >
                {isPosting ? "Saving..." : "Save Image"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {paginatedImages.map((image, index) => (
          <div
            key={index}
            className="relative w-full h-40 rounded-md overflow-hidden border"
          >
            {/* Image fills the card completely */}
            <img
              src={
                image
                  ? `${import.meta.env.VITE_API_URL}/images/${image}`
                  : "/placeholder.svg"
              }
              alt="carousel-img"
              className="w-full h-full object-cover"
            />

            {/* Dropdown menu at top-right */}
            <div className="absolute top-1 right-1 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer p-1"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleEdit(image, index)}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    onClick={() => handleDelete(image, index)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {images.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(startIndex + itemsPerPage, images.length)}
            </span>{" "}
            of <span className="font-medium">{images.length}</span> images
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
            <DialogDescription>
              Make changes to the carousel image. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {currentImage && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Current Image</Label>
                <div className="relative aspect-video rounded-md overflow-hidden">
                  <img
                    src={previewSrc}
                    alt={currentImage?.title || "Image preview"}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleButtonClick}
                >
                  <Upload className="mr-2 h-4 w-4" />

                  {isEditing ? "Saving..." : "Change Image"}
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleEditImage}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the carousel image. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={"cursor-pointer"}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation all */}
      <AlertDialog
        open={isDeleteAllDialogOpen}
        onOpenChange={setIsDeleteAllDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all carousel image. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={"cursor-pointer"}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleteAll ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
