    async function validarCredenciales() {
        const correo = document.getElementById("correo").value;
        const contrasena = document.getElementById("contrasena").value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo, contrasena })
            });

            const data = await response.json();

            if (data.valido) {
                window.location.href = '/facturas';
            } else {
                const msgError = document.getElementById("msgError");
                msgError.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Error al enviar solicitud de inicio de sesión:', error);
        }
    }
