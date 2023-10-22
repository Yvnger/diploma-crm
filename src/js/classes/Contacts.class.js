import {createEl} from "../helpers.js";
import {contactTypes} from "../config.js";

export class Contacts {
    constructor(data = null) {
        this.contactsWrap = null;
        this.contactList = null;
        this.addButton = null;
        this.activeClass = "contact-form__wrap--has-items";
        this.selectActiveClass = "contact-form__select-button--active";
        this._count = 0;
        this.countLimit = 10;
        this.data = data;
        this.list = [];
        this.types = contactTypes;
        this.currentOpenSelect = null;
    }

    element() {
        this.contactsWrap = createEl("div", "contact-form__wrap");
        this.contactList = createEl("ul", "contact-form__items");

        this.addButton = createEl("button", "contact-form__add");
        this.addButton.type = "button";
        const addContactIcon = createEl("span", "contact-form__add-icon");

        if (this.data.length > 0) {  // Используем this.list вместо this.contacts
            for (let i = 0; i < this.data.length; i++) {
                this.createContactItem(this.data[i]);  // Используем this.list[i]
                this.checkCount();
            }
        }

        // Appends
        this.contactsWrap.append(this.contactList, this.addButton);
        this.addButton.append(addContactIcon, "Добавить контакт");

        // Events
        this.addButton.addEventListener("click", () => {
            this.createContactItem();
            this.checkCount();
        })

        return this.contactsWrap;
    }

    createContactItem(data = null) {
        const contactData = data || {
            type: this.types[0],
            value: ""
        };

        this.list.push(contactData);  // Только добавляем, если данные новые

        const item = createEl("li", "contact-form__item");

        const {select, selectButton, selectOptions} = this.createSelect(contactData.type);

        for (let i = 0; i < this.types.length; i++) {
            const option = this.createOption(this.types[i]);
            selectOptions.append(option);
            option.addEventListener("click", () => {
                selectButton.innerText = this.types[i];
                contactData.type = this.types[i];
                this.closeSelect(selectButton);
            })
        }

        const input = createEl("input", "contact-form__input");
        input.type = "text";
        input.placeholder = "Введите данные контакта";
        input.value = contactData.value || "";
        input.addEventListener("input", () => {
            contactData.value = input.value;
        });

        const removeWrap = createEl("div", "contact-form__remove-wrap", "tooltip");
        removeWrap.setAttribute("data-tooltip", "Удалить контакт");
        const removeButton = createEl("button", "contact-form__remove", "contact-form__remove--active");
        removeButton.type = "button";

        // Appends
        item.append(select, input, removeWrap);
        removeWrap.append(removeButton);
        this.contactList.append(item);

        // Events
        this.count = this.count + 1;

        removeButton.addEventListener("click", () => {
            this.count = this.count - 1;
            const index = this.list.indexOf(contactData);  // Получаем индекс при каждом клике
            if (index > -1) {
                this.list.splice(index, 1); // Удаляем элемент из массива, если индекс найден
            }
            item.remove();
            this.checkCount();
        })

        return item;
    }

    createSelect(selectedType = null) {
        const select = createEl("div", "contact-form__select");
        const selectButton = createEl("button", "contact-form__select-button");
        let isSelectOpen = false;

        selectButton.type = "button";
        selectButton.innerText = selectedType || this.types[0];

        const selectOptions = createEl("ul", "contact-form__select-items");

        // Appends
        select.append(selectButton, selectOptions);

        // Events
        selectButton.addEventListener("click", event => {
            if (this.currentOpenSelect && this.currentOpenSelect !== selectButton) {
                this.closeSelect(this.currentOpenSelect);
            }

            this.openSelect(selectButton);
            this.currentOpenSelect = selectButton;
            event.stopPropagation();
        });


        selectOptions.addEventListener("click", event => {
            isSelectOpen = false;
            this.closeSelect(selectButton);
            event.stopPropagation();
        });

        document.body.addEventListener("click", () => {
            if (this.currentOpenSelect) {
                this.closeSelect(this.currentOpenSelect);
                this.currentOpenSelect = null;
            }
        });

        return {select, selectButton, selectOptions};
    }

    closeSelect(button) {
        button.classList.remove(this.selectActiveClass);
    }

    openSelect(button) {
        button.classList.add(this.selectActiveClass);
    }

    createOption(name) {
        const option = createEl("li", "contact-form__select-item");
        option.innerText = name;

        return option;
    }

    createTableContacts() {
        const list = createEl("ul", "contact__list");

        if (this.data.length > 5) {
            for (let i = 0; i < 4; i++) {
                const contact = this.createTableContact(this.data[i]);
                list.append(contact.item);
            }

            const countHideItems = this.data.length - 4;
            const toggle = this.createTableContact({type: 'toggle', value: `+${countHideItems}`});
            list.append(toggle.item);

            toggle.link.addEventListener('click', () => {
                list.innerHTML = '';

                for (let i = 0; i < this.data.length; i++) {
                    const contact = this.createTableContact(this.data[i]);
                    list.append(contact.item);
                }
            })
        } else {
            for (let i = 0; i < this.data.length; i++) {
                const contact = this.createTableContact(this.data[i]);
                list.append(contact.item);
            }
        }

        return list;
    }

    createTableContact(data) {
        const item = createEl("li", "contact__item");

        switch (data.type) {
            case "Телефон":
                item.classList.add("contact__item--phone");
                break;
            case "Email":
                item.classList.add("contact__item--email");
                break;
            case "Facebook":
                item.classList.add("contact__item--fb");
                break;
            case "VK":
                item.classList.add("contact__item--vk");
                break;
            case "Другое":
                item.classList.add("contact__item--other");
                break;
            case 'toggle':
                item.classList.add('contact__item--toggle');
                break;
            default:
                item.classList.add("contact__item--other");
                break;
        }

        if (data.type !== 'toggle') {
            const link = createEl("a", "contact__link", "tooltip");
            link.href = "javascript:void(0)";
            link.dataset.tooltip = `${data.type}: ${data.value}`;

            item.append(link);

            return {item, link};
        } else {
            const link = createEl('a', 'contact__link')
            link.href = "javascript:void(0)";
            link.innerText = data.value;

            item.append(link);

            return {item, link};
        }
    }

    checkCount() {
        if (this.count > 0) {
            if (!this.contactsWrap.classList.contains(this.activeClass)) {
                this.contactsWrap.classList.add(this.activeClass);
            }
        } else {
            this.contactsWrap.classList.remove(this.activeClass);
        }

        if (this.count === this.countLimit) {
            this.contactList.classList.add("contact-form__items--limit");
        } else if (this.count < this.countLimit) {
            this.contactList.classList.remove("contact-form__items--limit");
        }
    }

// Геттеры и сеттеры
    get count() {
        return this._count;
    }

    set count(value) {
        this._count = value;
    }

    get contacts() {
        return this.list;
    }
}