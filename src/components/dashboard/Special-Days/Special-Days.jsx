import { useEffect, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  ImagePlus,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  useAddNewSpecialDaysMutation,
  useDeleteSpecialDaysMutation,
  useGetAllSpecialDaysQuery,
  useUpdateSpecialDaysMutation,
} from "@/app/service/specialDayData";

export default function SpecialDaysPage() {
  const [specialDays, setSpecialDays] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    pdf: "",
    image: null,
  });

  const { data, isError, isLoading, refetch } = useGetAllSpecialDaysQuery();
  const [addNewSpecialDays, { isLoading: isPosting }] =
    useAddNewSpecialDaysMutation();
  const [updateSpecialDays, { isLoading: isEditing }] =
    useUpdateSpecialDaysMutation();
  const [deleteSpecialDays, { isLoading: isDelete }] =
    useDeleteSpecialDaysMutation();

  useEffect(() => {
    if (currentItem) {
      setFormData({
        title: currentItem.title || "",
        date: currentItem.date?.slice(0, 10) || "",
        pdf: currentItem.pdf || "",
        image: null,
        imagePreview: `${import.meta.env.VITE_API_URL}/images/${
          currentItem.image
        }`,
      });
    }
  }, [currentItem]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setSpecialDays(data);
    }
  }, [data]);

  // create special day

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("date", formData.date);
    payload.append("pdf", formData.pdf);
    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      const response = await addNewSpecialDays(payload).unwrap();
      if (response?.status === 201) {
        setIsAddDialogOpen(false);
        setFormData({ title: "", date: "", pdf: "" });
        refetch();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  if (isLoading) return <h1>Loading...</h1>;
  if (isError || !Array.isArray(data))
    return <h1>Oops! Something went wrong.</h1>;

  // Filter special days based on search term
  const filteredDays = specialDays.filter((day) =>
    day.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredDays.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDays = filteredDays.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // edit special day

  const handleEdit = (day) => {
    setCurrentItem(day);
    setFormData({
      title: day.title,
      date: new Date(day.date).toISOString().split("T")[0],
      pdf: day.pdf,
      image: null,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("date", formData.date);
    form.append("pdf", formData.pdf);
    if (formData.image) form.append("image", formData.image);

    try {
      await updateSpecialDays({
        id: currentItem._id,
        updateSpecialDays: form,
      }).unwrap();

      setIsEditDialogOpen(false);
      refetch(); // re-fetch updated
      setFormData({ title: "", date: "", pdf: "", image: null });
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // end edit special day

  //  delete special day

  const handleDelete = (id) => {
    setCurrentItem(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async (e) => {
    e.preventDefault();
    try {
      const { status } = await deleteSpecialDays(currentItem).unwrap();
      if (status === 200) {
        setIsDeleteDialogOpen(false);
        refetch();
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  // end delete

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Special Days</h1>
        <p className="text-muted-foreground">
          Manage special events and celebrations in your academic calendar
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search special days..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className={"cursor-pointer"}>
              <Plus className="mr-2 h-4 w-4" />
              Add Special Day
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] w-full">
            <DialogHeader>
              <DialogTitle>Add New Special Day</DialogTitle>
              <DialogDescription>
                Create a new special day or event for your calendar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pdf">PDF URL</Label>
                <Input
                  id="pdf"
                  placeholder="Enter PDF URL"
                  value={formData.pdf}
                  onChange={(e) =>
                    setFormData({ ...formData, pdf: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop or click to upload
                  </p>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files[0] })
                      }
                      className="w-full"
                    />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {" "}
                {isPosting ? "Saving..." : "Save"}{" "}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {paginatedDays.map((day) => (
          <div
            key={day._id}
            className="overflow-hidden border rounded-md"
          >
            {/* Image */}
            <div className="relative w-full h-28">
              <img
                src={
                  day.image
                    ? `${import.meta.env.VITE_API_URL}/images/${day.image}`
                    : "/placeholder.svg"
                }
                alt={day.title}
                className="w-full h-full object-cover"
              />
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
                      onClick={() => handleEdit(day)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => handleDelete(day._id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Content */}
            <div className="p-2 space-y-1">
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Calendar className="h-3 w-3" />
                {day.date &&
                  new Date(day.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
              </div>
              <h3 className="text-xs font-medium truncate">{day.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredDays.length === 0 && (
        <div className="flex flex-col items-center justify-center border rounded-md p-8">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No special days found</h3>
          <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
            {searchTerm
              ? "Try a different search term"
              : "Create your first special day to get started"}
          </p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className={"cursor-pointer"}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Special Day
          </Button>
        </div>
      )}

      {/* Pagination */}
      {filteredDays.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(startIndex + itemsPerPage, filteredDays.length)}
            </span>{" "}
            of <span className="font-medium">{filteredDays.length}</span> events
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
        <DialogContent className="sm:max-w-[500px] w-full max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Edit Special Day</DialogTitle>
            <DialogDescription>
              Make changes to the special day or event.
            </DialogDescription>
          </DialogHeader>

          {currentItem && (
            <div className="grid gap-4 py-4">
              {/* Title Input */}
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              {/* Date Input */}
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              {/* PDF Input */}
              <div className="grid gap-2">
                <Label htmlFor="edit-pdf">PDF URL</Label>
                <Input
                  id="edit-pdf"
                  value={formData.pdf}
                  onChange={(e) =>
                    setFormData({ ...formData, pdf: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              {/* Image Upload Section */}
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Current Image</Label>
                <div className="relative aspect-video rounded-md overflow-hidden border">
                  <img
                    src={formData.imagePreview || "/placeholder.svg"}
                    alt={formData.title}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Upload Button with Hidden Input */}
                <div className="relative mt-2">
                  <input
                    id="edit-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData((prev) => ({
                          ...prev,
                          image: file,
                          imagePreview: URL.createObjectURL(file),
                        }));
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <label htmlFor="edit-image-upload">
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full sm:w-auto"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Change Image
                    </Button>
                  </label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setCurrentItem(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isEditing}
              className="w-full sm:w-auto"
            >
              {isEditing ? "Saving..." : "Save Changes"}
            </Button>
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
              This will permanently delete this special day. This action cannot
              be undone.
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
              {isDelete ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
