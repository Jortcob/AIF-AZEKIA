function formatearFecha(fecha) {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaObj.getFullYear().toString().slice(-2);

    return `${dia}/${mes}/${anio}`;
}
function ajustarFechaParaInput(dateString) {
    const date = new Date(dateString);

    const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));

    const formattedDate = adjustedDate.toISOString().split('T')[0];

    return formattedDate;
}

function mostrarModalAgregarProyectoProducido() {
    document.getElementById("modalAgregarProyectoProducido").style.display = "block";
}


function cerrarModal() {
    document.getElementById("modalAgregarProyectoProducido").style.display = "none";
    document.getElementById("modalEditarProyectoProducido").style.display = "none";
}

async function agregarProyectoProducido(proyecto) {   
    try {
        const response = await fetch('/agregarProyectoProducido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ proyecto: proyecto })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.err) {
                mostrarError(data.errmsg);
            }else{
                cerrarModal();
            }
        } else {
            mostrarError('Error al añadir proyecto producido:'+ response.statusText);
        }
    } catch (error) {
        mostrarError('Error al añadir proyecto producido:'+ error.message);
    }
}

async function actualizarProyectoProducido(proyecto) {
    try {
        const response = await fetch('/actualizarProyectoProducido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ proyecto: proyecto })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.err) {
                mostrarError(data.errmsg);
            }else{
                cerrarModal();
            }
        } else {
            mostrarError('Error al actualizar proyecto producido:'+ response.statusText);
        }
    } catch (error) {
        mostrarError('Error al actualizar proyecto producido:'+ error.message);
    }
}

async function obtenerProyectosProducidos() {
    try {
        const response = await fetch('/obtenerProyectosProducidos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.err) {
                mostrarError('Error al obtener proyectos producidos:'+ data.errmsg);
            } else {
                mostrarDatosEnTablaProducidos(data);
            }
        } else {
            mostrarError('Error al llamar a la API:'+ response.statusText);
        }
    } catch (error) {
        mostrarError('Error al llamar a la API:'+ error.message);
    }
}

async function obtenerProyectosCertificados() {
    try {
        const response = await fetch('/obtenerProyectosCertificados', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.err) {
                mostrarError('Error al obtener proyectos certificados:'+ data.errmsg);
            } else {
                mostrarDatosEnTablaCertificados(data);
            }
        } else {
            mostrarError('Error al llamar a la API:'+ response.statusText);
        }
    } catch (error) {
        mostrarError('Error al llamar a la API:'+ error.message);
    }
}

async function obtenerProyectosCod() {
    try {
        const response = await fetch('/obtenerProyectosDatosBasicos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.err) {
                mostrarError('Error al obtener proyectosCod:'+ data.errmsg)

            } else {
                agregarProyectoProducidoCodSelect(data.datosProyecto)
            }
        } else {
            
            mostrarError('Error al llamar a la API:'+ response.statusText);

        }
    } catch (error) {
        mostrarError('Error al llamar a la API:'+ error.message);
    }
}

async function eliminarProyectoProducido(proyectoCod, fecha) {
    try {
        const response = await fetch('/eliminarProyectoProducido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ proyectoCod, fecha })

        });

        const data = await response.json();

        if (!data.err) {
            await obtenerProyectosProducidos();
        } else {
            mostrarError('Error al eliminar proyecto producido:'+ data.errmsg);
            console.error(data.errmsg);
        }
    } catch (error) {
        mostrarError('Error al eliminar proyecto producido:'+ error.message);
    }
}

async function eliminarProyectoCertificado(proyectoCod) {
    try {
        const response = await fetch('/eliminarProyectoCertificado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ proyectoCod })
        });

        const data = await response.json();

        if (!data.err) {
            await obtenerProyectosCertificados();
        } else {
            mostrarError('Error al eliminar proyecto certificado:'+ data.errmsg);
        }
    } catch (error) {
        mostrarError('Error al eliminar proyecto certificado:'+ error.message);
    }
}

async function abrirModalEditableProyectoProducido(proyectoCod, fecha) {
    try {
        // Obtener todos los proyectos
        const response = await fetch('/obtenerProyectosProducidos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();

            const proyecto = data.proyectos.find(proy => proy.proyectoCod === proyectoCod && proy.fecha === fecha);

            if (proyecto) {
                // Mostrar el modal de edición
                const modalEditarProyecto = document.getElementById('modalEditarProyectoProducido');
                modalEditarProyecto.style.display = 'block';

                document.getElementById("proyectoCodEditarProducido").value = proyecto.proyectoCod;
                document.getElementById("fechaEditarProducido").value = ajustarFechaParaInput(proyecto.fecha);
                document.getElementById("importeEditarProducido").value = proyecto.importe;

            } else {
                mostrarError('No se encontró el proyecto con el código proporcionado:'+ proyectoCod);
            }
        } else {
            mostrarError('Error al llamar a la API:'+ response.statusText);
        }
    } catch (error) {
        mostrarError('Error al abrir el modal editable del proyecto:'+ error.message);
    }
}

