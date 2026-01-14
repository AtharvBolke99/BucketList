import { Schema, model } from "mongoose";

const bucketListSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  priority : { type : Number, required : false , default : 0},
  iscompleted : { type : Boolean, required: false, default : false}
});

const BucketList = model("BucketList", bucketListSchema);

export default BucketList;
