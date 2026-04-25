import fs from 'node:fs/promises';
import path from 'node:path';
import { createEmptyGene } from '../gene/agent_gene_schema.js';
import { normalizeGene } from '../gene/gene_normalizer.js';
import { extractSections } from './markdown_extractor.js';

function textAfterColon(text = '') {
  const index = text.indexOf(':');
  return index === -1 ? text.trim() : text.slice(index + 1).trim();
}

function inferRole(stepText) {
  const text = stepText.toLowerCase();
  if (/(search|locate|discover|find)/.test(text)) return 'discover';
  if (/(trace|analy|root cause)/.test(text)) return 'analyze';
  if (/(plan|option|proposal|strategy)/.test(text)) return 'plan';
  if (/(implement|change|execute)/.test(text)) return 'execute';
  if (/(test|verify|validate|check)/.test(text)) return 'validate';
  if (/(report|summarize|communicat)/.test(text)) return 'report';
  return 'analyze';
}

function asDecisionRules(items) {
  return items.map((line) => {
    const lowered = line.toLowerCase();
    if (lowered.startsWith('if ')) {
      const [conditionPart, actionPart] = line.split(',').map((x) => x.trim());
      return {
        condition: conditionPart || 'unspecified_condition',
        action: actionPart || 'apply_safe_fallback'
      };
    }
    return {
      condition: `when ${line}`,
      action: 'apply_policy'
    };
  });
}

export async function parseAgent(agentPath) {
  const markdown = await fs.readFile(agentPath, 'utf8');
  const sections = extractSections(markdown);
  const gene = createEmptyGene();
  const agentId = path.basename(path.dirname(agentPath)) || path.basename(agentPath, '.md');

  gene.agent_id = agentId;
  gene.source_agent_path = agentPath;
  gene.identity_gene.name = (sections.get('name')?.raw || agentId).trim();
  gene.identity_gene.description = sections.get('description')?.raw || '';
  gene.identity_gene.intent = textAfterColon(sections.get('intent')?.raw || 'general_assistance');

  gene.trigger_gene.use_when = sections.get('when to use')?.bullets || [];
  gene.trigger_gene.avoid_when = sections.get('avoid')?.bullets || [];
  gene.trigger_gene.required_inputs = sections.get('required inputs')?.bullets || [];

  const workflowLines = sections.get('workflow')?.ordered || sections.get('workflow')?.bullets || [];
  gene.workflow_gene = workflowLines.map((text, index) => ({
    id: `step_${index + 1}`,
    role: inferRole(text),
    text,
    depends_on: index === 0 ? [] : [`step_${index}`]
  }));

  gene.decision_gene = asDecisionRules(sections.get('decision rules')?.bullets || []);
  gene.tool_gene.allowed_tools = sections.get('tools allowed')?.bullets || [];
  gene.tool_gene.forbidden_tools = sections.get('tools forbidden')?.bullets || [];
  gene.tool_gene.tool_rules = sections.get('tool policy')?.bullets || [];
  gene.tool_gene.preferred_tools = (sections.get('tool preferences')?.bullets || []).slice(0, 6);

  gene.output_gene.required_sections = sections.get('output requirements')?.bullets || [];
  gene.output_gene.format = sections.get('output format')?.raw || gene.output_gene.format;

  gene.validation_gene.success_criteria = sections.get('validation')?.bullets || [];
  gene.validation_gene.checks = sections.get('checks')?.bullets || [];

  gene.safety_gene.constraints = sections.get('safety constraints')?.bullets || [];
  gene.safety_gene.anti_patterns = sections.get('anti patterns')?.bullets || [];

  gene.style_gene.verbosity = sections.get('style')?.raw.includes('verbose') ? 'medium' : 'low';
  return normalizeGene(gene);
}
