function mostrarModalAgregarImpuesto() {
    document.getElementById("modalAgregarImpuesto").style.display = "block";
}

function cerrarModal() {
    document.getElementById("modalAgregarImpuesto").style.display = "none";
    document.getElementById("modalEditarImpuesto").style.display = "none";
}

async function agregarImpuesto(impuesto) {
    try {
        const response = await fetch('/agregarImpuesto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ impuesto: impuesto })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.err) {
                mostrarError('Error al añadir el impuesto:' + data.errmsg);
            }else{
                cerrarModal();
            }
        } else {
            mostrarError('Error al añadir impuesto:' + response.statusText);
        }
    } catch (error) {
        mostrarError('Error al añadir impuesto:' + error.message);
    }
}

async function actualizarImpuesto(impuesto) {
    try {
        const response = await fetch('/actualizarImpuesto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ impuesto: impuesto })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.err) {
                mostrarError('Error al actualizar el impuesto:' + data.errmsg);
            }else{
                cerrarModal();
            }
        } else {
            mostrarError('Error al actualizar impuesto:' + response.statusText);
        }
    } catch (error) {
        mostrarError('Error al actualizar impuesto:' + error.message);
    }
}

async function obtenerTipoImpuestos() {
    try {
        const response = await fetch('/obtenerTipoImpuestos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.err) {
                // Si hay un error, muestra un mensaje de error
                mostrarError('Error al obtener impuestos:' + data.errmsg);
            } else {
                const tipoImpuestos = data.tipoImpuestos;
                const tipoImpuestoSelect = document.getElementById('tipoImpuesto');
                const tipoImpuestoEditarSelect = document.getElementById('tipoImpuestoEditar');

                // Limpiar opciones anteriores
                tipoImpuestoSelect.innerHTML = '';
                tipoImpuestoEditarSelect.innerHTML = '';

                // Agregar nuevas opciones
                tipoImpuestos.forEach(tipo => {
                    const option = document.createElement('option');
                    option.value = tipo.codigo;
                    option.textContent = tipo.descripcion;
                    tipoImpuestoSelect.appendChild(option);

                    const optionEditar = document.createElement('option');
                    optionEditar.value = tipo.codigo;
                    optionEditar.textContent = tipo.descripcion;
                    tipoImpuestoEditarSelect.appendChild(optionEditar);
                });
            }
        } else {
            mostrarError('Error al llamar a la API:' + response.statusText);
        }
    } catch (error) {
        mostrarError('Error al llamar a la API:' + error.message);
    }
}


