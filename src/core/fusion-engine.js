import { buildAgentGenome, CHROMOSOME_BLUEPRINT } from './genome-engine.js';
import { fuseStrategyGenes } from './gene-fusion-engine.js';

const FUSION_SKILLS = [
  {
    requires: ['planning', 'storytelling'],
    skill: 'narrative problem solving'
  },
  {
    requires: ['retrieval', 'product framing'],
    skill: 'market-backed positioning'
  },
  {
    requires: ['debugging', 'teaching'],
    skill: 'explainable repair coaching'
  },
  {
    requires: ['risk mapping', 'policy explanation'],
    skill: 'guardrailed decision design'
  }
];

const MUTATIONS = [
  {
    id: 'spark-shift',
    type: 'Personality Mutation',
    trait: { trait: 'spark', weight: 67 },
    notice: 'A low-frequency spark trait appeared, increasing expressive risk-taking.'
  },
  {
    id: 'bridge-sense',
    type: 'Skill Mutation',
    skill: 'cross-domain bridge building',
    notice: 'A bridge-building skill emerged from distant knowledge capsules.'
  },
  {
    id: 'signal-glow',
    type: 'Visual Mutation',
    visual: 'cyan-coral pulse',
    notice: 'The child genome expresses a visible cyan-coral pulse during presentation.'
  }
];

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function byWeightDesc(a, b) {
  return b.weight - a.weight;
}

function selectMutation(parentA, parentB) {
  const index = (parentA.id.length + parentB.id.length + parentA.skills.length) % MUTATIONS.length;
  return MUTATIONS[index];
}

function getFusionSkills(skills) {
  return FUSION_SKILLS
    .filter((combo) => combo.requires.every((skill) => skills.includes(skill)))
    .map((combo) => combo.skill);
}

function createName(parentA, parentB, mutation) {
  if (parentA.id === 'atlas' && parentB.id === 'muse') return 'Astra';
  if (parentA.id === 'muse' && parentB.id === 'atlas') return 'Astra';
  const first = parentA.name.slice(0, Math.ceil(parentA.name.length / 2));
  const last = parentB.name.slice(Math.floor(parentB.name.length / 2));
  return `${first}${last}${mutation.id === 'spark-shift' ? 'a' : ''}`;
}

function arenaWeightMap(arena) {
  return (arena?.requiredLoci || []).reduce((weights, locus) => {
    weights[locus] = 1.2;
    return weights;
  }, {});
}

function getLocus(genome, chromosomeId, locusId) {
  return genome.chromosomes[chromosomeId].loci.find((locus) => locus.locus_id === locusId);
}

function inheritanceWeight(locus, arenaWeight, safetyMultiplier = 1) {
  return locus.strength * (locus.heritability || 0.7) * arenaWeight * safetyMultiplier * (locus.dominance || 0.7);
}

function chooseLocus(parentALocus, parentBLocus, chromosomeId, arenaWeight) {
  if (chromosomeId === 'safety') {
    return parentALocus.strength >= parentBLocus.strength
      ? { selected: 'parent_a', locus: parentALocus, weightA: parentALocus.strength, weightB: parentBLocus.strength }
      : { selected: 'parent_b', locus: parentBLocus, weightA: parentALocus.strength, weightB: parentBLocus.strength };
  }

  const safetyMultiplierA = chromosomeId === 'tool' ? 0.95 : 1;
  const safetyMultiplierB = chromosomeId === 'tool' ? 0.95 : 1;
  const weightA = inheritanceWeight(parentALocus, arenaWeight, safetyMultiplierA);
  const weightB = inheritanceWeight(parentBLocus, arenaWeight, safetyMultiplierB);

  return weightA >= weightB
    ? { selected: 'parent_a', locus: parentALocus, weightA, weightB }
    : { selected: 'parent_b', locus: parentBLocus, weightA, weightB };
}

