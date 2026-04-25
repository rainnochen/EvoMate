export const CHROMOSOME_BLUEPRINT = [
  {
    id: 'cognitive',
    label: 'Cognitive',
    loci: ['system_prompt', 'reasoning_strategy', 'planning_depth', 'reflection_policy']
  },
  {
    id: 'tool',
    label: 'Tool',
    loci: ['tool_registry', 'tool_routing_policy', 'tool_risk_policy']
  },
  {
    id: 'memory',
    label: 'Memory',
    loci: ['memory_schema', 'retrieval_strategy', 'memory_compression']
  },
  {
    id: 'personality',
    label: 'Personality',
    loci: ['creativity', 'precision', 'risk_tolerance', 'persistence', 'curiosity']
  },
  {
    id: 'safety',
    label: 'Safety',
    loci: ['guardrails', 'autonomy_boundary', 'review_policy', 'forbidden_behaviors']
  }
];

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function average(values) {
  const useful = values.filter((value) => Number.isFinite(value));
  if (!useful.length) return 0;
  return Math.round(useful.reduce((sum, value) => sum + value, 0) / useful.length);
}

function hasAny(agent, terms) {
  const haystack = [
    agent.archetype,
    agent.style,
    ...(agent.skills || []),
    ...(agent.knowledge || []),
    ...(agent.memory || []),
    ...(agent.genes || []).flatMap((gene) => [
      gene.id,
      gene.summary,
      gene.category,
      ...(gene.signals_match || []),
      ...(gene.strategy || []),
      ...(gene.avoid || [])
    ])
  ].join(' ').toLowerCase();

  return terms.some((term) => haystack.includes(term.toLowerCase()));
}

function topGeneConfidence(agent) {
  const confidences = (agent.genes || [])
    .map((gene) => gene.evidence?.confidence)
    .filter(Number.isFinite);
  if (!confidences.length) return 62;
  return Math.round(Math.max(...confidences) * 100);
}

function locusTypeFromPath(locusPath) {
  if (locusPath.startsWith('cognitive.')) return 'strategy';
  if (locusPath.startsWith('tool.')) return 'tool';
  if (locusPath.startsWith('memory.')) return 'memory';
  if (locusPath.startsWith('personality.')) return 'trait';
  if (locusPath.startsWith('safety.')) return 'policy';
  return 'attribute';
}

function contentFromPath(agent, locusPath) {
  const defaults = {
    'cognitive.system_prompt': agent.style,
    'cognitive.reasoning_strategy': (agent.genes || [])[0]?.summary || agent.archetype,
    'cognitive.planning_depth': (agent.skills || []).slice(0, 2).join(', '),
    'cognitive.reflection_policy': (agent.genes || [])[0]?.validation?.join(' / ') || 'review-first',
    'tool.tool_registry': (agent.skills || []).join(', '),
    'tool.tool_routing_policy': agent.style,
    'tool.tool_risk_policy': (agent.genes || [])[0]?.avoid?.join(', ') || 'guardrails first',
    'memory.memory_schema': (agent.memory || []).join(' | '),
    'memory.retrieval_strategy': (agent.knowledge || []).join(', '),
    'memory.memory_compression': (agent.genes || [])[0]?.summary || 'compressed memory fragments',
    'personality.creativity': String(agent.radar?.creativity || 50),
    'personality.precision': String(agent.radar?.logic || 50),
    'personality.risk_tolerance': String(agent.radar?.risk || 50),
    'personality.persistence': String(agent.radar?.autonomy || 50),
    'personality.curiosity': String(Math.round(((agent.radar?.creativity || 50) + (agent.radar?.autonomy || 50)) / 2)),
    'safety.guardrails': (agent.genes || [])[0]?.avoid?.join(', ') || 'basic guardrails',
    'safety.autonomy_boundary': `${100 - (agent.radar?.risk || 50)} risk ceiling`,
    'safety.review_policy': (agent.genes || [])[0]?.validation?.join(' / ') || 'review-first',
    'safety.forbidden_behaviors': (agent.genes || [])[0]?.constraints?.forbidden_paths?.join(', ') || '.git, node_modules'
  };

  return defaults[locusPath] || '';
}

