import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import notesRouter from "./routes/notes.route.js";
import path from "path";
const app = express();

dotenv.config();

//middleware
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}
app.use(express.json());

const __dirname = path.resolve();

app.use("/api/notes", notesRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/notebox/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend", "notebox", "dist", "index.html")
    );
  });
}

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`app is listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
