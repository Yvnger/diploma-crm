/**
 * Create main table container
 * @returns {{main: HTMLDivElement}}
 */
export function createTable() {
    const main = document.createElement('div');
    main.classList.add('table');

    const tableHead = createTableHead();

    const tableBody = document.createElement('div');
    tableBody.id = 'client-list';
    tableBody.classList.add('table__body');

    const tableLoading = document.createElement('span');
    tableLoading.classList.add('loading');

    /**
     * Loading function
     * @type {{set: loading.set, unset: loading.unset}}
     */
    const loading = {
        set: function() {
            tableBody.classList.add('table__body--loading');
        },
        unset: function() {
            tableBody.classList.remove('table__body--loading');
        }
    };

    // Appends
    main.append(tableHead);
    main.append(tableBody);
    tableBody.append(tableLoading);

    return {main, tableBody, loading};
}

/**
 * Create table head row
 * @returns {HTMLDivElement}
 */
function createTableHead() {
    const main = document.createElement('div');
    main.classList.add('table__head');

    const tableHeadRow = document.createElement('div');
    tableHeadRow.classList.add('table__row');

    const tableHeadColId = createTableCell('ID');
    const tableHeadColName = createTableCell('Фамилия Имя Отчество');
    const tableHeadColCreatedAt = createTableCell('Дата и время создания');
    const tableHeadColUpdatedAt = createTableCell('Последние изменения');
    const tableHeadColContacts = createTableCell('Контакты');
    const tableHeadColActions = createTableCell('Действия');

    // Appends
    main.append(tableHeadRow);
    tableHeadRow.append(tableHeadColId);
    tableHeadRow.append(tableHeadColName);
    tableHeadRow.append(tableHeadColCreatedAt);
    tableHeadRow.append(tableHeadColUpdatedAt);
    tableHeadRow.append(tableHeadColContacts);
    tableHeadRow.append(tableHeadColActions);

    return main;
}

export function createTableItem(data) {
    const item = document.createElement('div');
    item.classList.add('table__row', 'list-item');

    const createdAt = convertDate(data.createdAt);
    const updatedAt = convertDate(data.updatedAt);

    /**
     * Actions
     * @type {{actionsWrap: HTMLDivElement, edit: HTMLAnchorElement, remove: HTMLAnchorElement}}
     */
    const actions = createActions();

    const cellId = createTableCell(data.id, 'list-item__id');
    const cellName = createTableCell(`${data.name} ${data.surname} ${data.lastName}`);
    const cellCreatedAt = createTableCell(createdAt, 'list-item__date');
    const cellUpdatedAt = createTableCell(updatedAt, 'list-item__date');
    const cellContacts = createTableCell('Contacts', 'contact');
    const cellActions = createTableCell(actions.actionsWrap);

    item.append(cellId);
    item.append(cellName);
    item.append(cellCreatedAt);
    item.append(cellUpdatedAt);
    item.append(cellContacts);
    item.append(cellActions);

    return item;
}

/**
 * Create table head cell
 * @param content
 * @param classes
 * @returns {HTMLDivElement}
 */
function createTableCell(content, ...classes) {
    const main = document.createElement('div');
    main.classList.add('table__cell', ...classes);
    main.append(content);

    return main;
}

function createActions() {
    const actionsWrap = document.createElement('div');
    actionsWrap.classList.add('table__link-group');

    const tableLinkLoadingClass = 'table__link--loading';

    const edit = document.createElement('a');
    edit.href = 'javascript:void(0)';
    edit.classList.add('table__link', 'table__link--edit');
    const editIcon = document.createElement('span');
    editIcon.classList.add('table__link-icon');

    const remove = document.createElement('a');
    remove.href = 'javascript:void(0)';
    remove.classList.add('table__link', 'table__link--remove');
    const removeIcon = document.createElement('span');
    removeIcon.classList.add('table__link-icon');

    // Appends
    actionsWrap.append(edit);
    actionsWrap.append(remove);
    edit.append(editIcon);
    edit.append('Изменить');
    remove.append(removeIcon);
    remove.append('Удалить');

    return {actionsWrap, edit, remove};
}

/**
 * Convert date for table
 * @param date
 * @returns {HTMLDivElement}
 */
function convertDate(date) {
    const newDate = new Date(date);

    // Форматируем дату
    const day = String(newDate.getUTCDate()).padStart(2, '0');
    const month = String(newDate.getUTCMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = newDate.getFullYear();

    // Форматируем время
    const hours = String(newDate.getHours()).padStart(2, '0');
    const minutes = String(newDate.getMinutes()).padStart(2, '0');
    const formatTime = document.createElement('span');
    formatTime.classList.add('list-item__time');
    formatTime.innerText = `${hours}:${minutes}`;

    const result = document.createElement('div');
    result.append(`${day}.${month}.${year}`);
    result.append(formatTime);

    return result;
}