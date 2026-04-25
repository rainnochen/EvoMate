const CORE_ROLE_ORDER = ['discover', 'analyze', 'plan', 'validate', 'report'];

function firstByRole(workflow, role) {
  return workflow.find((step) => step.role === role);
}

function stepQuality(step, role) {
  if (!step?.text) return 0;
  const text = step.text.toLowerCase();
  let score = 1;
  score += Math.min(2, Math.floor(step.text.length / 45));
  if (/(risk|tradeoff|verify|validation|root cause|option|report)/.test(text)) score += 1;
  if (role === 'plan' && /(option|tradeoff|strategy)/.test(text)) score += 1;
  if (role === 'validate' && /(test|verify|check|validation)/.test(text)) score += 1;
  if (role === 'discover' && /(search|find|locate|discover)/.test(text)) score += 1;
  return score;
}

function templateStep(role) {
  const templates = {
    discover: 'Discover relevant files, symbols, and execution entry points',
    analyze: 'Analyze the execution path and identify root causes and constraints',
    plan: 'Propose 2-3 implementation options with tradeoffs and recommendation',
    validate: 'Define verification checks and rollback safeguards before execution',
    report: 'Report final plan with risks, assumptions, and next steps'
  };
  return templates[role];
}

export function roleAlignedWorkflowCrossover(workflowA, workflowB) {
  const steps = [];
  const mapping = {};
  const quality = {};

  for (const role of CORE_ROLE_ORDER) {
    const fromA = firstByRole(workflowA, role);
    const fromB = firstByRole(workflowB, role);
    const scoreA = stepQuality(fromA, role);
    const scoreB = stepQuality(fromB, role);
    const chosen = scoreA >= scoreB ? fromA : fromB;

    if (!chosen) {
      steps.push({
        id: `step_${steps.length + 1}`,
        role,
        text: templateStep(role),
        depends_on: steps.length ? [`step_${steps.length}`] : []
      });
      mapping[role] = 'template';
      quality[role] = { A: scoreA, B: scoreB };
      continue;
    }

    steps.push({
      ...chosen,
      id: `step_${steps.length + 1}`,
      depends_on: steps.length ? [`step_${steps.length}`] : []
    });
    mapping[role] = scoreA >= scoreB ? 'A' : 'B';
    quality[role] = { A: scoreA, B: scoreB };
  }

  return { steps, mapping, quality };
}
