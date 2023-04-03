const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


//ROUTE 1 : Get all the notes using GET "/api/notes/fetchallnotes" Login require
router.get('/fetchallnotes' , fetchuser , async (req, res)=>{
    const notes = await Notes.find({user:req.user.id});
    res.json(notes);
})

//ROUTE 2 : Add a new note using POST "/api/notes/addnote" Login require
router.post('/addnote' , fetchuser , [
    body('title', 'Minimum length of Title is 3').isLength({ min: 3 }),
    body('description', 'Minimum length of Description is 3').isLength({ min: 3 })
] , async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }else{
        let success = false
        try{
            //Store a new note
            const {title, description, tag} = req.body;
            let note = await Notes.create({
                user: req.user.id,
                title:title,
                description: description,
                tag: tag
            })
            success = true
            res.send({success,note});
        }catch(error){
            res.status(500).json({success,error:error.message});
        }
    } 
})

//ROUTE 3 : Update an existing note using PUT "/api/notes/updatenote" Login require
router.put('/updatenote/:id', fetchuser , [
    body('title', 'Minimum length of Title is 3').isLength({ min: 3 }),
    body('description', 'Minimum length of Description is 3').isLength({ min: 3 })
] , async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }else{
        let success = false
        try{
            const {title, description, tag} = req.body;
            // Create a new note object
            const newNote = {};
            if(title){newNote.title = title}
            if(description){newNote.description = description}
            if(tag){newNote.tag = tag}
            //Find the note to be updated and update it
            let note = await Notes.findById(req.params.id);
            if(!note){
                res.status(404).send("Note not found");
            }else{
                if(note.user.toString() != req.user.id){
                    res.status(404).send("Not allowed");
                }else{
                    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
                    success = true
                    res.send({success,message:'Note has been pdated at Note id : '+req.params.id+' by user '+req.user.id});
                }
            }
        }catch (error){
            res.status(500).json({success,error:error.message});
        }
    }
})

//ROUTE 4 : Delete an existing note using POST "/api/notes/deletenote" Login require
router.delete('/deletenote/:id', fetchuser , async (req, res)=>{
    let success = false
    try{
        //Find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        if(!note){
            res.status(404).send("Note not found");
        }else{
            if(note.user.toString() != req.user.id){
                res.status(404).send("Not allowed to delete this note");
            }else{
                note = await Notes.findByIdAndDelete(req.params.id)
                success = true
                res.send({success,message:"Note at id : "+req.params.id+" Has been deleted"});
            }
        }
    }catch (error){
        res.status(500).json({success,error:error.message});
    }
})

module.exports = router;