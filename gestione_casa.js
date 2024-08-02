document.addEventListener('DOMContentLoaded', () => {
    // Seleziona gli elementi del menu
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const sideMenu = document.getElementById('side-menu');

    // Mostra il menu laterale
    menuToggle.addEventListener('click', () => {
        sideMenu.classList.add('active');
    });

    // Nasconde il menu laterale
    menuClose.addEventListener('click', () => {
        sideMenu.classList.remove('active');
    });

    // Mostra la sezione selezionata
    document.querySelectorAll('#side-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = e.target.getAttribute('data-section');
            if (sectionId) {
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(sectionId).classList.add('active');
            } else {
                window.location.href = 'index.html';
            }
        });
    });

    // Gestione dei form e della tabella
    function handleFormSubmit(event, formId, tableId) {
        event.preventDefault();
        const form = document.getElementById(formId);
        const table = document.getElementById(tableId);
        const row = document.createElement('tr');

        Array.from(form.elements).forEach(input => {
            if (input.name && input.value) {
                const cell = document.createElement('td');
                cell.textContent = input.value;
                row.appendChild(cell);
            }
        });

        table.querySelector('tbody').appendChild(row);
        form.reset();
        updateSelectOptions(tableId);
    }

    function updateSelectOptions(tableId) {
        const table = document.getElementById(tableId);
        const select = document.getElementById(`${tableId}-select`);
        if (!select) return;

        select.innerHTML = '<option value="">Seleziona</option>'; // Reset the select options

        table.querySelectorAll('tbody tr').forEach(row => {
            const name = row.cells[0].textContent;
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
    }

    document.getElementById('food-form').addEventListener('submit', (event) => {
        handleFormSubmit(event, 'food-form', 'food-table');
    });

    document.getElementById('medicine-form').addEventListener('submit', (event) => {
        handleFormSubmit(event, 'medicine-form', 'medicine-table');
    });

    document.getElementById('bathroom-form').addEventListener('submit', (event) => {
        handleFormSubmit(event, 'bathroom-form', 'bathroom-table');
    });

    // Esportazione dei dati
    function exportProducts(tableId) {
        const table = document.getElementById(tableId);
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(table);
        XLSX.utils.book_append_sheet(wb, ws, 'Prodotti');
        XLSX.writeFile(wb, `${tableId}.xlsx`);
    }

    document.getElementById('export-food').addEventListener('click', () => {
        exportProducts('food-table');
    });

    document.getElementById('export-medicine').addEventListener('click', () => {
        exportProducts('medicine-table');
    });

    document.getElementById('export-bathroom').addEventListener('click', () => {
        exportProducts('bathroom-table');
    });

    // Importazione dei dati
    function importFromExcel(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const wb = XLSX.read(event.target.result, { type: 'array' });
                const sheetNames = wb.SheetNames;

                sheetNames.forEach(sheetName => {
                    const ws = wb.Sheets[sheetName];
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                    
                    const tableId = sheetName.replace(' ', '-').toLowerCase() + '-table';
                    const table = document.getElementById(tableId);
                    
                    if (table) {
                        const tbody = table.querySelector('tbody');
                        tbody.innerHTML = ''; // Pulisce la tabella esistente

                        data.forEach((row, rowIndex) => {
                            if (rowIndex === 0) return; // Skip header row
                            
                            const tr = document.createElement('tr');
                            row.forEach(cell => {
                                const td = document.createElement('td');
                                td.textContent = cell;
                                tr.appendChild(td);
                            });
                            tbody.appendChild(tr);
                        });

                        updateSelectOptions(tableId);
                    }
                });
            } catch (error) {
                console.error('Errore durante l\'importazione del file Excel:', error);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    document.getElementById('import-excel').addEventListener('click', () => {
        document.getElementById('file-input').click();
    });

    document.getElementById('file-input').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            importFromExcel(file);
        }
    });

    // Gestione dell’aumento e della rimozione dei prodotti
    function updateTableQuantity(tableId, productName, newQuantity) {
        const table = document.getElementById(tableId);
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            if (row.cells[0].textContent === productName) {
                const quantityCell = row.cells[1];
                quantityCell.textContent = parseInt(quantityCell.textContent, 10) + newQuantity;
            }
        });
    }

    function removeFromTable(tableId, productName, removeQuantity) {
        const table = document.getElementById(tableId);
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            if (row.cells[0].textContent === productName) {
                const quantityCell = row.cells[1];
                let currentQuantity = parseInt(quantityCell.textContent, 10);

                if (currentQuantity <= removeQuantity) {
                    row.remove();
                } else {
                    quantityCell.textContent = currentQuantity - removeQuantity;
                }
            }
        });
    }

    // Gestione dell’aumento delle confezioni
    document.getElementById('increase-food-quantity-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const productName = document.getElementById('food-increase-name').value;
        const quantity = parseInt(document.getElementById('food-increase-quantity').value, 10);
        if (productName && !isNaN(quantity) && quantity > 0) {
            updateTableQuantity('food-table', productName, quantity);
        }
    });

    document.getElementById('increase-medicine-quantity-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const productName = document.getElementById('medicine-increase-name').value;
        const quantity = parseInt(document.getElementById('medicine-increase-quantity').value, 10);
        if (productName && !isNaN(quantity) && quantity > 0) {
            updateTableQuantity('medicine-table', productName, quantity);
        }
    });

    document.getElementById('increase-bathroom-quantity-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const productName = document.getElementById('bathroom-increase-name').value;
        const quantity = parseInt(document.getElementById('bathroom-increase-quantity').value, 10);
        if (productName && !isNaN(quantity) && quantity > 0) {
            updateTableQuantity('bathroom-table', productName, quantity);
        }
    });

    // Gestione della rimozione dei prodotti
    document.getElementById('remove-food-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const productName = document.getElementById('food-remove-name').value;
        const quantity = parseInt(document.getElementById('food-remove-quantity').value, 10);
        if (productName && !isNaN(quantity) && quantity > 0) {
            removeFromTable('food-table', productName, quantity);
        }
    });

    document.getElementById('remove-medicine-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const productName = document.getElementById('medicine-remove-name').value;
        const quantity = parseInt(document.getElementById('medicine-remove-quantity').value, 10);
        if (productName && !isNaN(quantity) && quantity > 0) {
            removeFromTable('medicine-table', productName, quantity);
        }
    });

    document.getElementById('remove-bathroom-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const productName = document.getElementById('bathroom-remove-name').value;
        const quantity = parseInt(document.getElementById('bathroom-remove-quantity').value, 10);
        if (productName && !isNaN(quantity) && quantity > 0) {
            removeFromTable('bathroom-table', productName, quantity);
        }
    });
});
