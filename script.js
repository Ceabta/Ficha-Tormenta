const btn = document.getElementById("limparBtn");
const icon = document.getElementById("iconLimpar");
const habilidades = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];
const holdTime = 1000; // 1 segundos
let startTime;
let animationFrameId;

habilidades.forEach(hab => {
  const totInput = document.getElementById(`tot-${hab}`);
  const modInput = document.getElementById(`mod-${hab}`);

  function atualizarModificador() {
    const total = parseInt(totInput.value) || 0;
    const mod = Math.floor((total - 10) / 2);
    modInput.value = mod;
  }

  totInput.addEventListener('input', atualizarModificador);

  // Inicializa os valores ao carregar
  /*atualizarModificador();*/
});


function lerpColor(color1, color2, t) {
  return color1.map((c, i) => Math.round(c + (color2[i] - c) * t));
}

function rgbToHex(rgb) {
  return "#" + rgb.map(c => c.toString(16).padStart(2, "0")).join("");
}

const colorStart = [255, 255, 255];
const colorEnd = [255, 0, 0];
//const colorEnd = [162, 33, 29];

function updateColor() {
  const elapsed = Date.now() - startTime;
  let progress = elapsed / holdTime;
  if (progress > 1) progress = 1;

  const currentColor = lerpColor(colorStart, colorEnd, progress);
  icon.style.stroke = rgbToHex(currentColor);

  if (progress < 1) {
    animationFrameId = requestAnimationFrame(updateColor);
  } else {
    if (confirm("Tem certeza que deseja apagar todos os dados?")) {
      document.querySelectorAll("input, textarea").forEach((el) => {
        if (el.type === "number" && el.getAttribute("id") === "level") {
          el.value = 1;
        }
        else if (el.type === "number" && el.getAttribute("min") === "0") {
          el.value = 0;
        }
        else if (el.type === "number" && el.getAttribute("class") === "tot-hability") {
          el.value = 10;
        }
        else if (el.type === "checkbox") {
          el.checked = false; // Desmarca o checkbox
        }
        else if (el.type === "number" &&
          (el.getAttribute("class") === "total-skill" ||
            el.getAttribute("class") === "half-level" ||
            el.getAttribute("class") === "proeficiency" ||
            el.getAttribute("class") === "bonus")) {
          el.value = 0;
        }
        else {
          el.value = "";
        }
      });

      // Modificação AQUI: Para resetar os selects para a opção pré-selecionada
      document.querySelectorAll("select").forEach(selectEl => {
        // Encontra a opção que tem o atributo 'selected' no HTML original
        const defaultOption = selectEl.querySelector('option[selected]');
        if (defaultOption) {
          selectEl.value = defaultOption.value; // Define o valor do select para o valor da opção selected
        } else {
          selectEl.selectedIndex = 0; // Caso não haja 'selected', volta para a primeira opção (comportamento padrão)
        }
      });
    }
    icon.style.stroke = "white";
  }
}


btn.addEventListener("mousedown", () => {
  startTime = Date.now();
  updateColor();
});

function resetColor() {
  cancelAnimationFrame(animationFrameId);
  icon.style.stroke = "white";
}

btn.addEventListener("mouseup", resetColor);
btn.addEventListener("mouseleave", resetColor);

const deslocamentoInput = document.getElementById("deslocamento");

deslocamentoInput.addEventListener("blur", () => {
  let valor = deslocamentoInput.value.trim();

  // Só adiciona "m" se ainda não tiver
  if (valor !== "" && !valor.toLowerCase().endsWith("m")) {
    deslocamentoInput.value = valor + "m";
  }
});