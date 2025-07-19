import prisma from "../prisma.js";
//allow ts import is off rn

export const getAllBooks = async () => {
  return await prisma.books.findMany(); //lowerCase
};
