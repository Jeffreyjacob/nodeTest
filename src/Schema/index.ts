import { mergeTypeDefs } from "@graphql-tools/merge";
import studentSchema from "./StudentSchema";
import teacherSchema from "./TeacherSchema";
import bookSchema from "./BookSchema";

const mergedTypeDefs = mergeTypeDefs([studentSchema,teacherSchema,bookSchema])

export default mergedTypeDefs