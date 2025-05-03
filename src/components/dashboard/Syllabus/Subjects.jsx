import { Card, CardContent } from "@/components/ui/card";
import {  useNavigate } from "react-router-dom";

export function SubjectPage ({ isLoading, subject, id, no }) {
  const navigate = useNavigate();

  return (
    <>
      {!isLoading ? (
        <Card
          className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
          onClick={() =>
            navigate(`/syllabus/class/subjects/${id}/${no}/chapters/${subject._id}`)
          }
        >
          {/* <Link href={`/subjects/chapters/${subject.id}`}> */}
          <div className="relative aspect-video">
            <img
              src={
                `${import.meta.env.VITE_API_URL}/images/${subject.image}` ||
                "/placeholder.svg"
              }
              alt={subject.title}
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold line-clamp-2 mb-2">{subject.title}</h3>
            <div className="text-sm text-muted-foreground mb-2">
              Instructor: {subject.author}
            </div>
          </CardContent>
          {/* </Link> */}
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
