import mongoose,{Schema,Document} from "mongoose";
import Teacher from "./Teacher";
import Book from "./Book";

export interface IStudent extends Document {
    name:string;
    email:string;
    teacher: mongoose.Types.ObjectId;
}

const StudentSchema:Schema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    teacher: {type:mongoose.Schema.Types.ObjectId,ref:"Teacher",required:true},
});

StudentSchema.pre("deleteOne",{document:true,query:false},async function(next){
     const student = this as any;
     await Book.deleteMany({student:student._id});
     next()
})

export default mongoose.model<IStudent>("Student",StudentSchema);

