async function mostrarError(texto) {
    const dialogoError = document.createElement('div');
    dialogoError.classList.add('dialogo-error');
    dialogoError.textContent = texto;
    
    document.body.appendChild(dialogoError);

    setTimeout(() => {
        let opacity = 1;
        const intervalId = setInterval(() => {
            opacity -= 0.08; 
            dialogoError.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(intervalId);
                dialogoError.remove();
            }
        }, 20); 
    }, 3000); 
}

