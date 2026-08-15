import Note from "../models/notes.model.js";

const getNotes = async (_, res) => {
  try {
    let notes = await Note.find().sort({ createdAt: -1 }); // newest note first
    res.status(200).json(notes);
  } catch (error) {
    console.log("Error in getting notes");
    res.status(500).json({ message: "Internal server error" });
  }
};

const createNote = async (req, res) => {
  try {
    let { title, content } = req.body;
    let newNote = new Note({ title, content });
    await newNote.save();
    res.status(201).json({ message: "Note Created Successfully!" });
  } catch (error) {
    console.log("Error in creating note");
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateNote = async (req, res) => {
  try {
    let { title, content } = req.body;
    let updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
      },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found!" });
    }
    res.status(200).json({ message: "Note Updated Successfully!" });
  } catch (error) {
    console.log("Error in updating note");
    res.status(500).json({ message: "Internal server error" });
  }
};

const getNoteDetails = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found!" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.log("Error in finding note");
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteNote = async (req, res) => {
  try {
    let deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found!" });
    }
    res.status(200).json({ message: "Note Deleted Successfully!" });
  } catch (error) {
    console.log("Error in deleting note");
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getNotes, createNote, updateNote, deleteNote, getNoteDetails };
