import { Project } from '@/typess'
import React from 'react'

const ProjectElement = ({p} : {p : Project}) => {
  return (
    <div>
        <h1>{p.title}</h1>
    </div>
  )
}

export default ProjectElement