const teacherSchema = `#graphql

type Teacher{
    _id:ID!
    name:String!
    email:String!
}

type Query {
    allTeachers:[Teacher]
    teacherDetail(teacherId:ID!):Teacher!
}

type Mutation{
   createTeacher(input:CreateTeacherInput!):Teacher!
   updateTeacher(input:UpdateTeacherInput!):Teacher!
   deleteTeacher(teacherId:ID!):Teacher
}

input CreateTeacherInput{
    name:String!
    email:String!
}

input UpdateTeacherInput{
    teacherId:String!
    name:String
    email:String
}

`

export default teacherSchema