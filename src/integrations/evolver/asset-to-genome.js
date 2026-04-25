function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeConstraints(gene = {}) {
  return {
    max_files: gene.constraints?.max_files || gene.max_files || 12,
    forbidden_paths: toArray(gene.constraints?.forbidden_paths || gene.forbidden_paths)
  };
}

export function adaptGeneToGenome(gene, capsules = []) {
  const firstCapsule = capsules[0] || {};

  return {
    type: 'Gene',
    id: gene.id || gene.name || 'gene_imported_from_evolver',
    summary: gene.summary || firstCapsule.summary || 'Imported Evolver compressed strategy gene.',
    category: gene.category || gene.kind || 'optimize',
    signals_match: toArray(gene.signals_match || gene.signals),
    preconditions: toArray(gene.preconditions),
    strategy: toArray(gene.strategy || gene.steps),
    constraints: normalizeConstraints(gene),
    validation: toArray(gene.validation || gene.validate),
    avoid: toArray(gene.avoid || gene.anti_patterns),
    evidence: {
      confidence: gene.confidence || firstCapsule.confidence || 0.62,
      capsules: capsules.length
    },
    inherited_from: toArray(gene.inherited_from)
  };
}

export function adaptEvolverGenesToGenomeBundle(evolverAsset = {}) {
  const genes = toArray(evolverAsset.genes);
  const capsules = toArray(evolverAsset.capsules || evolverAsset.learning_capsules);

  return {
    source: evolverAsset.source || 'evolver-main/assets/gep/genes.json',
    schema: 'evomate-agent-gene-bundle-v1',
    genes: genes.map((gene) => adaptGeneToGenome(gene, capsules))
  };
}
