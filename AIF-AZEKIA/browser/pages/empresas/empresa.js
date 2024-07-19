
function mostrarModalAgregarEmpresa() {
    document.getElementById("modalAgregarEmpresa").style.display = "block";
}

function cerrarModal() {
    document.getElementById("modalAgregarEmpresa").style.display = "none";
    document.getElementById("modalEditarEmpresa").style.display = "none";
}

async function agregarEmpresa(empresa) {
    try {
        const response = await fetch('/agregarEmpresa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ empresa: empresa })
        });
        if (response.ok) {

            const data = await response.json();
            if (data.err) {
                mostrarError('Error al agregar la empresa:' + data.errmsg);
            }else{
                cerrarModal();
            }
        } else {
            mostrarError('Error al añadir empresa:' + response.statusText);
        }
    } catch (error) {
        mostrarError('Error al añadir empresa:' + error.message);
    }
}


async function actualizarEmpresa(empresa) {
    try {
        const response = await fetch('/actualizarEmpresa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ empresa: empresa })
        });
        if (response.ok) {

            const data = await response.json();
            if (data.err) {
                mostrarError('Error al actualizar la empresa:' + data.errmsg);
            }else{
                cerrarModal();
            }
        } else {
            mostrarError('Error al actualizar empresa:' + response.statusText);
        }
    } catch (error) {
        mostrarError('Error al actualizar empresa:' + error.message);
    }
}

async function obtenerEmpresasAPI() {
    try {
        const response = await fetch('/obtenerEmpresas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.err) {
                // Si hay un error, muestra un mensaje de error
                mostrarError('Error al obtener empresas:' + data.errmsg);
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

function ClicEliminarEmpresa() {
    // Obtener el valor de empresaCod del input
    const empresaCod = document.getElementById("codEmpresaeditar").value;
    // Llamar a la función eliminarEmpresa con empresaCod
    eliminarEmpresa(empresaCod);
    cerrarModal();
}

async function eliminarEmpresa(empresaCod) {
    try {
        const response = await fetch('/eliminarEmpresa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ empresaCod })
        });

        const data = await response.json();

        if (!data.err) {
            // Si no hay errores, actualiza la lista de empresas
            await obtenerEmpresasAPI();
        } else {
            mostrarError('Error al eliminar empresa: ' + data.errmsg);
        }
    } catch (error) {
        mostrarError('Error al eliminar empresa: ' + error.message);
    }
}

async function abrirModalEditable(empresaId) {
    try {
        // Obtener todas las empresas
        const response = await fetch('/obtenerEmpresas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();
            // Buscar la empresa con el ID proporcionado
            const empresa = data.empresas.find(emp => emp.empresaCod === empresaId);

            if (empresa) {
                // Llenar los campos del formulario del modal con los detalles de la empresa
                document.getElementById("codEmpresaeditar").value = empresa.empresaCod;
                document.getElementById("codEmpresaeditar").readOnly = true;
                document.getElementById("cifeditar").value = empresa.CIF;
                document.getElementById("razonSocialeditar").value = empresa.razonSocial;
                document.getElementById("direccioneditar").value = empresa.direccion;
                document.getElementById("cpeditar").value = empresa.CP;
                document.getElementById("municipioeditar").value = empresa.municipio;

                // Obtener el elemento del input
                const inputElement = document.getElementById("codEmpresaeditar");

                // Verificar si ya existe un span antes de agregar uno nuevo
                const existingSpan = inputElement.nextSibling;
                if (existingSpan && existingSpan.tagName === "SPAN") {
                    // Si existe un span, simplemente actualizar su contenido y ocultar el input
                    existingSpan.textContent = empresa.empresaCod;
                    inputElement.style.display = "none";
                } else {
                    // Si no existe un span, crear uno nuevo y agregarlo después del input, y ocultar el input
                    const spanElement = document.createElement("span");
                    spanElement.textContent = empresa.empresaCod;
                    inputElement.parentNode.insertBefore(spanElement, inputElement.nextSibling);
                    inputElement.style.display = "none";
                }


                // Mostrar el modal de edición
                const modalEditarEmpresa = document.getElementById('modalEditarEmpresa');
                modalEditarEmpresa.style.display = 'block';
            } else {
                mostrarError('No se encontró la empresa con el ID proporcionado:' + empresaId);
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
    const tabla = document.getElementById('tablaEmpresas');

    // Obtener todas las filas de la tabla, excepto la primera (la cabecera)
    const filasDatos = Array.from(tabla.querySelectorAll('tr:not(:first-child)'));

    // Eliminar todas las filas de datos existentes
    filasDatos.forEach(fila => fila.remove());

    if (data.empresas && Array.isArray(data.empresas)) {

        data.empresas.forEach(empresa => {
            const fila = document.createElement('tr');

            Object.values(empresa).forEach(valor => {
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
                // Obtén el identificador único de la empresa correspondiente a esta fila
                const empresaId = empresa.empresaCod;
                abrirModalEditable(empresaId);
            });
        });
    } else {
        mostrarError('No se encontraron datos de empresas válidos en la respuesta.');
    }
}



async function guardarEmpresa() {
    // Obtener los datos del formulario
    const codEmpresa = document.getElementById("codEmpresa").value;
    const cif = document.getElementById("cif").value;
    const razonSocial = document.getElementById("razonSocial").value;
    const direccion = document.getElementById("direccion").value;
    const cp = document.getElementById("cp").value;
    const municipio = document.getElementById("municipio").value;

    // Crear un objeto empresa con los datos del formulario
    const empresa = {
        empresaCod: codEmpresa,
        CIF: cif,
        razonSocial: razonSocial,
        direccion: direccion,
        CP: cp,
        municipio: municipio
    };

    try {

        await agregarEmpresa(empresa);

        await obtenerEmpresasAPI();
        // Aquí podrías actualizar la tabla de empresas si lo deseas
    } catch (error) {
        mostrarError('Error al agregar empresa:' + error.message);
    }
}

async function actualizadaempresa() {
    // Obtener los datos del formulario
    const codEmpresa = document.getElementById("codEmpresaeditar").value;
    const cif = document.getElementById("cifeditar").value;
    const razonSocial = document.getElementById("razonSocialeditar").value;
    const direccion = document.getElementById("direccioneditar").value;
    const cp = document.getElementById("cpeditar").value;
    const municipio = document.getElementById("municipioeditar").value;

    // Crear un objeto empresa con los datos del formulario
    const empresa = {
        empresaCod: codEmpresa,
        CIF: cif,
        razonSocial: razonSocial,
        direccion: direccion,
        CP: cp,
        municipio: municipio
    };

    try {

        await actualizarEmpresa(empresa);

        await obtenerEmpresasAPI();
    } catch (error) {
        mostrarError('Error al agregar empresa:' + error.message);
    }
}

async function main() {
    try {
        await obtenerEmpresasAPI();
    } catch (error) {
        mostrarError('Error en la ejecución principal:' + error);
    }
}


main(); 