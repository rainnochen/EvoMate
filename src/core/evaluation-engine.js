import { buildGenomeChromosomes, scoreLocus } from './genome-engine.js';

const FITNESS_WEIGHTS = {
  taskSuccess: 0.4,
  safety: 0.25,
  novelty: 0.2,
  stability: 0.15
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function average(values) {
  const useful = values.filter((value) => Number.isFinite(value));
  if (!useful.length) return 0;
  return Math.round(useful.reduce((sum, value) => sum + value, 0) / useful.length);
}

function scoreRequiredLoci(agent, requiredLoci) {
  return average(requiredLoci.map((locus) => scoreLocus(agent, locus)));
}

function scoreSafety(agent) {
  return average([
    scoreLocus(agent, 'safety.guardrails'),
    scoreLocus(agent, 'safety.review_policy'),
    scoreLocus(agent, 'tool.tool_risk_policy')
  ]);
}

function topGeneConfidence(agent) {
  const confidences = (agent.genes || [])
    .map((gene) => gene.evidence?.confidence)
    .filter(Number.isFinite);
  if (!confidences.length) return 62;
  return Math.round(Math.max(...confidences) * 100);
}

function scoreNovelty(agent) {
  const mutationBonus = agent.mutation ? 9 : 0;
  const hybridBonus = (agent.skills || []).some((skill) => /bridge|narrative|market-backed|arena-conditioned/i.test(skill)) ? 7 : 0;
  return clamp(average([agent.radar?.creativity || 55, topGeneConfidence(agent)]) + mutationBonus + hybridBonus);
}

function scoreStability(agent, arena) {
  const dependencyCoverage = arena.requiredLoci
    .filter((locus) => scoreLocus(agent, locus) >= 62)
    .length / arena.requiredLoci.length;
  const mutationPenalty = agent.mutation?.id === 'spark-shift' ? 4 : 0;
  return clamp(Math.round(dependencyCoverage * 100) - mutationPenalty);
}

function statusFromDelta(delta) {
  if (delta <= -5) return 'Regression';
  if (delta < 3) return 'Neutral';
  if (delta < 10) return 'Improved';
  return 'Breakthrough';
}

export { buildGenomeChromosomes };

export function evaluateGenome(agent, arena) {
  const taskSuccess = scoreRequiredLoci(agent, arena.requiredLoci);
  const safety = scoreSafety(agent);
  const novelty = scoreNovelty(agent);
  const stability = scoreStability(agent, arena);
  const overall = Math.round(
    FITNESS_WEIGHTS.taskSuccess * taskSuccess +
    FITNESS_WEIGHTS.safety * safety +
    FITNESS_WEIGHTS.novelty * novelty +
    FITNESS_WEIGHTS.stability * stability
  );

  return {
    agent_id: agent.id,
    agent_name: agent.name,
    arena_id: arena.id,
    overall_score: overall,
    metrics: {
      taskSuccess,
      safety,
      novelty,
      stability
    },
    highlighted_loci: arena.requiredLoci.map((locus) => ({
      locus,
      score: scoreLocus(agent, locus)
    }))
  };
}

export function compareEvolution(parentAResult, parentBResult, childResult) {
  const averageParentScore = Math.round((parentAResult.overall_score + parentBResult.overall_score) / 2);
  const bestParentScore = Math.max(parentAResult.overall_score, parentBResult.overall_score);
  const deltaVsAverage = childResult.overall_score - averageParentScore;
  const deltaVsBestParent = childResult.overall_score - bestParentScore;

  return {
    baseline: {
      average_parent_score: averageParentScore,
      best_parent_score: bestParentScore
    },
    evolution_result: {
      delta_vs_average: deltaVsAverage,
      delta_vs_best_parent: deltaVsBestParent,
      status: statusFromDelta(deltaVsAverage),
      reason: deltaVsAverage >= 3
        ? 'Child genome expresses a positive fitness delta under the same arena pressure.'
        : 'Child genome did not clearly outperform the parent baseline in this arena.'
    }
  };
}
