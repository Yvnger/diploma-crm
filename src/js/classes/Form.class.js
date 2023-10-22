import {createEl} from "../helpers.js";
import {Contacts} from "./Contacts.class.js";

export class Form {
    constructor(action, data = null) {
        this.id = data ? data.id : "";
        this._name = data ? data.name : "";
        this._surname = data ? data.surname : "";
        this._lastName = data ? data.lastName : "";
        this._contacts = data ? data.contacts : [];

        this.surnameField = null;
        this.nameField = null;
        this.lastNameField = null;
        this.contactsClass = null;

        this.form = null;
        this.inputInvalidClass = 'form__input--invalid';
    }

    createElement() {
        this.form = createEl("form", "form");
        const personGroup = createEl("div", "form__person-group");

        this.surnameField = this.createPersonField("surname", "Фамилия", true, this.surname);
        this.surnameField.input.addEventListener('input', () => {
            this.surname = this.surnameField.input.value;
        })

        this.nameField = this.createPersonField("name", "Имя", true, this.name);
        this.nameField.input.addEventListener('input', () => {
            this.name = this.nameField.input.value;
        })

        this.lastNameField = this.createPersonField("lastName", "Отчество", false, this.lastName);
        this.lastNameField.input.addEventListener('input', () => {
            this.lastName = this.lastNameField.input.value;
        })

        this.contactsClass = new Contacts(this.contacts);

        // Append
        this.form.append(personGroup, this.contactsClass.element());
        personGroup.append(this.surnameField.main, this.nameField.main, this.lastNameField.main);

        return this.form;
    }

    createPersonField(slug, name, required, data = null) {
        const main = createEl("div", "form__group");

        const input = createEl("input", "form__input");
        input.type = "text";
        input.id = slug;
        input.placeholder = name;
        input.required = required;

        if (data) {
            input.value = data;
        }

        const label = createEl("label", "form__label");
        label.for = slug;
        label.innerText = name;

        // Appends
        main.append(input, label);

        return {main, input};
    }

    showErrors(fields) {
        fields.forEach(field => {
            if (field === "name") {
                this.nameField.input.classList.add(this.inputInvalidClass);
            }
            if (field === "surname") {
                this.surnameField.input.classList.add(this.inputInvalidClass);
            }
            if (field === "lastName") {
                this.lastNameField.input.classList.add(this.inputInvalidClass);
            }
        });
    }

    // Геттеры и сеттеры
    get element() {
        return this.form;
    }

    get data() {
        return {
            id: this.id || null,
            name: this.name,
            surname: this.surname,
            lastName: this.lastName,
            contacts: this.contactsClass.list
        }
    }

    // Геттеры и сеттеры

    set name(value) {
        this._name = value;
    }

    get name() {
        return this._name;
    }

    set surname(value) {
        this._surname = value;
    }

    get surname() {
        return this._surname;
    }

    set lastName(value) {
        this._lastName = value;
    }

    get lastName() {
        return this._lastName;
    }

    set contacts(value) {
        this._contacts = value;
    }

    get contacts() {
        return this._contacts;
    }
}