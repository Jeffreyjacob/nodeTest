import mongoose,{Schema,Document} from "mongoose";
import Student from "./Student";
import Book from "./Book";


export interface ITeacher extends Document {
    name:string;
    email:string;
}


const TeacherSchema:Schema = new Schema({
     name:{type:String,required:true},
     email:{type:String,required:true,unique:true},
});

TeacherSchema.pre("deleteOne",{document:true,query:false},async function(next){
    const teacher = this as any

    const students = await Student.find({teacher:teacher._id})
    const studentIds = students.map(student => student._id)

    await Book.deleteMany({student:{$in:studentIds}})
    await Student.deleteMany({teacher:teacher._id})
    next()
});

export default mongoose.model<ITeacher>("Teacher",TeacherSchema);