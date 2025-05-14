import { useDeleteSyllbusAClassSubjectsMutation } from "@/app/service/syllbusData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SubjectPage({
  isLoading,
  subject,
  id,
  no,
  refetch,
  handleEdit,
}) {
  const navigate = useNavigate();

  const [deleteSyllbusAClassSubjects] =
    useDeleteSyllbusAClassSubjectsMutation();

  const handleDelete = async () => {
    try {
      const { status } = await deleteSyllbusAClassSubjects({
        id,
        no,
        subjectId: subject._id,
      }).unwrap();

      if (status === 200) {
        refetch();
      }
    } catch (error) {
      console.error("Failed to delete subject:", error);
    }
  };

  return (
    <>
      {!isLoading ? (
        <Card className="overflow-hidden border rounded-md w-full max-w-sm !m-0 !p-0 shadow-none">
          <div className="relative w-full h-40">
            <img
              src={
                subject.image
                  ? `${subject.image}`
                  : "/placeholder.svg"
              }
              alt={subject.title}
              className="w-full h-full object-cover m-0 p-0 block"
              onClick={() =>
                navigate(
                  `/syllabus/class/subjects/${id}/${no}/chapters/${subject._id}`
                )
              }
            />

            {/* Dropdown Positioned on Top Right */}
            <div className="absolute top-2 right-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 cursor-pointer"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem
                    onClick={() => handleEdit(subject)}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <CardContent className="p-3">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">
              {subject.title}
            </h3>
            <div className="text-xs text-muted-foreground">
              Instructor: {subject.author}
            </div>
          </CardContent>
        </Card>
      ) : (
        Array.from({ length: 8 }).map((_, index) => (
          <Card
            key={index}
            className="overflow-hidden transition-all animate-pulse cursor-pointer"
          >
            <div className="relative aspect-video bg-gray-300" />
            <CardContent className="p-4">
              <div className="h-4 w-3/4 bg-gray-300 rounded mb-2" />
              <div className="h-3 w-1/2 bg-gray-300 rounded" />
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
}
