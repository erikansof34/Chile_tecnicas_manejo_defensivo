export function init() {
  const audios = [
    { title: "1. Atención y Visión Periférica", src: "./momento2_3/audio/L2-slide_3_factor_1.mp3" },
    { title: "2. Anticipación y Predecibilidad", src: "./momento2_3/audio/L2-slide_3_factor_2.mp3" },
    { title: "3. Uso de Tecnología para la Seguridad", src: "./momento2_3/audio/L2-slide_3_factor_3.mp3" }
  ];

  let currentAudioIndex = 0;
  const audioPlayer = document.getElementById("myAudio");
  const audioSource = document.getElementById("audioSource_sld9");
  const audioTitle = document.getElementById("audio-title");
  const startButton = document.getElementById("startButton");
  const audioControls = document.getElementById("audioControls");
  const prevButton = document.getElementById("prevAudio_sld9");
  const nextButton = document.getElementById("nextAudio_sld9");

  function updateAudio() {
    audioSource.src = audios[currentAudioIndex].src;
    audioTitle.textContent = audios[currentAudioIndex].title;
    audioPlayer.load();

    audioPlayer.play().then(() => {
      console.log("Reproducción iniciada correctamente.");
    }).catch(error => {
      console.error("Error al reproducir el audio:", error);
    });

    // Mostrar/Ocultar botones según el índice actual
    if (currentAudioIndex === 0) {
      prevButton.style.display = 'none';
      nextButton.style.display = 'inline-block';
    } else if (currentAudioIndex === audios.length - 1) {
      prevButton.style.display = 'inline-block';
      nextButton.style.display = 'none';
    } else {
      prevButton.style.display = 'inline-block';
      nextButton.style.display = 'inline-block';
    }
  }

  startButton.addEventListener("click", () => {
    startButton.style.display = 'none';
    audioControls.style.display = 'block';
    updateAudio();
  });

  prevButton.addEventListener("click", () => {
    if (currentAudioIndex > 0) {
      currentAudioIndex--;
      updateAudio();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentAudioIndex < audios.length - 1) {
      currentAudioIndex++;
      updateAudio();
    }
  });
}