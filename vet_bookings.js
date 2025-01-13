document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let selectedDate = new Date();

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update header
        document.getElementById('currentMonth').textContent = 
            new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysGrid = document.getElementById('daysGrid');
        daysGrid.innerHTML = '';

        // Fill in days
        for (let i = 0; i < firstDay.getDay(); i++) {
            daysGrid.appendChild(createDayElement(''));
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayEl = createDayElement(day);
            
            // Check if day has appointments
            checkAppointments(year, month, day).then(hasAppointments => {
                if (hasAppointments) {
                    dayEl.classList.add('has-appointments');
                }
            });

            daysGrid.appendChild(dayEl);
        }
    }

    function createDayElement(day) {
        const div = document.createElement('div');
        div.className = 'calendar-day';
        div.textContent = day;
        
        if (day !== '') {
            div.addEventListener('click', () => selectDate(day));
        }
        
        return div;
    }

    function selectDate(day) {
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
        event.target.classList.add('selected');
        loadAppointments(selectedDate);
    }

    async function checkAppointments(year, month, day) {
        const date = new Date(year, month, day).toISOString().split('T')[0];
        const response = await fetch(`check_appointments.php?date=${date}`);
        const data = await response.json();
        return data.hasAppointments;
    }

    async function loadAppointments(date) {
        const formattedDate = date.toISOString().split('T')[0];
        const response = await fetch(`get_appointments.php?date=${formattedDate}`);
        const appointments = await response.json();
        
        const appointmentsList = document.getElementById('appointmentsList');
        appointmentsList.innerHTML = '';
        
        appointments.forEach(apt => {
            const card = document.createElement('div');
            card.className = 'appointment-card';
            card.innerHTML = `
                <div class="appointment-time">${apt.time}</div>
                <div class="appointment-details">
                    <p>Pet: ${apt.pet_name}</p>
                    <p>Owner: ${apt.owner_name}</p>
                </div>
            `;
            appointmentsList.appendChild(card);
        });
    }

    // Event Listeners
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Initial render
    renderCalendar();
    loadAppointments(new Date());
});