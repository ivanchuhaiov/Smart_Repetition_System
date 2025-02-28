document.addEventListener('DOMContentLoaded', function () {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthSpan = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const materialNameInput = document.getElementById('material-name');
    const materialLevelSelect = document.getElementById('material-level');
    const saveMaterialBtn = document.getElementById('save-material');
    const materialsTableBody = document.getElementById('materials-container');
    const levelModal = document.getElementById('level-modal');
    const levelSelect = document.getElementById('level-select');
    const saveLevelBtn = document.getElementById('save-level-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const errorMessage = document.getElementById('error-message');

    let currentDate = new Date();
    let currentMaterialName = '';
    let selectedDate = null;

    function renderCalendar(date) {
        calendarGrid.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        currentMonthSpan.textContent = date.toLocaleString('en', { month: 'long', year: 'numeric' });

        const startingEmptyDays = firstDay === 0 ? 6 : firstDay - 1;
        for (let i = 0; i < startingEmptyDays; i++) {
            calendarGrid.appendChild(document.createElement('div'));
        }

        for (let day = 1; day <= lastDate; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            dayDiv.classList.add('day');

            const currentLoopDate = new Date(year, month, day);
            currentLoopDate.setHours(0, 0, 0, 0);

            // Выделяем сегодняшний день
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayDiv.classList.add('today');
            }

            // Восстанавливаем выделение выбранной даты
            if (selectedDate && selectedDate.getTime() === currentLoopDate.getTime()) {
                dayDiv.classList.add('selected-day');
            }

            calendarGrid.appendChild(dayDiv);
        }
    }


    async function fetchMaterials() {
        try {
            const response = await fetch('/api/repetition/all');
            const materials = await response.json();
            renderMaterials(materials);
        } catch (error) {
            console.error('Ошибка загрузки материалов:', error);
        }
    }

    // Обработчик клика по календарю
    document.getElementById('calendar-grid').addEventListener('click', function (event) {
        if (event.target.classList.contains('day')) {
            // Убираем выделение со всех ранее выбранных дней (кроме "сегодня")
            document.querySelectorAll('.day.selected-day').forEach(day => {
                if (!day.classList.contains('today')) {
                    day.classList.remove('selected-day');
                }
            });

            // Запоминаем выбранную дату
            const selectedDay = event.target.textContent;
            selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
            selectedDate.setHours(0, 0, 0, 0);

            // Если выбран не "сегодня", выделяем его
            if (!event.target.classList.contains('today')) {
                event.target.classList.add('selected-day');
            }

            filterMaterialsByDate(selectedDate);
        }
    });

    prevMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    function filterMaterialsByDate(selectedDate) {
        selectedDate.setHours(0, 0, 0, 0); // Убираем время для корректного сравнения

        fetch('/api/repetition/all')
            .then(response => response.json())
            .then(materials => {
                const filteredMaterials = materials.filter(material => {
                    const nextReviewDate = new Date(material.nextReview);
                    nextReviewDate.setHours(0, 0, 0, 0); // Убираем время для сравнения

                    return nextReviewDate.getTime() === selectedDate.getTime();
                });

                renderMaterials(filteredMaterials);
            })
            .catch(error => console.error('Ошибка загрузки материалов:', error));
    }

    document.getElementById('calendar-grid').addEventListener('click', function (event) {
        if (event.target.classList.contains('day')) {
            // Убираем выделение со всех ранее выбранных дней (кроме "сегодня")
            document.querySelectorAll('.day.selected-day').forEach(day => {
                if (!day.classList.contains('today')) {
                    day.classList.remove('selected-day');
                }
            });

            // Если выбран не "сегодня", выделяем его
            if (!event.target.classList.contains('today')) {
                event.target.classList.add('selected-day');
            }

            // Получаем выбранную дату и фильтруем материалы
            const selectedDay = event.target.textContent;
            const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);

            filterMaterialsByDate(selectedDate);
        }
    });



    function renderMaterials(materials) {
        materialsTableBody.innerHTML = '';

        materials.forEach((material, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${material.name}</td>
            <td>Уровень ${material.reviewLevel.replace('LEVEL_', '')}</td>
            <td>${new Date(material.lastReviewed).toLocaleString('en')}</td>
            <td>${new Date(material.nextReview).toLocaleString('en')}</td>
            <td>
                <button class="edit-btn" data-name="${material.name}" data-level="${material.reviewLevel}">✏ Edit</button>
            </td>

        `;

            materialsTableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function (event) {
                const materialName = event.target.dataset.name;
                const currentLevel = event.target.dataset.level;
                openLevelModal(materialName, currentLevel, event.target);
            });
        });
    }


    function openLevelModal(materialName, currentLevel, button) {
        currentMaterialName = materialName;
        levelSelect.innerHTML = '';

        for (let i = 1; i <= 8; i++) {
            const option = document.createElement('option');
            option.value = `LEVEL_${i}`;
            option.textContent = `Уровень ${i}`;
            if (`LEVEL_${i}` === currentLevel) option.selected = true;
            levelSelect.appendChild(option);
        }

        const rect = button.getBoundingClientRect();
        levelModal.style.top = `${rect.top + window.scrollY + 30}px`;
        levelModal.style.left = `${rect.left + window.scrollX}px`;
        levelModal.style.display = 'block';
    }

    async function updateMaterialLevel() {
        if (!currentMaterialName) return;

        const newLevel = levelSelect.value;
        try {
            const response = await fetch(`/api/repetition/update?name=${encodeURIComponent(currentMaterialName)}&newLevel=${encodeURIComponent(newLevel)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                levelModal.style.display = 'none';
                fetchMaterials();
            } else {
                console.error('Ошибка обновления уровня');
            }
        } catch (error) {
            console.error('Ошибка запроса:', error);
        }
    }

    saveLevelBtn.addEventListener('click', updateMaterialLevel);
    closeModalBtn.addEventListener('click', () => (levelModal.style.display = 'none'));

    document.addEventListener('click', function (event) {
        if (!levelModal.contains(event.target) && !event.target.classList.contains('edit-btn')) {
            levelModal.style.display = 'none';
        }
    });

    async function createMaterial() {
        const name = materialNameInput.value.trim();
        const level = `LEVEL_${materialLevelSelect.value}`;

        if (!name) {
            showError("Введите название материала!");
            return;
        }

        try {
            const response = await fetch('/api/repetition/repetition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, reviewLevel: level })
            });

            if (response.ok) {
                materialNameInput.value = '';
                materialLevelSelect.value = '1';
                fetchMaterials();
            } else {
                showError("Ошибка при создании материала.");
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showError("Ошибка при создании материала.");
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    saveMaterialBtn.addEventListener('click', createMaterial);

    function openLevelModal(materialName, currentLevel, button) {
        console.log("Открытие модального окна для", materialName, "с уровнем", currentLevel);
        currentMaterialName = materialName;
        levelSelect.innerHTML = '';

        for (let i = 1; i <= 8; i++) {
            const option = document.createElement('option');
            option.value = `LEVEL_${i}`;
            option.textContent = `Уровень ${i}`;
            if (`LEVEL_${i}` === currentLevel) option.selected = true;
            levelSelect.appendChild(option);
        }

        const rect = button.getBoundingClientRect();
        console.log("Координаты кнопки:", rect);
        levelModal.style.top = `${rect.top + window.scrollY + 30}px`;
        levelModal.style.left = `${rect.left + window.scrollX}px`;
        levelModal.style.display = 'block';
    }


    renderCalendar(currentDate);
    fetchMaterials();
});
