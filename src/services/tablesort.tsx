import './tablesort.css';

/**
 * Sorts a HTML table
 * https://www.youtube.com/watch?v=8SL_hM1a0yo
 * 
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of column to sort
 * @param {boolean} asc Determines if the order will be ascending
 */
export function sortTableByColumn(table: any, column: number, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));          // Array of <tr>

    //Sort each row
    const sortedRows = rows.sort((a: any, b: any) => {
        var aColText = a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
        var bColText = b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();

        aColText = aColText.replaceAll(' ','');         // Price
        bColText = bColText.replaceAll(' ','');

        // aColText = aColText.replaceAll('-','');
        // bColText = bColText.replaceAll('-','');

        aColText = aColText.replaceAll('_','');         // Date
        bColText = bColText.replaceAll('_','');

        aColText = aColText.replaceAll('%','');         // Yield
        bColText = bColText.replaceAll('%','');

        return +aColText > +bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the column is currently sorted
    table.querySelectorAll("th").forEach((th: { classList: { remove: (arg0: string, arg1: string) => any; }; }) => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${column+1})`).classList.toggle("th-sort-asc", asc);          // Adding class to header
    table.querySelector(`th:nth-child(${column+1})`).classList.toggle("th-sort-desc", !asc);

}

export function sort() {
    document.querySelectorAll(".table-sortable th").forEach(headerCell => {
        headerCell.addEventListener("click", ()=>{
            // console.log("Click "+headerCell);
            // @ts-ignore
            const tableElement = headerCell.parentElement.parentElement.parentElement;
            // @ts-ignore
            const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
            const currentIsAscending = headerCell.classList.contains("th-sort-asc");        
            // console.log("TableElement "+tableElement);
            console.log("HeaderIndex "+headerIndex);
            console.log("Asc "+currentIsAscending);
    
            sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
        });
    });
}



