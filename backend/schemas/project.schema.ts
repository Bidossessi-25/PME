import { z } from "zod";

// ==========================
// SubStep DTO & Zod Schema
// ==========================

export const subStepSchema = z.object({
  // id: z.string().uuid(),
  name: z.string().min(1, "Le nom de la sous-étape est requis"),
  description: z.string().optional(),
  state: z.enum(["pending", "in_progress", "validated", "failed"]).optional(),
  dueDate: z.string().datetime().optional(),       // ISO string
  completedAt: z.string().datetime().optional(),
  validatedBy: z.array(z.object({
    id: z.string().uuid(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.enum(["super_admin", "admin", "financier"])
  })).optional(),
  remarks: z.string().optional()
});

export type SubStepDTO = z.infer<typeof subStepSchema>;

// ==========================
// Project DTO & Zod Schema
// ==========================

export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Le titre du projet est requis"),
  description: z.string().min(1, "La description du projet est requise"),
  pmeId: z.string().uuid(),
  status: z.enum(["pending", "approved", "rejected", "funded", "completed", "failed"]).optional(),
  requestedAmount: z.number().positive("Le montant demandé doit être positif"),
  fundedAmount: z.number().positive().optional(),
  fundDisbursementDates: z.array(z.string().datetime()).optional(),
  validatedAt: z.string().datetime().optional(),
  validatedBy: z.array(z.object({
    id: z.string().uuid(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.enum(["super_admin", "admin", "financier"])
  })).optional(),
  subSteps: z.array(subStepSchema).optional(),
  submissionDate: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

export type ProjectDTO = z.infer<typeof projectSchema>;
