// Character Class: Represents a Character
class Character {
  constructor(id, first, last, clan) {
    this.id = id;
    this.firstName = first;
    this.lastName = last;
    this.clan = clan;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayChars() {
    const chars = Store.getChars();

    chars.forEach(char => UI.addCharToList(char));
  }

  static addCharToList(char) {
    const list = document.querySelector("#char-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${char.id}</td>
        <td>${char.firstName}</td>
        <td>${char.lastName}</td>
        <td>${char.clan}</td>
        <td>
          <a href="#" class="btn btn-danger btn-sm delete">X</a>
          <a href="#" class="btn btn-info btn-sm edit">Edit</a>
        </td>
    `;

    list.appendChild(row);
  }

  static deleteChar(el) {
    el.parentElement.parentElement.remove();
  }

  // Open editing fields in a row
  static openEdit(el, id) {
    const charToBeEdited = Store.getChar(id);

    el.parentElement.parentElement.innerHTML = `
      <td>${charToBeEdited.id}</td>
      <form id = "char-edit-form">
      <td><input type="text" id="edit-first" class="form-control" value=${charToBeEdited.firstName} /></td>
      <td><input type="text" id="edit-last" class="form-control" value=${charToBeEdited.lastName} /></td>
      <td><input type="text" id="edit-clan" class="form-control" value=${charToBeEdited.clan} /></td>
      <td>
        <a href="#" class="btn btn-info btn-sm save-edit">Save</a>
        <a href="#" class="btn btn-danger btn-sm cancel-edit">Cancel</a>
      </td>
      </form>
    `;
  }

  static cancelEdit(el, id) {
    const charToBeEdited = Store.getChar(id);

    el.parentElement.parentElement.innerHTML = `
    <td>${charToBeEdited.id}</td>
    <td>${charToBeEdited.firstName}</td>
    <td>${charToBeEdited.lastName}</td>
    <td>${charToBeEdited.clan}</td>
    <td>
      <a href="#" class="btn btn-danger btn-sm delete">X</a>
      <a href="#" class="btn btn-info btn-sm edit">Edit</a>
    </td>
    `;
  }

  static saveEditToList(el, id) {
    const charToBeEdited = Store.getChar(id);

    const first = document.querySelector("#edit-first").value;
    const last = document.querySelector("#edit-last").value;
    const clan = document.querySelector("#edit-clan").value;

    el.parentElement.parentElement.innerHTML = `
    <td>${charToBeEdited.id}</td>
    <td>${first}</td>
    <td>${last}</td>
    <td>${clan}</td>
    <td>
      <a href="#" class="btn btn-danger btn-sm delete">X</a>
      <a href="#" class="btn btn-info btn-sm edit">Edit</a>
    </td>
    `;

    // Also save edit to storage, getting values from UI
    Store.editChar(id, first, last, clan);
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#char-form");
    container.insertBefore(div, form);

    // Remove alert after 3 seconds
    setTimeout(() => div.remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#first").value = "";
    document.querySelector("#last").value = "";
    document.querySelector("#clan").value = "";
  }
}

// Store Class: Handles Storage
class Store {
  static getChars() {
    let chars;
    if (localStorage.getItem("chars") === null) {
      chars = [];
    } else {
      chars = JSON.parse(localStorage.getItem("chars"));
    }

    return chars;
  }

  // Get a specific character by it's ID number
  static getChar(id) {
    const chars = Store.getChars();
    let charToReturn;

    chars.forEach(char => {
      if (char.id === id) {
        charToReturn = char;
      }
    });

    return charToReturn;
  }

  static addChar(char) {
    const chars = Store.getChars();

    chars.push(char);

    localStorage.setItem("chars", JSON.stringify(chars));
  }

  // Edit this to remove by a unique id, rather than name
  static removeChar(id) {
    const chars = Store.getChars();

    chars.forEach((char, index) => {
      if (char.id === id) {
        chars.splice(index, 1);
      }
    });

    localStorage.setItem("chars", JSON.stringify(chars));
  }

  static editChar(id, first, last, clan) {
    let charToEdit = Store.getChar(id);
    const chars = Store.getChars();

    charToEdit.firstName = first;
    charToEdit.lastName = last;
    charToEdit.clan = clan;

    chars.forEach((char, index) => {
      if (char.id === id) {
        chars.splice(index, 1, charToEdit);
      }
    });

    localStorage.setItem("chars", JSON.stringify(chars));
  }
}
// Event: Display Characters
document.addEventListener("DOMContentLoaded", UI.displayChars);

// Event: Add a Character
document.querySelector("#char-form").addEventListener("submit", e => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const first = document.querySelector("#first").value;
  const last = document.querySelector("#last").value;
  const clan = document.querySelector("#clan").value;

  // Validate
  if (first == "" || last == "" || clan == "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // Generate an ID for the character
    const chars = Store.getChars();
    let id;
    if (chars === null || chars.length === 0) {
      id = 1;
    } else {
      const lastChar = chars[chars.length - 1];
      id = lastChar.id + 1;
    }

    // Instantiate Character
    const char = new Character(id, first, last, clan);

    // Add Character to UI
    UI.addCharToList(char);

    // Add Character to store
    Store.addChar(char);

    // Clear fields
    UI.clearFields();

    // Success message
    UI.showAlert("Character successfully created", "success");
  }
});

// Event: Table row button is clicked
document.querySelector("#char-list").addEventListener("click", e => {
  const clickedCharID = parseInt(
    e.target.parentElement.parentElement.firstElementChild.textContent
  );

  const clickedButton = e.target;

  if (e.target.classList.contains("delete")) {
    // Delete button is clicked

    // Remove book from UI
    UI.deleteChar(clickedButton);

    // Remove character from store, using ID (first element on the table).
    // Need to use parseInt() as the ID is a string on webpage, but a number in storage.
    Store.removeChar(clickedCharID);

    // Success message
    UI.showAlert("Character removed", "success");
  } else if (clickedButton.classList.contains("edit")) {
    // Edit button is clicked
    // Open edit fields
    UI.openEdit(clickedButton, clickedCharID);

    // Update Character on UI and close edit fields
    // Update Character in Store

    // Cancel edit (closes edit fields)
  } else if (clickedButton.classList.contains("cancel-edit")) {
    UI.cancelEdit(clickedButton, clickedCharID);

    // Save Edit
  } else if (clickedButton.classList.contains("save-edit")) {
    UI.saveEditToList(clickedButton, clickedCharID);
  }
});
