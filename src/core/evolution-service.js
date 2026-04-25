import { buildGenomeChromosomes, compareEvolution, evaluateGenome } from './evaluation-engine.js';
import { fuseGenomes } from './fusion-engine.js';

const CANDIDATE_PROFILES = [
  {
    id: 'stable',
    label: 'Stable Hybrid',
    suffix: '01',
    skill: 'arena-conditioned execution',
    radarBoost: { logic: 1, creativity: 1, autonomy: 1, risk: -1 },
    mutationType: 'Strengthening Mutation',
    mutationNote: 'The child keeps parent strengths stable while adapting to the selected arena.'
  },
  {
    id: 'bridging',
    label: 'Bridge Candidate',
    suffix: '02',
    skill: 'demo-oriented bridge reasoning',
    radarBoost: { logic: 2, creativity: 5, autonomy: 2, risk: 0 },
    mutationType: 'Bridging Mutation',
    mutationNote: 'A bridge emerged between execution planning and audience-facing product narrative.'
  },
  {
    id: 'risk_hardened',
    label: 'Risk-Hardened Candidate',
    suffix: '03',
    skill: 'arena-safe execution policy',
    radarBoost: { logic: 3, creativity: 1, autonomy: 1, risk: -8 },
    mutationType: 'Risk-reducing Mutation',
    mutationNote: 'The child preserves novelty while tightening review and stability boundaries.'
  }
];

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function arenaShortName(arena) {
  return (arena?.id || 'arena')
    .replace(/_arena$/, '')
    .split('_')
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join('');
}

function applyCandidateProfile(fusionResult, profile, arena) {
  const child = structuredClone(fusionResult.child);
  const arenaName = arenaShortName(arena);
  const childId = `${child.id}-${arena.id}-${profile.suffix}`;

  child.id = childId;
  child.name = `${child.name}-${arenaName}-${profile.suffix}`;
  child.archetype = `${profile.label} Agent`;
  child.rarity = profile.id === 'bridging' ? 'Selected Mutation Candidate' : child.rarity;
  child.skills = [...new Set([...child.skills, profile.skill])];
  child.radar = Object.entries(profile.radarBoost).reduce((radar, [key, boost]) => {
    radar[key] = clamp((radar[key] || 50) + boost);
    return radar;
  }, { ...child.radar });
  child.mutation = {
    ...child.mutation,
    type: profile.mutationType,
    notice: profile.mutationNote,
    candidate_profile: profile.id
  };

  if (child.genes?.[0]) {
    child.genes[0] = {
      ...child.genes[0],
      id: `${child.genes[0].id}_${profile.id}`,
      strategy: [
        ...child.genes[0].strategy,
        `Optimize for ${arena.name} using ${profile.label.toLowerCase()} behavior.`
      ],
      mutation: {
        type: profile.mutationType,
        description: profile.mutationNote
      }
    };
  }

  return {
    ...fusionResult,
    child,
    fusionLog: [
      ...fusionResult.fusionLog,
      `Candidate ${profile.suffix} generated: ${profile.label}.`
    ],
    mutationLog: [
      ...fusionResult.mutationLog,
      profile.mutationNote
    ]
  };
}

function summarizeCandidate(candidate, parentAResult, parentBResult) {
  const comparison = compareEvolution(parentAResult, parentBResult, candidate.evaluation);
  return {
    id: candidate.child.id,
    name: candidate.child.name,
    profile: candidate.profile.label,
    score: candidate.evaluation.overall_score,
    delta_vs_average: comparison.evolution_result.delta_vs_average,
    delta_vs_best_parent: comparison.evolution_result.delta_vs_best_parent,
    status: comparison.evolution_result.status
  };
}

