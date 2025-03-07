document.addEventListener('DOMContentLoaded', function () {  // Слушаем событие загрузки документа
    const calendarGrid = document.getElementById('calendar-grid');  // Получаем элемент для сетки календаря
    const currentMonthSpan = document.getElementById('current-month');  // Получаем элемент для отображения текущего месяца
    const prevMonthBtn = document.getElementById('prev-month');  // Получаем кнопку для перехода на предыдущий месяц
    const nextMonthBtn = document.getElementById('next-month');  // Получаем кнопку для перехода на следующий месяц
    const materialNameInput = document.getElementById('material-name');  // Получаем элемент для ввода имени материала
    const materialLevelSelect = document.getElementById('material-level');  // Получаем элемент для выбора уровня материала
    const saveMaterialBtn = document.getElementById('save-material');  // Получаем кнопку для сохранения материала
    const materialsTableBody = document.getElementById('materials-container');  // Получаем контейнер для отображения материалов
    const levelModal = document.getElementById('level-modal');  // Получаем модальное окно выбора уровня
    const levelSelect = document.getElementById('level-select');  // Получаем элемент выбора уровня в модальном окне
    const saveLevelBtn = document.getElementById('save-level-btn');  // Получаем кнопку сохранения уровня
    const closeModalBtn = document.getElementById('close-modal-btn');  // Получаем кнопку закрытия модального окна
    const errorMessage = document.getElementById('error-message');  // Получаем элемент для вывода сообщения об ошибке

    let currentDate = new Date();  // Инициализируем текущую дату
    let currentMaterialName = '';  // Инициализируем переменную для хранения имени материала
    let selectedDate = null;  // Инициализируем переменную для хранения выбранной даты

    function renderCalendar(date) {  // Функция для отрисовки календаря
        calendarGrid.innerHTML = '';  // Очищаем текущую сетку календаря
        const year = date.getFullYear();  // Получаем год из текущей даты
        const month = date.getMonth();  // Получаем месяц из текущей даты
        const firstDay = new Date(year, month, 1).getDay();  // Получаем день недели для первого дня месяца
        const lastDate = new Date(year, month + 1, 0).getDate();  // Получаем последний день месяца
        const today = new Date();  // Создаем объект сегодняшней даты

        currentMonthSpan.textContent = date.toLocaleString('en', {month: 'long', year: 'numeric'});  // Отображаем текущий месяц и год

        const startingEmptyDays = firstDay === 0 ? 6 : firstDay - 1;  // Определяем количество пустых дней в начале месяца
        for (let i = 0; i < startingEmptyDays; i++) {  // Добавляем пустые дни в начало месяца
            calendarGrid.appendChild(document.createElement('div'));  // Добавляем пустой блок для каждого пустого дня
        }

        for (let day = 1; day <= lastDate; day++) {  // Для каждого дня месяца создаем элемент
            const dayDiv = document.createElement('div');  // Создаем элемент для дня
            dayDiv.textContent = day;  // Устанавливаем номер дня в текст
            dayDiv.classList.add('day');  // Добавляем класс для стилизации

            const currentLoopDate = new Date(year, month, day);  // Создаем дату для текущего дня
            currentLoopDate.setHours(0, 0, 0, 0);  // Устанавливаем время на начало дня

            // Выделяем сегодняшний день
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayDiv.classList.add('today');  // Если день совпадает с сегодняшним, добавляем класс 'today'
            }

            // Восстанавливаем выделение выбранной даты
            if (selectedDate && selectedDate.getTime() === currentLoopDate.getTime()) {
                dayDiv.classList.add('selected-day');  // Если день выбран, добавляем класс 'selected-day'
            }

            calendarGrid.appendChild(dayDiv);  // Добавляем элемент дня в сетку календаря
        }
    }
    // Обработчик клика по календарю
    document.getElementById('calendar-grid').addEventListener('click', function (event) {  // Слушаем событие клика по календарю
        if (event.target.classList.contains('day')) {  // Если клик был по элементу с классом 'day'
            // Убираем выделение со всех ранее выбранных дней (кроме "сегодня")
            document.querySelectorAll('.day.selected-day').forEach(day => {
                if (!day.classList.contains('today')) {
                    day.classList.remove('selected-day');  // Убираем выделение у дней, которые не сегодня
                }
            });

            // Запоминаем выбранную дату
            const selectedDay = event.target.textContent;  // Получаем выбранный день
            selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);  // Создаем объект даты с выбранным днем
            selectedDate.setHours(0, 0, 0, 0);  // Устанавливаем время на начало дня

            // Если выбран не "сегодня", выделяем его
            if (!event.target.classList.contains('today')) {
                event.target.classList.add('selected-day');  // Добавляем класс выделения выбранному дню
            }

            filterMaterialsByDate(selectedDate);  // Фильтруем материалы по выбранной дате
        }
    });

    prevMonthBtn.addEventListener('click', function () {  // Обработчик клика по кнопке "предыдущий месяц"
        currentDate.setMonth(currentDate.getMonth() - 1);  // Уменьшаем месяц на 1
        renderCalendar(currentDate);  // Перерисовываем календарь с новым месяцем
    });

    nextMonthBtn.addEventListener('click', function () {  // Обработчик клика по кнопке "следующий месяц"
        currentDate.setMonth(currentDate.getMonth() + 1);  // Увеличиваем месяц на 1
        renderCalendar(currentDate);  // Перерисовываем календарь с новым месяцем
    });


    document.getElementById('calendar-grid').addEventListener('click', function (event) {
        if (event.target.classList.contains('day')) { // Проверяем, что клик был по дню на календаре
            // Убираем выделение со всех ранее выбранных дней (кроме "сегодня")
            document.querySelectorAll('.day.selected-day').forEach(day => {
                if (!day.classList.contains('today')) { // Не убираем выделение с "сегодня"
                    day.classList.remove('selected-day');
                }
            });

            // Если выбран не "сегодня", выделяем его
            if (!event.target.classList.contains('today')) {
                event.target.classList.add('selected-day'); // Выделяем выбранный день
            }

            // Получаем выбранную дату и фильтруем материалы
            const selectedDay = event.target.textContent; // Извлекаем номер дня
            const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay); // Создаем объект даты с выбранным днем

            filterMaterialsByDate(selectedDate); // Фильтруем материалы по выбранной дате
        }
    });





    async function fetchMaterials() {  // Функция для получения материалов с сервера
        try {
            const response = await fetch('/api/repetition/all');  // Выполняем запрос на сервер для получения всех материалов
            const materials = await response.json();  // Парсим ответ как JSON
            renderMaterials(materials);  // Отображаем материалы
        } catch (error) {
            console.error('Ошибка загрузки материалов:', error);  // Логируем ошибку, если запрос не удался
        }
    }

    // Функция для создания нового материала
    async function createMaterial() {
        const name = materialNameInput.value.trim(); // Получаем название материала и удаляем лишние пробелы
        const level = `LEVEL_${materialLevelSelect.value}`; // Получаем выбранный уровень материала

        // Проверяем, введено ли название материала
        if (!name) {
            showError("Введите название материала!"); // Показываем ошибку, если название не введено
            return;
        }

        try {
            // Отправляем запрос на сервер для создания нового материала
            const response = await fetch('/api/repetition/repetition', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, reviewLevel: level}) // Отправляем имя материала и его уровень
            });

            // Если запрос прошел успешно, очищаем поля ввода и обновляем список материалов
            if (response.ok) {
                materialNameInput.value = ''; // Очищаем поле для имени материала
                materialLevelSelect.value = '1'; // Сбрасываем уровень материала на 1
                fetchMaterials(); // Обновляем список материалов
            } else {
                showError("Ошибка при создании материала."); // Показываем ошибку при неудачном запросе
            }
        } catch (error) {
            console.error('Ошибка:', error); // Логируем ошибку в консоль
            showError("Ошибка при создании материала."); // Показываем ошибку, если возникла ошибка при запросе
        }
    }

    // Функция для отображения сообщения об ошибке
    function showError(message) {
        errorMessage.textContent = message; // Устанавливаем текст сообщения об ошибке
        errorMessage.style.display = 'block'; // Показываем сообщение об ошибке
    }

    // Добавляем обработчик события на кнопку сохранения материала
    saveMaterialBtn.addEventListener('click', createMaterial);






    function filterMaterialsByDate(selectedDate) {
        selectedDate.setHours(0, 0, 0, 0); // Убираем время для корректного сравнения

        fetch('/api/repetition/all') // Отправляем запрос на сервер для получения всех материалов
            .then(response => response.json()) // Преобразуем ответ в JSON
            .then(materials => {
                const filteredMaterials = materials.filter(material => {
                    const nextReviewDate = new Date(material.nextReview); // Преобразуем дату следующего обзора материала
                    nextReviewDate.setHours(0, 0, 0, 0); // Убираем время для сравнения

                    return nextReviewDate.getTime() === selectedDate.getTime(); // Фильтруем материалы, чья дата следующего обзора совпадает с выбранной датой
                });

                renderMaterials(filteredMaterials); // Отображаем отфильтрованные материалы
            })
            .catch(error => console.error('Ошибка загрузки материалов:', error)); // Логируем ошибку, если запрос не удался
    }


    function renderMaterials(materials) {
        materialsTableBody.innerHTML = ''; // Очищаем контейнер таблицы перед рендером новых материалов

        materials.forEach((material, index) => { // Перебираем все материалы
            const row = document.createElement('tr'); // Создаем новую строку таблицы

            row.innerHTML = `
            <td>${index + 1}</td> <!-- Индекс материала -->
            <td>${material.name}</td> <!-- Название материала -->
            <td>Уровень ${material.reviewLevel.replace('LEVEL_', '')}</td> <!-- Уровень материала -->
            <td>${new Date(material.lastReviewed).toLocaleString('en')}</td> <!-- Дата последнего обзора материала -->
            <td>${new Date(material.nextReview).toLocaleString('en')}</td> <!-- Дата следующего обзора материала -->
            <td>
                <button class="edit-btn" data-name="${material.name}" data-level="${material.reviewLevel}">✏ Edit</button> <!-- Кнопка для редактирования уровня -->
            </td>
        `;

            materialsTableBody.appendChild(row); // Добавляем строку в таблицу
        });

        // Добавляем обработчик кликов на кнопки "Edit"
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function (event) {
                const materialName = event.target.dataset.name; // Извлекаем название материала
                const currentLevel = event.target.dataset.level; // Извлекаем текущий уровень материала
                openLevelModal(materialName, currentLevel, event.target); // Открываем модальное окно для изменения уровня материала
            });
        });
    }


    async function updateMaterialLevel() {
        if (!currentMaterialName) return; // Если нет текущего материала, выходим из функции

        const newLevel = levelSelect.value; // Получаем выбранный новый уровень
        try {
            const response = await fetch(`/api/repetition/update?name=${encodeURIComponent(currentMaterialName)}&newLevel=${encodeURIComponent(newLevel)}`, {
                method: 'PUT', // Отправляем запрос на обновление материала
                headers: {'Content-Type': 'application/json'}
            });

            if (response.ok) { // Если запрос прошел успешно
                levelModal.style.display = 'none'; // Закрываем модальное окно
                fetchMaterials(); // Обновляем список материалов
            } else {
                console.error('Ошибка обновления уровня'); // Логируем ошибку, если запрос не удался
            }
        } catch (error) {
            console.error('Ошибка запроса:', error); // Логируем ошибку при отправке запроса
        }
    }


    // Функция для открытия модального окна изменения уровня материала
    function openLevelModal(materialName, currentLevel, button) {
        console.log("Открытие модального окна для", materialName, "с уровнем", currentLevel); // Логируем информацию о материале и его текущем уровне
        currentMaterialName = materialName; // Сохраняем имя текущего материала
        levelSelect.innerHTML = ''; // Очищаем выпадающий список уровней

        // Создаем выпадающий список с уровнями от 1 до 8
        for (let i = 1; i <= 8; i++) {
            const option = document.createElement('option'); // Создаем новый элемент option
            option.value = `LEVEL_${i}`; // Устанавливаем значение уровня (LEVEL_1, LEVEL_2 и т.д.)
            option.textContent = `LEVEL_${i}`; // Устанавливаем текст для отображения
            if (`LEVEL_${i}` === currentLevel) option.selected = true; // Если это текущий уровень, выбираем его
            levelSelect.appendChild(option); // Добавляем опцию в выпадающий список
        }

        const rect = button.getBoundingClientRect(); // Получаем координаты кнопки на экране
        console.log("Координаты кнопки:", rect); // Логируем координаты кнопки
        levelModal.style.top = `${rect.top + window.scrollY + 30}px`; // Устанавливаем вертикальную позицию модального окна
        levelModal.style.left = `${rect.left + window.scrollX}px`; // Устанавливаем горизонтальную позицию модального окна
        levelModal.style.display = 'block'; // Показываем модальное окно
    }
    // Добавляем обработчик события на кнопку сохранения уровня
    saveLevelBtn.addEventListener('click', updateMaterialLevel);

    // Добавляем обработчик события на кнопку закрытия модального окна
    closeModalBtn.addEventListener('click', () => (levelModal.style.display = 'none'));

    // Добавляем обработчик события на клик по документу, чтобы закрыть модальное окно при клике вне его
    document.addEventListener('click', function (event) {
        // Если клик был вне модального окна и кнопки редактирования, скрываем модальное окно
        if (!levelModal.contains(event.target) && !event.target.classList.contains('edit-btn')) {
            levelModal.style.display = 'none';
        }
    });

    // Вызываем функции для отображения календаря и загрузки материалов
    renderCalendar(currentDate); // Рендерим календарь для текущей даты
    fetchMaterials(); // Загружаем список материалов с сервера

});
