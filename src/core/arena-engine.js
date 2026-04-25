function dominantTraits(agent) {
  return agent.soul
    .slice()
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((item) => item.trait);
}

function strongestSkills(agent) {
  return agent.skills.slice(0, 3);
}

function primaryGene(agent) {
  return (agent.genes || [])[0];
}

function geneNote(agent) {
  const gene = primaryGene(agent);
  if (!gene) return 'No compressed Gene attached yet.';
  return `Gene: ${gene.id}; category: ${gene.category}.`;
}

function fitnessNote(agent) {
  const tests = agent.fitnessTests || primaryGene(agent)?.validation || [];
  if (!tests.length) return 'Fitness tests pending.';
  return `Fitness: ${tests.slice(0, 2).join(' / ')}.`;
}

export function generateArenaOutputs(task, parentA, parentB, child) {
  return [
    {
      agent: parentA.name,
      role: 'Parent A',
      output: `${parentA.name}: This project should be framed as a disciplined experiment. We define the agent genome, measure inheritance across soul, skills, memory, and knowledge, then evaluate the child agent in a clear arena task.`,
      notes: `Strength: ${strongestSkills(parentA).join(', ')}. Expression: ${dominantTraits(parentA).join(', ')}. ${geneNote(parentA)}`
    },
    {
      agent: parentB.name,
      role: 'Parent B',
      output: `${parentB.name}: Imagine agents not as tools you configure, but as digital beings that can inherit, mutate, and surprise us. EvoMate makes that invisible birth process visible in one unforgettable demo.`,
      notes: `Strength: ${strongestSkills(parentB).join(', ')}. Expression: ${dominantTraits(parentB).join(', ')}. ${geneNote(parentB)}`
    },
    {
      agent: child.name,
      role: 'Child',
      output: `${child.name}: EvoMate turns agent building into digital genetics. Two parent agents enter the lab, their DNA recombines across personality, skills, memory, knowledge, and compressed Strategy Genes. The child does not just inherit traits; it carries a testable protocol for when to act, what to avoid, and how to validate itself in the arena.`,
      notes: `Hybrid expression for task: "${task}" with ${strongestSkills(child).join(', ')}. ${geneNote(child)} ${fitnessNote(child)}`
    }
  ];
}
