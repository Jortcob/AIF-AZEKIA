function mostrarModalAgregarSerie() {
    document.getElementById("modalAgregarSerie").style.display = "block";
}

// Función para cerrar el modal de agregar series
function cerrarModal() {
    document.getElementById("modalAgregarSerie").style.display = "none";
    document.getElementById("modalEditarSerie").style.display = "none";
}

async function agregarSerie(serie) {
    try {
        const response = await fetch('/agregarSerie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ serie: serie })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.err) {
                mostrarError('Error al añadir la serie: ' + data.errmsg);
            }else{
                cerrarModal();
            }
        } else {
            mostrarError('Error al añadir serie:' + response.statusText);
        }
    } catch (error) {
        mostrarError('Error al añadir serie:' + error.message);
    }
}

async function actualizarSerie(serie) {
    try {
        const response = await fetch('/actualizarSerie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ serie: serie })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.err) {
                mostrarError('Error al actualizar la serie:' + data.errmsg);
            }else{
                cerrarModal();
            }
        } else {
            mostrarError('Error al actualizar serie:' + response.statusText);
        }
    } catch (error) {
        mostrarError('Error al actualizar serie:' + error.message);
    }
}

async function obtenerEmpresasCod() {
    try {
        const response = await fetch('/obtenerEmpresasDatosBasicos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.err) {
                mostrarError('Error al obtener empresasCod:'+ data.errmsg)

            } else {
                agregarEmpresasCodSelect(data.datosEmpresa)
            }
        } else {
            
            mostrarError('Error al llamar a la API:'+ response.statusText);

        }
    } catch (error) {
        mostrarError('Error al llamar a la API:'+ error.message);
    }
}

