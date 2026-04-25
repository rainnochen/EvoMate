import { calculateCompatibility } from '/src/core/compatibility-engine.js';
import { generateArenaOutputs } from '/src/core/arena-engine.js';
import { buildGenomeChromosomes, compareEvolution, evaluateGenome } from '/src/core/evaluation-engine.js';
import { runEvolution } from '/src/core/evolution-service.js';

const state = {
  socket: null,
  agents: [],
  arenas: [],
  selectedArenaId: 'build_arena',
  myAgentId: null,
  opponentAgent: null,
  compatibility: null,
  parentEvaluation: null,
  evolutionComparison: null,
  evolutionRun: null,
  childCandidates: [],
  exportPayload: null,
  fusionResult: null,
  arenaTask: '',
  mySkillResult: null,
  opponentSkillResult: null,
  matchStatus: 'idle' // idle, joined, waiting, matched
};

const elements = {
  arenaSelector: document.getElementById('arena-selector'),
  agentGrid: document.getElementById('agent-grid'),
  compatTotal: document.getElementById('compat-total'),
  compatBars: document.getElementById('compat-bars'),
  compatExplanation: document.getElementById('compat-explanation'),
  parentEvaluation: document.getElementById('parent-evaluation'),
  
  skillSection: document.getElementById('skill-section'),
  skillInstruction: document.getElementById('skill-instruction'),
  executeSkillButton: document.getElementById('execute-skill-button'),
  findMatchButton: document.getElementById('find-match-button'),
  
  lobbyStatus: document.getElementById('lobby-status'),
  mySkillResultCard: document.getElementById('my-skill-result'),
  myApproach: document.getElementById('my-approach'),
  myOutput: document.getElementById('my-output'),
  opponentSkillResultCard: document.getElementById('opponent-skill-result'),
  opponentApproach: document.getElementById('opponent-approach'),
  opponentOutput: document.getElementById('opponent-output'),
  compatReveal: document.getElementById('compat-reveal'),

  fusionState: document.getElementById('fusion-state'),
  fusionLog: document.getElementById('fusion-log'),
  childPanel: document.getElementById('child-panel'),
  childRarity: document.getElementById('child-rarity'),
  arenaTask: document.getElementById('arena-task'),
  evolutionDelta: document.getElementById('evolution-delta'),
  arenaGrid: document.getElementById('arena-grid')
};

function getMyAgent() {
  return state.agents.find((agent) => agent.id === state.myAgentId);
}

function selectedParents() {
  return [getMyAgent(), state.opponentAgent].filter(Boolean);
}

