import { createEmptyGene, WORKFLOW_ROLES } from './agent_gene_schema.js';

function unique(items = []) {
  return [...new Set(items.filter(Boolean).map((item) => item.trim()).filter(Boolean))];
}

function normalizeWorkflow(workflow = []) {
  const roleSet = new Set(WORKFLOW_ROLES);
  return workflow
    .map((step, index) => {
      const safeRole = roleSet.has(step.role) ? step.role : 'analyze';
      const id = step.id || `step_${index + 1}`;
      return {
        id,
        role: safeRole,
        text: (step.text || '').trim(),
        depends_on: Array.isArray(step.depends_on) ? unique(step.depends_on) : []
      };
    })
    .filter((step) => step.text);
}

export function normalizeGene(inputGene) {
  const base = createEmptyGene();
  const gene = { ...base, ...inputGene };

  gene.trigger_gene = {
    use_when: unique(gene.trigger_gene?.use_when),
    avoid_when: unique(gene.trigger_gene?.avoid_when),
    required_inputs: unique(gene.trigger_gene?.required_inputs)
  };

  gene.workflow_gene = normalizeWorkflow(gene.workflow_gene);
  gene.decision_gene = (gene.decision_gene || [])
    .filter((rule) => rule?.condition && rule?.action)
    .map((rule) => ({
      condition: rule.condition.trim(),
      action: rule.action.trim()
    }));

  gene.tool_gene = {
    allowed_tools: unique(gene.tool_gene?.allowed_tools),
    preferred_tools: unique(gene.tool_gene?.preferred_tools),
    forbidden_tools: unique(gene.tool_gene?.forbidden_tools),
    tool_rules: unique(gene.tool_gene?.tool_rules)
  };

  gene.output_gene = {
    format: gene.output_gene?.format || base.output_gene.format,
    required_sections: unique(gene.output_gene?.required_sections),
    tone: gene.output_gene?.tone || base.output_gene.tone,
    length_preference: gene.output_gene?.length_preference || base.output_gene.length_preference
  };

  gene.validation_gene = {
    success_criteria: unique(gene.validation_gene?.success_criteria),
    checks: unique(gene.validation_gene?.checks)
  };

  gene.safety_gene = {
    constraints: unique(gene.safety_gene?.constraints),
    anti_patterns: unique(gene.safety_gene?.anti_patterns)
  };

  gene.identity_gene = {
    name: gene.identity_gene?.name || base.identity_gene.name,
    description: gene.identity_gene?.description || base.identity_gene.description,
    intent: gene.identity_gene?.intent || base.identity_gene.intent
  };

  gene.style_gene = {
    verbosity: gene.style_gene?.verbosity || base.style_gene.verbosity,
    format_style: gene.style_gene?.format_style || base.style_gene.format_style,
    interaction_style: gene.style_gene?.interaction_style || base.style_gene.interaction_style
  };

  return gene;
}
