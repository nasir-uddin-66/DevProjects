import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import api from "../lib/axios.js";

export default function CreatePage() {
  const navigate = useNavigate();
  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please Enter Title And Content!");
      return;
    }

    try {
      let note = await api.post("/notes", {
        title,
        content,
      });
      toast.success(note.data.message);
      navigate("/");
    } catch (error) {
      console.log("Error - ", error);
      toast.error("Could Not Create Note!");
    }
    setTitle("");
    setContent("");
  };

  return (
    <div className="max-w-4xl font-mono mx-auto">
      <div className="py-4 px-6 border-b border-green-500 mx-auto">
        <Button color="success" sx={{ borderRadius: "2rem" }}>
          <Link to="/">
            <i className="fa-solid fa-arrow-left"></i>&nbsp;
            <span>Back to home</span>
          </Link>
        </Button>
      </div>

      <Card variant="outlined" sx={{ padding: "2rem 2rem" }}>
        <h1 className="max-w-xl mx-auto text-2xl font-bold text-green-500 mb-10">
          Create New Note
        </h1>

        <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
          <label htmlFor="title" className="font-semibold text-green-500">
            <span>Enter Title</span>
          </label>
          <br />
          <input
            type="text"
            id="title"
            value={title}
            placeholder="Note Title"
            className="bg-black mx-auto w-full p-2 mt-4 text-green-500 placeholder:text-green-600"
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <br />
          <label htmlFor="content" className="font-semibold text-green-500">
            Enter Content
          </label>
          <br />
          <textarea
            type="text"
            id="content"
            value={content}
            placeholder="Write your note here..."
            className="bg-black mx-auto w-full p-2 mt-4 text-green-500 placeholder:text-green-600 h-36 text-start"
            onChange={(e) => setContent(e.target.value)}
          />

          <Button
            type="submit"
            color="success"
            variant="contained"
            sx={{ marginTop: "1rem" }}
          >
            Create Note
          </Button>
        </form>
      </Card>
    </div>
  );
}
