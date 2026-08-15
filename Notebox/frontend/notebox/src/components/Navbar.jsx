import Button from "@mui/material/Button";
import { Link } from "react-router";

export default function Navbar() {
  return (
    <header>
      <div className="py-4 px-6 max-w-4xl font-mono border-b border-green-500 mx-auto flex items-center justify-between">
        <h1 className="text-3xl font-bold text-green-500">Notebox</h1>

        <Button
          variant="contained"
          color="success"
          style={{ borderRadius: "1.25rem" }}
        >
          <Link to="/create">
            <i className="fa-solid fa-plus"></i> Create
          </Link>
        </Button>
      </div>
    </header>
  );
}
