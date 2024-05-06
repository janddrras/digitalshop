import { z } from "zod"

export const AuthCredentialsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long."
  })
})

export type TAuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>

export const QueryValidator = z.object({
  category: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  limit: z.number().optional()
})

export type TQueryValidator = z.infer<typeof QueryValidator>
