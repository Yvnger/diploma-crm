import {apiUrl} from "./config.js";

export async function getClients(search = "") {
    let url = apiUrl + '/api/clients';

    if (search) {
        url += '?search=' + search;
    }

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка получения данных с сервера");
            }

            return response.json();
        })
        .catch(error => {
            return error;
        })
}

export function getClient(id) {
    return fetch(apiUrl + "/api/clients/" + id)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка получения данных с сервера");
            }
            return response.json();
        })
        .catch(error => {
            return error;
        })
}

export function createTestClient() {
    return fetch(apiUrl + '/api/clients/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'Василий',
            surname: 'Пупкин',
            lastName: 'Васильевич',
            contacts: [
                {
                    type: 'Телефон',
                    value: '+71234567890'
                },
                {
                    type: 'Email',
                    value: 'abc@xyz.com'
                },
                {
                    type: 'Facebook',
                    value: 'https://facebook.com/vasiliy-pupkin-the-best'
                }
            ]
        })
    })
        .then(response => response.json())
        .catch(error => console.log(error));
}

export function createClient(data) {
    return fetch(apiUrl + '/api/clients/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(JSON.stringify(errorData));
                });
            }
            return response.json();
        })
        .catch(error => {
            throw new Error(error.message);
        });
}

export function updateClient(data) {
    return fetch(apiUrl + '/api/clients/' + data.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(JSON.stringify(errorData));
                });
            }
            return response.json();
        })
        .catch(error => {
            throw new Error(error.message);
        });
}

export function removeClient(id) {
    return fetch(apiUrl + '/api/clients/' + id, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Что-то пошло не так...')
            }
        })
        .catch(error => {
            return error;
        })
}