function runtimeConfigFromChild(child, arena) {
  return {
    name: child.name,
    role: `${arena.name} optimized child agent`,
    system_prompt: `You are ${child.name}, a child agent bred by EvoMate for ${arena.name}. Combine inherited strengths, respect safety constraints, and optimize for the arena task: ${arena.task}`,
    tools: child.skills.filter((skill) => /tool|code|debug|retrieval|planning|orchestration/i.test(skill)),
    memory_policy: {
      inherit: 'compressed_fragments_only',
      retained_fragments: child.memory
    },
    safety_policy: {
      mode: 'review-first',
      forbidden_paths: child.genes?.[0]?.constraints?.forbidden_paths || ['.git', 'node_modules']
    },
    execution_policy: {
      prefer: 'arena-conditioned execution',
      fitness_tests: child.fitnessTests || []
    }
  };
}

export function buildExportPayload(evolutionRun) {
  const { arena, parentA, parentB, selectedCandidate, comparison, candidates } = evolutionRun;
  const child = selectedCandidate.child;

  return {
    schema_version: 'evomate-evolution-run-v0.1',
    run_id: evolutionRun.run_id,
    arena: {
      id: arena.id,
      name: arena.name,
      task: arena.task,
      required_loci: arena.requiredLoci
    },
    parents: [
      { id: parentA.id, name: parentA.name },
      { id: parentB.id, name: parentB.name }
    ],
    parent_baseline: comparison.baseline,
    selected_child: {
      id: child.id,
      name: child.name,
      archetype: child.archetype,
      genome: {
        chromosomes: buildGenomeChromosomes(child),
        soul: child.soul,
        skills: child.skills,
        memory: child.memory,
        knowledge: child.knowledge,
        genes: child.genes,
        radar: child.radar,
        mutation: child.mutation
      },
      evaluation: selectedCandidate.evaluation,
      evolution_result: comparison.evolution_result
    },
    candidates: candidates.map((candidate) => candidate.summary),
    runtime_config: runtimeConfigFromChild(child, arena),
    share_card: {
      title: 'I bred a better Agent with EvoMate',
      parents: `${parentA.name} x ${parentB.name}`,
      arena: arena.name,
      evolution_delta: comparison.evolution_result.delta_vs_average,
      best_new_trait: child.skills.at(-1)
    }
  };
}

export function runEvolution(parentA, parentB, compatibility, arena) {
  const parentAResult = evaluateGenome(parentA, arena);
  const parentBResult = evaluateGenome(parentB, arena);
  const baseFusion = fuseGenomes(parentA, parentB, compatibility, arena);
  const candidates = CANDIDATE_PROFILES.map((profile) => {
    const fusionResult = applyCandidateProfile(baseFusion, profile, arena);
    const evaluation = evaluateGenome(fusionResult.child, arena);
    return {
      profile,
      fusionResult,
      child: fusionResult.child,
      evaluation
    };
  });

  candidates.forEach((candidate) => {
    candidate.summary = summarizeCandidate(candidate, parentAResult, parentBResult);
  });

  const selectedCandidate = candidates
    .slice()
    .sort((a, b) => {
      if (b.evaluation.overall_score !== a.evaluation.overall_score) {
        return b.evaluation.overall_score - a.evaluation.overall_score;
      }
      return b.evaluation.metrics.safety - a.evaluation.metrics.safety;
    })[0];
  const comparison = compareEvolution(parentAResult, parentBResult, selectedCandidate.evaluation);
  const run = {
    run_id: `evo_run_${arena.id}_${parentA.id}_${parentB.id}`,
    arena,
    parentA,
    parentB,
    parentEvaluation: {
      parentAResult,
      parentBResult
    },
    candidates,
    selectedCandidate,
    comparison,
    fusionResult: {
      ...selectedCandidate.fusionResult,
      fusionLog: [
        ...selectedCandidate.fusionResult.fusionLog,
        `Selected best child from ${candidates.length} generated candidates.`
      ]
    }
  };

  return {
    ...run,
    exportPayload: buildExportPayload(run)
  };
}
