const studentSchema = `#graphql


type Student {
    _id: ID!
    name: String!
    email: String!
    teacher:Teacher!
}

type Query {
    getStudentDetail(studentId:ID!):Student!
    getAllStudent:[Student!]
    getListOfStudentsForTeacher(teacherId:ID!):[Student!]
}

type Mutation {
    createStudent(input:CreateStudentInput!): Student!
    updateStudent(input:UpdateStudentInput!): Student!
    deleteStudent(studentId:ID!): Student
}

input CreateStudentInput {
    name:String!
    email:String!
    teacher:ID!
}

input UpdateStudentInput {
    name:String
    email:String
    studentId:String!
}


`;

export default studentSchema;
