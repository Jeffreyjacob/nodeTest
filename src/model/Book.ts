import mongoose,{Schema,Document} from "mongoose";

export interface IBook extends Document {
   title:{type:String,required:true},
   author:{type:String,required:true},
   student:mongoose.Types.ObjectId;
} 


const BooKSchema:Schema = new Schema({
    title: {type:String,required:true},
    author:{type:String,required:true},
    student:{type:mongoose.Schema.Types.ObjectId,ref:"Student",required:true}
})


export default mongoose.model<IBook>("Book",BooKSchema)


