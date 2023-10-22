import {createEl, padNumber} from "../helpers.js";
import {Modal} from "./Modal.class.js";
import {getClient} from "../api.js";
import {Contacts} from "./Contacts.class.js";

export class Client {
    constructor(data, table = null) {
        this.id = data.id;
        this.name = data.name;
        this.surname = data.surname;
        this.lastName = data.lastName;
        this.fullName = `${this.surname} ${this.name} ${this.lastName}`;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.contacts = data.contacts;
        this.table = table;
        this.rowItem = '';
        this.markClass = 'list-item--selected';
    }

    getDateElement(date) {
        const convert = new Date(date);
        const dateFormat = `${padNumber(convert.getDate())}.${padNumber(convert.getMonth() + 1)}.${convert.getFullYear()}`;
        const timeFormat = `<span class="list-item__time">${padNumber(convert.getHours())}:${padNumber(convert.getMinutes())}</span>`;

        return dateFormat + timeFormat;
    }

    createCell(inner, type = null) {
        const cell = createEl("div", "table__cell");

        if (type === "id") {
            cell.classList.add("list-item__id");
        } else if (type === "contacts") {
            cell.classList.add("contact");
        }

        if (typeof inner === "object") {
            cell.append(inner);
        } else {
            cell.innerHTML = inner;
        }

        return cell;
    }

    createAction(item) {
        const action = createEl("a", "table__link", `table__link--${item.slug}`);
        action.href = "javascript:void(0)";
        const span = createEl("span", "table__link-icon");

        const loadingClass = "table__link--loading";

        // Events
        action.addEventListener("click", () => {
            if (item.slug === "edit") {
                action.classList.add(loadingClass);

                getClient(this.id)
                    .then(data => {
                        const modal = new Modal(item.slug, this.table, data);
                        document.body.append(modal.element());
                    })
                    .catch(error => {
                        console.error(error)
                    })
                    .finally(() => {
                        action.classList.remove(loadingClass);
                    })
            } else if (item.slug === "remove") {
                const modal = new Modal(item.slug, this.table, {id: this.id});
                document.body.append(modal.element());
            }
        })

        // Appends
        action.append(span, item.name);

        return action;
    }

    markElement() {
        this.rowItem.classList.add(this.markClass);
        this.rowItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

        setTimeout(() => {
            this.rowItem.classList.remove(this.markClass);
        }, 3000);
    }

    createActions() {
        const wrap = createEl("div", "table__link-group");

        const edit = this.createAction({
            name: "Изменить",
            slug: "edit"
        });

        const remove = this.createAction({
            name: "Удалить",
            slug: "remove"
        })

        // Appends
        wrap.append(edit, remove);

        return wrap;
    }

    createElement() {
        this.rowItem = createEl("div", "table__row", "list-item");
        const contactList = new Contacts(this.contacts);
        const cellId = this.createCell(this.id, "id");
        const cellName = this.createCell(this.fullName);
        const cellCreatedAt = this.createCell(this.getDateElement(this.createdAt));
        const cellUpdatedAt = this.createCell(this.getDateElement(this.updatedAt));
        const cellContacts = this.createCell(contactList.createTableContacts(), "contacts");
        const cellActions = this.createCell(this.createActions());

        // Appends
        this.rowItem.append(cellId, cellName, cellCreatedAt, cellUpdatedAt, cellContacts, cellActions);

        return this.rowItem;
    }
}