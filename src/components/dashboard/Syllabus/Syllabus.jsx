import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  useAddNewSyllbusMutation,
  useDeleteSyllbusMutation,
  useGetAllSyllbusQuery,
  useUpdateSyllbusMutation,
} from "@/app/service/syllbusData";
import { useNavigate } from "react-router-dom";

// Mock syllabus data

export default function SyllabusPage({ setSelectedCategories }) {
  // const [syllabus, setSyllabus] = useState(syllabusData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  const { data, isError, isLoading, refetch } = useGetAllSyllbusQuery();
  const [addNewSyllbus, { isLoading: isPosting }] = useAddNewSyllbusMutation();
  const [deleteSyllbus, { isLoading: isDelete }] = useDeleteSyllbusMutation();
  const [updateSyllbus, { isLoading: isEditing }] = useUpdateSyllbusMutation();

  const [syllabusTitle, setSyllabusTitle] = useState("");
  const [classNo, setClassNo] = useState("");
  const [subject, setSubject] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [chapter, setChapter] = useState("");
  const [description, setDescription] = useState("");
  // const [pdf, setPdf] = useState("");
  const [pdfs, setPdfs] = useState([""]); // instead of a single pdf string

  const [video, setVideo] = useState("");
  const [formData, setFormData] = useState({ title: "" });

  // Handle file input change
  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // Set the file in state
  };


  const handlePdfChange = (index, value) => {
    const newPdfs = [...pdfs];
    newPdfs[index] = value;
    setPdfs(newPdfs);
  };
  
  const addPdfField = () => {
    setPdfs([...pdfs, ""]);
  };
  
  const removePdfField = (index) => {
    const newPdfs = pdfs.filter((_, i) => i !== index);
    setPdfs(newPdfs);
  };
  

  const handleAddSyllabus = async (e) => {
    e?.preventDefault?.();
    try {
      const formData = new FormData();

      // Append all fields to FormData
      formData.append("title", syllabusTitle);
      // formData.append(
      //   "classes",
      //   JSON.stringify([
      //     {
      //       no: Number(classNo),
      //       subjects: [
      //         {
      //           title: subject,
      //           author,
      //           chapters: [
      //             {
      //               title: chapter,
      //               description,
      //               document: {
      //                 pdf,
      //                 video,
      //               },
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ])
      // );


      formData.append(
        "classes",
        JSON.stringify([
          {
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
                      pdf: pdfs.filter(Boolean), // only non-empty PDFs
                      video,
                    },
                  },
                ],
              },
            ],
          },
        ])
      );
      

      if (image) {
        formData.append("image", image);
      }

      // Replace with actual API call to add syllabus
      const response = await addNewSyllbus(formData).unwrap();
      console.log(response, "response");
      

      if (response?.status === 201) {
        // Reset the form state after successful submission
        setSyllabusTitle("");
        setClassNo("");
        setSubject("");
        setAuthor("");
        setImage(null);
        setChapter("");
        setDescription("");
        setPdfs([""]);
        setVideo("");
        setIsAddDialogOpen(false);
        refetch();
      }
    } catch (error) {
      console.error("Error while adding syllabus:", error);
    }
  };

  

  if (isLoading) return <h1>Loading...</h1>;
  if (isError || !Array.isArray(data))
    return <h1>Oops! Something went wrong.</h1>;

  // Filter syllabus based on search term

  const filteredSyllabus = data?.filter((item) =>
    (item?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredSyllabus?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSyllabus = filteredSyllabus?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // edit special day

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      title: item.title || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await updateSyllbus({
        id: currentItem._id,
        updateSyllbus: { title: formData.title },
      }).unwrap();

      setIsEditDialogOpen(false);
      refetch();
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
      const { status } = await deleteSyllbus(currentItem).unwrap();
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
        <h1 className="text-3xl font-bold tracking-tight">
          Syllabus Management
        </h1>
        <p className="text-muted-foreground">
          Manage classes, subjects, and chapters for your curriculum
        </p>
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
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filter syllabus</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
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
                <DialogDescription>
                  Fill in all required details to add a syllabus.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="syllabusTitle">Syllabus Title</Label>
                  <Input
                    id="syllabusTitle"
                    value={syllabusTitle}
                    onChange={(e) => setSyllabusTitle(e.target.value)}
                    placeholder="Enter syllabus title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="class">Class No</Label>
                    <Input
                      id="class"
                      value={classNo}
                      onChange={(e) => setClassNo(e.target.value)}
                      placeholder="Enter class number"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter subject"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="author"
                      className="text-sm font-medium text-gray-700"
                    >
                      Author
                    </Label>
                    <Input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Enter author name"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="image"
                      className="text-sm font-medium text-gray-700"
                    >
                      Upload Image
                    </Label>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0  file:px-4 file:py-2 file:text-sm file:font-semibold  focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="chapter">Chapter Title</Label>
                  <Input
                    id="chapter"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="Enter chapter title"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Chapter Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter chapter description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* <div className="grid gap-2">
                    <Label htmlFor="pdf">PDF URL</Label>
                    <Input
                      id="pdf"
                      value={pdf}
                      onChange={(e) => setPdf(e.target.value)}
                      placeholder="Enter PDF link"
                    />
                  </div> */}

                  <div className="grid gap-2">
  <Label>PDF URLs</Label>
  {pdfs.map((link, index) => (
    <div key={index} className="flex gap-2 items-center">
      <Input
        value={link}
        onChange={(e) => handlePdfChange(index, e.target.value)}
        placeholder={`Enter PDF link ${index + 1}`}
      />
      {pdfs.length > 1 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => removePdfField(index)}
        >
          ✕
        </Button>
      )}
    </div>
  ))}
  <Button type="button" variant="outline" size="sm" onClick={addPdfField}>
    + Add PDF
  </Button>
</div>


                  <div className="grid gap-2">
                    <Label htmlFor="video">Video URL</Label>
                    <Input
                      id="video"
                      value={video}
                      onChange={(e) => setVideo(e.target.value)}
                      placeholder="Enter Video link"
                    />
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
                <Button onClick={handleAddSyllabus} disabled={isPosting}>
                  {isPosting ? "Adding..." : "Add Syllabus"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Syllabus</TableHead>
              <TableHead>Class</TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead>Show</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSyllabus?.length > 0 ? (
              paginatedSyllabus?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item?.title}</TableCell>
                  <TableCell>{item?.classes?.length}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <Eye
                      className="w-5 h-5 cursor-pointer text-blue-500"
                      onClick={() => {
                        navigate("/syllabus/class");
                        setSelectedCategories(item?.title);
                      }}
                    />
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
                        <DropdownMenuItem
                          onClick={() => handleEdit(item)}
                          className={"cursor-pointer"}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => handleDelete(item?._id)}
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
      {filteredSyllabus?.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(startIndex + itemsPerPage, filteredSyllabus.length)}
            </span>{" "}
            of <span className="font-medium">{filteredSyllabus.length}</span>{" "}
            items
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Syllabus Title</DialogTitle>
            <DialogDescription>
              Update only the title of the syllabus.
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
              This will permanently delete this syllabus item. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDelete ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