export function scoreLocus(agent, locusPath) {
  const [chromosomeId, locusId] = locusPath.split('.');
  const genomeLocus = agent.genome?.chromosomes?.[chromosomeId]?.loci?.find((locus) => locus.locus_id === locusId);
  if (genomeLocus?.strength) {
    return genomeLocus.strength;
  }

  const radar = agent.radar || {};
  const geneConfidence = topGeneConfidence(agent);
  const riskInverse = 100 - (radar.risk || 50);

  const rules = {
    'cognitive.system_prompt': () => average([radar.logic, geneConfidence, hasAny(agent, ['systems', 'story', 'strategy']) ? 82 : 62]),
    'cognitive.reasoning_strategy': () => average([radar.logic, geneConfidence, hasAny(agent, ['planning', 'research', 'decompose', 'verify']) ? 88 : 60]),
    'cognitive.planning_depth': () => average([radar.logic, hasAny(agent, ['planning', 'debugging', 'prototype']) ? 86 : 58]),
    'cognitive.reflection_policy': () => average([riskInverse, radar.logic, hasAny(agent, ['review', 'evidence', 'validation']) ? 88 : 58]),
    'tool.tool_registry': () => average([hasAny(agent, ['tool', 'code', 'runner', 'retrieval', 'debugging']) ? 86 : 58, radar.autonomy]),
    'tool.tool_routing_policy': () => average([radar.logic, radar.autonomy, hasAny(agent, ['orchestration', 'routing', 'debugging']) ? 84 : 58]),
    'tool.tool_risk_policy': () => average([riskInverse, hasAny(agent, ['risk', 'safety', 'review', 'guardrail']) ? 90 : 58]),
    'memory.memory_schema': () => average([(agent.memory || []).length * 28 + 32, geneConfidence]),
    'memory.retrieval_strategy': () => average([hasAny(agent, ['retrieval', 'research', 'memory', 'source']) ? 88 : 56, radar.logic]),
    'memory.memory_compression': () => average([geneConfidence, hasAny(agent, ['compress', 'capsule', 'lesson']) ? 88 : 62]),
    'personality.creativity': () => radar.creativity || 50,
    'personality.precision': () => average([radar.logic, riskInverse, hasAny(agent, ['precise', 'structured', 'evidence']) ? 88 : 58]),
    'personality.risk_tolerance': () => radar.risk || 50,
    'personality.persistence': () => average([radar.autonomy, hasAny(agent, ['debugging', 'builder', 'persistence', 'repair']) ? 84 : 58]),
    'personality.curiosity': () => average([radar.creativity, radar.autonomy, hasAny(agent, ['curious', 'research', 'exploration']) ? 88 : 58]),
    'safety.guardrails': () => average([riskInverse, hasAny(agent, ['safety', 'policy', 'guardrail', 'review']) ? 92 : 62]),
    'safety.autonomy_boundary': () => average([riskInverse, 100 - Math.max(0, (radar.autonomy || 50) - 70)]),
    'safety.review_policy': () => average([riskInverse, hasAny(agent, ['review', 'validation', 'evidence']) ? 90 : 60]),
    'safety.forbidden_behaviors': () => average([riskInverse, Math.min(96, 58 + ((agent.genes || [])[0]?.avoid || []).length * 8)])
  };

  return clamp(Math.round((rules[locusPath] || (() => 60))()));
}

export function buildGenomeChromosomes(agent) {
  if (agent.genome?.chromosomes) {
    return Object.values(agent.genome.chromosomes);
  }

  return CHROMOSOME_BLUEPRINT.map((chromosome) => ({
    chromosome_id: chromosome.id,
    id: chromosome.id,
    label: chromosome.label,
    loci: chromosome.loci.map((locus) => {
      const locusPath = `${chromosome.id}.${locus}`;
      const strength = scoreLocus(agent, locusPath);
      return {
        locus_id: locus,
        path: locusPath,
        name: locus.replaceAll('_', ' '),
        type: locusTypeFromPath(locusPath),
        strength,
        heritability: Number((0.65 + strength / 300).toFixed(2)),
        dominance: chromosome.id === 'safety' ? 0.95 : Number((0.5 + strength / 200).toFixed(2)),
        mutation_rate: chromosome.id === 'safety' ? 0.04 : 0.12,
        dependencies: chromosome.id === 'tool' ? ['safety.review_policy'] : [],
        gene: {
          gene_id: (agent.genes || [])[0]?.id || `gene_${agent.id}_${locus}`,
          content: contentFromPath(agent, locusPath),
          strength: Number((strength / 100).toFixed(2))
        },
        status: chromosome.id === 'safety' ? 'locked' : 'active'
      };
    })
  }));
}

export function buildAgentGenome(agent) {
  if (agent.genome) return agent.genome;

  const chromosomesArray = buildGenomeChromosomes(agent);
  const chromosomes = chromosomesArray.reduce((acc, chromosome) => {
    acc[chromosome.chromosome_id] = chromosome;
    return acc;
  }, {});

  return {
    id: agent.id,
    name: agent.name,
    version: '0.1.0',
    source: 'mock',
    chromosomes,
    genes: agent.genes || [],
    metadata: {
      created_at: '2026-04-25',
      archetype: agent.archetype
    }
  };
}