function buildFusionPlan(parentAGenome, parentBGenome, arena) {
  const weights = arenaWeightMap(arena);
  const inheritancePlan = [];
  const chromosomes = {};

  CHROMOSOME_BLUEPRINT.forEach((chromosome) => {
    chromosomes[chromosome.id] = {
      chromosome_id: chromosome.id,
      id: chromosome.id,
      label: chromosome.label,
      loci: chromosome.loci.map((locusId) => {
        const path = `${chromosome.id}.${locusId}`;
        const locusA = getLocus(parentAGenome, chromosome.id, locusId);
        const locusB = getLocus(parentBGenome, chromosome.id, locusId);
        const arenaWeight = weights[path] || 0.7;
        const chosen = chooseLocus(locusA, locusB, chromosome.id, arenaWeight);
        const selectedLocus = {
          ...chosen.locus,
          source_parent: chosen.selected,
          arena_weight: Number(arenaWeight.toFixed(2)),
          selected_weight: Number(Math.max(chosen.weightA, chosen.weightB).toFixed(2))
        };

        inheritancePlan.push({
          locus: path,
          selected_parent: chosen.selected,
          reason: chosen.selected === 'parent_a'
            ? `Parent A wins by arena-weighted locus strength (${chosen.weightA.toFixed(2)} vs ${chosen.weightB.toFixed(2)}).`
            : `Parent B wins by arena-weighted locus strength (${chosen.weightB.toFixed(2)} vs ${chosen.weightA.toFixed(2)}).`,
          weight_a: Number(chosen.weightA.toFixed(2)),
          weight_b: Number(chosen.weightB.toFixed(2)),
          arena_weight: Number(arenaWeight.toFixed(2))
        });

        return selectedLocus;
      })
    };
  });

  return {
    parent_a: parentAGenome.id,
    parent_b: parentBGenome.id,
    arena_id: arena?.id || null,
    inheritance_plan: inheritancePlan,
    child_chromosomes: chromosomes
  };
}

function deriveRadarFromGenome(childGenome, mutation) {
  const cognitive = childGenome.chromosomes.cognitive.loci;
  const personality = childGenome.chromosomes.personality.loci;
  const safety = childGenome.chromosomes.safety.loci;

  return {
    logic: clamp(Math.round((cognitive[1].strength + cognitive[2].strength) / 2)),
    creativity: clamp(personality.find((locus) => locus.locus_id === 'creativity').strength + (mutation.id === 'spark-shift' ? 8 : 0)),
    empathy: clamp(Math.round((personality.find((locus) => locus.locus_id === 'curiosity').strength + safety.find((locus) => locus.locus_id === 'review_policy').strength) / 2)),
    autonomy: clamp(personality.find((locus) => locus.locus_id === 'persistence').strength + (mutation.id === 'bridge-sense' ? 6 : 0)),
    risk: clamp(personality.find((locus) => locus.locus_id === 'risk_tolerance').strength - (mutation.id === 'signal-glow' ? 4 : 0))
  };
}

function deriveSoul(parentA, parentB, mutation, fusionPlan) {
  const inheritedSoul = [
    ...parentA.soul.slice().sort(byWeightDesc).slice(0, 2),
    ...parentB.soul.slice().sort(byWeightDesc).slice(0, 2)
  ];
  const planningWinner = fusionPlan.inheritance_plan.find((item) => item.locus === 'cognitive.planning_depth')?.selected_parent;
  const narrativeWinner = fusionPlan.inheritance_plan.find((item) => item.locus === 'cognitive.system_prompt')?.selected_parent;

  const dynamicSoul = [];
  if (planningWinner === 'parent_a') dynamicSoul.push({ trait: 'build-first', weight: 72 });
  if (narrativeWinner === 'parent_b') dynamicSoul.push({ trait: 'narrative-aware', weight: 74 });

  return mutation.trait
    ? [...inheritedSoul, ...dynamicSoul, mutation.trait]
    : [...inheritedSoul, ...dynamicSoul];
}

