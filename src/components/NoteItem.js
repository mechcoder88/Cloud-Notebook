import React, { useState, useContext } from "react";
import noteContext from "../Context/Notes/noteContext";

const NoteItem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { Notes, updateNote } = props;

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="col-md-3">
      <div className="card my-3 note_body_style">
        <div className="card-header note_title_style">{Notes.title}</div>
        <div className="card-body note_description_style">
          <blockquote className="blockquote mb-0">
            <p>{Notes.description}</p>
            <footer className="footer">
              {Notes.time}
              <cite title="Source Title">{Notes.lastUpdated}</cite>
            </footer>
            <i
              className={`fa-solid fa-trash mx-2 ${isHovered ? "fa-fade" : ""}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                deleteNote(Notes._id);
                props.showAlert("Deleted Successfully", "success");
              }}
            ></i>
            <i
              className="fa-solid fa-pen-to-square mx-2"
              onClick={() => {
                updateNote(Notes);
              }}
            ></i>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
