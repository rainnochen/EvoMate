import { normalizeGene } from '../gene/gene_normalizer.js';
import {
  bridgeStepInsert,
  enforceCoreRoles,
  reorderWorkflowByCoreRoles,
  redundancyPrune,
  strengthenDecisionAndOutput,
  validationAdd
} from './operators.js';

export function repairChildGene(childDraft) {
  const mutationLog = [];
  const gene = structuredClone(childDraft);

  const coreRoleResult = enforceCoreRoles(gene);
  gene.workflow_gene = coreRoleResult.workflow;
  mutationLog.push(...coreRoleResult.mutations);

  const bridgeResult = bridgeStepInsert(gene);
  gene.workflow_gene = bridgeResult.workflow;
  mutationLog.push(...bridgeResult.mutations);

  const reorderResult = reorderWorkflowByCoreRoles(gene);
  gene.workflow_gene = reorderResult.workflow;
  mutationLog.push(...reorderResult.mutations);

  const pruneResult = redundancyPrune(gene);
  gene.workflow_gene = pruneResult.workflow.map((step, index) => ({
    ...step,
    id: `step_${index + 1}`,
    depends_on: index === 0 ? [] : [`step_${index}`]
  }));
  mutationLog.push(...pruneResult.mutations);

  const strengthenResult = strengthenDecisionAndOutput(gene);
  gene.decision_gene = strengthenResult.decision_gene;
  gene.output_gene = strengthenResult.output_gene;
  gene.safety_gene = strengthenResult.safety_gene;
  mutationLog.push(...strengthenResult.mutations);

  const validationResult = validationAdd(gene);
  gene.validation_gene.success_criteria = validationResult.success_criteria;
  mutationLog.push(...validationResult.mutations);

  if (mutationLog.length > 0) {
    gene.identity_gene.description = `${gene.identity_gene.description} Mutated and hardened for child-level reliability.`.trim();
  }

  return {
    childGene: normalizeGene(gene),
    mutations: mutationLog
  };
}
