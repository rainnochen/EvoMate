function renderList(items = []) {
  return items.map((item) => `- ${item}`).join('\n');
}

export function renderAgent(gene) {
  const workflow = gene.workflow_gene
    .map((step, index) => `${index + 1}. ${step.text}`)
    .join('\n');

  return `# ${gene.identity_gene.name}

## Description
${gene.identity_gene.description}

## Intent
${gene.identity_gene.intent}

## When to use
${renderList(gene.trigger_gene.use_when)}

## Avoid
${renderList(gene.trigger_gene.avoid_when)}

## Required inputs
${renderList(gene.trigger_gene.required_inputs)}

## Workflow
${workflow}

## Decision rules
${renderList(gene.decision_gene.map((rule) => `${rule.condition}, ${rule.action}`))}

## Tools allowed
${renderList(gene.tool_gene.allowed_tools)}

## Tools forbidden
${renderList(gene.tool_gene.forbidden_tools)}

## Tool policy
${renderList(gene.tool_gene.tool_rules)}

## Output format
${gene.output_gene.format}

## Output requirements
${renderList(gene.output_gene.required_sections)}

## Validation
${renderList(gene.validation_gene.success_criteria)}

## Checks
${renderList(gene.validation_gene.checks)}

## Safety constraints
${renderList(gene.safety_gene.constraints)}

## Anti patterns
${renderList(gene.safety_gene.anti_patterns)}

## Style
verbosity: ${gene.style_gene.verbosity}; interaction: ${gene.style_gene.interaction_style}
`;
}
