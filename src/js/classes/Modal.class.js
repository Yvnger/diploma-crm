import {createEl} from "../helpers.js";
import {createClient, removeClient, updateClient} from "../api.js";
import {Form} from "./Form.class.js";

export class Modal {
    constructor(action, table, client = null) {
        this.action = action;
        this.table = table;
        this.client = client;
        this.modal = null;
        this.openedClass = "modal--opened";
        this.buttonLoadingClass = 'btn--loading';
        this.errors = '';
        this.titles = {
            create: "Новый клиент",
            edit: "Изменить данные",
            remove: "Удалить клиента"
        };
        this.submitValues = {
            create: "Добавить",
            edit: "Сохранить",
            remove: "Удалить"
        };
    }

    element() {
        this.modal = createEl("div", "modal");
        const body = createEl("div", "modal__body");
        const heading = this.createModalHeading();
        const close = createEl("button", "btn", "modal__close");
        close.setAttribute("aria-label", "Закрыть окно");

        setTimeout(() => {
            this.modal.classList.add(this.openedClass);
        }, 1);

        // Events
        body.addEventListener("click", event => {
            event._clickOnBody = true;
        })

        this.modal.addEventListener("click", event => {
            if (event._clickOnBody) return;
            this.close();
        })

        close.addEventListener("click", () => {
            this.close()
        })

        this.errors = createEl('span', 'contact-form__error');

        const buttons = this.createButtonGroup(this.submitValues[this.action], this);

        // Appends
        document.body.append(this.modal);
        this.modal.append(body);
        body.append(heading, close);

        if (this.action === "create") {
            const form = new Form(this.action);
            body.append(form.createElement(), this.errors, buttons.submit);

            // Events
            buttons.submit.addEventListener('click', () => {
                const data = form.data;

                buttons.submit.classList.add(this.buttonLoadingClass);

                createClient(data)
                    .then(() => {
                        this.table.renderList();
                        this.close();
                    })
                    .catch(error => {
                        const errors = JSON.parse(error.message).errors;
                        const errorFields = errors.map(item => item.field);
                        form.showErrors(errorFields);
                        this.displayErrors(errors);
                    })
                    .finally(() => {
                        buttons.submit.classList.remove(this.buttonLoadingClass);
                    });
            })
        } else if (this.action === "edit") {
            const form = new Form(this.action, this.client);
            body.append(form.createElement(), this.errors, buttons.submit);

            // Events
            buttons.submit.addEventListener('click', () => {
                const data = form.data;

                buttons.submit.classList.add(this.buttonLoadingClass);

                updateClient(data)
                    .then(() => {
                        this.table.renderList();
                        this.close();
                    })
                    .catch(error => {
                        const errors = JSON.parse(error.message).errors;
                        const errorFields = errors.map(item => item.field);
                        form.showErrors(errorFields);
                        this.displayErrors(errors);
                    })
                    .finally(() => {
                        buttons.submit.classList.remove(this.buttonLoadingClass);
                    });
            })
        } else if (this.action === "remove") {
            body.append(this.errors, buttons.submit);

            // Events
            buttons.submit.addEventListener("click", () => {
                buttons.submit.classList.add(this.buttonLoadingClass);

                removeClient(this.client.id)
                    .then(() => {
                        this.table.renderList();
                        this.close();
                    })
                    .finally(() => {
                        buttons.submit.classList.remove(this.buttonLoadingClass);
                    })
            });
        }

        body.append(buttons.cancel);

        // Events
        buttons.cancel.addEventListener("click", () => this.close());

        return this.modal;
    }

    createModalHeading() {
        const heading = createEl("div", "modal__heading");

        const title = createEl("h2", "modal__title");
        title.innerText = this.titles[this.action];

        heading.append(title);

        if (this.action === "edit") {
            const id = createEl("span", "modal__id");
            id.innerText = `ID: ${this.client.id}`;

            heading.append(id);
        } else if (this.action === "remove") {
            heading.classList.add("modal__heading--center");

            // Описание
            const description = createEl("p", "modal__description");
            description.innerText = "Вы действительно хотите удалить данного клиента?";

            heading.append(description)
        }

        return heading;
    }

    createButtonGroup(submitText) {
        const submit = createEl("button", "btn", "btn--primary", "btn--fill", "contact-form__submit");
        submit.innerText = submitText;

        const cancel = createEl("a", "contact-form__bottom-link");
        cancel.href = "#";
        cancel.innerText = "Отмена";

        return {submit, cancel};
    }

    displayErrors(array = null) {
        if (array) {
            if (this.errors.classList.contains('contact-form__error--empty')) {
                this.errors.classList.remove('contact-form__error--empty')
            }

            this.errors.innerHTML = array.map(error => {
                return `${error.message}<br>`;
            }).join('');
        } else {
            this.errors.classList.add('contact-form__error--empty');
        }
    }


    close() {
        if (this.modal) {
            this.modal.classList.remove(this.openedClass);
        }
    }
}