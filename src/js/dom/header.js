import {createEl} from "../helpers.js";

export function createHeader(searchObject) {
    const header = createEl('header', 'header');
    const headerContainer = createEl('div', 'container--fluid');
    const headerInner = createEl('div', 'header__inner');
    const headerLogo = createEl('div', 'header__logo');

    header.append(headerContainer);
    headerContainer.append(headerInner);
    headerInner.append(headerLogo, searchObject);

    return header;
}