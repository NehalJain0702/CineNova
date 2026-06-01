import { useState } from "react";
import axios from "axios";

function AddMovie() {

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [poster, setPoster] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("poster", poster);

    await axios.post(
      "http://localhost:8080/api/movies",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    alert("Movie Added!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Movie Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Genre"
        onChange={(e) => setGenre(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setPoster(e.target.files[0])}
      />

      <button type="submit">
        Add Movie
      </button>
    </form>
  );
}

export default AddMovie;