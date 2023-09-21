import {URL, TIMEOUT_DURATION} from '../utils/config.js';

export async function getClients(query = null) {
    try {
        const response = await fetch(URL); // Ожидание завершения запроса
        const data = await response.json(); // Преобразование ответа в JSON

        await new Promise(resolve => setTimeout(resolve, TIMEOUT_DURATION));

        if (!query) {
            return data;
        }


    } catch (error) {
        console.error('Произошла ошибка:', error);
        throw error; // Пробрасывание ошибки для обработки на верхнем уровне
    }
}

export async function getClient(id) {
    try {
        const response = await fetch(URL + `/${id}`); // Ожидание завершения запроса
        const data = await response.json(); // Преобразование ответа в JSON

        // Добавляем задержку в 2 секунды
        await new Promise(resolve => setTimeout(resolve, TIMEOUT_DURATION));

        return data;
    } catch (error) {
        console.error('Произошла ошибка:', error);
        throw error; // Пробрасывание ошибки для обработки на верхнем уровне
    }
}

export async function addClient(data) {
    const user = {
        name: data.name,
        surname: data.surname,
        lastName: data.lastName,
        // contacts: data.contacts
        // contacts: [
        //     {
        //         type: 'Телефон',
        //         value: '+71234567890'
        //     },
        //     {
        //         type: 'Email',
        //         value: 'abc@xyz.com'
        //     },
        //     {
        //         type: 'Facebook',
        //         value: 'https://facebook.com/vasiliy-pupkin-the-best'
        //     }
        // ]
    };

    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw data;
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Результат:', data);
            return null;  // Возвращаем null, если нет ошибок
        })
        .catch(error => {
            if (error.errors) {
                // Обработка ошибок
                const errorMessages = {};
                for (const [field, message] of Object.entries(error.errors)) {
                    errorMessages[field] = message;
                }
                return errorMessages;
            } else {
                console.error('Ошибка:', error);
                return {general: 'Произошла неизвестная ошибка'};
            }
        });
}

export async function updateClient(data) {
    const user = {
        name: data.name ? data.name : '',
        surname: data.surname ? data.surname : '',
        lastName: data.patronymic ? data.patronymic : '',
    };

    await new Promise(resolve => setTimeout(resolve, TIMEOUT_DURATION));

    fetch(URL + `/${data.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(result => {

        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}

export async function deleteClient(id) {
    fetch(URL + `/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(result => {
            console.log('Результат:', result);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}