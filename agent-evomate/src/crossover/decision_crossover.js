export function mergeDecisionRules(rulesA = [], rulesB = []) {
  const merged = new Map();
  const warnings = [];

  for (const rule of [...rulesA, ...rulesB]) {
    const key = rule.condition.toLowerCase();
    if (!merged.has(key)) {
      merged.set(key, rule.action);
      continue;
    }

    const previous = merged.get(key);
    if (previous !== rule.action) {
      warnings.push(`Decision conflict on "${rule.condition}"`);
      const conservative = [previous, rule.action].find((action) =>
        /avoid|forbid|safe|review|search_before/.test(action.toLowerCase())
      );
      merged.set(key, conservative || previous);
    }
  }

  return {
    rules: [...merged.entries()].map(([condition, action]) => ({ condition, action })),
    warnings
  };
}
