const canvas = document.getElementById("c");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fontSize = Math.floor(window.innerWidth / 20); // Tamaño de la fuente
const columns = Math.floor(canvas.width / fontSize);

const drops = Array(columns).fill(1);

const phrases = [
  "Buenos días, Mi amor",
  " Espero que tengas un día maravilloso",
  " ¡Siempre estoy pensando en ti!",
  " Te amo más de lo que las palabras pueden expresar",
];

const colors = [
  "#0F0", // Verde
  "#FF0", // Amarillo
  "#F00", // Rojo
  "#0FF", // Cian
  "#F0F", // Magenta
  "#00F", // Azul
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let showingPhrase = true;
let colorIndex = 0;
let phraseFinished = false; // Flag para saber si la frase ha terminado de mostrarse

// Función para manejar la lluvia de letras
function drawRain() {
  context.fillStyle = "rgba(0, 0, 0, 0.05)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = String.fromCharCode(0x30a0 + Math.random() * 96);

    // Cambiar el color secuencialmente
    context.fillStyle = colors[colorIndex];
    context.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }

  // Cambiar el color secuencialmente
  colorIndex = (colorIndex + 1) % colors.length;
}

// Función para dividir el texto en líneas
function wrapText(text, context, maxWidth) {
  const words = text.split(" ");
  let line = "";
  const lines = [];

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const testWidth = context.measureText(testLine).width;

    // Si la línea es demasiado larga, agregarla a las líneas y comenzar una nueva línea
    if (testWidth > maxWidth - 60 && line.length > 0) {
      lines.push(line);
      line = words[i] + " "; // Empezar nueva línea con la palabra actual
    } else {
      line = testLine; // Continuar añadiendo palabras a la línea actual
    }
  }

  // Agregar la última línea
  lines.push(line);

  return lines;
}


// Función para mostrar las frases con efecto, letra por letra
function drawPhrase() {
  if (currentPhraseIndex < phrases.length) {
    const phrase = phrases[currentPhraseIndex];

    // Obtener el ancho máximo permitido para el texto (canvas.width - márgenes)
    const maxWidth = canvas.width - 40; // Márgenes de 20px a cada lado

    // Dividir la frase en líneas
    const lines = wrapText(phrase.slice(0, currentCharIndex), context, maxWidth);

    // Configuración de estilo
    context.fillStyle = "#FFF"; // Color de la letra
    context.font = `${fontSize + 10}px monospace`;
    context.textAlign = "center"; // Centrar el texto

    // Ajuste de la posición vertical, para que las líneas estén centradas verticalmente
    const lineHeight = fontSize + 10; // Altura de la línea
    const totalTextHeight = lines.length * lineHeight;
    const startY = (canvas.height - totalTextHeight) / 2; // Centrar el texto verticalmente

    // Dibujar cada línea en el canvas
    lines.forEach((line, index) => {
      const yPosition = startY + index * lineHeight;
      context.fillText(line, canvas.width / 2, yPosition);
    });

    // Incrementar el índice del carácter
    if (currentCharIndex < phrase.length) {
      currentCharIndex++;
    } else if (!phraseFinished) {
      // Cuando la frase termina de mostrarse
      phraseFinished = true;
      setTimeout(() => {
        currentCharIndex = 0;
        currentPhraseIndex++;
        if (currentPhraseIndex == phrases.length) {
          currentPhraseIndex = 0;
        }
        phraseFinished = false; // Resetear el flag para la siguiente frase
      }, 3000); // Pausa de 2 segundos antes de cambiar de frase
    }
  }
}
// Función para mostrar el botón
function showButton() {
  const button = document.getElementById("button");
  button.style.display = "block"; // Mostrar el botón cuando se termina de mostrar las frases
}

// Función para ir a la canción en YouTube
function goToSong() {
  window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // URL de la canción de YouTube
}

// Renderizar ambas funciones en el bucle de animación
function draw() {
  drawRain();
  drawPhrase();

  // Mostrar el botón después de la última frase
  if (currentPhraseIndex === phrases.length && currentCharIndex === phrases[phrases.length - 1].length) {
    showButton();
  }
}

// Ajustar tamaño del canvas al redimensionar
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Intervalo de renderización
setInterval(draw, 50);

// Función para obtener la canción correspondiente según el día de la semana
function getSongForToday() {
  const daysOfWeek = [
    "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"
  ];
  const today = new Date().getDay(); // Devuelve un número entre 0 y 6 (domingo - sábado)
  return `canciones/${daysOfWeek[today]}.mp3`; // Ruta de la canción correspondiente
}

// Función para cargar la canción en el reproductor
function loadSong() {
  const songPath = getSongForToday();
  const player = document.getElementById("player");
  const songSource = document.getElementById("songSource");

  // Establecer la fuente del audio
  songSource.src = songPath;

  // Reproducir la canción automáticamente
  player.load(); // Cargar el archivo de audio
  player.play(); // Iniciar la reproducción
}

// Función que inicia la música cuando el usuario hace clic en el botón
document.getElementById("playButton").addEventListener("click", function() {
  loadSong();
  // Ocultar el botón una vez que se haya iniciado la música
  document.getElementById("playButton").style.display = "none";
});