async function mostrarDatosEnTablaProducidos(data) {
    // Obtener la tabla HTML
    const tabla = document.getElementById('tablaProyectoProducido');

    // Obtener todas las filas de la tabla, excepto la primera (la cabecera)
    const filasDatos = Array.from(tabla.querySelectorAll('tr:not(:first-child)'));

    // Eliminar todas las filas de datos existentes
    filasDatos.forEach(fila => fila.remove());

    if (data.proyectos && Array.isArray(data.proyectos)) {
        data.proyectos.forEach(proyecto => {
            const fila = document.createElement('tr');

            // Orden de las propiedades del proyecto para mostrar en la tabla
            const propiedades = [
                'proyectoCod',
                'fecha',
                'importe'
            ];

            propiedades.forEach(clave => {
                const celda = document.createElement('td');
                const valor = proyecto[clave];
                // Verificar si la clave es una fecha para formatearla
                if (clave === 'fecha') {
                    celda.textContent = formatearFecha(valor);
                } else {
                    celda.textContent = valor;
                }
                fila.appendChild(celda);
            });

            const celdaBoton = document.createElement('td');
            const boton = document.createElement('button');
            boton.textContent = 'Ver';
            celdaBoton.appendChild(boton);
            fila.appendChild(celdaBoton);

            tabla.appendChild(fila);

            boton.addEventListener('click', function () {
                const proyectoCod = proyecto.proyectoCod;
                const fecha = proyecto.fecha;
                abrirModalEditableProyectoProducido(proyectoCod, fecha);
            });
        });
    } else {
        mostrarError('No se encontraron datos de proyectos válidos en la respuesta.');
    }
}

async function mostrarDatosEnTablaCertificados(data) {
    // Obtener la tabla HTML
    const tabla = document.getElementById('tablaProyectoCertificado');

    // Obtener todas las filas de la tabla, excepto la primera (la cabecera)
    const filasDatos = Array.from(tabla.querySelectorAll('tr:not(:first-child)'));

    // Eliminar todas las filas de datos existentes
    filasDatos.forEach(fila => fila.remove());

    if (data.proyectos && Array.isArray(data.proyectos)) {
        data.proyectos.forEach(proyecto => {
            const fila = document.createElement('tr');

            // Orden de las propiedades del proyecto para mostrar en la tabla
            const propiedades = [
                'proyectoCod',
                'fecha',
                'importe'
            ];

            propiedades.forEach(clave => {
                const celda = document.createElement('td');
                const valor = proyecto[clave];
                // Verificar si la clave es una fecha para formatearla
                if (clave === 'fecha') {
                    celda.textContent = formatearFecha(valor);
                } else {
                    celda.textContent = valor;
                }
                fila.appendChild(celda);
            });

            const celdaBoton = document.createElement('td');
            const boton = document.createElement('button');
            boton.textContent = 'Eliminar';
            celdaBoton.appendChild(boton);
            fila.appendChild(celdaBoton);

            tabla.appendChild(fila);

            
        });
    } else {
        mostrarError('No se encontraron datos de proyectos válidos en la respuesta.');
    }
}

async function guardarProyectoProducido() {
    const proyectoCod = document.getElementById("proyectoCodProducido").value;
    const fecha = document.getElementById("fechaProducido").value;
    const importe = document.getElementById("importeProducido").value;

    const proyecto = {
        proyectoCod: proyectoCod,
        fecha: fecha,
        importe: importe
    };

    try {
        await agregarProyectoProducido(proyecto);
        await obtenerProyectosProducidos();
    } catch (error) {
        mostrarError('Error al agregar proyecto:'+ error.message);
    }
}

async function actualizadaProyectoProducido() {
    const proyectoCod = document.getElementById("proyectoCodEditarProducido").value;
    const fecha = document.getElementById("fechaEditarProducido").value;
    const importe = document.getElementById("importeEditarProducido").value;

    const proyecto = {
        proyectoCod: proyectoCod,
        fecha: fecha,
        importe: importe
    };

    try {
        await actualizarProyectoProducido(proyecto);
        await obtenerProyectosProducidos();
    } catch (error) {
        mostrarError('Error al actualizar proyecto:'+ error.message);
    }
}

function ClicEliminarProyectoProducido() {
    const proyectoCod = document.getElementById("proyectoCodEditarProducido").value;
    const fecha = document.getElementById("fechaEditarProducido").value;

    eliminarProyectoProducido(proyectoCod, fecha);
    cerrarModal();
}

function agregarProyectoProducidoCodSelect(datosProyectoProducido) {
    let selectAgregarProyectoCod = document.getElementById("proyectoCodProducido");
    let selectEditarProyectoCod = document.getElementById("proyectoCodEditarProducido");

    selectAgregarProyectoCod.innerHTML = "";
    selectEditarProyectoCod.innerHTML = "";

    datosProyectoProducido.forEach((proyecto) => {
        let optionAgregar = document.createElement("option");
        optionAgregar.text = proyecto.nombre; 
        optionAgregar.value = proyecto.proyectoCod; 
        selectAgregarProyectoCod.add(optionAgregar);

        let optionEditar = document.createElement("option");
        optionEditar.text = proyecto.nombre; 
        optionEditar.value = proyecto.proyectoCod; 
        selectEditarProyectoCod.add(optionEditar);
    });
}

async function main() {
    try {
        await obtenerProyectosProducidos();
        await obtenerProyectosCertificados();
        await obtenerProyectosCod()

    } catch (error) {
        mostrarError('Error en la ejecución principal:'+ error);
    }
}

main();