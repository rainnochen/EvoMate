export function buildLineageRecord({
  childId,
  parentAId,
  parentBId,
  compatibility,
  crossoverRecord,
  mutations,
  evaluation
}) {
  return {
    child_id: childId,
    parents: [parentAId, parentBId],
    compatibility_score: compatibility.score,
    compatible: compatibility.compatible,
    compatibility_warnings: compatibility.warnings,
    crossover_profile: crossoverRecord.profile,
    workflow_mapping: crossoverRecord.workflow_mapping,
    decision_warnings: crossoverRecord.decision_warnings,
    mutations,
    evaluation_summary: evaluation,
    created_at: new Date().toISOString()
  };
}
