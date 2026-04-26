import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkCompatibility } from "../agent-evomate/src/gene/compatibility.js";
import { crossover } from "../agent-evomate/src/crossover/crossover_engine.js";
import { repairChildGene } from "../agent-evomate/src/mutation/mutation_engine.js";
import { parseAgent } from "../agent-evomate/src/parser/agent_parser.js";
import { renderAgent } from "../agent-evomate/src/render/agent_renderer.js";
import { runStaticEval } from "../agent-evomate/src/evaluate/static_evaluator.js";
import { runTaskEval } from "../agent-evomate/src/evaluate/task_evaluator.js";
import { computeFitness } from "../agent-evomate/src/evaluate/scoring.js";
import { buildLineageRecord } from "../agent-evomate/src/lineage/lineage_recorder.js";
import { writeJson, writeText } from "../agent-evomate/src/store/artifact_store.js";
import { evolve } from "../agent-evomate/src/pipeline/evolve.js";
import { extractSections } from "../agent-evomate/src/parser/markdown_extractor.js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const DEFAULT_OPENCLAW_ROOT = path.resolve(REPO_ROOT, "..", "openclaw-main");
const DEFAULT_OUTPUT_ROOT = path.join(REPO_ROOT, "outputs", "skill-showcase-batch");

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "into",
  "your",
  "you",
  "will",
  "can",
  "use",
  "used",
  "when",
  "what",
  "how",
  "why",
  "are",
  "is",
  "to",
  "of",
  "in",
  "on",
  "a",
  "an",
  "or",
  "as",
  "by",
  "be",
  "it",
  "its",
  "if",
  "we",
  "our",
  "their",
  "your",
  "more",
  "less",
  "best",
  "make",
  "help",
  "using",
  "into",
  "via",
  "out",
  "who",
  "what",
  "where",
  "which",
]);

function parseArgs(argv) {
  const args = {
    openclawRoot: DEFAULT_OPENCLAW_ROOT,
    outputRoot: DEFAULT_OUTPUT_ROOT,
    limit: 12,
    pairLimit: 0,
    mode: "local",
  };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[i + 1];
    if (value && !value.startsWith("--")) {
      i += 1;
    }
    switch (key) {
      case "openclaw-root":
        args.openclawRoot = path.resolve(value);
        break;
      case "output-root":
        args.outputRoot = path.resolve(value);
        break;
      case "limit":
        args.limit = Number(value) || args.limit;
        break;
      case "pair-limit":
        args.pairLimit = Number(value) || 0;
        break;
      case "mode":
        args.mode = value || args.mode;
        break;
      case "help":
        args.help = true;
        break;
      default:
        break;
    }
  }
  return args;
}

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function titleCase(text) {
  return normalizeText(text)
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function slugify(text) {
  return normalizeText(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "skill";
}

function unique(items) {
  return [...new Set(items.filter(Boolean).map((item) => normalizeText(item)).filter(Boolean))];
}

function tokenize(text) {
  return normalizeText(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length >= 4 && !STOPWORDS.has(token));
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return {};
  const frontmatter = {};
  const lines = match[1].split("\n");
  let currentKey = null;
  let jsonBuffer = [];
  for (const line of lines) {
    if (/^[A-Za-z0-9_-]+:\s*/.test(line)) {
      if (currentKey && jsonBuffer.length > 0) {
        frontmatter[currentKey] = jsonBuffer.join("\n").trim();
        jsonBuffer = [];
      }
      const [, key, value] = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/) ?? [];
      if (!key) continue;
      currentKey = key;
      frontmatter[key] = value ?? "";
      if ((value ?? "").trim().length === 0) {
        jsonBuffer = [];
      }
      continue;
    }
    if (currentKey && line.startsWith("  ")) {
      jsonBuffer.push(line);
    }
  }
  if (currentKey && jsonBuffer.length > 0) {
    frontmatter[currentKey] = jsonBuffer.join("\n").trim();
  }
  return frontmatter;
}

function getSection(sections, ...names) {
  for (const name of names) {
    const section = sections.get(name.toLowerCase());
    if (section) return section;
  }
  return null;
}

function collectBullets(sections, names) {
  const bullets = [];
  for (const name of names) {
    const section = getSection(sections, name);
    if (!section) continue;
    bullets.push(...section.bullets);
  }
  return unique(bullets);
}

function collectOrdered(sections, names) {
  const ordered = [];
  for (const name of names) {
    const section = getSection(sections, name);
    if (!section) continue;
    ordered.push(...section.ordered);
  }
  return unique(ordered);
}

function extractBodyAfterFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  return match ? match[2] : raw;
}

