const levelInput = document.getElementById("level");

// Atualiza ½ do nível
function atualizarHalfLevel() {
  const nivel = parseInt(levelInput.value) || 1;
  const metadeNivel = Math.floor(nivel / 2);

  document.querySelectorAll(".half-level").forEach(input => {
    input.value = metadeNivel;
  });
}
levelInput.addEventListener("input", atualizarHalfLevel);

// Tabela de bônus de perícia (treinado, não treinado, proficiência)
const skillBonusTable = [
  [2, 0, 2],  // 1º nível
  [3, 1, 2],  // 2º nível
  [3, 1, 2],  // 3º nível
  [4, 2, 2],  // 4º nível
  [4, 2, 2],  // 5º nível
  [5, 3, 2],  // 6º nível
  [7, 3, 4],  // 7º nível
  [8, 4, 4],  // 8º nível
  [8, 4, 4],  // 9º nível
  [9, 5, 4],  // 10º nível
  [9, 5, 4],  // 11º nível
  [10, 6, 4], // 12º nível
  [10, 6, 4], // 13º nível
  [11, 7, 4], // 14º nível
  [13, 7, 6], // 15º nível
  [14, 8, 6], // 16º nível
  [14, 8, 6], // 17º nível
  [15, 9, 6], // 18º nível
  [15, 9, 6], // 19º nível
  [16, 10, 6] // 20º nível
];

// Retorna o bônus da perícia para o nível e tipo
function getSkillValues(level, trained, proeficiency) {
  if (level > 20) level = 20;
  const [trainedBonus, untrainedBonus, proefBonus] = skillBonusTable[level - 1];
  if (proeficiency === 0)
    return trained ? trainedBonus : untrainedBonus;
  else
    return trained ? proefBonus : 0;
}

// Pega o modificador com base na sigla (ex: "DES" → #mod-DES)
function getModifierValue(sigla) {
  const modInput = document.getElementById("mod-" + sigla);
  return parseInt(modInput?.value || "0");
}

// Atualiza o total de TODAS as perícias
function atualizarTodasPericias() {
  const level = parseInt(levelInput.value) || 1;
  const halfLevel = Math.floor(level / 2);

  document.querySelectorAll(".skill").forEach(skillEl => {
    const checkbox = skillEl.querySelector('input[type="checkbox"]');
    const totalInput = skillEl.querySelector(".total-skill");
    const halfInput = skillEl.querySelector(".half-level");
    const proefInput = skillEl.querySelector(".proeficiency");
    const bonusInput = skillEl.querySelector(".bonus");
    const selectAttr = skillEl.querySelector(".input-modifier");

    const trained = checkbox.checked;
    const selectedAttr = selectAttr.value;
    const otherBonus = parseInt(bonusInput.value) || 0;
    const attrMod = getModifierValue(selectedAttr);

    const proef = getSkillValues(level, trained, 1);
    const bonus = getSkillValues(level, trained, 0);

    halfInput.value = halfLevel;
    proefInput.value = proef;

    const total = halfLevel + attrMod + proef + otherBonus;
    totalInput.value = total;

    const skillLabel = skillEl.querySelector('.skill-label');
    let needProef = false; // Flag para indicar se a perícia tem penalidade de armadura
    
    if (skillLabel) {
      const infoSkillImage = skillLabel.querySelector('.info_skill_proef');
      if (infoSkillImage) {
        needProef = true; // A perícia possui a imagem 'info_skill'
      }
    }
    // ------------------------------------------------------------------

    // Exemplo de como você poderia usar a flag 'needProef'
    let finalBonus = bonus;
    if (needProef && !trained) { // Exemplo: se tem penalidade E é treinada
      // Aqui você aplicaria a lógica da penalidade, por exemplo, subtraindo um valor
      // Você precisaria de alguma forma obter o valor da penalidade da armadura
      // Por agora, vamos apenas demonstrar que a flag funciona.
      // finalBonus -= valorDaPenalidadeDeArmadura;

      halfInput.value = 0;
      proefInput.value = 0;
      totalInput.value = 0;
    }
  });
}

// Eventos para recalcular as perícias
levelInput.addEventListener("input", atualizarTodasPericias);

document.querySelectorAll(".skill input[type='checkbox'], .skill select, .skill .bonus").forEach(el => {
  el.addEventListener("input", atualizarTodasPericias);
  el.addEventListener("change", atualizarTodasPericias);
});

// Atualiza modificadores automaticamente quando total de atributos mudar
document.querySelectorAll(".tot-hability").forEach(input => {
  input.addEventListener("input", () => {
    const id = input.id.split("tot-")[1]; // Ex: "DES"
    const modInput = document.getElementById("mod-" + id);
    const total = parseInt(input.value) || 10;
    modInput.value = Math.floor((total - 10) / 2);
    atualizarTodasPericias();
  });
});