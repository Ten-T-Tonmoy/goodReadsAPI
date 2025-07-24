
// // GET /searchBooks/:keyword - Search books
// export const searchBooks = async (req: Request, res: Response) => {
//   try {
//     const { keyword } = req.params;
//     const { limit = 20, offset = 0 } = req.query;

//     const books = await prisma.book.findMany({
//       where: {
//         OR: [
//           { title: { contains: keyword, mode: 'insensitive' } },
//           { Author: { userProfile: { name: { contains: keyword, mode: 'insensitive' } } } },
//           { keywords: { has: keyword } }
//         ]
//       },
//       include: {
//         Author: {
//           include: { userProfile: true }
//         },
//         _count: {
//           select: { likedBy: true, review: true }
//         }
//       },
//       take: Number(limit),
//       skip: Number(offset),
//       orderBy: { ratingSum: 'desc' }
//     });

//     res.json({
//       success: true,
//       data: books,
//       meta: {
//         keyword,
//         total: books.length,
//         limit: Number(limit),
//         offset: Number(offset)
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: 'Search failed' });
//   }
// };

// // PUT /updatebook - Update book
// export const updateBook = async (req: Request, res: Response) => {
//   try {
//     const { id, ...updateData } = req.body;

//     const updatedBook = await prisma.book.update({
//       where: { id },
//       data: {
//         ...updateData,
//         publishDate: updateData.publishDate ? new Date(updateData.publishDate) : undefined
//       },
//       include: {
//         Author: true
//       }
//     });

//     res.json({
//       success: true,
//       data: updatedBook,
//       message: 'Book updated successfully'
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: 'Failed to update book' });
//   }
// };

// // DELETE /deletebook/:id - Delete book
// export const deleteBook = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     await prisma.book.delete({
//       where: { id }
//     });

//     res.json({
//       success: true,
//       message: 'Book deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: 'Failed to delete book' });
//   }
// };

// // api/routes/articles.ts - Article related endpoints

// // GET /article/:id - Get article details
// export const getArticleById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const article = await prisma.article.findUnique({
//       where: { id },
//       include: {
//         author: true,
//         Author: true,
//         comments: {
//           include: { commentedBy: true },
//           orderBy: { createdAt: 'desc' }
//         }
//       }
//     });

//     if (!article) {
//       return res.status(404).json({ success: false, error: 'Article not found' });
//     }

//     // Get random article suggestion
//     const randomArticle = await prisma.article.findMany({
//       where: { id: { not: id } },
//       take: 1,
//       orderBy: { upVotes: 'desc' }
//     });

//     res.json({
//       success: true,
//       data: {
//         article,
//         nextSuggestion: randomArticle[0] || null
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: 'Failed to fetch article' });
//   }
// };

// // api/routes/booklists.ts - BookList related endpoints

// // GET /bookList/:id - Get book list details
// export const getBookListById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { view = 'blocks' } = req.query; // blocks or list view

//     const bookList = await prisma.bookList.findUnique({
//       where: { id },
//       include: {
//         createdBy: true,
//         Author: true,
//         booksListed: {
//           include: {
//             Author: {
//               include: { userProfile: true }
//             },
//             _count: { select: { likedBy: true } }
//           }
//         },
//         comments: {
//           include: { commentedBy: true },
//           orderBy: { createdAt: 'desc' }
//         }
//       }
//     });

//     if (!bookList) {
//       return res.status(404).json({ success: false, error: 'Book list not found' });
//     }

//     // Check if list is private and user has access
//     if (!bookList.isPublicList) {
//       // Add auth check here - req.user.id === bookList.userId
//     }

//     res.json({
//       success: true,
//       data: {
//         bookList,
//         view,
//         totalBooks: bookList.booksListed.length
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: 'Failed to fetch book list' });
//   }
// };

// // api/routes/users.ts - User related endpoints

// // GET /userProfile/:id - Get user profile
// export const getUserProfile = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const user = await prisma.user.findUnique({
//       where: { id },
//       include: {
//         likedBooks: {
//           include: {
//             Author: { include: { userProfile: true } },
//             _count: { select: { likedBy: true } }
//           },
//           take: 10,
//           orderBy: { createdAt: 'desc' }
//         },
//         writtenReviews: {
//           include: { book: true },
//           orderBy: { createdAt: 'desc' },
//           take: 10
//         },
//         createdBookList: {
//           where: { isPublicList: true },
//           orderBy: { upVotes: 'desc' },
//           take: 5
//         },
//         Author: true
//       }
//     });

//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }

//     res.json({
//       success: true,
//       data: {
//         user,
//         stats: {
//           likedBooksCount: user.likedBooks.length,
//           reviewsCount: user.writtenReviews.length,
//           publicListsCount: user.createdBookList.length,
//           isAuthor: !!user.Author?.length
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: 'Failed to fetch user profile' });
//   }
// };

// // api/middleware/auth.ts - Authentication middleware
// export const authenticateUser = async (req: Request, res: Response, next: any) => {
//   try {
//     // Implement JWT token verification here
//     const token = req.headers.authorization?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ success: false, error: 'No token provided' });
//     }

//     // Verify token and attach user to request
//     // req.user = decodedUser;
//     next();
//   } catch (error) {
//     res.status(401).json({ success: false, error: 'Invalid token' });
//   }
// };

// // api/app.ts - Express app setup
// import express from 'express';
// import cors from 'cors';

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Book routes
// app.get('/home', getHomePage);
// app.get('/viewbook/:id', getBookById);
// app.post('/addbook', authenticateUser, addBook);
// app.get('/searchBooks/:keyword', searchBooks);
// app.put('/updatebook', authenticateUser, updateBook);
// app.delete('/deletebook/:id', authenticateUser, deleteBook);

// // Author routes
// app.get('/authors/:id', getAuthorById);

// // Article routes  
// app.get('/article/:id', getArticleById);

// // BookList routes
// app.get('/bookList/:id', getBookListById);

// // User routes
// app.get('/userProfile/:id', getUserProfile);

// export default app;