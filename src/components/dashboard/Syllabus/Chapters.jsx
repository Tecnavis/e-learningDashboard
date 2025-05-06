import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Plus,
  Search,
  Star,
  MoreHorizontal,
  Trash2,
  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  useAddSyllbusClassSubjectsChaptersMutation,
  useDeleteSyllbusAClassSubjectsChaptersMutation,
  useEditSyllbusClassSubjectsChaptersMutation,
} from "@/app/service/syllbusData";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Chapters({
  isLoading,
  chapters,
  id,
  no,
  chapterId,
  refetch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [chapter, setChapter] = useState("");
  const [description, setDescription] = useState("");
  const [pdf, setPdf] = useState("");
  const [video, setVideo] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    document: {
      pdf: "",
      video: "",
    },
  });

  const navigate = useNavigate();
  const [addSyllbusClassSubjectsChapters, { isLoading: isPosting }] =
    useAddSyllbusClassSubjectsChaptersMutation();
  const [deleteSyllbusAClassSubjectsChapter] =
    useDeleteSyllbusAClassSubjectsChaptersMutation();
  const [editSyllbusClassSubjectsChapters, { isLoading: isEditing }] =
    useEditSyllbusClassSubjectsChaptersMutation();

  const filteredLessons = chapters?.filter((lesson) => {
    const query = searchQuery.toLowerCase();
    return (
      lesson.title.toLowerCase().includes(query) ||
      lesson.description.toLowerCase().includes(query)
    );
  });

  const handleAddSyllabus = async (e) => {
    e?.preventDefault?.();
    try {
      const newClassData = {
        chapters: [
          {
            title: chapter,
            description,
            document: {
              pdf,
              video,
            },
          },
        ],
      };
      const response = await addSyllbusClassSubjectsChapters({
        id,
        no,
        subjectId: chapterId,
        addSyllbusClassSubjectsChapters: newClassData,
      }).unwrap();

      if (response?.status === 200) {
        setChapter("");
        setDescription("");
        setPdf("");
        setVideo("");
        setIsAddDialogOpen(false);
        refetch();
      }
    } catch (error) {
      alert(`Error: ${error?.data?.message || "Something went wrong."}`);
    }
  };

  const handleDelete = async (chapterIdToDelete) => {
    try {
      const { status } = await deleteSyllbusAClassSubjectsChapter({
        id,
        no,
        subjectId: chapterId,
        chapterId: chapterIdToDelete,
      }).unwrap();
      if (status === 200) {
        refetch();
      }
    } catch (error) {
      console.error("Failed to delete chapter:", error);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      document: {
        pdf: item.document?.pdf || "",
        video: item.document?.video || "",
      },
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        chapters: [
          {
            title: formData.title,
            description: formData.description,
            document: formData.document,
          },
        ],
      };
  
      await editSyllbusClassSubjectsChapters({
        id,
        no,
        subjectId: chapterId,
        chapterId: currentItem._id,
        editSyllbusClassSubjectsChapters: updatedData,
      }).unwrap();
  
      setIsEditDialogOpen(false);
      refetch();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <ArrowLeft
              onClick={() => navigate(-1)}
              className="h-6 w-6 cursor-pointer"
            />
            Chapters
          </h1>
        </div>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search chapters..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Chapters
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Chapter</DialogTitle>
              <DialogDescription>
                Fill in all required details to add a chapter.
              </DialogDescription>
            </DialogHeader>
            <form className="grid gap-4 py-4" onSubmit={handleAddSyllabus}>
              <div className="grid gap-2">
                <Label htmlFor="chapter">Chapter Title</Label>
                <Input
                  id="chapter"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="pdf">PDF Link</Label>
                  <Input
                    id="pdf"
                    value={pdf}
                    onChange={(e) => setPdf(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="video">Video Link</Label>
                  <Input
                    id="video"
                    value={video}
                    onChange={(e) => setVideo(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isPosting ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        {/* <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Subject</DialogTitle>
                          <DialogDescription>
                            Update the title, author, or image of the subject.
                          </DialogDescription>
                        </DialogHeader>
      
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                              id="edit-title"
                              value={formData.title}
                              onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-author">Author</Label>
                            <Input
                              id="edit-author"
                              value={formData.author}
                              onChange={(e) =>
                                setFormData({ ...formData, author: e.target.value })
                              }
                            />
                          </div>
                        
                        </div>
      
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleUpdate}>
                            {isEditing ? "Saving..." : "Save Changes"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog> */}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Chapter</DialogTitle>
              <DialogDescription>Update the chapter details.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="w-full">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  className="w-full"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="w-full">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  className="w-full"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-pdf">PDF Link</Label>
                  <Input
                    id="edit-pdf"
                    className="w-full"
                    value={formData.document.pdf}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        document: { ...formData.document, pdf: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-video">Video Link</Label>
                  <Input
                    id="edit-video"
                    className="w-full"
                    value={formData.document.video}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        document: {
                          ...formData.document,
                          video: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between gap-2 flex-col sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="w-full sm:w-auto">
                {isEditing ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


      </div>

      {/* Chapter List */}
      <Tabs defaultValue="lessons" className="mb-8">
        <TabsContent value="lessons" className="pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isLoading
              ? filteredLessons.map((lesson) => (
                  <Card key={lesson._id} className="relative">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-1 text-yellow-500">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${
                                index < Math.round(lesson.rating)
                                  ? "fill-yellow-500"
                                  : "fill-muted stroke-muted"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-muted-foreground ml-1">
                            {lesson.rating}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2 z-10">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                              <DropdownMenuItem
                                onClick={() => handleEdit(lesson)}
                                className={"cursor-pointer"}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive cursor-pointer"
                                onClick={() => handleDelete(lesson._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {lesson.description}
                      </p>
                    </CardContent>
                  </Card>
                ))
              : Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-5 w-1/2 bg-gray-300 rounded mb-2" />
                      <div className="flex gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-4 w-4 bg-gray-300 rounded-full"
                          />
                        ))}
                      </div>
                      <div className="h-4 w-full bg-gray-300 rounded mb-2" />
                      <div className="h-4 w-3/4 bg-gray-300 rounded" />
                    </CardContent>
                  </Card>
                ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
