function overlapScore(listA = [], listB = []) {
  const a = new Set(listA.map((x) => x.toLowerCase()));
  const b = new Set(listB.map((x) => x.toLowerCase()));
  if (!a.size && !b.size) return 1;
  const common = [...a].filter((x) => b.has(x)).length;
  const total = new Set([...a, ...b]).size;
  return total ? common / total : 0;
}

function workflowRoleScore(geneA, geneB) {
  return overlapScore(
    geneA.workflow_gene.map((step) => step.role),
    geneB.workflow_gene.map((step) => step.role)
  );
}

function toolConflictWarnings(geneA, geneB) {
  const warnings = [];
  const forbiddenA = new Set(geneA.tool_gene.forbidden_tools.map((x) => x.toLowerCase()));
  for (const tool of geneB.tool_gene.allowed_tools) {
    if (forbiddenA.has(tool.toLowerCase())) {
      warnings.push(`B allows "${tool}" but A forbids it`);
    }
  }
  return warnings;
}

export function checkCompatibility(geneA, geneB) {
  const intentScore = overlapScore([geneA.identity_gene.intent], [geneB.identity_gene.intent]);
  const workflowScore = workflowRoleScore(geneA, geneB);
  const triggerScore = overlapScore(geneA.trigger_gene.use_when, geneB.trigger_gene.use_when);
  const toolWarnings = toolConflictWarnings(geneA, geneB);
  const score = Number((0.35 * workflowScore + 0.35 * triggerScore + 0.3 * intentScore).toFixed(2));

  return {
    compatible: score >= 0.35,
    score,
    warnings: [
      ...(score < 0.45 ? ['Low overlap between parent intents/workflows'] : []),
      ...toolWarnings
    ]
  };
}
