import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import BucketList from "./models/BucketList.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

const MONGO_URI = process.env.MONGO_URI;

app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Welcome to BucketList App",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: true,
    message: "Server is healthy",
  });
});

app.post("/bucketlists", async (req, res) => {
  const { name, description, priority, iscompleted } = req.body;

  if (!name) {
    return res.json({
      status: false,
      message: "name is required",
    });
  }

  if (!description) {
    return res.json({
      status: false,
      message: "description is required",
    });
  }

  if (priority === undefined) {
    return res.json({
      status: false,
      message: "priority is required",
    });
  }

  const newBucketList = new BucketList({
    name,
    description,
    priority,
    iscompleted,
  });

  try {
    const savedBucketList = await newBucketList.save();
    return res.json({
      status: true,
      message: "new bucket list added succesfully",
    });
  } catch (e) {
    return res.json({
      status: false,
      message: e.message,
    });
  }
  res.json({
    status: true,
    message: "new bucket list added succesfully",
    data: newBucketList,
  });
});

app.get("/bucketlists", async (req, res) => {
  const bucketlist = await BucketList.find();
  res.json({
    status: true,
    message: "bucket list items feteched successfully",
    data: bucketlist,
  });
});

app.patch("/bucketlists/:id/complete", async (req, res) => {
  const { id } = req.params;

   await BucketList.updateOne({ _id: id }, { $set: { iscompleted: true } });

   const updatedBucketList = await BucketList.findOne({ _id: id });

   return res.json( {
    status : true,
    message : "Bucket List updated succesfully",
    data : updatedBucketList,
  });
});



app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
  mongoConnection();
});

const mongoConnection = async () => {
  const conn = await mongoose.connect(MONGO_URI);

  if (conn) {
    console.log("Database connected successfully");
  }
};
