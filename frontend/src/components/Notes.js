import React, { useContext, useEffect, useState } from "react";
import noteContext from "../context/notes/noteContext";
import AddNote from "./AddNote";
import NoteItem from "./NoteItem";
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";

const Notes = () => {
  const [show, setShow] = useState(false);

  let navigate = useNavigate()

  const handleClose = () => setShow(false);
  const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" })
  const updateNote = (currentNote) => {
    setShow(true);
    setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })
  }

  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  useEffect(() => {
    if(localStorage.getItem("token")){
      getNotes();
    }else{
      navigate("/login")
    }
  }, []);

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }

  const handleClick = (e) => {
    e.preventDefault();
    editNote(note.id, note.etitle, note.edescription, note.etag)
    handleClose()
  }

  return (
    <>
      <AddNote />

      <Modal show={show} onHide={handleClose}>
        <div>
          <div className="container my-3">
            <h2>Update a Note</h2>
            <form>
              <div className="form-group my-2">
                <input
                  type="text"
                  className="form-control"
                  id="etitle" name="etitle"
                  aria-describedby="emailHelp"
                  placeholder="Enter Title" minLength={3} required value={note.etitle} onChange={onChange}
                />
              </div>
              <div className="form-group my-2">
                <input
                  type="text"
                  className="form-control"
                  id="edescription" name="edescription"
                  placeholder="Description" minLength={3} required value={note.edescription} onChange={onChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="etag" name="etag"
                  placeholder="Tag" minLength={3} required value={note.etag} onChange={onChange}
                />
              </div>
              <button disabled={note.etitle.length<3 || note.edescription.length<3} type="submit" onClick={handleClick} className="btn btn-primary my-3">
                Update Note
              </button>
            </form>
          </div>
        </div>
      </Modal>

      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container mx-2">
          {notes.length == 0 && 'No notes to display'}
        </div>
        {notes.map((note) => {
          return (
            <NoteItem key={note._id} updateNote={updateNote} note={note} />
          );
        })}
      </div>
    </>
  );
};

export default Notes;
