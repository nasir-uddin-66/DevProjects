import mongoose from "mongoose";

export default async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}
