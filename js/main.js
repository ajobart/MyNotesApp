import NotesView from './NotesView.js'
import NotesAPI from './NotesAPI.js'

const app = document.getElementById("app");
const view = new NotesView(app, {
  onNoteAdd() {
    console.log("Let's add a new note");
  },

  onNoteSelect(id) {
    console.log("Note selected : " + id)
  },

  onNoteEdit(newTitle, newBody) {
    console.log(newTitle);
    console.log(newBody);
  },

  onNoteDelete(id) {
    console.log("Note Deleted : " + id)
  },
});

const notes = NotesAPI.getAllNotes();

view.updateNoteList(notes);
view.updateActiveNote(notes[0]);
