const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE: 1 -  Get all the notes using GET "/api/notes/getuser". Login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error ");
  }
});

// ROUTE: 2 -Add notes using POST "/api/notes/addnote". Login required

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid Title !!").isLength({ min: 2 }),
    body("description", "Enter at least something in the Description field !!").isLength({
      min: 2,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there are errors, return the bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error !!");
    }
  }
);
// ROUTE: 3 -Update Notes using  PUT "/api/notes/updatenote". Login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // Create a new note object
    const newNote = {}
    if (title) { newNote.title = title; }
    if (description) { newNote.description = description; }
    if (tag) { newNote.tag = tag; }
    // Find the note to be update and update it 
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found !!");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not Allowed !!");
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error !!");
  }
}
);
// ROUTE: 4 - Delete Notes using  DELETE "/api/notes/deletenote". Login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {

  try {
    // Find the note to be deleted and delete it 
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found !!");
    }
    // Only allow deletion of the note if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not Allowed !!");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Note Deleted Successfully !!", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error !!");
  }
});

module.exports = router;
