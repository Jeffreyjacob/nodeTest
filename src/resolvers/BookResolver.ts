import Student from "../model/Student";
import Book from "../model/Book";
import redisClient from "../config/redisClient";

const BookResolver = {
    Query: {
        getStudentListOfBooks: async (_: any, { studentId }: { studentId: string }) => {
            try {
                const student = await Student.findById(studentId)
                if (!student) {
                    throw new Error("Student with id not found")
                }
                const allBooksforStudent = await Book.find({ student: studentId }).populate("student")
                return allBooksforStudent
            } catch (error: any) {
                console.log("errot getting list of books for a student", error)
                throw new Error("something went wrong getting student list of books")
            }
        },
        getBookDetail: async (_: any, { bookId }: { bookId: string }) => {
            try {
                const book = await Book.findById(bookId).populate("student")
                if (!book) {
                    throw new Error("book with id not found")
                }
                return book
            } catch (error: any) {
                console.log("get book details error", error)
                throw new Error("something went wrong getting book detail")
            }
        },
        getAllBook: async () => {
            try {
                const book = await Book.find().populate("student")
                return book
            } catch (error: any) {
                console.log("Get all books Error", error)
                throw new Error("Failed to fetch books");
            }
        }
    },
    Mutation: {
        createBook: async (_: any, { input }: { input: { title: string, author: string, student: string } }) => {
            try {
                const student = await Student.findById(input.student);
                if (!student) {
                    throw new Error("Teacher with id not found.");
                }
                const newBook = new Book({
                    title: input.title,
                    author: input.author,
                    student: input.student
                })
                await newBook.save();
                const cacheKey = `getAllBook:{}`
                await redisClient.del(cacheKey)
                return newBook;
            } catch (error: any) {
                console.error("Error creating book:", error);
                throw new Error("Failed to create book.");
            }
        },
        updateBook: async (_: any, { input }: { input: { title: string, author: string, bookId: string } }) => {
            try {
                const updatedBook = await Book.findByIdAndUpdate(input.bookId,
                    { $set: { title: input.title, author: input.author } },
                    { new: true, runValidators: true })

                if (!updatedBook) {
                    throw new Error("Book with id not found.");
                }
                const cacheKeys = [
                    `getAllBook:{}`,
                    `getBookDetail:${input.bookId}`
                ]
                await Promise.all(cacheKeys.map((key) => redisClient.del(key)))
                return updatedBook
            } catch (error: any) {
                console.error("Error updating book:", error);
                throw new Error("Failed to update book.");
            }
        },
        deleteBook: async (_: any, { bookId }: { bookId: string }) => {
            try {
                const book = await Book.findById(bookId)
                if (book) {
                    await book.deleteOne();
                }
                if (!book) {
                    throw new Error("book with id not found.");
                }
                return book
            } catch (error: any) {
                console.error("Error deleting book:", error);
                throw new Error("Failed to delete book.");
            }
        }
    }
}

export default BookResolver;