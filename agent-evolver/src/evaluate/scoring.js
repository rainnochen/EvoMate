export function computeFitness(staticEval, taskEval) {
  const staticGatePass = staticEval.schema_score >= 0.75 && staticEval.consistency_score >= 0.6;
  const taskScore = taskEval.task_score ?? 0.55;

  const fitness = staticGatePass
    ? 0.25 * staticEval.consistency_score
      + 0.2 * staticEval.safety_score
      + 0.15 * staticEval.inheritance_balance_score
      + 0.1 * staticEval.novelty_score
      + 0.3 * taskScore
    : 0;

  return {
    static_gate_pass: staticGatePass,
    fitness: Number(fitness.toFixed(3))
  };
}
