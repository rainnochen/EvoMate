import { normalizeGene } from '../gene/gene_normalizer.js';
import { roleAlignedWorkflowCrossover } from './workflow_crossover.js';
import { mergeDecisionRules } from './decision_crossover.js';
import { conservativeToolMerge, unionMerge } from './merge_policies.js';

function intentTokens(intent = '') {
  return intent.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function unifyIntent(intentA, intentB) {
  if (intentA === intentB) return intentA;
  const a = intentTokens(intentA);
  const b = intentTokens(intentB);
  const shared = a.filter((token) => b.includes(token));
  if (shared.length >= 2) return shared.join('_');
  if (a.includes('analysis') || b.includes('analysis')) return 'analysis_planning';
  if (a.includes('plan') || b.includes('plan')) return 'analysis_planning';
  return 'hybrid_assistance';
}

function chooseByStrength(parentA, parentB, selector) {
  const scoreA = selector(parentA);
  const scoreB = selector(parentB);
  return {
    winner: scoreA >= scoreB ? 'A' : 'B',
    scoreA,
    scoreB
  };
}

function decisionStrength(parent) {
  return parent.decision_gene.length * 1.5 + parent.validation_gene.checks.length;
}

function safetyStrength(parent) {
  return parent.safety_gene.constraints.length * 2 + parent.safety_gene.anti_patterns.length;
}

function outputStrength(parent) {
  return parent.output_gene.required_sections.length * 1.5 + (parent.output_gene.format ? 1 : 0);
}

export function crossover(parentA, parentB, profile = 'balanced') {
  const child = structuredClone(parentA);
  const workflow = roleAlignedWorkflowCrossover(parentA.workflow_gene, parentB.workflow_gene);
  const decisionOwner = chooseByStrength(parentA, parentB, decisionStrength);
  const safetyOwner = chooseByStrength(parentA, parentB, safetyStrength);
  const outputOwner = chooseByStrength(parentA, parentB, outputStrength);
  const primaryDecisionRules = decisionOwner.winner === 'A' ? parentA.decision_gene : parentB.decision_gene;
  const secondaryDecisionRules = decisionOwner.winner === 'A' ? parentB.decision_gene : parentA.decision_gene;
  const decisions = mergeDecisionRules(primaryDecisionRules, secondaryDecisionRules);

  child.agent_id = `child_${parentA.agent_id}_${parentB.agent_id}_${Date.now()}`;
  child.identity_gene = {
    name: `${parentA.identity_gene.name} Hybrid`,
    description: `Child from ${parentA.agent_id} + ${parentB.agent_id}`,
    intent: unifyIntent(parentA.identity_gene.intent, parentB.identity_gene.intent)
  };

  child.trigger_gene = {
    use_when: unionMerge(parentA.trigger_gene.use_when, parentB.trigger_gene.use_when),
    avoid_when: unionMerge(parentA.trigger_gene.avoid_when, parentB.trigger_gene.avoid_when),
    required_inputs: unionMerge(parentA.trigger_gene.required_inputs, parentB.trigger_gene.required_inputs)
  };

  child.workflow_gene = workflow.steps;
  child.decision_gene = decisions.rules;
  child.tool_gene = conservativeToolMerge(parentA.tool_gene, parentB.tool_gene);
  child.validation_gene = {
    success_criteria: unionMerge(parentA.validation_gene.success_criteria, parentB.validation_gene.success_criteria),
    checks: unionMerge(parentA.validation_gene.checks, parentB.validation_gene.checks)
  };
  const primarySafety = safetyOwner.winner === 'A' ? parentA.safety_gene : parentB.safety_gene;
  const secondarySafety = safetyOwner.winner === 'A' ? parentB.safety_gene : parentA.safety_gene;
  child.safety_gene = {
    constraints: unionMerge(primarySafety.constraints, secondarySafety.constraints),
    anti_patterns: unionMerge(primarySafety.anti_patterns, secondarySafety.anti_patterns)
  };

  if (profile === 'A_first') {
    child.output_gene = parentA.output_gene;
  } else if (profile === 'B_first') {
    child.output_gene = parentB.output_gene;
  } else {
    child.output_gene = outputOwner.winner === 'A' ? parentA.output_gene : parentB.output_gene;
  }
  child.style_gene = parentA.style_gene;

  return {
    childDraftGene: normalizeGene(child),
    crossoverRecord: {
      profile,
      workflow_mapping: workflow.mapping,
      workflow_quality: workflow.quality,
      decision_warnings: decisions.warnings,
      decision_owner: decisionOwner,
      safety_owner: safetyOwner,
      output_owner: outputOwner
    }
  };
}
