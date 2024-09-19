let mesas = [];
const menu = {
    platos: [
        { nombre: "Plato 1", precio: 5000 },
        { nombre: "Plato 2", precio: 6000 },
        { nombre: "Plato 3", precio: 5500 },
        { nombre: "Plato 4", precio: 7000 },
        { nombre: "Plato 5", precio: 4500 }
    ],
    bebidas: [
        { nombre: "Bebida 1", precio: 2500 },
        { nombre: "Bebida 2", precio: 2500 },
        { nombre: "Bebida 3", precio: 3000 },
        { nombre: "Bebida 4", precio: 3200 },
        { nombre: "Bebida 5", precio: 3000 }
    ]
};

function crearMesa() {
    const nombreMesa = document.getElementById('mesa-nombre').value;
    if (nombreMesa) {
        const mesa = {
            nombre: nombreMesa,
            items: [],
            total: 0
        };
        mesas.push(mesa);
        actualizarVistaMesas();
        document.getElementById('mesa-nombre').value = '';
    }
}

function agregarItem(index) {
    const mesa = mesas[index];
    const selectElement = document.getElementById(`item-select-${index}`);
    const selectedItem = JSON.parse(selectElement.value);
    
    if (selectedItem) {
        mesa.items.push(selectedItem);
        mesa.total += selectedItem.precio;
        actualizarVistaMesas();
    }
}

function eliminarItem(mesaIndex, itemIndex) {
    const mesa = mesas[mesaIndex];
    const item = mesa.items[itemIndex];
    mesa.total -= item.precio;
    mesa.items.splice(itemIndex, 1);
    actualizarVistaMesas();
}

function actualizarVistaMesas() {
    const mesasContainer = document.getElementById('mesas-container');
    mesasContainer.innerHTML = '';
    
    mesas.forEach((mesa, index) => {
        const mesaElement = document.createElement('div');
        mesaElement.className = 'mesa';
        mesaElement.innerHTML = `
            <h2>${mesa.nombre}</h2>
            <div>
                <select id="item-select-${index}">
                    <option value="">Seleccione un item</option>
                    <optgroup label="Platos">
                        ${menu.platos.map(plato => `<option value='${JSON.stringify(plato)}'>${plato.nombre} - $${plato.precio.toFixed(2)}</option>`).join('')}
                    </optgroup>
                    <optgroup label="Bebidas">
                        ${menu.bebidas.map(bebida => `<option value='${JSON.stringify(bebida)}'>${bebida.nombre} - $${bebida.precio.toFixed(2)}</option>`).join('')}
                    </optgroup>
                </select>
                <button onclick="agregarItem(${index})">Agregar Item</button>
            </div>
            <ul class="item-list">
                ${mesa.items.map((item, itemIndex) => `
                    <li>
                        ${item.nombre}: $${item.precio.toFixed(2)}
                        <button class="eliminar-item" onclick="eliminarItem(${index}, ${itemIndex})" id='eliminar'>Eliminar</button>
                    </li>
                `).join('')}
            </ul>
            <p>Total: $${mesa.total.toFixed(2)}</p>
            <button onclick="generarPDF(${index})">Generar PDF</button>
        `;
        mesasContainer.appendChild(mesaElement);
    });
}

function generarPDF(index) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const mesa = mesas[index];
    
    doc.text(`Cuenta de la mesa: ${mesa.nombre}`, 20, 20);
    doc.text('Items:', 20, 30);
    
    let yPos = 40;
    mesa.items.forEach(item => {
        doc.text(`${item.nombre}: $${item.precio.toFixed(2)}`, 30, yPos);
        yPos += 10;
    });
    
    doc.text(`Total: $${mesa.total.toFixed(2)}`, 20, yPos + 10);
    
    doc.save(`cuenta_${mesa.nombre}.pdf`);
}