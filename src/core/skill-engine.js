export function executeSkill(agent, instruction) {
  // Mock LLM Engine for offline Hackathon Demo
  const lowerInstruction = instruction.toLowerCase();
  let output = '';
  let approach = '';
  let styleMultiplier = 1;

  if (agent.archetype.includes('Cartographer') || agent.id === 'atlas') {
    approach = 'Systematic analysis and defensive planning.';
    styleMultiplier = 1.2;
    output = `[VALIDATING INPUT]\nAnalyzing instruction: "${instruction}"\n\n[EXECUTION PLAN]\n1. Verify constraints.\n2. Build abstract syntax tree or logical model.\n3. Execute with safe boundaries.\n\n[RESULT]\nExecution successful. No unhandled edge cases detected.`;
    if (lowerInstruction.includes('code') || lowerInstruction.includes('script')) {
      output += '\n\n```python\n# Structured, typed, and well-commented code\ndef secure_execution():\n    pass\n```';
    }
  } else if (agent.archetype.includes('Catalyst') || agent.id === 'muse') {
    approach = 'Creative lateral thinking and narrative framing.';
    styleMultiplier = 1.4;
    output = `*Sparks flying!* Let's look at this from a completely different angle!\n\nRegarding: "${instruction}"\n\nWhat if we don't just solve it, but we make it an experience? Here's a bold idea: We flip the premise.`;
    if (lowerInstruction.includes('pitch') || lowerInstruction.includes('story')) {
      output += '\n\n"We aren\'t just writing code, we are breeding the future of digital workers."';
    }
  } else if (agent.archetype.includes('Exploration') || agent.id === 'nomad') {
    approach = 'Broad pattern matching and hypothesis generation.';
    styleMultiplier = 1.3;
    output = `[SCANNING...] Found 3 weak signals related to "${instruction}".\n\nHypothesis A: It's a standard execution request.\nHypothesis B: There is a hidden dependency we haven't mapped.\n\nLet's keep both alive and prototype a quick path forward.`;
  } else if (agent.archetype.includes('Mediator') || agent.id === 'lumen') {
    approach = 'Ambiguity reduction and safe clarification.';
    styleMultiplier = 1.1;
    output = `I hear you. You want to execute: "${instruction}".\n\nBefore I proceed, I notice a potential ambiguity that could lead to unexpected results. Let me clarify the safest path first, so we don't break anything.`;
  } else {
    approach = 'Standard execution.';
    output = `Instruction received: "${instruction}". Executed according to base parameters.`;
  }

  // Calculate a fake "time_taken" to make it feel real
  const timeTakenMs = Math.floor(Math.random() * 800) + 400 * styleMultiplier;

  return {
    output,
    approach,
    timeTakenMs,
    timestamp: new Date().toISOString()
  };
}
