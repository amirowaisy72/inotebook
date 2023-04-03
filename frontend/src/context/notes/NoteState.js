import { useState } from "react";
import context from "./noteContext";


const NoteState = (props)=>{
  // const host = "http://localhost:5000"
  const host = "https://inotebook-rho.vercel.app"

  //Notes useState
  const notesInit = []
  const [notes, setNotes] = useState(notesInit)

  //Add a note
  const addNote = async (title,description,tag) => {
    //Todo Api Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem("token")
      },
      body: JSON.stringify({title,description,tag})
    });
    const note = await response.json()
    setNotes(notes.concat(note.note))
    if(note.success == true){
      alertFunction("success","New note has been added")
    }else{
      alertFunction("danger",note.error)
    }
  }

  //Get all notes
  const getNotes = async () => {
    // Api Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem("token")
      },
      body: JSON.stringify()
    });
    const json = await response.json()
    setNotes(json)

  }

  //Delete a note
  const deleteNote = async (id) => {
    // API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem("token")
      }
    });

    const note = await response.json()

    if(note.success == true){
      alertFunction("success","Note has been deleted")
    }else{
      alertFunction("danger",note.error)
    }

    //Delete Clinet side
    const newNotes = notes.filter((note)=>{return note._id!==id})
    setNotes(newNotes)
  }

  //Edit a note
  const editNote = async (id,title,description,tag) => {
    // API Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem("token")
      },
      body: JSON.stringify({title,description,tag})
    });

    const note = await response.json()

    if(note.success == true){
      alertFunction("success","Note has been updated")
    }else{
      alertFunction("danger",note.error)
    }

    let newNotes = JSON.parse(JSON.stringify(notes))
    //Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if(element._id == id){
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes)
  }

  //Methodoly to create and use context state. (Example notes table CRUD)
  //Step 1 : Create a contextCreator.js file to initialize context
             // import {createContext} from "react";
             // const contextCreator = createContext();
             // export default contextCreator;
  //Step 2 : Create NoteState.js file to contol state of CRUD of notes
             // import context from "./contextCreator";
             // <context.Provider value={{//functions to control crud}}>
             //     {props.children}
             // </context.Provider>
             // Wrap all components of app.js inside NoteState.js
  //Step 3 : Use context in any file controling CRUD by importing (Example AddNote component) 
             // import contextCreator from "../context/notes/contextCreator";
             // const context = useContext(contextCreator)
             // const {addNote} = context // addNote function taken from NoteState.js to control note state


  // There are two works of context
  // First : Make file context provider and wrap all components of app.js inside it
  // Second : Fetch all functions of context provider to change state of context variable
  // For both import context from "./noteContext";
  // For first one,  make a providor of context
  // For second one, use context to execute function like this
  // const context = useContext(context)

  const initAlert = {
    status:"success",
    message:""
  }
  const [alert, setAlert] = useState(initAlert)         

  const alertFunction =  (status, message) => {
    setAlert({status:status, message:message})
  }
    return(
        <context.Provider value={{notes,addNote,deleteNote,editNote,getNotes,alertFunction,alert}}>
          {props.children}
        </context.Provider>
    )
}

export default NoteState;