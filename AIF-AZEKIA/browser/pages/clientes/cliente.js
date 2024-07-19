
function mostrarModalAgregarCliente() {
    document.getElementById("modalAgregarCliente").style.display = "block";
}

function cerrarModal() {
    document.getElementById("modalAgregarCliente").style.display = "none";
    document.getElementById("modalEditarCliente").style.display = "none";
}

async function agregarCliente(cliente) {
    try {
        const response = await fetch('/agregarCliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cliente: cliente })
        });
        if (response.ok) {

            const data = await response.json();
            if (data.err) {
                mostrarError('Error al agregar el cliente:' + data.errmsg);
            } else {
                cerrarModal();
            }
        } else {
            mostrarError('Error al añadir cliente:' + response.statusText);
        }
    } catch (error) {
        mostrarError('Error al añadir cliente:' + error.message);
    }
}


async function actualizarCliente(cliente) {
    try {
        const response = await fetch('/actualizarCliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cliente: cliente })
        });
        if (response.ok) {

            const data = await response.json();
            if (data.err) {
                mostrarError('Error al actualizar el cliente:' + data.errmsg);
            }else{
                cerrarModal();
            }
        } else {
            mostrarError('Error al actualizar cliente:' + response.statusText);
        }
    } catch (error) {
        mostrarError('Error al actualizar cliente:' + error.message);
    }
}

async function obtenerClientesAPI() {
    try {
        const response = await fetch('/obtenerClientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.err) {
                // Si hay un error, muestra un mensaje de error
                mostrarError('Error al obtener clientes:' + data.errmsg);
                mostrarDatosEnTabla(data);

            } else {
                // Si no hay error, procesa los datos y muestra la tabla
                mostrarDatosEnTabla(data);
            }
        } else {
            mostrarError('Error al llamar a la API:' + response.statusText);
        }
    } catch (error) {
        mostrarError('Error al llamar a la API:' + error.message);
    }
}

function ClicEliminarCliente() {
    // Obtener el valor de clienteCod del input
    const clienteCod = document.getElementById("codClienteeditar").value;
    // Llamar a la función eliminarCliente con clienteCod
    eliminarCliente(clienteCod);
    cerrarModal();

}

async function eliminarCliente(clienteCod) {
    try {
        const response = await fetch('/eliminarCliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clienteCod })
        });

        const data = await response.json();

        if (!data.err) {
            await obtenerClientesAPI();
        } else {
            mostrarError('Error al eliminar cliente: ' + data.errmsg);
        }
    } catch (error) {
        mostrarError('Error al eliminar cliente:' + error.message);
    }
}

async function abrirModalEditable(clienteId) {
    try {
        // Obtener todas las clientes
        const response = await fetch('/obtenerClientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();
            // Buscar la cliente con el ID proporcionado
            const cliente = data.clientes.find(emp => emp.clienteCod === clienteId);

            if (cliente) {
                // Llenar los campos del formulario del modal con los detalles de la cliente
                document.getElementById("codClienteeditar").value = cliente.clienteCod;
                document.getElementById("codClienteeditar").readOnly = true;
                document.getElementById("cifeditar").value = cliente.CIF;
                document.getElementById("razonSocialeditar").value = cliente.razonSocial;
                document.getElementById("direccioneditar").value = cliente.direccion;
                document.getElementById("cpeditar").value = cliente.CP;
                document.getElementById("municipioeditar").value = cliente.municipio;

                // Obtener el elemento del input
                const inputElement = document.getElementById("codClienteeditar");

                // Verificar si ya existe un span antes de agregar uno nuevo
                const existingSpan = inputElement.nextSibling;
                if (existingSpan && existingSpan.tagName === "SPAN") {
                    // Si existe un span, simplemente actualizar su contenido y ocultar el input
                    existingSpan.textContent = cliente.clienteCod;
                    inputElement.style.display = "none";
                } else {
                    // Si no existe un span, crear uno nuevo y agregarlo después del input, y ocultar el input
                    const spanElement = document.createElement("span");
                    spanElement.textContent = cliente.clienteCod;
                    inputElement.parentNode.insertBefore(spanElement, inputElement.nextSibling);
                    inputElement.style.display = "none";
                }


                // Mostrar el modal de edición
                const modalEditarCliente = document.getElementById('modalEditarCliente');
                modalEditarCliente.style.display = 'block';
            } else {
                mostrarError('No se encontró la cliente con el ID proporcionado:' + clienteId);
            }
        } else {
            mostrarError('Error al llamar a la API:' + response.statusText);
        }
    } catch (error) {
        mostrarError('Error al abrir el modal editable:' + error.message);
    }
}

