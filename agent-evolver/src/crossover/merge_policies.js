function unique(items = []) {
  return [...new Set(items.filter(Boolean))];
}

export function unionMerge(a = [], b = []) {
  return unique([...a, ...b]);
}

export function conservativeToolMerge(toolA, toolB) {
  const allowedSetA = new Set(toolA.allowed_tools);
  const allowedSetB = new Set(toolB.allowed_tools);
  const allowedTools = [...allowedSetA].filter((tool) => allowedSetB.has(tool));

  return {
    allowed_tools: allowedTools,
    preferred_tools: unique([...toolA.preferred_tools, ...toolB.preferred_tools]),
    forbidden_tools: unique([...toolA.forbidden_tools, ...toolB.forbidden_tools]),
    tool_rules: unique([...toolA.tool_rules, ...toolB.tool_rules])
  };
}
