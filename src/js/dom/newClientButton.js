import {createEl} from "../helpers.js";

export function createNewClientButton(buttonText) {
    const wrap = createEl('div', 'home__btn-bottom');
    const button = createEl('button', 'btn', 'btn--outline', 'btn--add-client', 'btn--fixed');
    button.innerText = buttonText;

    // Appends
    wrap.append(button);

    return {wrap, button};
}