// Luego, definir la función mostrarDatosEnTabla
async function mostrarDatosEnTabla(data) {
    // Obtener la tabla HTML
    const tabla = document.getElementById('tablaClientes');

    // Obtener todas las filas de la tabla, excepto la primera (la cabecera)
    const filasDatos = Array.from(tabla.querySelectorAll('tr:not(:first-child)'));

    // Eliminar todas las filas de datos existentes
    filasDatos.forEach(fila => fila.remove());

    if (data.clientes && Array.isArray(data.clientes)) {

        data.clientes.forEach(cliente => {
            const fila = document.createElement('tr');

            Object.values(cliente).forEach(valor => {
                const celda = document.createElement('td');
                celda.textContent = valor;
                fila.appendChild(celda);
            });

            // Agregar el botón a la última celda de la fila
            const celdaBoton = document.createElement('td');
            const boton = document.createElement('button');
            boton.textContent = 'Ver';
            celdaBoton.appendChild(boton);
            fila.appendChild(celdaBoton);

            // Agregar la fila a la tabla
            tabla.appendChild(fila);

            // Agregar el evento click al botón "Ver"
            boton.addEventListener('click', function () {
                // Obtén el identificador único de la cliente correspondiente a esta fila
                const clienteId = cliente.clienteCod;
                abrirModalEditable(clienteId);
            });
        });
    } else {
        mostrarError('No se encontraron datos de clientes válidos en la respuesta.');
    }
}



async function guardarCliente() {
    // Obtener los datos del formulario
    const codCliente = document.getElementById("codCliente").value;
    const cif = document.getElementById("cif").value;
    const razonSocial = document.getElementById("razonSocial").value;
    const direccion = document.getElementById("direccion").value;
    const cp = document.getElementById("cp").value;
    const municipio = document.getElementById("municipio").value;

    // Crear un objeto cliente con los datos del formulario
    const cliente = {
        clienteCod: codCliente,
        CIF: cif,
        razonSocial: razonSocial,
        direccion: direccion,
        CP: cp,
        municipio: municipio
    };

    try {

        await agregarCliente(cliente);
        // Cerrar el modal después de agregar la cliente con éxito
        await obtenerClientesAPI();
        // Aquí podrías actualizar la tabla de clientes si lo deseas
    } catch (error) {
        mostrarError('Error al agregar cliente:' + error.message);
    }
}

async function actualizadacliente() {
    // Obtener los datos del formulario
    const codCliente = document.getElementById("codClienteeditar").value;
    const cif = document.getElementById("cifeditar").value;
    const razonSocial = document.getElementById("razonSocialeditar").value;
    const direccion = document.getElementById("direccioneditar").value;
    const cp = document.getElementById("cpeditar").value;
    const municipio = document.getElementById("municipioeditar").value;

    // Crear un objeto cliente con los datos del formulario
    const cliente = {
        clienteCod: codCliente,
        CIF: cif,
        razonSocial: razonSocial,
        direccion: direccion,
        CP: cp,
        municipio: municipio
    };

    try {
        // Llamar a la función agregarCliente con el objeto cliente como argumento
        console.log(cliente);
        await actualizarCliente(cliente);
        await obtenerClientesAPI();
    } catch (error) {
        mostrarError('Error al agregar cliente:' + error.message);
    }
}

async function main() {
    try {
        await obtenerClientesAPI();
    } catch (error) {
        mostrarError('Error en la ejecución principal:' + error);
    }
}


main(); 