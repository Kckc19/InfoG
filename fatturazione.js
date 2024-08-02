document.addEventListener('DOMContentLoaded', function () {
    const saveBtn = document.getElementById('save-btn');
    const exportBtn = document.getElementById('export-btn');
    const dateInput = document.getElementById('date');
    const normalHoursInput = document.getElementById('normal-hours');
    const overtimeHoursInput = document.getElementById('overtime-hours');
    const breakHoursInput = document.getElementById('break-hours');
    const hoursTableBody = document.querySelector('#hours-table tbody');
    const totalNormalHoursElem = document.getElementById('total-normal-hours');
    const totalOvertimeHoursElem = document.getElementById('total-overtime-hours');
    const totalBreakHoursElem = document.getElementById('total-break-hours');
    const totalHoursElem = document.getElementById('total-hours');
    const monthInput = document.getElementById('month');

    let hoursData = JSON.parse(localStorage.getItem('hoursData')) || {};

    function updateTable() {
        hoursTableBody.innerHTML = '';
        let totalNormalHours = 0;
        let totalOvertimeHours = 0;
        let totalBreakHours = 0;

        for (const [date, { normalHours, overtimeHours, breakHours }] of Object.entries(hoursData)) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date}</td>
                <td>${normalHours}</td>
                <td>${overtimeHours}</td>
                <td>${breakHours}</td>
            `;
            hoursTableBody.appendChild(row);

            totalNormalHours += parseFloat(normalHours);
            totalOvertimeHours += parseFloat(overtimeHours);
            totalBreakHours += parseFloat(breakHours);
        }

        totalNormalHoursElem.innerText = totalNormalHours.toFixed(2);
        totalOvertimeHoursElem.innerText = totalOvertimeHours.toFixed(2);
        totalBreakHoursElem.innerText = totalBreakHours.toFixed(2);
        totalHoursElem.innerText = (totalNormalHours + totalOvertimeHours - totalBreakHours).toFixed(2);
    }

    function saveData() {
        const date = dateInput.value;
        const normalHours = parseFloat(normalHoursInput.value) || 0;
        const overtimeHours = parseFloat(overtimeHoursInput.value) || 0;
        const breakHours = parseFloat(breakHoursInput.value) || 0;

        if (!date || isNaN(normalHours) || isNaN(overtimeHours) || isNaN(breakHours)) {
            alert('Per favore, inserisci valori validi per tutti i campi.');
            return;
        }

        if (hoursData[date]) {
            if (confirm('I dati per questa data esistono già. Vuoi sovrascrivere i dati?')) {
                hoursData[date] = { normalHours, overtimeHours, breakHours };
            } else {
                return;
            }
        } else {
            hoursData[date] = { normalHours, overtimeHours, breakHours };
        }

        localStorage.setItem('hoursData', JSON.stringify(hoursData));
        updateTable();
        dateInput.value = '';
        normalHoursInput.value = '';
        overtimeHoursInput.value = '';
        breakHoursInput.value = '';
    }

    function exportToExcel() {
        const ws = XLSX.utils.json_to_sheet(Object.entries(hoursData).map(([date, { normalHours, overtimeHours, breakHours }]) => ({
            Data: date,
            "Ore Normali": normalHours,
            "Ore Straordinarie": overtimeHours,
            "Ore di Pausa": breakHours
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Ore Lavorate");
        XLSX.writeFile(wb, "Ore_Lavorate.xlsx");
    }

    function updateMonthlySummary() {
        const selectedMonth = monthInput.value;
        if (!selectedMonth) {
            alert('Seleziona un mese.');
            return;
        }

        let totalNormalHours = 0;
        let totalOvertimeHours = 0;
        let totalBreakHours = 0;

        for (const [date, { normalHours, overtimeHours, breakHours }] of Object.entries(hoursData)) {
            const [year, month] = date.split('-');
            if (month === selectedMonth) {
                totalNormalHours += parseFloat(normalHours);
                totalOvertimeHours += parseFloat(overtimeHours);
                totalBreakHours += parseFloat(breakHours);
            }
        }

        totalNormalHoursElem.innerText = totalNormalHours.toFixed(2);
        totalOvertimeHoursElem.innerText = totalOvertimeHours.toFixed(2);
        totalBreakHoursElem.innerText = totalBreakHours.toFixed(2);
        totalHoursElem.innerText = (totalNormalHours + totalOvertimeHours - totalBreakHours).toFixed(2);
    }

    saveBtn.addEventListener('click', saveData);
    exportBtn.addEventListener('click', exportToExcel);
    monthInput.addEventListener('change', updateMonthlySummary);

    updateTable(); // Carica la tabella all'avvio
});
