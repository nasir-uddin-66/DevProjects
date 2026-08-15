import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Link } from "react-router";
import { toast } from "react-hot-toast";
import api from "../lib/axios.js";

export default function NoteCard({ note, setNotes }) {
  const handleDeletion = async (id) => {
    if (!confirm("Do you really want to delete this note?")) return;
    try {
      let deletedNote = await api.delete(`/notes/${id}`);
      toast.success(deletedNote.data.message);
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.log("Error - ", error);
      toast.error("Cannot Delete Note!");
    }
  };

  return (
    <Card
      className="p-2 pb-3 border-b-2 border-green-500"
      style={{ borderRadius: "0.85rem" }}
    >
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {note.title}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {note.content}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
          style={{ marginTop: "1rem", fontSize: "0.70rem", textAlign: "end" }}
        >
          {new Date(note.createdAt).toLocaleString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </CardContent>
      <div className="px-4 py-1 text-green-500">
        <Link to={`/edit/${note._id}`}>
          <i className="fa-solid fa-pen-to-square"></i>
        </Link>
        <Link
          onClick={() => handleDeletion(note._id)}
          style={{ marginLeft: "0.5rem" }}
        >
          <i className="fa-solid fa-trash"></i>
        </Link>
      </div>
    </Card>
  );
}
