(function () {
    let DELIMITER = ',';
    let NEWLINE = '\n';
    let elements = document.getElementById('file');
    let table = document.getElementById('table');

    if (!elements) {
        alert('No file available');
        return;
    }

    elements.addEventListener('change', () => {
        if (elements.files && elements.files.length > 0) {
            parseCSV(elements.files[0]);
        }
    });

    function parseCSV(file) {
        if (!file || !FileReader) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            toTable(e.target.result);
            calculateTotal();
        };

        reader.readAsText(file);
    }

    function toTable(text) {
        if (!text || !table) {
            return;
        }

        while (table.lastElementChild) {
            table.removeChild(table.lastElementChild);
        }

        let rows = text.split(NEWLINE).map(row => row.trim()).filter(row => row);
        if (rows.length < 3) return; // Ensure there's at least a header and two data rows

        // Remove header row and first data row
        rows.shift(); // Remove header row
        rows.shift(); // Remove first data row

        let headers = rows.shift().split(DELIMITER).map(h => h.trim()); // Get new headers
        let htr = document.createElement('tr');

        headers.forEach(element => {
            let th = document.createElement('th');
            th.textContent = element;
            htr.appendChild(th);
        });

        table.appendChild(htr);

        // Populate remaining data rows
        rows.forEach(row => {
            let cols = row.split(DELIMITER).map(col => col.trim());
            if (cols.length === 0) return;

            let rtr = document.createElement('tr');
            cols.forEach(col => {
                let td = document.createElement('td');
                td.textContent = col;
                rtr.appendChild(td);
            });

            table.appendChild(rtr);
        });

        // Calculate totals after table is populated
        calculateTotal();
    }

    function calculateTotal() {
        let rows = table.getElementsByTagName('tr');
        if (rows.length === 0) return;

        let headers = rows[0].getElementsByTagName('th');
        let amountIndex = -1;
        let debitsIndex = -1;

        for (let i = 0; i < headers.length; i++) {
            let columnTitle = headers[i].textContent.toLowerCase();
            console.log(columnTitle)
            if (columnTitle === '"amount"') {
                amountIndex = i;
            }
        }

        if (amountIndex === -1 && debitsIndex === -1) {
            console.warn("'Amount' columns found not");
            return;
        }

        let totalAmount = 0;
        let totalDebits = 0;

        for (let i = 1; i < rows.length; i++) {
            let cells = rows[i].getElementsByTagName('td');

            // Process "Amount" column
            if (amountIndex !== -1 && cells.length > amountIndex) {
                let value = parseFloat(cells[amountIndex].textContent.replace(/[^0-9.-]+/g, ''));
                if (!isNaN(value)) {
                    totalAmount += value;
                }
            }
        }

        // Remove existing total row if present
        let totalRow = document.getElementById('total-row');
        if (totalRow) {
            table.removeChild(totalRow);
        }

        // Create a new row to display totals
        let tRow = document.createElement('tr');
        tRow.id = 'total-row';

        let tdLabel = document.createElement('td');
        tdLabel.colSpan = headers.length - 1;
        tdLabel.style.fontWeight = "bold";
        tdLabel.textContent = "Total Spending & Debits:";

        let tdTotal = document.createElement('td');
        tdTotal.style.fontWeight = "bold";
        tdTotal.textContent = `$${(totalAmount).toFixed(2)}`;
        console.log(totalAmount)
        tRow.appendChild(tdLabel);
        tRow.appendChild(tdTotal);
        table.appendChild(tRow);
    }

})();
