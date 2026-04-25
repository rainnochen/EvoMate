const DEFAULT_VALIDATION = ['npm run check'];
const BLOCKED_VALIDATION = [/^node\s+(-e|--eval|-p)\b/, /\$\(/, /rm\s+-rf/, />\s*\/dev\/null/];
const VALIDATION_PREFIXES = ['node ', 'npm ', 'npx '];

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function isAllowedValidationCommand(command) {
  if (!command || BLOCKED_VALIDATION.some((pattern) => pattern.test(command))) return false;
  return VALIDATION_PREFIXES.some((prefix) => command.startsWith(prefix));
}

function normalizeGene(gene = {}, owner = 'unknown') {
  const constraints = gene.constraints || {};

  return {
    type: gene.type || 'Gene',
    id: gene.id || `gene_${owner}_strategy`,
    summary: gene.summary || 'Compressed strategy gene',
    category: gene.category || 'optimize',
    signals_match: gene.signals_match || gene.signals || [],
    preconditions: gene.preconditions || [],
    strategy: gene.strategy || [],
    constraints: {
      max_files: constraints.max_files || 12,
      forbidden_paths: constraints.forbidden_paths || ['.git', 'node_modules']
    },
    validation: (gene.validation || DEFAULT_VALIDATION).filter(isAllowedValidationCommand),
    avoid: gene.avoid || gene.anti_patterns || [],
    evidence: gene.evidence || { confidence: 0.62, capsules: 1 },
    inherited_from: gene.inherited_from || [owner]
  };
}

function geneScore(gene) {
  const confidence = gene.evidence?.confidence || 0.6;
  const signalScore = Math.min(0.18, gene.signals_match.length * 0.03);
  const validationScore = Math.min(0.12, gene.validation.length * 0.04);
  return confidence + signalScore + validationScore;
}

function pickStrongestGene(agent) {
  return (agent.genes || [])
    .map((gene) => normalizeGene(gene, agent.name))
    .sort((a, b) => geneScore(b) - geneScore(a))[0];
}

function mergeConstraints(genes) {
  const maxFiles = genes
    .map((gene) => gene.constraints.max_files)
    .filter(Boolean);

  return {
    max_files: maxFiles.length ? Math.min(...maxFiles) : 12,
    forbidden_paths: unique(genes.flatMap((gene) => gene.constraints.forbidden_paths || []))
  };
}

function inferCategory(genes, compatibility) {
  if (compatibility?.mutation >= 78) return 'innovate';
  if (genes.some((gene) => gene.category === 'repair')) return 'repair';
  return 'optimize';
}

function buildMutation(compatibility) {
  if (!compatibility || compatibility.mutation < 72) {
    return {
      type: 'Stable Gene Recombination',
      description: 'No unsafe strategy drift detected; child gene keeps parent validation rails.'
    };
  }

  return {
    type: 'Strategy Mutation',
    description: 'A new arena-first validation step emerged before the child can promote itself.'
  };
}

export function fuseStrategyGenes(parentA, parentB, compatibility) {
  const inheritedGenes = [
    pickStrongestGene(parentA),
    pickStrongestGene(parentB)
  ].filter(Boolean);

  if (!inheritedGenes.length) {
    return {
      genes: [],
      inheritedGenes: [],
      report: null,
      fitnessTests: [],
      geneFusionLog: ['No compressed Strategy Gene detected; Gene layer skipped.']
    };
  }

  const mutation = buildMutation(compatibility);
  const signals = unique(inheritedGenes.flatMap((gene) => gene.signals_match)).slice(0, 10);
  const strategy = unique([
    ...inheritedGenes.flatMap((gene) => gene.strategy),
    mutation.type === 'Strategy Mutation' ? 'Run a child-specific arena validation before promotion.' : ''
  ]).slice(0, 9);
  const validation = unique(inheritedGenes.flatMap((gene) => gene.validation))
    .filter(isAllowedValidationCommand)
    .slice(0, 5);
  const avoid = unique(inheritedGenes.flatMap((gene) => gene.avoid)).slice(0, 8);

  const childGene = {
    type: 'Gene',
    id: `gene_child_${parentA.id}_${parentB.id}_strategy_dna`,
    summary: `Fuses ${parentA.name}'s operational strategy with ${parentB.name}'s expression strategy.`,
    category: inferCategory(inheritedGenes, compatibility),
    signals_match: signals,
    preconditions: unique(inheritedGenes.flatMap((gene) => gene.preconditions)).slice(0, 6),
    strategy,
    constraints: mergeConstraints(inheritedGenes),
    validation: validation.length ? validation : DEFAULT_VALIDATION,
    avoid,
    evidence: {
      confidence: Math.min(0.95, Math.round((inheritedGenes.reduce((sum, gene) => sum + geneScore(gene), 0) / inheritedGenes.length) * 100) / 100),
      parent_gene_count: inheritedGenes.length
    },
    inherited_from: inheritedGenes.flatMap((gene) => gene.inherited_from),
    mutation,
    schema_version: 'evomate-gene-v1'
  };

  const report = {
    inherited_gene_ids: inheritedGenes.map((gene) => gene.id),
    dominant_category: childGene.category,
    signal_count: childGene.signals_match.length,
    strategy_steps: childGene.strategy.length,
    validation_commands: childGene.validation,
    constraints: childGene.constraints,
    mutation
  };

  return {
    genes: [childGene],
    inheritedGenes,
    report,
    fitnessTests: childGene.validation,
    geneFusionLog: [
      `Strategy Gene inherited: ${report.inherited_gene_ids.join(' + ')}.`,
      `Gene signals compressed to ${report.signal_count} trigger patterns.`,
      `Fitness tests attached: ${childGene.validation.join(' / ')}.`,
      `Gene mutation status: ${mutation.type}.`
    ]
  };
}
