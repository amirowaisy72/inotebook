import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

const NoteItem = (props) => {
  const { note ,updateNote} = props;
  const context = useContext(noteContext)
  const {deleteNote} = context
  return (
    <>
      <div className="col-md-3 my-2">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{note.title}</h5>
            <p className="card-text">{note.description}</p>
            <i className="fa-solid fa-trash" onClick={()=>{deleteNote(note._id)}}></i>
            <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>{updateNote(note)}}></i>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteItem;
