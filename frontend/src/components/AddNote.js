import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

const AddNote = () => {
    const context = useContext(noteContext)
    const {addNote} = context

    const [note , setNote] = useState({title:"",description:"",tag:"default"})

    const onChange = (e) => {
        setNote({...note, [e.target.name]: e.target.value})
    }

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag)
        setNote({title:"",description:"",tag:""})
    }
  return (
    <div>
      <div className="container my-3">
        <h2>Add a Note</h2>
        <form>
          <div className="form-group my-2">
            <input
              type="text"
              className="form-control"
              id="title" name="title"
              aria-describedby="emailHelp"
              placeholder="Enter Title" value={note.title} onChange={onChange}
            />
          </div>
          <div className="form-group my-2">
            <input
              type="text"
              className="form-control"
              id="description" name="description"
              placeholder="Description" value={note.description} onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="tag" name="tag"
              placeholder="Tag" value={note.tag} onChange={onChange}
            />
          </div>
          <button disabled={note.title.length<3 || note.description.length<3} type="submit" onClick={handleClick} className="btn btn-primary my-3">
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