function pickFallbackSentences(text, count = 2) {
  const sentences = normalizeText(text)
    .split(/(?<=[.!?。！？])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return sentences.slice(0, count);
}

function scoreSkillRecord(record) {
  const sections = record.sections;
  const weights = [
    ["workflow", 2.5],
    ["validation", 1.75],
    ["decision rules", 1.5],
    ["tools allowed", 1.25],
    ["tool policy", 1.25],
    ["safety constraints", 1.25],
    ["output requirements", 1.0],
    ["checks", 1.0],
  ];
  let score = 0;
  for (const [name, weight] of weights) {
    if ((getSection(sections, name)?.raw ?? "").length > 0) {
      score += weight;
    }
  }
  const bodyWords = normalizeText(record.body).split(/\s+/).filter(Boolean).length;
  score += Math.min(2, bodyWords / 120);
  score += Math.min(1.5, normalizeText(record.description).length / 120);
  return Number(score.toFixed(2));
}

async function readSkillMd(filePath, source) {
  const raw = await fs.readFile(filePath, "utf8");
  const frontmatter = parseFrontmatter(raw);
  const body = extractBodyAfterFrontmatter(raw);
  const sections = extractSections(body);
  const skillName = normalizeText(frontmatter.name) || path.basename(path.dirname(filePath));
  const description = normalizeText(frontmatter.description) || normalizeText(getSection(sections, "description")?.raw);
  return {
    source,
    filePath,
    skillName,
    slug: slugify(skillName),
    description,
    frontmatter,
    body,
    sections,
  };
}

async function discoverSkillFiles(root) {
  const results = [];
  const seen = new Set();

  async function walk(dir, source) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      if (entry.name === "node_modules") continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const skillFile = path.join(fullPath, "SKILL.md");
        try {
          const stat = await fs.stat(skillFile);
          if (stat.isFile()) {
            const key = path.resolve(skillFile);
            if (!seen.has(key)) {
              seen.add(key);
              results.push({ filePath: skillFile, source });
            }
          }
        } catch {
          await walk(fullPath, source);
        }
      }
    }
  }

  await walk(path.join(root, "skills"), "openclaw-core");
  const extensionsDir = path.join(root, "extensions");
  try {
    const extensions = await fs.readdir(extensionsDir, { withFileTypes: true });
    for (const ext of extensions) {
      if (!ext.isDirectory()) continue;
      const skillsDir = path.join(extensionsDir, ext.name, "skills");
      try {
        const nested = await fs.readdir(skillsDir, { withFileTypes: true });
        for (const skill of nested) {
          if (!skill.isDirectory()) continue;
          const skillFile = path.join(skillsDir, skill.name, "SKILL.md");
          try {
            const stat = await fs.stat(skillFile);
            if (stat.isFile()) {
              const key = path.resolve(skillFile);
              if (!seen.has(key)) {
                seen.add(key);
                results.push({ filePath: skillFile, source: `extension:${ext.name}` });
              }
            }
          } catch {
            // ignore
          }
        }
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }

  return results;
}

function buildAgentMarkdownFromSkill(record) {
  const sections = record.sections;
  const whenToUse = collectBullets(sections, [
    "when to use",
    "use when",
    "good for",
    "trigger",
    "trigger conditions",
  ]);
  const avoid = collectBullets(sections, ["avoid", "avoid when", "do not use", "when not to use"]);
  const requiredInputs = collectBullets(sections, [
    "required inputs",
    "inputs",
    "prerequisites",
    "preconditions",
  ]);
  const workflow = collectOrdered(sections, ["workflow", "procedure", "steps", "how it works"]);
  const decisionRules = collectBullets(sections, [
    "decision rules",
    "rules",
    "decision policy",
    "policy",
  ]);
  const toolsAllowed = collectBullets(sections, ["tools allowed", "tools", "tooling", "toolbox"]);
  const toolsForbidden = collectBullets(sections, ["tools forbidden", "forbidden tools"]);
  const toolPolicy = collectBullets(sections, ["tool policy", "tool usage", "execution policy"]);
  const outputRequirements = collectBullets(sections, [
    "output requirements",
    "expected output",
    "deliverables",
  ]);
  const validation = collectBullets(sections, ["validation", "quality gates", "checks"]);
  const checks = collectBullets(sections, ["checks", "verification", "review"]);
  const safetyConstraints = collectBullets(sections, [
    "safety constraints",
    "safety",
    "guardrails",
    "constraints",
  ]);
  const antiPatterns = collectBullets(sections, ["anti patterns", "anti-patterns", "anti patterns"]);
  const style = normalizeText(getSection(sections, "style")?.raw) || "concise and direct";
  const intent = `skill_${record.slug}`;
  const workflowLines =
    workflow.length > 0
      ? workflow
      : pickFallbackSentences(record.body, 3).map((sentence, index) => `${index + 1}. ${sentence}`);

  const fallbackWhenUse = whenToUse.length > 0
    ? whenToUse
    : record.description
      ? [record.description]
      : ["specialized task execution"];

  const mergedTools = unique([
    ...toolsAllowed,
    ...(normalizeText(record.frontmatter.metadata).includes("bins") ? ["local-binary"] : []),
  ]);

  return `# ${record.skillName}

## Description
${record.description || "Skill imported from OpenClaw."}

## Intent
${intent}

## When to use
${fallbackWhenUse.map((item) => `- ${item}`).join("\n")}

## Avoid
${avoid.length > 0 ? avoid.map((item) => `- ${item}`).join("\n") : "- task is unrelated"}

## Required inputs
${requiredInputs.length > 0 ? requiredInputs.map((item) => `- ${item}`).join("\n") : "- context"}

## Workflow
${workflowLines.join("\n")}

## Decision rules
${decisionRules.length > 0 ? decisionRules.map((item) => `- ${item}`).join("\n") : "- prefer safe defaults"}

## Tools allowed
${mergedTools.length > 0 ? mergedTools.map((item) => `- ${item}`).join("\n") : "- node"}

## Tools forbidden
${toolsForbidden.length > 0 ? toolsForbidden.map((item) => `- ${item}`).join("\n") : "- destructive commands"}

## Tool policy
${toolPolicy.length > 0 ? toolPolicy.map((item) => `- ${item}`).join("\n") : "- keep commands auditable"}

## Output format
structured_markdown

## Output requirements
${outputRequirements.length > 0 ? outputRequirements.map((item) => `- ${item}`).join("\n") : "- summary"}

## Validation
${validation.length > 0 ? validation.map((item) => `- ${item}`).join("\n") : "- must include verification steps"}

## Checks
${checks.length > 0 ? checks.map((item) => `- ${item}`).join("\n") : "- include risks"}

## Safety constraints
${safetyConstraints.length > 0 ? safetyConstraints.map((item) => `- ${item}`).join("\n") : "- do not run destructive commands"}

## Anti patterns
${antiPatterns.length > 0 ? antiPatterns.map((item) => `- ${item}`).join("\n") : "- skip repo discovery"}

## Style
${style}
`;
}

function buildEvalSpecFromSkills(skillA, skillB) {
  const keywords = unique([
    ...tokenize(skillA.skillName),
    ...tokenize(skillA.description),
    ...tokenize(skillB.skillName),
    ...tokenize(skillB.description),
    ...tokenize(skillA.body).slice(0, 10),
    ...tokenize(skillB.body).slice(0, 10),
  ]).slice(0, 12);
  return {
    samples: [
      {
        expected_properties: keywords,
      },
    ],
  };
}

async function writeFileEnsured(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
}

async function runPairEvolution(params) {
  const parentA = await parseAgent(path.join(params.runPairDir, "agents", "parent_a", "agent.md"));
  const parentB = await parseAgent(path.join(params.runPairDir, "agents", "parent_b", "agent.md"));
  const compatibility = checkCompatibility(parentA, parentB);

  if (compatibility.compatible) {
    const result = await evolve("agents/parent_a/agent.md", "agents/parent_b/agent.md", {
      root: params.runPairDir,
      profile: "balanced",
      evalSpec: params.evalSpec,
    });
    return {
      ...result,
      compatibility,
      executionMode: "native",
    };
  }

  const crossoverResult = crossover(parentA, parentB, "balanced");
  const mutationResult = repairChildGene(crossoverResult.childDraftGene);
  const childGene = mutationResult.childGene;
  const childMarkdown = renderAgent(childGene);
  const staticEval = runStaticEval(childGene, parentA, parentB);
  const taskEval = runTaskEval(childGene, params.evalSpec || null);
  const fitness = computeFitness(staticEval, taskEval);
  const lineage = buildLineageRecord({
    childId: childGene.agent_id,
    parentAId: parentA.agent_id,
    parentBId: parentB.agent_id,
    compatibility,
    crossoverRecord: crossoverResult.crossoverRecord,
    mutations: mutationResult.mutations,
    evaluation: { staticEval, taskEval, fitness },
  });

  const childId = childGene.agent_id;
  const outputs = {
    childAgentPath: await writeText(params.runPairDir, `outputs/children/${childId}.md`, childMarkdown),
    childGenePath: await writeJson(params.runPairDir, `outputs/genes/${childId}.gene.json`, childGene),
    lineagePath: await writeJson(params.runPairDir, `outputs/lineage/${childId}.lineage.json`, lineage),
    evalPath: await writeJson(params.runPairDir, `outputs/evaluations/${childId}.eval.json`, {
      staticEval,
      taskEval,
      fitness,
    }),
    mutationPath: await writeJson(
      params.runPairDir,
      `outputs/evaluations/${childId}.mutations.json`,
      mutationResult.mutations,
    ),
  };

  return {
    childId,
    compatibility,
    crossoverRecord: crossoverResult.crossoverRecord,
    mutations: mutationResult.mutations,
    staticEval,
    taskEval,
    fitness,
    outputs,
    executionMode: "exploratory",
  };
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(`Usage:
  node scripts/skills-batch-showcase.mjs [--openclaw-root <path>] [--output-root <path>] [--limit <n>] [--pair-limit <n>] [--mode local]

Modes:
  local   Scan local OpenClaw skills folders and run pairwise EvoMate tests (default)

Output:
  Writes a run folder with selected parent skills, child artifacts, and a showcase ranking report.
`);
    process.exit(0);
  }

  const discovered = await discoverSkillFiles(args.openclawRoot);
  const records = [];
  for (const item of discovered) {
    try {
      records.push(await readSkillMd(item.filePath, item.source));
    } catch {
      // ignore malformed skills
    }
  }

  if (records.length === 0) {
    throw new Error(`No skills found under ${args.openclawRoot}`);
  }

  const rankedSkills = records
    .map((record) => ({
      ...record,
      structureScore: scoreSkillRecord(record),
    }))
    .sort((a, b) => b.structureScore - a.structureScore || a.skillName.localeCompare(b.skillName));

  const selectedSkills = rankedSkills.slice(0, Math.max(2, args.limit));
  const pairCandidates = [];
  for (let i = 0; i < selectedSkills.length; i += 1) {
    for (let j = i + 1; j < selectedSkills.length; j += 1) {
      pairCandidates.push([selectedSkills[i], selectedSkills[j]]);
    }
  }

  const selectedPairs =
    args.pairLimit > 0 ? pairCandidates.slice(0, args.pairLimit) : pairCandidates;

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const runDir = path.join(args.outputRoot, timestamp);
  const selectedDir = path.join(runDir, "selected-skills");
  const pairDir = path.join(runDir, "pair-runs");
  const childrenDir = path.join(runDir, "children");
  const reportPath = path.join(runDir, "report.md");
  const manifestPath = path.join(runDir, "manifest.json");

  await fs.mkdir(runDir, { recursive: true });

  const manifest = {
    createdAt: new Date().toISOString(),
    openclawRoot: path.resolve(args.openclawRoot),
    mode: args.mode,
    totalDiscovered: records.length,
    totalSelected: selectedSkills.length,
    totalPairs: selectedPairs.length,
    selectedSkills: selectedSkills.map((record) => ({
      skillName: record.skillName,
      slug: record.slug,
      source: record.source,
      filePath: record.filePath,
      structureScore: record.structureScore,
    })),
  };

  await writeFileEnsured(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const rankingRows = [];
  const processedPairs = [];

  for (let index = 0; index < selectedPairs.length; index += 1) {
    const [skillA, skillB] = selectedPairs[index];
    const pairLabel = `${skillA.slug}__${skillB.slug}`;
    const runPairDir = path.join(pairDir, String(index + 1).padStart(3, "0"), pairLabel);
    const parentADir = path.join(runPairDir, "agents", "parent_a");
    const parentBDir = path.join(runPairDir, "agents", "parent_b");
    const parentAPath = path.join(parentADir, "agent.md");
    const parentBPath = path.join(parentBDir, "agent.md");

    await writeFileEnsured(parentAPath, buildAgentMarkdownFromSkill(skillA));
    await writeFileEnsured(parentBPath, buildAgentMarkdownFromSkill(skillB));

    const evalSpec = buildEvalSpecFromSkills(skillA, skillB);
    let result;
    try {
      result = await runPairEvolution({
        runPairDir,
        evalSpec,
      });
    } catch (error) {
      processedPairs.push({
        pairLabel,
        skillA: skillA.skillName,
        skillB: skillB.skillName,
        error: error instanceof Error ? error.message : String(error),
      });
      continue;
    }

    const childMarkdownPath = result.outputs.childAgentPath;
    const childGenePath = result.outputs.childGenePath;
    const lineagePath = result.outputs.lineagePath;
    const evalPath = result.outputs.evalPath;

    const row = {
      pairLabel,
      skillA: skillA.skillName,
      skillB: skillB.skillName,
      compatibility: result.compatibility.score,
      fitness: result.fitness.fitness,
      staticGatePass: result.fitness.static_gate_pass,
      taskScore: result.taskEval.task_score ?? 0,
      childId: result.childId,
      childMarkdownPath,
      childGenePath,
      lineagePath,
      evalPath,
      mutationCount: result.mutations.length,
      executionMode: result.executionMode,
    };
    rankingRows.push(row);
    processedPairs.push(row);

    const childTargetDir = path.join(childrenDir, pairLabel);
    await fs.mkdir(childTargetDir, { recursive: true });
    await fs.copyFile(childMarkdownPath, path.join(childTargetDir, "child-agent.md"));
    await fs.copyFile(childGenePath, path.join(childTargetDir, "child-gene.json"));
    await fs.copyFile(lineagePath, path.join(childTargetDir, "child-lineage.json"));
    await fs.copyFile(evalPath, path.join(childTargetDir, "child-eval.json"));
  }

  rankingRows.sort((a, b) => {
    if (b.fitness !== a.fitness) return b.fitness - a.fitness;
    if (b.compatibility !== a.compatibility) return b.compatibility - a.compatibility;
    return a.pairLabel.localeCompare(b.pairLabel);
  });

  const topRows = rankingRows.slice(0, 10);
  const reportLines = [];
  reportLines.push(`# Skill Batch Showcase Report`);
  reportLines.push("");
  reportLines.push(`- createdAt: ${manifest.createdAt}`);
  reportLines.push(`- openclawRoot: \`${manifest.openclawRoot}\``);
  reportLines.push(`- discoveredSkills: ${manifest.totalDiscovered}`);
  reportLines.push(`- selectedSkills: ${manifest.totalSelected}`);
  reportLines.push(`- testedPairs: ${manifest.totalPairs}`);
  reportLines.push("");
  reportLines.push(`## Top showcase candidates`);
  reportLines.push("");
  reportLines.push(`| Rank | Pair | Compatibility | Fitness | Task | Static Gate | Mutations |`);
  reportLines.push(`| --- | --- | ---: | ---: | ---: | --- | ---: |`);
  topRows.forEach((row, index) => {
    reportLines.push(
      `| ${index + 1} | ${row.skillA} × ${row.skillB} | ${row.compatibility.toFixed(2)} | ${row.fitness.toFixed(
        3,
      )} | ${row.taskScore.toFixed(2)} | ${row.staticGatePass ? "pass" : "fail"} | ${row.mutationCount} |`,
    );
  });
  reportLines.push("");
  reportLines.push(`## Selection strategy`);
  reportLines.push("");
  reportLines.push(
    `We selected the most structurally complete skills first, then bred them pairwise and ranked children by combined fitness. This favors skills with explicit workflow, validation, tool policy, and safety sections.`,
  );
  reportLines.push("");
  reportLines.push(`## Next step`);
  reportLines.push("");
  reportLines.push(
    `Take the top 3 pairs and turn their generated child artifacts into demo-ready showcase candidates.`,
  );

  await writeFileEnsured(reportPath, `${reportLines.join("\n")}\n`);
  await writeFileEnsured(
    path.join(runDir, "pairs.json"),
    `${JSON.stringify({ createdAt: manifest.createdAt, selectedPairs: processedPairs }, null, 2)}\n`,
  );

  console.log(JSON.stringify({ runDir, manifestPath, reportPath, topRows }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
