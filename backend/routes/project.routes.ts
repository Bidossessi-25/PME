import express from "express";
import { createProject, getProject, getProjects } from "../controllers/project.controllers";
const router = express.Router();


router.route('/:id')
.get(getProject)


router.route('/')
.get(getProjects)
.post(createProject)

export default router