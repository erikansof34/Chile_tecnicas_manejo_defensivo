export function init() {

    // Datos de la información
    const infoDataMom3Sld11 = {
        1: {
            text: "<strong>1.</strong>",
            audio: "./momento3_6/audio/L3-slide_6_audio1.mp3"
        },
        2: {
            text: "<strong>2.</strong>",
            audio: "./momento3_6/audio/L3-slide_6_audio2.mp3"
        },
        3: {
            text: "<strong>3.</strong>",
            audio: "./momento3_6/audio/L3-slide_6_audio3.mp3"
        },
        4: {
            text: "<strong>4.</strong>",
            audio: "./momento3_6/audio/L3-slide_6_audio4.mp3"
        },
        5: {
            text: "<strong>5.</strong>",
            audio: "./momento3_6/audio/L3-slide_6_audio5.mp3"
        },
        6: {
            text: "<strong>6.</strong>",
            audio: "./momento3_6/audio/L3-slide_6_audio6.mp3"
        },
        7: {
            text: "<strong>7.</strong>",
            audio: "./momento3_6/audio/L3-slide_6_audio7.mp3"
        }
    };

    // Función para cambiar la información
    function changeInfo(buttonId) {
        const infoText = document.getElementById('info-text-mom3-11');
        const audioPlayer = document.getElementById('audioPlayer-mom3-11');
        const data = infoDataMom3Sld11[buttonId];

        if (infoText && data) {
            infoText.innerHTML = data.text;
        }

        if (audioPlayer && data) {
            // Pausar el audio actual
            audioPlayer.pause();

            // Cambiar la fuente del audio
            audioPlayer.src = data.audio;

            // Cargar el nuevo audio
            audioPlayer.load();

            // Reproducir automáticamente
            const playPromise = audioPlayer.play();

            // Manejar posibles errores de reproducción automática
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Reproducción automática prevenida por el navegador:", error);
                    // En algunos navegadores, la reproducción automática puede estar bloqueada
                    // En ese caso, solo cargamos el audio pero no lo reproducimos
                });
            }
        }

        // Actualizar estado activo de los botones
        const buttons = document.querySelectorAll('.circle-button-mom3-11');

        buttons.forEach(button => {
            if (button.getAttribute('data-id') === buttonId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Añadir event listeners a los botones
    const buttons = document.querySelectorAll('.circle-button-mom3-11');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const buttonId = this.getAttribute('data-id');
            changeInfo(buttonId);
        });
    });

    // Inicializar con el primer elemento activo
    changeInfo('');
}