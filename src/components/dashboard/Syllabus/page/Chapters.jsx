import { useGetASyllbusByIdQuery } from '@/app/service/syllbusData';
import React from 'react'
import { useParams } from 'react-router-dom';
import Chapters from '../Chapters';

export default function ChaptersPage() {

   const {id, no, chapterId  } = useParams();
  
     const { data, isLoading, isError } = useGetASyllbusByIdQuery(id)
    
      if (isLoading) return <div className="p-4">Loading...</div>
      if (isError || !data || data.length === 0) return <div className="p-4">No subject found.</div>
  
    
    const subject = data?.classes.filter((cla) => cla.no == no)

    const chapter = subject?.[0].subjects.filter((chp) => chp._id == chapterId);
  
  return (
    <>
    <Chapters  isLoading = { isLoading }  chapters = {chapter?.[0].chapters}   id = {id} no = {no} chapterId = {chapterId} />
    </>
  )
}
