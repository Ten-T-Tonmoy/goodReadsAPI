import z from "zod";

//for runtime validation since interfaces compile time validation only
export const addBookSchema = z.object({
  title: z.string().min(1, "Title is Require"),
  description: z.string().min(1, "Description is needed"),
  bookType: z.enum([
    "poetry",
    "drama",
    "fiction",
    "horror",
    "nonFiction",
    "academic",
    "biography",
    "children",
    "youngAdult",
  ]),
  genre: z.array(z.string()).nonempty("Atleast one genre required"),
  keywords: z.array(z.string()).nonempty("Atleast one genre required"),
  coverPhoto: z.string().optional(),
  publisher: z.string().optional(),
  publishDate: z.string().datetime().optional(),
  availableStores: z.array(z.string()).optional(),
  writerIds: z
    .array(z.string())
    .nonempty("Atleast write unknown if writer not found"),
});