async function obtenerImpuestosAPI() {
    try {
        const response = await fetch('/obtenerImpuestos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.err) {
                // Si hay un error, muestra un mensaje de error
                mostrarError('Error al obtener impuestos:' + data.errmsg);
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

async function eliminarImpuesto(impuestoCod) {
    try {
        const response = await fetch('/eliminarImpuesto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ impuestoCod })
        });

        if (response.ok) {
            const data = await response.json();
            await obtenerImpuestosAPI();
        } else {
            mostrarError('Error al eliminar impuesto:' + response.statusText);
        }
    } catch (error) {
        mostrarError('Error al eliminar impuesto:' + error.message);
    }
}

async function abrirModalEditableImpuesto(impuestoCod) {
    try {
        // Obtener todos los impuestos
        const response = await fetch('/obtenerImpuestos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();
            // Buscar el impuesto con el código proporcionado
            const impuesto = data.impuestos.find(imp => imp.impuestoCod === impuestoCod);

            if (impuesto) {
                // Llenar los campos del formulario del modal con los detalles del impuesto
                document.getElementById("impuestoCodEditar").value = impuesto.impuestoCod;
                document.getElementById("impuestoCodEditar").readOnly = true;
                document.getElementById("tipoImpuestoEditar").value = impuesto.tipoImpuesto;
                document.getElementById("porcentajeEditar").value = impuesto.porcentaje;

                // Mostrar el modal de edición
                const modalEditarImpuesto = document.getElementById('modalEditarImpuesto');
                modalEditarImpuesto.style.display = 'block';
            } else {
                mostrarError('No se encontró el impuesto con el código proporcionado:' + impuestoCod);
            }
        } else {
            mostrarError('Error al llamar a la API:' + response.statusText);
        }
    } catch (error) {
        mostrarError('Error al abrir el modal editable del impuesto:' + error.message);
    }
}

// Luego, definir la función mostrarDatosEnTabla
async function mostrarDatosEnTabla(data) {
    // Obtener la tabla HTML
    const tabla = document.getElementById('tablaImpuestos');

    // Obtener todas las filas de la tabla, excepto la primera (la cabecera)
    const filasDatos = Array.from(tabla.querySelectorAll('tr:not(:first-child)'));

    // Eliminar todas las filas de datos existentes
    filasDatos.forEach(fila => fila.remove());

    if (data.impuestos && Array.isArray(data.impuestos)) {
        data.impuestos.forEach(impuesto => {
            const fila = document.createElement('tr');

            Object.values(impuesto).forEach(valor => {
                const celda = document.createElement('td');
                celda.textContent = valor;
                fila.appendChild(celda);
            });

            // Agregar el botón "Ver" a la última celda de la fila
            const celdaBoton = document.createElement('td');
            const boton = document.createElement('button');
            boton.textContent = 'Ver';
            celdaBoton.appendChild(boton);
            fila.appendChild(celdaBoton);

            // Agregar la fila a la tabla
            tabla.appendChild(fila);

            // Agregar el evento click al botón "Ver"
            boton.addEventListener('click', function () {
                // Obtener el identificador único del impuesto correspondiente a esta fila
                const impuestoCod = impuesto.impuestoCod;
                abrirModalEditableImpuesto(impuestoCod);
            });
        });
    } else {
        mostrarError('No se encontraron datos de impuestos válidos en la respuesta.');
    }
}

async function guardarImpuesto() {
    // Obtener los datos del formulario
    const impuestoCod = document.getElementById("impuestoCod").value;
    const tipoImpuesto = document.getElementById("tipoImpuesto").value;
    const porcentajeString = document.getElementById("porcentaje").value;

    const porcentaje = parseFloat(porcentajeString);


    const impuesto = {
        impuestoCod: impuestoCod,
        tipoImpuesto: tipoImpuesto,
        porcentaje: porcentaje
    };

    try {
        // Llamar a la función agregarImpuesto con el objeto impuesto como argumento
        await agregarImpuesto(impuesto);
        // Actualizar la tabla de impuestos
        await obtenerImpuestosAPI();
    } catch (error) {
        mostrarError('Error al agregar impuesto:' + error.message);
    }
}

async function actualizadaImpuesto() {
    // Obtener los datos del formulario
    const impuestoCod = document.getElementById("impuestoCodEditar").value;
    const tipoImpuesto = document.getElementById("tipoImpuestoEditar").value;
    const porcentajeString = document.getElementById("porcentajeEditar").value;

    const porcentaje = parseFloat(porcentajeString);


    const impuesto = {
        impuestoCod: impuestoCod,
        tipoImpuesto: tipoImpuesto,
        porcentaje: porcentaje
    };

    try {
        await actualizarImpuesto(impuesto);
        // Actualizar la tabla de impuestos
        await obtenerImpuestosAPI();
    } catch (error) {
        mostrarError('Error al actualizar impuesto:' + error.message);
    }
}

function ClicEliminarImpuesto() {
    const impuestoCod = document.getElementById("impuestoCodEditar").value;
    eliminarImpuesto(impuestoCod);
    cerrarModal();
}
async function main() {
    try {
        // Al cargar la página, obtener y mostrar los datos de los impuestos
        await obtenerImpuestosAPI();
        await obtenerTipoImpuestos()
    } catch (error) {
        mostrarError('Error en la ejecución principal:' + error);
    }
}

// Llamar a la función principal
main();
