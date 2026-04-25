function hasRole(workflow, role) {
  return workflow.some((step) => step.role === role);
}

const CORE_ROLE_ORDER = ['discover', 'analyze', 'plan', 'validate', 'report'];

function roleTemplate(role) {
  const templates = {
    discover: 'Search and map relevant files and symbols before deep analysis',
    analyze: 'Trace key execution paths and identify root causes and constraints',
    plan: 'Generate multiple fix options and select one with clear tradeoffs',
    validate: 'Define concrete checks, tests, and rollback safeguards',
    report: 'Deliver structured summary with risks, assumptions, and next actions'
  };
  return templates[role];
}

export function bridgeStepInsert(gene) {
  const mutations = [];
  const workflow = [...gene.workflow_gene];
  const hasAnalyze = hasRole(workflow, 'analyze');
  const hasPlan = hasRole(workflow, 'plan');

  if (hasAnalyze && !hasPlan) {
    workflow.push({
      id: `step_${workflow.length + 1}`,
      role: 'plan',
      text: 'Create 2-3 options from analysis results with tradeoffs',
      depends_on: workflow.length ? [`step_${workflow.length}`] : []
    });
    mutations.push('bridge_step_insert: added missing plan step');
  }
  return { workflow, mutations };
}

export function enforceCoreRoles(gene) {
  const workflow = [...gene.workflow_gene];
  const mutations = [];

  for (const role of CORE_ROLE_ORDER) {
    if (hasRole(workflow, role)) continue;
    workflow.push({
      id: `step_${workflow.length + 1}`,
      role,
      text: roleTemplate(role),
      depends_on: workflow.length ? [`step_${workflow.length}`] : []
    });
    mutations.push(`core_role_enforce: added ${role} step`);
  }

  return { workflow, mutations };
}

export function reorderWorkflowByCoreRoles(gene) {
  const priority = new Map(CORE_ROLE_ORDER.map((role, index) => [role, index]));
  const sorted = [...gene.workflow_gene].sort((a, b) => {
    const pa = priority.has(a.role) ? priority.get(a.role) : 99;
    const pb = priority.has(b.role) ? priority.get(b.role) : 99;
    return pa - pb;
  });
  const changed = sorted.some((step, index) => step.id !== gene.workflow_gene[index]?.id);
  return {
    workflow: sorted,
    mutations: changed ? ['workflow_reorder: normalized workflow to discover->analyze->plan->validate->report'] : []
  };
}

export function strengthenDecisionAndOutput(gene) {
  const mutations = [];
  const decisionGene = [...gene.decision_gene];

  const mustHaveRules = [
    { condition: 'if repo is large', action: 'prefer_search_before_full_read' },
    { condition: 'if git worktree is dirty', action: 'avoid_destructive_commands' }
  ];

  for (const rule of mustHaveRules) {
    if (!decisionGene.some((item) => item.condition.toLowerCase() === rule.condition)) {
      decisionGene.push(rule);
      mutations.push(`decision_strengthen: added "${rule.condition}"`);
    }
  }

  const requiredSections = new Set(gene.output_gene.required_sections);
  for (const section of ['summary', 'options', 'risks', 'validation']) {
    if (!requiredSections.has(section)) {
      requiredSections.add(section);
      mutations.push(`output_harden: added output section "${section}"`);
    }
  }

  const constraints = new Set(gene.safety_gene.constraints);
  for (const constraint of ['do not run destructive commands', 'state assumptions explicitly']) {
    if (!constraints.has(constraint)) {
      constraints.add(constraint);
      mutations.push(`safety_harden: added constraint "${constraint}"`);
    }
  }

  return {
    decision_gene: decisionGene,
    output_gene: {
      ...gene.output_gene,
      required_sections: [...requiredSections]
    },
    safety_gene: {
      ...gene.safety_gene,
      constraints: [...constraints]
    },
    mutations
  };
}

export function redundancyPrune(gene) {
  const seen = new Set();
  const cleaned = [];
  const mutations = [];

  for (const step of gene.workflow_gene) {
    const key = `${step.role}:${step.text.toLowerCase()}`;
    if (seen.has(key)) {
      mutations.push(`redundancy_prune: removed duplicate ${step.role} step`);
      continue;
    }
    seen.add(key);
    cleaned.push(step);
  }
  return { workflow: cleaned, mutations };
}

export function validationAdd(gene) {
  const updates = [...gene.validation_gene.success_criteria];
  const marker = 'must include verification steps';
  if (!updates.some((line) => line.toLowerCase() === marker)) {
    updates.push(marker);
    return {
      success_criteria: updates,
      mutations: ['validation_add: injected verification success criteria']
    };
  }
  return { success_criteria: updates, mutations: [] };
}