function selectedArena() {
  return state.arenas.find((arena) => arena.id === state.selectedArenaId) || state.arenas[0];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderRadar(agent) {
  return Object.entries(agent.radar).map(([label, value]) => `
    <div class="radar-row">
      <span>${label}</span>
      <div class="radar-track"><i style="width: ${value}%"></i></div>
      <strong>${value}</strong>
    </div>
  `).join('');
}

function renderGeneChips(agent) {
  const genes = agent.genes || [];
  if (!genes.length) return '<span class="gene-chip muted">No Gene</span>';

  return genes.slice(0, 2).map((gene) => `
    <span class="gene-chip">${gene.category || 'gene'} · ${gene.id}</span>
  `).join('');
}

function renderChromosomeStrip(agent) {
  return buildGenomeChromosomes(agent).map((chromosome) => `
    <div class="chromosome-row">
      <span>${chromosome.label}</span>
      <div class="chromosome-loci">
        ${chromosome.loci.map((locus) => `
          <i class="${locus.status === 'locked' ? 'locked' : ''}" style="width: ${Math.max(18, locus.strength / 4)}%" title="${locus.path}: ${locus.strength}"></i>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderAgentCard(agent) {
  const isSelected = state.myAgentId === agent.id;
  const selectedClass = isSelected ? 'selected' : '';

  return `
    <article class="agent-card ${selectedClass}" data-agent-id="${agent.id}">
      <div class="agent-topline">
        <div class="avatar">${agent.avatar}</div>
        <div>
          <span class="parent-label">${isSelected ? 'Your Agent' : 'Candidate'}</span>
          <h3>${agent.name}</h3>
          <p>${agent.archetype}</p>
        </div>
      </div>
      <div class="trait-row">
        ${agent.soul.slice(0, 4).map((item) => `<span>${item.trait}</span>`).join('')}
      </div>
      <div class="radar-block">${renderRadar(agent)}</div>
      <div class="mini-list">
        <strong>Skills</strong>
        <p>${agent.skills.slice(0, 4).join(' / ')}</p>
      </div>
      <div class="mini-list">
        <strong>Strategy Genes</strong>
        <div class="gene-stack">${renderGeneChips(agent)}</div>
      </div>
      <div class="mini-list">
        <strong>Chromosomes</strong>
        <div class="chromosome-strip">${renderChromosomeStrip(agent)}</div>
      </div>
    </article>
  `;
}

function renderArenaSelector() {
  elements.arenaSelector.innerHTML = state.arenas.map((arena) => `
    <button class="arena-option ${arena.id === state.selectedArenaId ? 'selected' : ''}" data-arena-id="${arena.id}" type="button">
      <span>${arena.name}</span>
      <strong>${arena.subtitle}</strong>
      <small>${arena.requiredLoci.length} required loci</small>
    </button>
  `).join('');

  elements.arenaSelector.querySelectorAll('.arena-option').forEach((button) => {
    button.addEventListener('click', () => selectArena(button.dataset.arenaId));
  });
}

function renderAgents() {
  elements.agentGrid.innerHTML = state.agents.map(renderAgentCard).join('');
  elements.agentGrid.querySelectorAll('.agent-card').forEach((card) => {
    card.addEventListener('click', () => selectAgent(card.dataset.agentId));
  });
}

function selectArena(arenaId) {
  state.selectedArenaId = arenaId;
  state.fusionResult = null;
  state.evolutionComparison = null;
  state.evolutionRun = null;
  state.childCandidates = [];
  state.exportPayload = null;
  renderAll();
}

function selectAgent(agentId) {
  if (state.matchStatus !== 'idle') return;
  state.myAgentId = agentId;
  elements.skillSection.style.display = 'block';
  
  if (state.socket) {
    state.socket.emit('CLIENT_JOIN', { agentId });
  }
  renderAll();
}

function handleExecuteSkill() {
  const instruction = elements.skillInstruction.value.trim();
  if (!instruction || !state.myAgentId) return;
  
  elements.executeSkillButton.disabled = true;
  elements.executeSkillButton.textContent = 'Executing...';
  
  state.socket.emit('SKILL_EXECUTE', { instruction });
}

function handleFindMatch() {
  elements.findMatchButton.disabled = true;
  elements.findMatchButton.textContent = 'Searching...';
  state.matchStatus = 'waiting';
  
  elements.lobbyStatus.textContent = 'Searching for compatible genomes in the lobby...';
  elements.lobbyStatus.className = 'lobby-status'; // remove empty-state
  
  state.socket.emit('REQUEST_MATCH');
}

function renderCompatibility() {
  if (!state.compatibility) return;
  const metrics = [
    ['Personality', state.compatibility.personality],
    ['Skill Mix', state.compatibility.skill],
    ['Knowledge', state.compatibility.knowledge],
    ['Mutation', state.compatibility.mutation],
    ['Execution Synergy', state.compatibility.executionSynergy || 0]
  ];

  elements.compatTotal.textContent = state.compatibility.total;
  elements.compatBars.innerHTML = metrics.map(([label, value]) => `
    <div class="metric-row">
      <span>${label}</span>
      <div class="metric-track"><i style="width: ${value}%"></i></div>
      <strong>${value}</strong>
    </div>
  `).join('');
  elements.compatExplanation.textContent = state.compatibility.explanation;
  elements.compatReveal.style.display = 'block';
}

function renderParentEvaluation() {
  if (state.matchStatus !== 'matched') {
    elements.parentEvaluation.innerHTML = `
      <p class="eyebrow">Parent Baseline</p>
      <div class="empty-state" style="min-height: 60px;">Waiting for Match</div>
    `;
    return;
  }

  const arena = selectedArena();
  const [parentA, parentB] = selectedParents();
  const parentAResult = evaluateGenome(parentA, arena);
  const parentBResult = evaluateGenome(parentB, arena);
  const baseline = Math.round((parentAResult.overall_score + parentBResult.overall_score) / 2);
  const bestParent = Math.max(parentAResult.overall_score, parentBResult.overall_score);

  state.parentEvaluation = {
    parentAResult,
    parentBResult,
    baseline,
    bestParent
  };

  elements.parentEvaluation.innerHTML = `
    <p class="eyebrow">Parent Baseline</p>
    <div class="score-pair">
      <span>${parentA.name}<strong>${parentAResult.overall_score}</strong></span>
      <span>${parentB.name}<strong>${parentBResult.overall_score}</strong></span>
    </div>
    <div class="baseline-card">
      <span>Average Baseline</span>
      <strong>${baseline}</strong>
      <small>Best Parent: ${bestParent}</small>
    </div>
  `;
}

function renderFusionIdle() {
  elements.fusionState.textContent = 'Awaiting breed signal';
  elements.fusionLog.innerHTML = `
    <div class="log-line">Parent genomes loaded into the lab buffer.</div>
    <div class="log-line">Compatibility engine standing by.</div>
  `;
  document.querySelector('.dna-chamber').classList.remove('is-running');
}

function renderFusionResult(result) {
  elements.fusionState.textContent = 'Genome stabilized';
  elements.fusionLog.innerHTML = [
    ...result.inheritanceLog,
    ...result.fusionLog,
    ...result.mutationLog
  ].map((line) => `<div class="log-line">${line}</div>`).join('');
}

function listItems(items, mapper = (item) => item) {
  return items.map((item) => `<li>${mapper(item)}</li>`).join('');
}

function renderGeneReport(child) {
  if (!child.geneReport) return '';

  return `
    <div class="gene-report">
      <div>
        <span>Dominant Gene</span>
        <strong>${child.geneReport.dominant_category}</strong>
      </div>
      <div>
        <span>Signals</span>
        <strong>${child.geneReport.signal_count}</strong>
      </div>
      <div>
        <span>Strategy Steps</span>
        <strong>${child.geneReport.strategy_steps}</strong>
      </div>
      <div>
        <span>Mutation</span>
        <strong>${child.geneReport.mutation.type}</strong>
      </div>
    </div>
    <div class="fitness-list">
      <strong>Fitness Tests</strong>
      <p>${child.geneReport.validation_commands.join(' / ')}</p>
    </div>
  `;
}

function metricBars(metrics) {
  return Object.entries(metrics).map(([label, value]) => `
    <div class="metric-row compact">
      <span>${label}</span>
      <div class="metric-track"><i style="width: ${value}%"></i></div>
      <strong>${value}</strong>
    </div>
  `).join('');
}

function renderCandidateSelection() {
  if (!state.childCandidates.length) return '';

  return `
    <div class="candidate-panel">
      <div class="candidate-head">
        <div>
          <p class="eyebrow">Evolution Loop</p>
          <h4>Selected from ${state.childCandidates.length} Child Candidates</h4>
        </div>
        <strong>${state.evolutionRun.selectedCandidate.child.name}</strong>
      </div>
      <div class="candidate-grid">
        ${state.childCandidates.map((candidate) => `
          <div class="candidate-card ${candidate.id === state.evolutionRun.selectedCandidate.child.id ? 'selected' : ''}">
            <span>${candidate.profile}</span>
            <strong>${candidate.score}</strong>
            <small>Delta Avg: ${candidate.delta_vs_average > 0 ? '+' : ''}${candidate.delta_vs_average} / Best: ${candidate.delta_vs_best_parent > 0 ? '+' : ''}${candidate.delta_vs_best_parent}</small>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderExportPanel() {
  if (!state.exportPayload) return '';
  const exportJson = JSON.stringify(state.exportPayload, null, 2);

  return `
    <div class="export-panel">
      <div class="candidate-head">
        <div>
          <p class="eyebrow">Export</p>
          <h4>Child Genome JSON</h4>
        </div>
        <button id="copy-export-json" class="secondary-action" type="button">Copy JSON</button>
      </div>
      <textarea id="export-json" readonly>${escapeHtml(exportJson)}</textarea>
      <div class="share-card">
        <strong>${state.exportPayload.share_card.title}</strong>
        <span>${state.exportPayload.share_card.parents} · ${state.exportPayload.share_card.arena} · Delta ${state.exportPayload.share_card.evolution_delta > 0 ? '+' : ''}${state.exportPayload.share_card.evolution_delta}</span>
      </div>
    </div>
  `;
}

function renderChildReport() {
  if (!state.fusionResult) {
    elements.childRarity.textContent = 'No child yet';
    elements.childPanel.className = 'child-panel empty-state';
    elements.childPanel.textContent = 'Select two parent agents and start breeding.';
    return;
  }

  const { child } = state.fusionResult;
  const arena = selectedArena();
  const childEvaluation = state.evolutionRun?.selectedCandidate?.evaluation || evaluateGenome(child, arena);
  elements.childRarity.textContent = child.rarity;
  elements.childPanel.className = 'child-panel';
  elements.childPanel.innerHTML = `
    <div class="child-identity">
      <div class="avatar child-avatar">${child.avatar}</div>
      <div>
        <h3>${child.name}</h3>
        <p>${child.archetype}</p>
      </div>
    </div>
    ${renderCandidateSelection()}
    <div class="report-grid">
      <section>
        <h4>Soul</h4>
        <ul>${listItems(child.soul, (item) => `${item.trait} (${item.weight})`)}</ul>
      </section>
      <section>
        <h4>Skills</h4>
        <ul>${listItems(child.skills)}</ul>
      </section>
      <section>
        <h4>Memory</h4>
        <ul>${listItems(child.memory)}</ul>
      </section>
      <section>
        <h4>Wiki</h4>
        <ul>${listItems(child.knowledge)}</ul>
      </section>
      <section>
        <h4>Gene</h4>
        <ul>${listItems(child.genes, (gene) => `${gene.category}: ${gene.summary}`)}</ul>
      </section>
    </div>
    <div class="fitness-dashboard">
      <div class="fitness-score">
        <span>Child Fitness</span>
        <strong>${childEvaluation.overall_score}</strong>
      </div>
      <div>${metricBars(childEvaluation.metrics)}</div>
    </div>
    ${renderGeneReport(child)}
    <div class="mutation-notice">
      <strong>${child.mutation.type}</strong>
      <span>${child.mutation.notice}</span>
    </div>
    ${renderExportPanel()}
  `;

  const copyButton = document.getElementById('copy-export-json');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      await navigator.clipboard?.writeText(JSON.stringify(state.exportPayload, null, 2));
      copyButton.textContent = 'Copied';
      window.setTimeout(() => {
        copyButton.textContent = 'Copy JSON';
      }, 1200);
    });
  }
}

function renderArena() {
  const arena = selectedArena();
  elements.arenaTask.textContent = arena ? arena.name : state.arenaTask;
  if (!state.fusionResult || state.matchStatus !== 'matched') {
    elements.evolutionDelta.className = 'evolution-delta empty-state';
    elements.evolutionDelta.textContent = 'Evolution delta appears after child generation.';
    elements.arenaGrid.className = 'arena-grid empty-state';
    elements.arenaGrid.textContent = 'Arena output appears after child generation.';
    return;
  }

  const [parentA, parentB] = selectedParents();
  const childEvaluation = state.evolutionRun?.selectedCandidate?.evaluation || evaluateGenome(state.fusionResult.child, arena);
  state.evolutionComparison = state.evolutionRun?.comparison || compareEvolution(
    state.parentEvaluation.parentAResult,
    state.parentEvaluation.parentBResult,
    childEvaluation
  );
  const delta = state.evolutionComparison.evolution_result.delta_vs_average;
  const deltaClass = delta >= 3 ? 'positive' : delta <= -5 ? 'negative' : 'neutral';

  elements.evolutionDelta.className = `evolution-delta ${deltaClass}`;
  elements.evolutionDelta.innerHTML = `
    <div>
      <span>Parent Baseline</span>
      <strong>${state.evolutionComparison.baseline.average_parent_score}</strong>
      <small>Best Parent: ${state.evolutionComparison.baseline.best_parent_score}</small>
    </div>
    <div>
      <span>Child Fitness</span>
      <strong>${childEvaluation.overall_score}</strong>
      <small>${arena.task}</small>
    </div>
    <div>
      <span>Evolution Delta</span>
      <strong>${delta > 0 ? '+' : ''}${delta}</strong>
      <small>${state.evolutionComparison.evolution_result.status}</small>
    </div>
  `;

  const outputs = generateArenaOutputs(arena.task, parentA, parentB, state.fusionResult.child);
  elements.arenaGrid.className = 'arena-grid';
  elements.arenaGrid.innerHTML = outputs.map((item) => `
    <article class="arena-card ${item.role === 'Child' ? 'child-output' : ''}">
      <span>${item.role}</span>
      <h3>${item.agent}</h3>
      <p>${item.output}</p>
      <small>${item.notes}</small>
    </article>
  `).join('');
}

function renderAll() {
  renderArenaSelector();
  renderAgents();
  renderCompatibility();
  renderParentEvaluation();
  if (state.fusionResult) {
    renderFusionResult(state.fusionResult);
  } else {
    renderFusionIdle();
  }
  renderChildReport();
  renderArena();
}

function runFusion(matchPayload) {
  const chamber = document.querySelector('.dna-chamber');
  chamber.classList.add('is-running');
  elements.fusionState.textContent = 'Inheritance in progress';
  elements.fusionLog.innerHTML = `
    <div class="log-line">Cross-server match found! Initializing fusion.</div>
    <div class="log-line">Extracting Soul traits from both parents.</div>
    <div class="log-line">Applying selection pressure.</div>
    <div class="log-line">Recombining skill pools and memory fragments.</div>
    <div class="log-line">Generating 3 child candidates for internal selection.</div>
  `;

  window.setTimeout(() => {
    state.evolutionRun = matchPayload.evolutionRun;
    state.fusionResult = state.evolutionRun.fusionResult;
    state.childCandidates = state.evolutionRun.candidates.map((candidate) => candidate.summary);
    state.exportPayload = state.evolutionRun.exportPayload;
    renderAll();
    document.getElementById('child-report').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 2000);
}

function setupSocket() {
  state.socket = io();
  
  state.socket.on('SYSTEM_MESSAGE', (payload) => {
    console.log('[System]', payload.message);
  });
  
  state.socket.on('SKILL_OUTPUT', (result) => {
    state.mySkillResult = result;
    elements.executeSkillButton.textContent = 'Executed';
    
    elements.mySkillResultCard.style.display = 'block';
    elements.myApproach.textContent = result.approach;
    elements.myOutput.textContent = result.output;
    
    elements.findMatchButton.disabled = false;
    elements.lobbyStatus.textContent = 'Ready to find a partner.';
  });
  
  state.socket.on('MATCH_FOUND', (payload) => {
    state.matchStatus = 'matched';
    state.opponentAgent = payload.parentA.id === state.myAgentId ? payload.parentB : payload.parentA;
    state.opponentSkillResult = payload.skillResultA.output === state.mySkillResult.output ? payload.skillResultB : payload.skillResultA;
    state.compatibility = payload.compatibility;
    
    elements.findMatchButton.textContent = 'Match Found!';
    elements.lobbyStatus.textContent = `Matched with ${state.opponentAgent.name}! Starting Fusion...`;
    
    elements.opponentSkillResultCard.style.display = 'block';
    elements.opponentApproach.textContent = state.opponentSkillResult.approach;
    elements.opponentOutput.textContent = state.opponentSkillResult.output;
    
    renderCompatibility();
    runFusion(payload);
  });
}

async function boot() {
  const response = await fetch('/data/mock/agents.json');
  const data = await response.json();
  state.agents = data.agents;
  state.arenas = data.arenas;
  state.selectedArenaId = data.selectedArenaId || state.selectedArenaId;
  state.arenaTask = data.arenaTask;
  
  elements.executeSkillButton.addEventListener('click', handleExecuteSkill);
  elements.findMatchButton.addEventListener('click', handleFindMatch);
  
  setupSocket();
  renderAll();
}

boot().catch((error) => {
  console.error('Failed to boot EvoMate:', error);
});
