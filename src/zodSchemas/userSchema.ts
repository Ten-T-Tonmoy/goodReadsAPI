import z, { email } from "zod";

export const addUserSchema = z.object({
  name: z.string().min(1, "dude name gotta exist"),
  email: z.email(),
  region: z.string().min(1, "atleast the continent "),
  gender: z.boolean().nonoptional(),
  //   profilePhoto: z.string(),
  //   coverPhoto: z.string(),
  about: z.string(),
  // made articles/list connect them
  //   languageOfBooks: z.string().min(1, "atleast the human lang he spoke"),
});
