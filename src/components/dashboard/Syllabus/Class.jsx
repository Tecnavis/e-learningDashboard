import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, NotebookText, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  useAddSyllbusClassMutation,
  useDeleteSyllbusAClassMutation,
  useGetAllSyllbusQuery,
} from "@/app/service/syllbusData";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ----------------- Class Card -----------------
function ClassCard({
  id,
  no,
  title,
  subjects = 0,
  color = "bg-blue-500",
  refetch,
}) {
  const navigate = useNavigate();

  const [deleteSyllbusAClass] = useDeleteSyllbusAClassMutation();

  const handleDelete = async (no) => {
    try {
      const { status } = await deleteSyllbusAClass({ id, no }).unwrap();
      console.log(status);

      if (status === 200) {
        refetch();
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: no * 0.05 }}
      whileHover={{ scale: 1.03 }}
    >
      <Card className="relative rounded-xl overflow-hidden p-2 hover:shadow-md transition-all">
        <div className={`h-2 ${color} rounded-t-md`} />
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={() => handleDelete(no)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardContent
          onClick={() => navigate(`/syllabus/class/subjects/${id}/${no}`)}
          className="flex flex-col items-center justify-center gap-2 pt-4 px-2 pb-2 cursor-pointer"
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${color} text-white font-bold text-sm`}
          >
            {no}
          </div>
          <div className="text-sm font-medium">{title}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <NotebookText className="h-4 w-4" />
            <span>{subjects}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ----------------- Class Page -----------------
export default function ClassPage({
  selectedCategories,
  setSelectedCategories,
}) {
  const { data, isLoading, isError, refetch } = useGetAllSyllbusQuery();
  const { data: allsyllabus } = useGetAllSyllbusQuery();
  const [addSyllbusClass, { isLoading: isPosting }] =
    useAddSyllbusClassMutation();

  const filterData =
    Array.isArray(data) && data.length > 0
      ? selectedCategories == null
        ? data[0]
        : data.find((value) => value.title === selectedCategories) || data[0]
      : null;

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [classNo, setClassNo] = useState("");
  const [subject, setSubject] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [chapter, setChapter] = useState("");
  const [description, setDescription] = useState("");
  const [pdf, setPdf] = useState("");
  const [video, setVideo] = useState("");

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleAddSyllabus = async (e) => {
    e?.preventDefault?.();
    try {
      const formData = new FormData();

      // Build the syllabus class data structure
      const newClassData = {
        no: Number(classNo),
        subjects: [
          {
            title: subject,
            author,
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
          },
        ],
      };

      // Append the JSON data as a string
      formData.append("addSyllbusClass", JSON.stringify(newClassData));

      // Append the image file if it exists
      if (image) {
        formData.append("image", image);
      }

      // Call the mutation to send data to backend
      const response = await addSyllbusClass({
        id: filterData?._id,
        addSyllbusClass: formData,
      }).unwrap();

      if (response?.status === 200) {
        // Reset form fields
        setClassNo("");
        setSubject("");
        setAuthor("");
        setImage(null);
        setChapter("");
        setDescription("");
        setPdf("");
        setVideo("");
        setIsAddDialogOpen(false);
        refetch();
      }
    } catch (error) {
      // Handling the error response for 400
      if (error?.status === 400) {
        alert(`Error: ${error?.data?.message || "Class already exists."}`);
      } else {
        console.error("Error while adding syllabus:", error);
      }
    }
  };

  if (isError || !data || data.length === 0) {
    return <div className="p-4">No syllabus found.</div>;
  }

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-bold">
          Available Classes for {filterData.title}
        </h2>

        <div className="flex gap-1">
          <Select
            onValueChange={(value) => setSelectedCategories(value)}
            value={selectedCategories || ""}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select syllabus" />
            </SelectTrigger>
            <SelectContent>
              {allsyllabus?.map((item) => (
                <SelectItem key={item._id} value={item.title}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add  Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
                <DialogDescription>
                  Fill in all required details to add a class.
                </DialogDescription>
              </DialogHeader>

              <form className="grid gap-4 py-4" onSubmit={handleAddSyllabus}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="class">Class No</Label>
                    <Input
                      id="class"
                      value={classNo}
                      onChange={(e) => setClassNo(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Upload Image</Label>
                    <Input
                      id="image"
                      type="file"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

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
                    {isPosting ? "Saving..." : "Save"}{" "}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Classes List */}
      <div className="grid grid-cols-4 gap-2">

        {filterData?.classes?.map((item, index) => (
          <ClassCard
            key={index}
            id={filterData._id}
            no={item.no}
            title={`Class ${item.no}`}
            subjects={item.subjects?.length || 0}
            refetch={refetch}
          />
        ))}
      </div>
    </div>
  );
}
