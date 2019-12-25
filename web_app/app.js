// Character Class: Represents a Character
class Character {
  constructor(first, last, clan) {
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
        <td>${char.firstName}</td>
        <td>${char.lastName}</td>
        <td>${char.clan}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteChar(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
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

  static addChar(char) {
    const chars = Store.getChars();

    chars.push(char);

    localStorage.setItem("chars", JSON.stringify(chars));
  }

  // Edit this to remove by a unique id, rather than name
  static removeChar(firstName) {
    const chars = Store.getChars();

    chars.forEach((char, index) => {
      if (char.firstName === firstName) {
        chars.splice(index, 1);
      }
    });

    localStorage.setItem("chars", JSON.stringify(chars));
  }
}
// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayChars);

// Event: Add a Book
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
    // Instantiate Character
    const char = new Character(first, last, clan);

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

// Event: Remove a Character
document.querySelector("#char-list").addEventListener("click", e => {
  // Remove book from UI
  UI.deleteChar(e.target);

  // Remove character from store
  Store.removeChar(
    e.target.parentElement.parentElement.firstElementChild.textContent
  );
  console.log(
    e.target.parentElement.parentElement.firstElementChild.textContent
  );

  // Success message
  UI.showAlert("Character removed", "success");
});
