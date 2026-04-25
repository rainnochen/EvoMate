export const GENE_VERSION = '1.0';

export const WORKFLOW_ROLES = [
  'discover',
  'analyze',
  'plan',
  'execute',
  'validate',
  'report',
  'recover'
];

export function createEmptyGene() {
  return {
    gene_version: GENE_VERSION,
    agent_id: 'unknown_agent',
    source_agent_path: '',
    identity_gene: {
      name: 'Unnamed Agent',
      description: '',
      intent: 'general_assistance'
    },
    trigger_gene: {
      use_when: [],
      avoid_when: [],
      required_inputs: []
    },
    workflow_gene: [],
    decision_gene: [],
    tool_gene: {
      allowed_tools: [],
      preferred_tools: [],
      forbidden_tools: [],
      tool_rules: []
    },
    output_gene: {
      format: 'structured_markdown',
      required_sections: [],
      tone: 'concise',
      length_preference: 'short'
    },
    validation_gene: {
      success_criteria: [],
      checks: []
    },
    safety_gene: {
      constraints: [],
      anti_patterns: []
    },
    style_gene: {
      verbosity: 'low',
      format_style: 'structured_markdown',
      interaction_style: 'direct'
    }
  };
}
