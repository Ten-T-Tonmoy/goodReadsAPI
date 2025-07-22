import z from "zod";

export const addAuthorSchema = z.object({
  name: z.string().min(1, "dude name gotta exist"),
  activeUsing: z.boolean().nonoptional("must fill this "),
  //   profilePhoto: z.string(),
  //   coverPhoto: z.string(),

  titles: z.array(z.string()).nonempty("atleast something"),
  info: z.string().min(1, "Minimal info required.. wikipedia it!"),
  role: z.enum([
    "poet",
    "novelist",
    "dramatist",
    "philosopher",
    "scientist",
    "fictionWriter",
  ]),
  //   writtenBooks: z
  //     .array(z.string())
  //     .min(1, "Cmon if he aint got any books how's he a author"),
  region: z.string().min(1, "atleast the continent "),
  languageOfBooks: z.string().min(1, "atleast the human lang he spoke"),
});
