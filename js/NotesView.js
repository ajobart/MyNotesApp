export default class NotesView {
  constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `
      <div class="notes__sidebar">
        <button class="notes__add" type="button">Add note</button>
        <div class="notes__list"></div>
      </div>
      <div class="notes__preview">
        <input class="notes__title" type="text" placeholder="New note...">
        <textarea class="notes__body" placeholder="Write here..."></textarea>
      </div>
    `;

    const btnAddNote = this.root.querySelector(".notes__add");
    const inpTitle = this.root.querySelector(".notes__title");
    const inpBody = this.root.querySelector(".notes__body");

    btnAddNote.addEventListener("click", () => {
      this.onNoteAdd();
    });

    [inpTitle, inpBody].forEach(inputField => {
      inputField.addEventListener("blur", () => {
        // La méthode trim() supprime les espaces des deux côtés d'une chaîne de caractères.
        const updatedTitle = inpTitle.value.trim();
        const updatedBody = inpBody.value.trim();

        this.onNoteEdit(updatedTitle, updatedBody);
      });
    });

    //Cacher la preview des notes par default
    this.updateNotePreviewVisibility(false);
  }

  // Créer un nouvel élement à la création d'une note dans la sidebar
  _createListItemHTML(id, title, body, updated) {
    const MAX_BODY_LENGTH = 60;

    return `
      <div class="notes__list-item" data-note-id="${id}">
        <div class="notes__small-title">${title}</div>
        <div class="notes__small-body">
          ${body.substring(0, MAX_BODY_LENGTH)}
          ${body.length > MAX_BODY_LENGTH ? "..." : ""}
        </div>
        <div class="notes__small-updated">
          <!--Obtenir une date sous forme de string, en utilisant les conventions locales-->
          ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
        </div>
      </div>
    `;
  }

  updateNoteList(notes) {
    const notesListContainer = this.root.querySelector(".notes__list");

    //Liste vide
    notesListContainer.innerHTML = "";

    for (const note of notes) {
      const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

      notesListContainer.insertAdjacentHTML("beforeend", html);
    }

    //On ajoute les events SELECT/DELETE pour chaques notes
    notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
      noteListItem.addEventListener('click', () => {
        this.onNoteSelect(noteListItem.dataset.noteId);
      });

      noteListItem.addEventListener("dblclick", () => {
        const doDelete = confirm("Are your sure to delete this note ?");

        if (doDelete) {
          this.onNoteDelete(noteListItem.dataset.noteId)
        }
      });
    });
  }

  updateActiveNote(note) {
    this.root.querySelector(".notes__title").value = note.title;
    this.root.querySelector(".notes__body").value = note.body;

    this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
      noteListItem.classList.remove("notes__list-item--selected");
    });

    this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
  }

  updateNotePreviewVisibility(visible) {
    this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
  }
}