async function obtenerSeriesAPI() {
    try {
        const response = await fetch('/obtenerSeries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.err) {
                // Si hay un error, muestra un mensaje de error
                mostrarError('Error al obtener series:' + data.errmsg);
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

async function eliminarSerie(serieCod, empresaCod) {
    try {
        const response = await fetch('/eliminarSerie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({serieCod, empresaCod})
        });

        const data = await response.json();

        if (!data.err) {
            await obtenerSeriesAPI();
        } else {
            mostrarError('Error al eliminar serie:' + data.errmsg);
        }
    } catch (error) {
        mostrarError('Error al eliminar serie:' + error.message);
    }
}

async function abrirModalEditableSerie(serieCod, empresaCod) {
    try {
        // Obtener todas las series
        const response = await fetch('/obtenerSeries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();
            // Buscar la serie con el código proporcionado
            const serie = data.series.find(ser => ser.serieCod === serieCod && ser.empresaCod === empresaCod);

            if (serie) {
                // Llenar los campos del formulario del modal con los detalles de la serie
                document.getElementById("serieCodEditar").value = serie.serieCod;
                document.getElementById("serieCodEditar").readOnly = true;
                document.getElementById("empresaCodEditar").value = serie.empresaCod;
                document.getElementById("empresaCodEditar").readOnly = true;
                document.getElementById("razonSocialEmpresa").value = serie.razonSocialEmpresa;
                document.getElementById("razonSocialEmpresa").readOnly = true;
                document.getElementById("descripcionEditar").value = serie.descripcion;
                document.getElementById("ultimoNumUsadoEditar").value = serie.ultimoNumUsado;

                // Mostrar el modal de edición
                const modalEditarSerie = document.getElementById('modalEditarSerie');
                modalEditarSerie.style.display = 'block';
            } else {
                mostrarError('No se encontró la serie con el código proporcionado:' + serieCod);
            }
        } else {
            mostrarError('Error al llamar a la API:' + response.statusText);
        }
    } catch (error) {
        mostrarError('Error al abrir el modal editable de la serie:' + error.message);
    }
}

async function mostrarDatosEnTabla(data) {
    // Obtener la tabla HTML
    const tabla = document.getElementById('tablaSeries');

    // Obtener todas las filas de la tabla, excepto la primera (la cabecera)
    const filasDatos = Array.from(tabla.querySelectorAll('tr:not(:first-child)'));

    // Eliminar todas las filas de datos existentes
    filasDatos.forEach(fila => fila.remove());

    if (data.series && Array.isArray(data.series)) {
        data.series.forEach(serie => {
            const fila = document.createElement('tr');

            // Orden de las propiedades del serie para mostrar en la tabla
            const propiedades = [
                'razonSocialEmpresa',
                'serieCod',
                'descripcion',
                'ultimoNumUsado'
            ];

            propiedades.forEach(clave => {
                const celda = document.createElement('td');
                const valor = serie[clave];
                celda.textContent = valor;
                fila.appendChild(celda);
            });

            const celdaBoton = document.createElement('td');
            const boton = document.createElement('button');
            boton.textContent = 'Ver';
            celdaBoton.appendChild(boton);
            fila.appendChild(celdaBoton);

            tabla.appendChild(fila);

            boton.addEventListener('click', function () {
                const serieCod = serie.serieCod;
                const empresaCod = serie.empresaCod;
                abrirModalEditableSerie(serieCod, empresaCod);
            });
        });
    } else {
        mostrarError('No se encontraron datos de series válidos en la respuesta.');
    }
}

async function guardarSerie() {
    // Obtener los datos del formulario
    const serieCod = document.getElementById("serieCod").value;
    const empresaCod = document.getElementById("empresaCod").value;
    const descripcion = document.getElementById("descripcion").value;
    const ultimoNumUsadoString = document.getElementById("ultimoNumUsado").value;

    const ultimoNumUsado = parseInt(ultimoNumUsadoString);


    const serie = {
        serieCod: serieCod,
        empresaCod: empresaCod,
        descripcion: descripcion,
        ultimoNumUsado: ultimoNumUsado
    };

    try {
        // Llamar a la función agregarSerie con el objeto serie como argumento
        await agregarSerie(serie);
        // Actualizar la tabla de series
        await obtenerSeriesAPI();
    } catch (error) {
        mostrarError('Error al agregar serie:' + error.message);
    }
}

async function actualizadaSerie() {
    // Obtener los datos del formulario
    const serieCod = document.getElementById("serieCodEditar").value;
    const empresaCod = document.getElementById("empresaCodEditar").value;
    const descripcion = document.getElementById("descripcionEditar").value;
    const ultimoNumUsadoString = document.getElementById("ultimoNumUsadoEditar").value;

    const ultimoNumUsado = parseInt(ultimoNumUsadoString);


    const serie = {
        serieCod: serieCod,
        empresaCod: empresaCod,
        descripcion: descripcion,
        ultimoNumUsado: ultimoNumUsado
    };

    try {
        await actualizarSerie(serie);
        // Actualizar la tabla de series
        await obtenerSeriesAPI();
    } catch (error) {
        mostrarError('Error al actualizar serie:' + error.message);
    }
}

function ClicEliminarSerie() {
    const serieCod = document.getElementById("serieCodEditar").value;
    const empresaCod = document.getElementById("empresaCodEditar").value;
    eliminarSerie(serieCod, empresaCod);
    cerrarModal();
}
async function main() {
    try {
        // Al cargar la página, obtener y mostrar los datos de las series
        await obtenerSeriesAPI();
        await obtenerEmpresasCod()
    } catch (error) {
        mostrarError('Error en la ejecución principal:' + error);
    }
}

function agregarEmpresasCodSelect(datosEmpresa) {
    let selectAgregarEmpresaCod = document.getElementById("empresaCod");

    selectAgregarEmpresaCod.innerHTML = "";

    datosEmpresa.forEach(  (empresa) => {
        let optionAgregar = document.createElement("option");
        optionAgregar.text = empresa.razonSocial;
        optionAgregar.value = empresa.empresaCod;
        selectAgregarEmpresaCod.add(optionAgregar);

       
    });
}

// Llamar a la función principal
main();
