const TRAIT_TENSIONS = new Map([
  ['skeptical:bold', 12],
  ['disciplined:playful', 10],
  ['calm:restless', 14],
  ['protective:experimental', 11]
]);

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function traitNames(agent) {
  return agent.soul.map((item) => item.trait);
}

function tensionScore(parentA, parentB) {
  const aTraits = traitNames(parentA);
  const bTraits = traitNames(parentB);
  let tension = 0;

  aTraits.forEach((aTrait) => {
    bTraits.forEach((bTrait) => {
      tension += TRAIT_TENSIONS.get(`${aTrait}:${bTrait}`) || 0;
      tension += TRAIT_TENSIONS.get(`${bTrait}:${aTrait}`) || 0;
    });
  });

  return tension;
}

function scoreSkillComplementarity(parentA, parentB) {
  const aSkills = new Set(parentA.skills);
  const bSkills = new Set(parentB.skills);
  const overlap = parentB.skills.filter((skill) => aSkills.has(skill)).length;
  const unique = new Set([...parentA.skills, ...parentB.skills]).size;
  return clampScore(54 + unique * 5 - overlap * 8);
}

function scoreKnowledgeDiversity(parentA, parentB) {
  const unique = new Set([...parentA.knowledge, ...parentB.knowledge]).size;
  const total = parentA.knowledge.length + parentB.knowledge.length;
  return clampScore((unique / total) * 100 + 12);
}

function scorePersonality(parentA, parentB) {
  const aWeights = parentA.soul.map((trait) => trait.weight);
  const bWeights = parentB.soul.map((trait) => trait.weight);
  const confidence = average([...aWeights, ...bWeights]);
  const tension = tensionScore(parentA, parentB);
  return clampScore(68 + confidence * 0.18 - tension);
}

function scoreMutationPotential(parentA, parentB) {
  const radarGap = Object.keys(parentA.radar).map((key) => {
    return Math.abs(parentA.radar[key] - parentB.radar[key]);
  });
  const skillSpread = new Set([...parentA.skills, ...parentB.skills]).size;
  return clampScore(36 + average(radarGap) * 0.7 + skillSpread * 3);
}

export function calculateCompatibility(parentA, parentB) {
  const personality = scorePersonality(parentA, parentB);
  const skill = scoreSkillComplementarity(parentA, parentB);
  const knowledge = scoreKnowledgeDiversity(parentA, parentB);
  const mutation = scoreMutationPotential(parentA, parentB);
  const total = clampScore(personality * 0.25 + skill * 0.3 + knowledge * 0.2 + mutation * 0.25);

  let explanation = 'The pair has balanced compatibility and enough variation for a stable child genome.';
  if (mutation >= 78 && skill >= 76) {
    explanation = 'High skill complementarity and strong genome distance create excellent mutation potential.';
  } else if (personality < 62) {
    explanation = 'The pair has personality tension, but that tension may produce a distinctive child agent.';
  } else if (knowledge >= 82) {
    explanation = 'The pair brings broad knowledge coverage, useful for a versatile child agent.';
  }

  return {
    total,
    personality,
    skill,
    knowledge,
    mutation,
    explanation
  };
}
