/**
 * openclaw-genome-extractor.js
 * 从真实 OpenClaw Gateway 中，读取 Agent 的 Bootstrap Files / Skills / Sessions
 * 并将其转换为 EvoMate 所用的 AgentGenome 格式
 */

import path from 'path';
import fs from 'fs';
import os from 'os';

const OPENCLAW_STATE_DIR = process.env.OPENCLAW_STATE_DIR || path.join(os.homedir(), '.openclaw');

/**
 * 读取 Agent 的本地 workspace bootstrap 文件（SOUL.md, AGENTS.md 等）
 * 这适用于无需 Gateway 连接的本地文件读取
 */
export function readAgentBootstrapFiles(agentId) {
  const agentDir = path.join(OPENCLAW_STATE_DIR, 'agents', agentId);
  const files = {};
  const targets = ['SOUL.md', 'AGENTS.md', 'IDENTITY.md', 'TOOLS.md', 'BOOTSTRAP.md'];

  for (const filename of targets) {
    const filePath = path.join(agentDir, filename);
    try {
      files[filename] = fs.readFileSync(filePath, 'utf8');
    } catch {
      files[filename] = null;
    }
  }

  return files;
}

/**
 * 从 Gateway extractGenome 的结果，再加上本地文件，
 * 拼装成 EvoMate AgentGenome 格式
 */
export function buildEvoMateGenomeFromGateway(agentId, gatewayGenome, bootstrapFiles) {
  const soulContent = bootstrapFiles?.['SOUL.md'] ?? '';
  const agentsContent = bootstrapFiles?.['AGENTS.md'] ?? '';

  // 从 SOUL.md 中提取 trait（简单启发式：找到列表项）
  const traits = extractTraitsFromMarkdown(soulContent);

  // 技能列表
  const skills = (gatewayGenome?.skills ?? []).map(s => s.id || s.name || String(s)).filter(Boolean);

  // 雷达分数（从 identity 推导，如果 Gateway 没有就用默认值）
  const radar = deriveRadarFromBootstrap(soulContent, agentsContent);

  return {
    id: agentId,
    name: gatewayGenome?.identity?.name ?? agentId,
    archetype: extractArchetypeFromBootstrap(agentsContent) ?? 'OpenClaw Agent',
    source: 'openclaw-gateway',
    avatar: '🤖',
    rarity: 'Live Agent',
    soul: traits.map(t => ({ trait: t, weight: Math.floor(Math.random() * 40) + 60 })),
    skills: skills.length > 0 ? skills : ['conversation', 'analysis', 'reasoning'],
    memory: extractMemoryFragments(agentsContent),
    knowledge: ['OpenClaw Runtime', 'Live Session Data'],
    radar,
    genes: [],
    // 附加元数据，表明来自真实 OpenClaw Gateway
    openclaw: {
      agentId,
      sessionCount: gatewayGenome?.recentSessionCount ?? 0,
      extractedAt: gatewayGenome?.extractedAt,
      isLive: true,
    }
  };
}

function extractTraitsFromMarkdown(content) {
  if (!content) return ['analytical', 'helpful', 'precise'];
  const listItems = content.match(/^[-*]\s+(.+)$/gm) ?? [];
  const traits = listItems
    .map(item => item.replace(/^[-*]\s+/, '').toLowerCase().trim())
    .filter(t => t.length > 2 && t.length < 30)
    .slice(0, 6);
  return traits.length > 0 ? traits : ['analytical', 'helpful', 'precise'];
}

function extractArchetypeFromBootstrap(content) {
  if (!content) return null;
  const match = content.match(/archetype[:\s]+([^\n]+)/i);
  return match ? match[1].trim() : null;
}

function extractMemoryFragments(content) {
  if (!content) return ['Live session data loaded from OpenClaw Gateway.'];
  const lines = content.split('\n').filter(l => l.trim().length > 10).slice(0, 3);
  return lines.length > 0 ? lines.map(l => l.trim()) : ['Active OpenClaw agent with live session memory.'];
}

function deriveRadarFromBootstrap(soulContent, agentsContent) {
  const combined = `${soulContent} ${agentsContent}`.toLowerCase();
  return {
    logic: scoreKeywords(combined, ['logic', 'reason', 'analysis', 'systematic', 'structured']),
    creativity: scoreKeywords(combined, ['creative', 'novel', 'imaginative', 'innovative', 'design']),
    autonomy: scoreKeywords(combined, ['autonomous', 'proactive', 'independent', 'initiative']),
    risk: scoreKeywords(combined, ['careful', 'safe', 'conservative', 'cautious', 'review']),
    social: scoreKeywords(combined, ['empathy', 'collaborative', 'communication', 'support']),
    focus: scoreKeywords(combined, ['focused', 'precise', 'detail', 'thorough', 'meticulous']),
  };
}

function scoreKeywords(text, keywords) {
  const matches = keywords.filter(k => text.includes(k)).length;
  return Math.min(95, 50 + matches * 10);
}
