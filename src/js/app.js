import {createEl} from "./helpers.js";
import {appContainer} from "./config.js";
import {createTestClient} from "./api.js";
import {createHeader} from "./dom/header.js";
import {createNewClientButton} from "./dom/newClientButton.js";
import {Search} from "./classes/Search.class.js";
import {Table} from "./classes/Table.class.js";
import {Modal} from "./classes/Modal.class.js";

(function () {
    // Creating objects
    const table = new Table();
    const search = new Search(table);

    // Header
    const header = createHeader(search.element());

    // Main
    const main = createEl("main", "home");
    const mainContainer = createEl("div", "container");

    const mainTitle = createEl("h1", "home__title");
    mainTitle.innerText = "Клиенты";

    const mainButton = createNewClientButton('Добавить клиента');
    const testButton = createNewClientButton('Создать тестового клиента');

    table.renderList();

    // Events
    mainButton.button.addEventListener("click", () => {
        const modal = new Modal("create", table);
        document.body.append(modal.element())
    })

    testButton.button.addEventListener('click', () => {
        createTestClient()
            .then(() => {
                table.renderList();
            })
    })

    // Appends
    appContainer.append(header, main);
    main.append(mainContainer);
    mainContainer.append(mainTitle, table.createElement(), mainButton.wrap, testButton.wrap);
})()