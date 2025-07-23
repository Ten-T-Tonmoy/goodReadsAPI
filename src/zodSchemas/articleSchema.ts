import z from "zod";

export const addAuthorSchema = z.object({
  title: z.string().min(1, "dude title gotta exist"),
  //   profilePhoto: z.string(),
  //   coverPhoto: z.string(),

  titles: z.array(z.string()).nonempty("atleast something"),
  content: z.string().min(1, "Minimal content required.. think it!"),
  theme: z.enum([
    "summer",
    "rain",
    "paradise",
    "forest",
    "fantasy",
    "sea",
    "abstract1",
    "abstract2",
    "colorful1",
    "colorful2",
  ]),
  

});
