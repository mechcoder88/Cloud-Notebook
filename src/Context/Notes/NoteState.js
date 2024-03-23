import React, { useState } from "react";
import noteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Get all notes 
  const getNotes = async () => {
    // API Call 
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });

    const AllNotes = await response.json();
    setNotes(AllNotes);
  }

  //  Add a Note 
  const addNotes = async (title, description, tag) => {
    // To Do API Call 
    const note = {
      title: title,
      description: description,
      tag: tag
    };

    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify(note)
    });

    const addnewnote = await response.json()
    setNotes(notes.concat(addnewnote))
  }


  // Delete a Note
  const deleteNote = async (id) => {

    //API Call
    // eslint-disable-next-line
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });

    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes);
  }

  // Update a Note

  const updateNotes = async (id, title, description, tag) => {
    //API Call
    // eslint-disable-next-line
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });

    let newNotes = JSON.parse(JSON.stringify(notes))
    // Logic to edit in client
    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
      }
    }
    setNotes(newNotes);
  }
  
  return (
    <noteContext.Provider value={{ notes, setNotes, addNotes, deleteNote, updateNotes, getNotes }}>
      {props.children}
    </noteContext.Provider>
  )

}

export default NoteState;
