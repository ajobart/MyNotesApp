export default class NotesAPI {
  static getAllNotes() {
    const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");

    return notes.sort((a, b) => {
      return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
    });
  }

  static saveNote(noteToSave) {
    const notes = NotesAPI.getAllNotes();
    // On vérifie si la note existe déjà
    const existing = notes.find(note => note.id == noteToSave.id);
    // Si c'est le cas on veut pouvoir l'edit et update
    if (existing) {
      existing.title = noteToSave.title;
      existing.body = noteToSave.body;
      existing.updated = new Date().toISOString();
      // Sinon on la créer
    } else {
      // Génération de l'id avec MathRandom
      noteToSave.id = Math.floor(Math.random() * 1000000);
      // Récupérer la date en string
      noteToSave.updated = new Date().toISOString();
      notes.push(noteToSave);
    }
    localStorage.setItem("notesapp-notes", JSON.stringify(notes))
  }

  static deleteNote(id) {
    const notes = NotesAPI.getAllNotes();
    const newNotes = notes.filter(note => note.id != id);

    localStorage.setItem("notesapp-notes", JSON.stringify(newNotes))
  }
}
