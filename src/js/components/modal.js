import {createElementWithClass} from "../utils/dom.js";
import {addClient} from "../utils/api.js";

export function createAddClientModal() {
    const openedClass = 'modal--opened';

    const main = createElementWithClass('div', 'modal');
    const body = createElementWithClass('div', 'modal__body');
    const heading = createElementWithClass('div', 'modal__heading');
    const title = createElementWithClass('h2', 'modal__title');
    const closeButton = createElementWithClass('button', 'modal__close');

    title.innerText = 'Новый клиент';

    closeButton.setAttribute('aria-label', 'Закрыть окно');

    // Timeout 0ms for open transition
    setTimeout(open, 0);

    // Form
    const form = createForm();

    /**
     * Close modal trigger
     */
    closeButton.addEventListener('click', () => {
        close();
    })

    body.addEventListener('click', event => {
        event._clickOnBody = true;
    })

    main.addEventListener('click', event => {
        if (event._clickOnBody) return;
        close();
    })

    form.cancel.addEventListener('click', () => {
        close();
    })

    /**
     * Open & close functions
     */
    function open() {
        main.classList.add(openedClass);
    }

    function close() {
        main.classList.remove(openedClass);
        setTimeout(() => main.remove(), 300);
    }

    // Appends
    main.append(body);

    body.append(heading, closeButton, form.main);

    heading.append(title);

    return main;
}

function createForm() {
    const main = createElementWithClass('form', 'form');
    main.noValidate = true;

    const personGroup = createElementWithClass('div', 'form__person-group');

    // Surname group
    const surnameWrap = createElementWithClass('div', 'form__group');
    const surnameInput = createElementWithClass('input', 'form__input');
    const surnameLabel = createElementWithClass('label', 'form__label');
    surnameInput.id = 'surname';
    surnameInput.name = 'surname';
    surnameInput.type = 'text';
    surnameInput.placeholder = 'Фамилия';
    surnameInput.required = true;
    surnameLabel.setAttribute('for', 'surname');
    surnameLabel.innerText = 'Фамилия';

    // Name group
    const nameWrap = createElementWithClass('div', 'form__group');
    const nameInput = createElementWithClass('input', 'form__input');
    const nameLabel = createElementWithClass('label', 'form__label');
    nameInput.id = 'name';
    nameInput.name = 'name';
    nameInput.type = 'text';
    nameInput.placeholder = 'Имя';
    nameInput.required = true;
    nameLabel.setAttribute('for', 'name');
    nameLabel.innerText = 'Имя';

    // Patronymic group
    const patronymicWrap = createElementWithClass('div', 'form__group');
    const patronymicInput = createElementWithClass('input', 'form__input');
    const patronymicLabel = createElementWithClass('label', 'form__label');
    patronymicInput.id = 'lastName';
    patronymicInput.name = 'lastName';
    patronymicInput.type = 'text';
    patronymicInput.placeholder = 'Имя';
    patronymicLabel.setAttribute('for', 'lastName');
    patronymicLabel.innerText = 'Отчество';

    // Submit button
    const submit = createElementWithClass('button', 'btn', 'btn--primary', 'btn--fill', 'contact-form__submit');
    submit.innerText = 'Сохранить';

    // Cancel button
    const cancel = createElementWithClass('a', 'contact-form__bottom-link');
    cancel.href = 'javascript:void(0)';
    cancel.innerText = 'Отмена';

    // Appends
    main.append(personGroup, submit, cancel);

    personGroup.append(surnameWrap, nameWrap, patronymicWrap);

    surnameWrap.append(surnameInput, surnameLabel);
    nameWrap.append(nameInput, nameLabel);
    patronymicWrap.append(patronymicInput, patronymicLabel);

    /**
     * Handle form submit
     */
    main.addEventListener('submit', async event => {
        event.preventDefault();

        const user = {};

        const formData = new FormData(main);

        for (const [key, value] of formData.entries()) {
            const item = {[key]: value};
            user[key] = value;
        }

        try {
            await addClient(user);
        } catch (e) {
            const error = createElementWithClass('span', 'contact-form__error');
            error.innerText = '';

            main.append(error);
        } finally {

        }

    })

    return {main, cancel};
}