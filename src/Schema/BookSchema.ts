const bookSchema = `#graphql
type Book {
       _id:ID!
       title:String!
       author:String!
       student:Student
}

type Query{
    getStudentListOfBooks(studentId:ID!):[Book]
    getBookDetail(bookId:ID!):[Book],
    getAllBook:[Book!]
}

type Mutation{
    createBook(input:CreateBookInput!):Book!
    updateBook(input:UpdateBookInput!):Book!
    deleteBook(bookId:ID!):Book
}

input CreateBookInput{
    title:String!
    author:String!
    student:ID!
}

input UpdateBookInput{
    bookId:ID!
    title:String
    author:String
}
`

export default bookSchema