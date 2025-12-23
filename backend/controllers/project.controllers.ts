import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { CreateProjectDTO , UpdateProjectDTO, UpdateSubStepDTO} from "../types/project.dto";
import { projectSchema } from "../schemas/project.schema";
// Créer un projet
export const createProject = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const parsed = projectSchema.parse(data)
    if(!parsed){
      res.status(400)
      throw new Error("In valid data format")

    }

       if (parsed.subSteps && parsed.subSteps?.length > 0) {
  for (const s of parsed.subSteps) {
    await prisma.subStep.create({
      data: {
        name: s.name,
        description: s.description,
        state: s.state ?? "pending",
        dueDate: s.dueDate ? new Date(s.dueDate) : undefined,
        remarks: s.remarks,
        projectId: id,
      },
    })
  }
}
    const project = await prisma.project.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        requestedAmount: parsed.requestedAmount,
        pmeId: parsed.pmeId,
        subSteps: {
          create : parsed.subSteps
        },
      },
      include: { subSteps: true },
    });

    res.status(201).json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating project" });
  }
};

// // Mettre à jour un projet
// export const updateProject = async (req: Request, res: Response) => {
//   try {
//     const id = await req.params.id;
//     const data: UpdateProjectDTO = req.body;
//     const parsedData = projectSchema.parse(data);
//     if(!id || !data){
//       throw new Error("No id on the request")
//     }

//    if (data.subSteps?.create) {
//   for (const s of data.subSteps.create) {
//     await prisma.subStep.create({
//       data: {
//         name: s.name,
//         description: s.description,
//         state: s.state ?? "pending",
//         dueDate: s.dueDate ? new Date(s.dueDate) : undefined,
//         remarks: s.remarks,
//         projectId: id,
//       },
//     })
//   }
// }

// if (data.subSteps?.update) {
//   for (const s of data.subSteps.update) {
//     await prisma.subStep.update({
//       where: { id: s.id },
//       data: {
//         name: s.name,
//         description: s.description,
//         state: s.state,
//         dueDate: s.dueDate ? new Date(s.dueDate) : undefined,
//         completedAt: s.completedAt
//           ? new Date(s.completedAt)
//           : undefined,
//         remarks: s.remarks,
//       },
//     })
//   }
// }


//     const project = await prisma.project.update({
//       where: { id },
//       data: {
//         ...data,
//         subSteps: data.subSteps ? { upsert: data.subSteps.map((s) => ({
//           where: { id: s.id || "" }, // id obligatoire pour upsert, sinon créer
//           update: s,
//           create: s
//         })) } : undefined,
//       },
//       include: { subSteps: true },
//     });

//     res.json({ project });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error updating project" });
//   }
// };

// Récupérer tous les projets
export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: { subSteps: true, validatedBy: true },
    });
    res.json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};

// Récupérer un projet par id
export const getProject = async (req: Request, res: Response) => {
  try {
    const id = await  req.params.id;
    if(!id){
      throw new Error("No id specified on the request")
    }
    const project = await prisma.project.findUnique({
      where: { id },
      include: { subSteps: true, validatedBy: true },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching project" });
  }
};

// Supprimer un projet
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if(!id){
      res.status(400);
      throw new Error('No id')

    }
    await prisma.project.delete({ where: { id } });
    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting project" });
  }
};
