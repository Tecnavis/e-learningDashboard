import { useAddSyllbusClassSubjectsMutation, useEditSyllbusClassSubjectsMutation, useGetASyllbusByIdQuery } from '@/app/service/syllbusData';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SubjectPage } from '../Subjects';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";

export default function Subjects() {
  const navigate = useNavigate();
  const { id, no } = useParams();

  const { data, isLoading, isError, refetch } = useGetASyllbusByIdQuery(id);
  const [searchQuery, setSearchQuery] = useState("");

  const [addSyllbusClassSubjects, { isLoading: isPosting }] = useAddSyllbusClassSubjectsMutation();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [subjects, setSubjects] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [chapter, setChapter] = useState("");
  const [description, setDescription] = useState("");
  const [pdf, setPdf] = useState("");
  const [video, setVideo] = useState("");


   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editSyllbusClassSubjects, { isLoading: isEditing }] =
      useEditSyllbusClassSubjectsMutation();
  
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({
      title: "",
      author: "",
      image: null,
    });

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  // Ensure subjectData is always defined
  const classData = data?.classes?.find((cla) => cla.no == no);
  const filteredSubjects = classData?.subjects?.filter((subject) => {
    const q = searchQuery.toLowerCase();
    return subject.title.toLowerCase().includes(q) || subject.author.toLowerCase().includes(q);
  }) || [];
  

  const handleAddSyllabus = async (e) => {
    e?.preventDefault?.();

    try {
      const formData = new FormData();

      const newClassData = {
        subjects: [
          {
            title: subjects,
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

      formData.append("addSyllbusClass", JSON.stringify(newClassData));

      if (image) {
        formData.append("image", image);
      }

      const response = await addSyllbusClassSubjects({
        id: data?._id,
        no,
        addSyllbusClassSubjects: formData,
      }).unwrap();

      if (response?.status === 200) {
        setSubjects("");
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
      if (error?.status === 400) {
        alert(`Error: ${error?.data?.message || "Class already exists."}`);
      } else {
        console.error("Error while adding subject:", error);
      }
    }
  };

  if (isError || !data) {
    return <div className="p-4">No subject found.</div>;
  }


  

  const handleEdit = (item) => {
      setCurrentItem(item);
    
      setFormData({
        title: item.title || "",
        author: item.author || "",
        image: null,
      });
      setIsEditDialogOpen(true);
    };
  
    const handleUpdate = async () => {
      try {
        const form = new FormData();
  
        const updatedData = {
          subjects: [
            {
              title: formData.title,
              author: formData.author,
            },
          ],
        };
  
        form.append("addSyllbusClass", JSON.stringify(updatedData));
  
        if (formData.image) {
          form.append("image", formData.image);
        }
  
        await editSyllbusClassSubjects({
          id,
          no,
          subjectId: currentItem._id,
          editSyllbusClassSubjects: form,
        }).unwrap();
  
        setIsEditDialogOpen(false);
        refetch();
      } catch (err) {
        console.error("Update failed:", err);
      }
    };


  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ArrowLeft onClick={() => navigate(-1)} className="h-6 w-6 cursor-pointer" />
        Subjects
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search subjects..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add  Subjects
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
                <DialogDescription>
                  Fill in all required details to add a Subjects.
                </DialogDescription>
              </DialogHeader>

              <form className="grid gap-4 py-4" onSubmit={handleAddSyllabus}>
                <div className="grid  gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subjects}
                      onChange={(e) => setSubjects(e.target.value)}
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


           {/* Edit Dialog */}
           <Dialog
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
                    <div className="grid gap-2">
                      <Label htmlFor="edit-image">Image</Label>
                      <Input
                        id="edit-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.files[0] })
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

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <SubjectPage key={index} isLoading={true}/>
            ))
          : filteredSubjects.map((subject) => (
              <SubjectPage
                key={subject._id}
                subject={subject}
                id={id}
                no={no}
                isLoading={false}
                refetch = {refetch} 
                handleEdit = {handleEdit}
              />
            ))}
      </div>
    </section>
  );
}
