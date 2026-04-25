import path from 'node:path';
import { parseAgent } from '../parser/agent_parser.js';
import { checkCompatibility } from '../gene/compatibility.js';
import { crossover } from '../crossover/crossover_engine.js';
import { repairChildGene } from '../mutation/mutation_engine.js';
import { renderAgent } from '../render/agent_renderer.js';
import { runStaticEval } from '../evaluate/static_evaluator.js';
import { runTaskEval } from '../evaluate/task_evaluator.js';
import { computeFitness } from '../evaluate/scoring.js';
import { buildLineageRecord } from '../lineage/lineage_recorder.js';
import { writeJson, writeText } from '../store/artifact_store.js';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    args[token.slice(2)] = argv[i + 1];
    i += 1;
  }
  return args;
}

export async function evolve(parentAPath, parentBPath, options = {}) {
  const root = options.root || process.cwd();
  const parentA = await parseAgent(path.resolve(root, parentAPath));
  const parentB = await parseAgent(path.resolve(root, parentBPath));

  const compatibility = checkCompatibility(parentA, parentB);
  if (!compatibility.compatible) {
    throw new Error(`Parent genes are not compatible enough: score=${compatibility.score}`);
  }

  const crossoverResult = crossover(parentA, parentB, options.profile || 'balanced');
  const mutationResult = repairChildGene(crossoverResult.childDraftGene);
  const childGene = mutationResult.childGene;
  const childMarkdown = renderAgent(childGene);

  const staticEval = runStaticEval(childGene, parentA, parentB);
  const taskEval = runTaskEval(childGene, options.evalSpec || null);
  const fitness = computeFitness(staticEval, taskEval);

  const lineage = buildLineageRecord({
    childId: childGene.agent_id,
    parentAId: parentA.agent_id,
    parentBId: parentB.agent_id,
    compatibility,
    crossoverRecord: crossoverResult.crossoverRecord,
    mutations: mutationResult.mutations,
    evaluation: { staticEval, taskEval, fitness }
  });

  const childId = childGene.agent_id;
  const outputs = {
    childAgentPath: await writeText(root, `outputs/children/${childId}.md`, childMarkdown),
    childGenePath: await writeJson(root, `outputs/genes/${childId}.gene.json`, childGene),
    lineagePath: await writeJson(root, `outputs/lineage/${childId}.lineage.json`, lineage),
    evalPath: await writeJson(root, `outputs/evaluations/${childId}.eval.json`, { staticEval, taskEval, fitness }),
    mutationPath: await writeJson(root, `outputs/evaluations/${childId}.mutations.json`, mutationResult.mutations)
  };

  return {
    childId,
    compatibility,
    crossoverRecord: crossoverResult.crossoverRecord,
    mutations: mutationResult.mutations,
    staticEval,
    taskEval,
    fitness,
    outputs
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv);
  const root = args.root ? path.resolve(process.cwd(), args.root) : process.cwd();
  evolve(args.parentA, args.parentB, { profile: args.profile, root })
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}
