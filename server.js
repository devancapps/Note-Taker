const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Return the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Return the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Read and return saved notes as JSON
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  res.json(notes);
});

// Receive and save new notes
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuid.v4();

  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  notes.push(newNote);
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes));
  res.json(newNote);
});

// Delete a specific note by ID
app.delete('/api/notes/:id', (req, res) => {
  const idToDelete = req.params.id;
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  const updatedNotes = notes.filter((note) => note.id !== idToDelete);
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(updatedNotes));
  res.json({ message: 'Note deleted successfully' });
});


app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
