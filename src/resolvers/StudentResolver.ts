import Teacher from "../model/Teacher";
import Student from "../model/Student";
import Book from "../model/Book";
import redisClient from "../config/redisClient";

const StudentResolver = {
    Query: {
        getStudentDetail: async (_: any, { studentId }: { studentId: string }) => {
            try {
                const student = await Student.findById(studentId).populate("teacher")
                if (!student) {
                    throw new Error("student with id not found")
                }
                return student
            } catch (error: any) {
                console.log("get teacher details error", error)
                throw new Error("something went wrong getting teach students list")
            }
        },
        getAllStudent: async () => {
            try {
                const student = await Student.find().populate("teacher")
                return student
            } catch (error: any) {
                console.log("Get all students Error", error)
                throw new Error("Failed to fetch students");
            }
        },
        getListOfStudentsForTeacher:async(_:any,{teacherId}:{teacherId:string})=>{
           try{
                const teacher = await Teacher.findById(teacherId)
                if(!teacher){
                    throw new Error("Teacher with id not found")
                }
                const students = await Student.find({teacher:teacherId})
                return students
           }catch(error:any){
            console.log("error getting list of student for teacher", error)
            throw new Error("Failed to fetch list of students");
           }
        }
    },
    Mutation: {
        createStudent: async (_: any, { input }: { input: { name: string, email: string, teacher: string } }) => {
            try {
                const teacher = await Teacher.findById(input.teacher);
                if (!teacher) {
                    throw new Error("Teacher with id not found.");
                }
                const newStudent = new Student({
                      name: input.name,
                    email: input.email,
                    teacher: input.teacher
                })
                await newStudent.save();
                const cacheKey = `getAllStudent:{}`
                await redisClient.del(cacheKey)
                return newStudent;
            } catch (error: any) {
                console.error("Error creating student:", error);
                throw new Error("Failed to create student.");
            }
        },
        updateStudent: async (_: any, { input }: { input: { name: string, email: string, studentId: string } }) => {
            try {
                const updatedStudent = await Student.findByIdAndUpdate(
                    input.studentId,
                    { $set: { name: input.name, email: input.email } },
                    { new: true, runValidators: true }
                )
                const cacheKeys = [
                    `getAllStudent:{}`,
                    `getStudentDetail:${input.studentId}`
                ]
               await Promise.all(cacheKeys.map((key)=>redisClient.del(key)))
                if (!updatedStudent) {
                    throw new Error("Student with id  not found.");
                }
                return updatedStudent
            } catch (error: any) {
                console.error("Error updating student:", error);
                throw new Error("Failed to update student.");
            }
        },
        deleteStudent: async (_: any, { studentId }: { studentId: string }) => {
            try {
                const student = await Student.findById(studentId)
                if (student) {
                    await student.deleteOne();
                }
                if (!student) {
                    throw new Error("student with id not found.");
                }
            } catch (error: any) {
                console.error("Error deleting student:", error);
                throw new Error("Failed to delete student.");
            }
        }
    }
}

export default StudentResolver;
