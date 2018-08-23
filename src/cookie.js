/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

const isMatching = (full, str) => {
    return full.toLowerCase().indexOf(str.toLowerCase()) > -1;
};

filterNameInput.addEventListener('keyup', function() {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie

    let cookieParse = parseCookie();

    const filterValue = filterNameInput.value;

    // Очистить таблицу при нажатии на кнопку выгрузки кук иначе будут добавляться в конец списком
    listTable.innerHTML = '';

    // Отобрать только то что найдено или все если поле пустое
    filterCookie(cookieParse, isMatching, filterValue);

});

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"

    // Запись в куки из формы
    document.cookie = `${addNameInput.value}=${addValueInput.value}`;

    // Очистить таблицу при нажатии на кнопку выгрузки кук иначе будут добавляться в конец списком
    listTable.innerHTML = '';

    if(filterNameInput.value === ''){
        // Приведение к виду объекта из строки
        let cookie = parseCookie();
        // Перебираем ключ и значение (рендер таблицы)
        renderCookie(cookie);
    }else{
        // Приведение к виду объекта из строки
        let filtercookie = parseFilterCookie(filterNameInput.value);
        // Перебираем ключ и значение (рендер таблицы)
        renderCookie(filtercookie);
    }

});

// Функции необходимые для работы

function parseCookie() {
    let cookie = document.cookie.split('; ').reduce((prev, current) => {
        const [name, value] = current.split('=');
        prev[name] = value;
        return prev;
    }, {});
    return cookie;
}

function parseFilterCookie(filterValue) {
    let cookie = document.cookie.split('; ').reduce((prev, current) => {
        const [name, value] = current.split('=');
        if(isMatching(name, filterValue) || isMatching(value, filterValue)){
            prev[name] = value;
        }
        return prev;
    }, {});
    return cookie;
}

function renderCookie(cookie) {
    for(let key in cookie){

        let row = listTable.insertRow(listTable.rows.length);
        let cell = row.insertCell(0);
        cell.innerText = key;
        let cell2 = row.insertCell(1);
        cell2.innerText = cookie[key];
        let cell3 = row.insertCell(2);
        let button = document.createElement("BUTTON");
        //let txt = document.createTextNode('Удалить');
        //button.appendChild(txt);
        button.textContent = 'Удалить';
        cell3.appendChild(button);
        button.addEventListener('click', function () {
            listTable.removeChild(row);
            document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        });
    }
}

function filterCookie(cookieParse, isMatching, filterValue) {
    for (let key in cookieParse) {
        if (typeof (key) != "undefined" && typeof(cookieParse[key]) != "undefined") {

            if (isMatching(key, filterValue) || isMatching(cookieParse[key], filterValue)) {
                // add cookie to table

                let row = listTable.insertRow(listTable.rows.length);
                let cell = row.insertCell(0);
                cell.innerText = key;
                let cell2 = row.insertCell(1);
                cell2.innerText = cookieParse[key];
                let cell3 = row.insertCell(2);
                let button = document.createElement("BUTTON");
                button.textContent = 'Удалить';
                cell3.appendChild(button);
                button.addEventListener('click', function () {
                    listTable.removeChild(row);
                    document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                });
            }
        }
    }
}

let globalParse = parseCookie();

renderCookie(globalParse);