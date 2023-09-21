import {APP_CONTAINER_ID, APP_TITLE} from "./utils/config.js";
import {createHeader} from "./components/header.js";
import {createMain} from "./components/main.js";
import {createTable, createTableItem} from "./components/table.js";
import {getClients} from "./utils/api.js";
import {createAddClientModal} from "./components/modal.js";

function appInit() {
    const appContainer = document.getElementById(APP_CONTAINER_ID);

    /**
     * HEADER
     * @hook main
     * @hook searchForm
     * @hook searchInput
     * @hook searchResultWrap
     * @hook searchResultList
     */
    const header = createHeader();

    /**
     * MAIN CONTAINER
     * @hook main
     * @hook mainContent
     * @hook addButton
     */
    const main = createMain(APP_TITLE);

    /**
     * TABLE
     * @hook main
     * @hook tableBody
     * @hook loading
     */
    const table = createTable();

    main.addButton.addEventListener('click', () => {
        const modal = createAddClientModal();
        document.body.append(modal)
    })

    renderList(table);

    // Appends
    appContainer.append(header.main);
    appContainer.append(main.main);
    main.mainContent.append(table.main);
}

/**
 * Render client list via API request
 * @returns {Promise<any>}
 */
export async function renderList(table) {
    try {
        // Добавляем статус загрузки к таблице
        table.loading.set();

        const request = await getClients();

        // Очищаем текущий контент таблицы
        table.tableBody.innerHTML = '';

        for (let i = 0; i < request.length; i++) {
            const item = createTableItem(request[i]);
            table.tableBody.append(item);

            console.log(request[i].contacts);
        }
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
    } finally {
        // Убираем статус загрузки у таблицы
        table.loading.unset();
    }
}

appInit();