import redisClient from "../config/redisClient"
import Teacher from "../model/Teacher"

const TeacherResolver = {
    Query: {
        allTeachers: async () => {
            try {
                const teacher = await Teacher.find()
                return teacher
            } catch (error: any) {
                console.log("Get all teachers Error", error)
                throw new Error("Failed to fetch teachers.");
            }
        },
        teacherDetail: async (_: any, { teacherId }: { teacherId: string }) => {
            try {
                const teacher = await Teacher.findById(teacherId)
                if (!teacher) {
                    throw new Error("teacher with id not found")
                }
                return teacher
            } catch (error: any) {
                console.log("get teacher details error", error)
                throw new Error("something went wrong getting teach students list")
            }
        }
    },
    Mutation: {
        createTeacher: async (_: any, { input }: { input: { name: string, email: string } }) => {
            try {
                const newTeacher = new Teacher(input)
                await newTeacher.save();
                const cacheKey = `allTeachers:{}`
                await redisClient.del(cacheKey)
                return newTeacher;
            } catch (error: any) {
                console.error("Error creating teacher:", error);
                throw new Error("Failed to create teacher.");
            }
        },
        updateTeacher: async (_: any, { input }: { input: { name: string, email: string, teacherId: string } }) => {
            try {
                const updatedTeacher = await Teacher.findByIdAndUpdate(
                    input.teacherId,
                    { $set: { name: input.name, email: input.email } },
                    { new: true, runValidators: true }
                )
                const cacheKeys = [
                    `allTeachers:{}`,
                    `teacherDetail:${input.teacherId}`
                ]
               await Promise.all(cacheKeys.map((key)=>redisClient.del(key)))
                if (!updatedTeacher) {
                    throw new Error("Teacher with id not found.");
                }
                return updatedTeacher
            } catch (error: any) {
                console.error("Error updating teacher:", error);
                throw new Error("Failed to update teacher.");
            }
        },
        deleteTeacher: async (_: any, { teacherId }: { teacherId: string }) => {
            try{
                const teacher = await Teacher.findById(teacherId)
                if(teacher){
                    await teacher.deleteOne();
                }

                if(!teacher){
                    throw new Error("Teacher with id  not found.");
                }
            }catch(error:any){
                console.error("Error deleting teacher:", error);
                throw new Error("Failed to delete teacher.");
            }
        }
    }
}

export default TeacherResolver;
