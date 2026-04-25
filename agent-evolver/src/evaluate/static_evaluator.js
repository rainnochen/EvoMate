function hasCoverage(gene, role) {
  return gene.workflow_gene.some((step) => step.role === role);
}

export function runStaticEval(childGene, parentA, parentB) {
  const requiredSections = [
    childGene.identity_gene?.intent,
    childGene.trigger_gene?.use_when?.length,
    childGene.workflow_gene?.length,
    childGene.validation_gene?.success_criteria?.length
  ];
  const schemaScore = requiredSections.filter(Boolean).length / requiredSections.length;

  const consistencySignals = [
    childGene.workflow_gene.length > 0,
    childGene.tool_gene.forbidden_tools.length > 0,
    childGene.validation_gene.success_criteria.length > 0,
    hasCoverage(childGene, 'discover'),
    hasCoverage(childGene, 'validate')
  ];
  const consistencyScore = consistencySignals.filter(Boolean).length / consistencySignals.length;

  const safetyScore = childGene.safety_gene.constraints.length ? 1 : 0.4;
  const inheritedA = childGene.trigger_gene.use_when.filter((x) => parentA.trigger_gene.use_when.includes(x)).length;
  const inheritedB = childGene.trigger_gene.use_when.filter((x) => parentB.trigger_gene.use_when.includes(x)).length;
  const inheritanceBalanceScore = Math.min(inheritedA, inheritedB) / Math.max(inheritedA + inheritedB, 1);
  const noveltyScore = childGene.workflow_gene.some((step) => step.text.includes('tradeoffs')) ? 1 : 0.6;

  return {
    schema_score: Number(schemaScore.toFixed(2)),
    consistency_score: Number(consistencyScore.toFixed(2)),
    safety_score: Number(safetyScore.toFixed(2)),
    inheritance_balance_score: Number(inheritanceBalanceScore.toFixed(2)),
    novelty_score: Number(noveltyScore.toFixed(2))
  };
}