function deriveSkills(parentA, parentB, mutation, fusionPlan) {
  const inheritedSkills = [];

  fusionPlan.inheritance_plan.forEach((item) => {
    if (item.locus === 'tool.tool_registry' && item.selected_parent === 'parent_a') {
      inheritedSkills.push(...parentA.skills.slice(0, 3));
    }
    if (item.locus === 'cognitive.system_prompt' && item.selected_parent === 'parent_b') {
      inheritedSkills.push(...parentB.skills.slice(0, 3));
    }
  });

  const baseSkills = unique([...parentA.skills.slice(0, 2), ...parentB.skills.slice(0, 2), ...inheritedSkills]);
  const fusionSkills = getFusionSkills([...parentA.skills, ...parentB.skills]);
  const mutationSkills = mutation.skill ? [mutation.skill] : [];

  return unique([...baseSkills, ...fusionSkills, ...mutationSkills]);
}

function deriveMemory(parentA, parentB, fusionPlan) {
  const retrievalWinner = fusionPlan.inheritance_plan.find((item) => item.locus === 'memory.retrieval_strategy')?.selected_parent;
  return retrievalWinner === 'parent_b'
    ? [parentB.memory[0], parentA.memory[0]].filter(Boolean)
    : [parentA.memory[0], parentB.memory[0]].filter(Boolean);
}

function deriveKnowledge(parentA, parentB, fusionPlan) {
  const promptWinner = fusionPlan.inheritance_plan.find((item) => item.locus === 'cognitive.system_prompt')?.selected_parent;
  const ordered = promptWinner === 'parent_b'
    ? [parentB.knowledge[0], parentB.knowledge[1], parentA.knowledge[0], parentA.knowledge[1]]
    : [parentA.knowledge[0], parentA.knowledge[1], parentB.knowledge[0], parentB.knowledge[1]];
  return unique(ordered).filter(Boolean);
}

function buildChildGenome(parentA, parentB, fusionPlan, childId, childName, childArchetype) {
  return {
    id: childId,
    name: childName,
    version: '0.1.0',
    source: 'fusion',
    chromosomes: fusionPlan.child_chromosomes,
    metadata: {
      parents: [parentA.id, parentB.id],
      archetype: childArchetype,
      created_at: '2026-04-25'
    }
  };
}

export function fuseGenomes(parentA, parentB, compatibility, arena = null) {
  const mutation = selectMutation(parentA, parentB);
  const geneFusion = fuseStrategyGenes(parentA, parentB, compatibility);
  const parentAGenome = buildAgentGenome(parentA);
  const parentBGenome = buildAgentGenome(parentB);
  const fusionPlan = buildFusionPlan(parentAGenome, parentBGenome, arena);
  const childName = createName(parentA, parentB, mutation);
  const childArchetype = 'Hybrid Evolution Agent';
  const childId = `${parentA.id}-${parentB.id}-child`;
  const childGenome = buildChildGenome(parentA, parentB, fusionPlan, childId, childName, childArchetype);

  const child = {
    id: childId,
    name: childName,
    archetype: childArchetype,
    rarity: compatibility.mutation >= 78 ? 'Rare Mutation' : 'Stable Hybrid',
    avatar: childName.slice(0, 2).toUpperCase(),
    soul: deriveSoul(parentA, parentB, mutation, fusionPlan),
    skills: deriveSkills(parentA, parentB, mutation, fusionPlan),
    memory: deriveMemory(parentA, parentB, fusionPlan),
    knowledge: deriveKnowledge(parentA, parentB, fusionPlan),
    genes: geneFusion.genes,
    inheritedGenes: geneFusion.inheritedGenes,
    geneReport: geneFusion.report,
    fitnessTests: geneFusion.fitnessTests,
    radar: deriveRadarFromGenome(childGenome, mutation),
    style: `${parentA.style.split(',')[0]}, ${parentB.style.split(',')[0]}, mutation-aware`,
    mutation,
    genome: childGenome,
    fusionPlan
  };

  return {
    child,
    inheritanceLog: fusionPlan.inheritance_plan.slice(0, 5).map((item) => `${item.locus} selected from ${item.selected_parent}.`),
    mutationLog: [mutation.notice],
    fusionLog: [
      arena ? `Arena pressure applied: ${arena.name}.` : '',
      `Formal chromosome fusion completed across ${Object.keys(childGenome.chromosomes).length} chromosomes.`,
      ...geneFusion.geneFusionLog
    ].filter(Boolean)
  };
}
