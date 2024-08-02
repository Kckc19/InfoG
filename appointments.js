document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('save-appointment-btn');
    const modal = document.getElementById('confirmation-modal');
    const closeModalButton = document.getElementById('close-modal');
    const saveAppleButton = document.getElementById('save-apple-calendar');
    const saveGoogleButton = document.getElementById('save-google-calendar');
    const saveLocalButton = document.getElementById('save-local');
    const appointmentTable = document.getElementById('appointment-table').getElementsByTagName('tbody')[0];

    // Funzione per aprire il modal di conferma
    function openModal() {
        modal.style.display = 'block';
    }

    // Funzione per chiudere il modal di conferma
    function closeModal() {
        modal.style.display = 'none';
    }

    // Funzione per aggiungere un appuntamento alla tabella
    function addAppointmentToTable(date, location, title, notes) {
        const row = appointmentTable.insertRow();
        row.insertCell(0).textContent = date;
        row.insertCell(1).textContent = location;
        row.insertCell(2).textContent = title;
        row.insertCell(3).textContent = notes;
    }

    // Funzione per creare un file .ics
    function createICSFile(date, location, title, notes) {
        const startDate = new Date(date);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Durata di un'ora

        // Formattare la data e l'ora in formato iCalendar
        const formatDateTime = (dt) => {
            return dt.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
        };

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//NONSGML Event//EN
BEGIN:VEVENT
UID:${new Date().getTime()}@yourdomain.com
DTSTAMP:${formatDateTime(new Date())}
DTSTART:${formatDateTime(startDate)}
DTEND:${formatDateTime(endDate)}
SUMMARY:${title}
LOCATION:${location}
DESCRIPTION:${notes}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        return url;
    }

    // Gestione del clic sul pulsante "Salva Appuntamento"
    saveButton.addEventListener('click', function () {
        openModal();
    });

    // Gestione del clic sul pulsante "Apple Calendar"
    saveAppleButton.addEventListener('click', function () {
        const form = document.getElementById('appointment-form');
        const formData = new FormData(form);
        const appointmentDate = formData.get('appointment-date');
        const location = formData.get('location');
        const title = formData.get('title');
        const notes = formData.get('notes');

        // Creare il file .ics
        const icsUrl = createICSFile(appointmentDate, location, title, notes);

        // Creare un link per il download del file .ics
        const a = document.createElement('a');
        a.href = icsUrl;
        a.download = 'appuntamento.ics';
        a.click();

        addAppointmentToTable(appointmentDate, location, title, notes);
        closeModal();
    });

    // Gestione del clic sul pulsante "Google Calendar"
    saveGoogleButton.addEventListener('click', function () {
        const form = document.getElementById('appointment-form');
        const formData = new FormData(form);
        const appointmentDate = formData.get('appointment-date');
        const location = formData.get('location');
        const title = formData.get('title');
        const notes = formData.get('notes');

        // Formattare la data e ora per Google Calendar
        const startDate = new Date(appointmentDate).toISOString().replace(/[-:]/g, '').replace('T', 'T').substring(0, 15);
        const endDate = new Date(new Date(appointmentDate).getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace('T', 'T').substring(0, 15);
        
        // Creare l'URL per Google Calendar
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${notes}&location=${location}`;
        window.open(googleCalendarUrl, '_blank');

        addAppointmentToTable(appointmentDate, location, title, notes);
        closeModal();
    });

    // Gestione del clic sul pulsante "Solo Salvataggio Locale"
    saveLocalButton.addEventListener('click', function () {
        const form = document.getElementById('appointment-form');
        const formData = new FormData(form);
        const appointmentDate = formData.get('appointment-date');
        const location = formData.get('location');
        const title = formData.get('title');
        const notes = formData.get('notes');

        addAppointmentToTable(appointmentDate, location, title, notes);
        closeModal();
    });

    // Gestione del clic sul pulsante "Annulla" nel modal
    closeModalButton.addEventListener('click', function () {
        closeModal();
    });
});
