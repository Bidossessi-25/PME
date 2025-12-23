import asyncHandler from "express-async-handler"
import { prisma } from "../lib/prisma"
import { Request, Response } from "express"
import {createUserSchema, updateUserSchema, roleEnum} from '../schemas/user.schemas'
import { hashPassword } from "../utils/password"
import { AuthRequest } from "types"
import { UpdateUserDTO } from "backend/types/user.dto"

/**
 * @desc CREATE user
 * @route POST /api/users
 * @access Private
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  // ✅ Zod validation
  const data = createUserSchema.parse(req.body)

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  })

  if (existingUser) {
    res.status(409)
    throw new Error("User already exists")
  }

  const passwordHash = await hashPassword(data.password)

  const user = await prisma.user.create({
    data: {
      email: data.email ,
      passwordHash,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      role: data.role ?? "PME"
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true
    }
  })

  res.status(201).json(user)
})

/**
 * @desc GET all users
 * @route GET /api/users
 * @access Private
 */
export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true
    }
  })

  res.json(users)
})

/**
 *@desc  GET user by id
 * @route GET /api/users/:id
 * @access Private
 */
export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = await req.params.id
  // Get access to the aythentificated user
  const currentUser = req.user

  if (!id) {
    res.status(400)
    throw new Error("Missing user id")
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true
    }
  })

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  res.json(user)
})

/**
 *@desc  UPDATE user (PUT / PATCH)
 * @route PUT|PATCH /api/users/:id
 * @access Private
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = await req.params.id
  if (!id) {
    res.status(400)
    throw new Error("Missing user id")
  }
  const received : UpdateUserDTO = req.body
  
  const data = updateUserSchema.parse(received)

  const userExists = await prisma.user.findUnique({
    where: { id }
  })

  if (!userExists) {
    res.status(404)
    throw new Error("User not found")
  }

   const updateData = {
    ...(data.email !== undefined && { email: data.email }),
    ...(data.firstName !== undefined && { firstName: data.firstName ?? null }),
    ...(data.lastName !== undefined && { lastName: data.lastName ?? null }),
    ...(data.role !== undefined && { role: data.role }),
    ...(data.isActive !== undefined && { isActive: data.isActive })
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data : updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      updatedAt: true
    }
  })

  res.json(updatedUser)
})

/**
 *@desc DELETE user
 * @route DELETE /api/users/:id
 * @access Private
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id
  if (!id) {
    res.status(400)
    throw new Error("Missing user id")
  }

  const userExists = await prisma.user.findUnique({
    where: { id }
  })

  if (!userExists) {
    res.status(404)
    throw new Error("User not found")
  }

  await prisma.user.delete({
    where: { id }
  })

  res.status(204).send()
})
