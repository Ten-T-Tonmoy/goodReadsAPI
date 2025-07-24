import z from "zod";

export const addArticleSchema = z.object({
  title: z.string().min(1, "dude title gotta exist"),
  isPublic: z.boolean().nonoptional(),
  //   profilePhoto: z.string(),
  //   coverPhoto: z.string(),

  //   createdAt   based on add we will store em
  //   updatedAt
  description: z.string(), //optional here
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
  // using ids gonna connect with DB
  bookIds: z.array(z.string()).nonempty(),
  //author add by maker
});

/**
 * frontend whole ass list deigner
 * themes
 * row/col/icon style
 * font effect?
 * notion to lagei
 */

/**
 * connecting books[] with the list
 * await prisma.bookList.create({
  data: {
    title: body.title,
    description: body.description,
    isPublicList: body.isPublicList,
    user: { connect: { id: body.userId } },
    booksListed: {
      connect: body.bookIds.map((id) => ({ id })),
    },
    createdAt: new Date(), // optional, default works
  },
});
 */

/**
 * the connect will through error for where id is invalid to avoid do this
 * const validBooks = await prisma.book.findMany({
  where: { id: { in: body.bookIds } },
});

if (validBooks.length !== body.bookIds.length) {
  return res.status(400).json({ error: "Some books not found" });
}
 */
