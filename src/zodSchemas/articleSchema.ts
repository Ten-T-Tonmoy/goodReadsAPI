import z from "zod";

export const addArticleSchema = z.object({
  title: z.string().min(1, "dude title gotta exist"),
  //   profilePhoto: z.string(),
  //   coverPhoto: z.string(),

  //   createdAt   based on add we will store em
  //   updatedAt
  content: z.string().min(1, "Minimal content required.. think it!"),
  theme: z.enum([
    "summer",
    "rain",
    "ice",
    "fire",
    "paradise",
    "forest",
    "fantasy",
    "sea",
    "abstract1",
    "abstract2",
    "colorful1",
    "colorful2",
  ]),
  //author add by maker
});
