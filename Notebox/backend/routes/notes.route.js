import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getNoteDetails,
} from "../controller/notes.controller.js";
import { Router } from "express";
const router = Router();

router.route("/").get(getNotes).post(createNote);
router.route("/:id").put(updateNote).delete(deleteNote).get(getNoteDetails)

export default router;
