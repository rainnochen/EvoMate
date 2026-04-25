function scoreSample(gene, sample) {
  const rendered = JSON.stringify(gene).toLowerCase();
  const expected = sample.expected_properties || [];
  const matched = expected.filter((token) => rendered.includes(token.replaceAll('_', ' '))).length;
  return expected.length ? matched / expected.length : 0.5;
}

export function runTaskEval(childGene, evalSpec) {
  if (!evalSpec?.samples?.length) {
    return {
      provided: false,
      task_score: 0.55,
      detail: 'No eval spec provided; used weak default probe score.'
    };
  }

  const sampleScores = evalSpec.samples.map((sample) => scoreSample(childGene, sample));
  const avg = sampleScores.reduce((sum, x) => sum + x, 0) / sampleScores.length;
  return {
    provided: true,
    task_score: Number(avg.toFixed(2)),
    samples: sampleScores
  };
}
