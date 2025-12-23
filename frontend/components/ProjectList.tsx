'use client'
import React from 'react'
import api from '@/lib/api'
import { useEffect, useState } from 'react'
import { Project } from '@/typess'
import ProjectElement from './ProjectElement'

const ProjectList = () => {
const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading] = useState<boolean>(true);


useEffect(()=>{
    // Get the projects list
    const fetchProjects = async () =>{
        try {
            
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (error) {
            console.log("Error while fetching projects :",error )
        }finally{
            setLoading(false);
        }
    }
    fetchProjects();
},[])
  return (
   <>
   {loading 
   ? (
    <div>Loading .....</div>
   ) 
   : (
    <section>
        {projects && projects.length > 0 
        ? (projects.map((p)=> (
            <ProjectElement p={p}/>
        ))) 
        : (
            <div>
                <h3>Aucun projet pour le moment</h3>
            </div>
        )}
    </section>
   )}
   </>
  )
}

export default ProjectList