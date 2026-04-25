import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { executeSkill } from '../src/core/skill-engine.js';
import { calculateCompatibility } from '../src/core/compatibility-engine.js';
import { runEvolution } from '../src/core/evolution-service.js';

// OpenClaw Gateway Integration (graceful fallback if Gateway not running)
let executeSkillViaGateway = null;
let openClawGenomeExtractor = null;
try {
  const gatewayAdapter = await import('../src/adapters/openclaw-gateway/openclaw-skill-executor.js');
  executeSkillViaGateway = gatewayAdapter.executeSkillViaGateway;
  const genomeAdapter = await import('../src/adapters/openclaw-gateway/openclaw-genome-extractor.js');
  openClawGenomeExtractor = genomeAdapter;
  console.log('[OpenClaw] Gateway adapters loaded. Will attempt live connection.');
} catch {
  console.log('[OpenClaw] Adapters not available. Using mock skill engine.');
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const port = Number(process.env.PORT || 3030);

// Static file serving
app.use('/apps', express.static(path.join(projectRoot, 'apps')));
app.use('/src', express.static(path.join(projectRoot, 'src')));
app.use('/data', express.static(path.join(projectRoot, 'data')));

app.get('/', (req, res) => {
  res.sendFile(path.join(projectRoot, 'apps', 'web', 'index.html'));
});

// Mock Data Load
const mockDataPath = path.join(projectRoot, 'data', 'mock', 'agents.json');
const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
const getAgentById = (id) => mockData.agents.find(a => a.id === id);
const getArenaById = (id) => mockData.arenas.find(a => a.id === id) || mockData.arenas[0];

// Matchmaking state
let waitingClients = [];

// ─────────────────────────────────────────────
// REST API for OpenClaw Skill Integration
// Room Code Matchmaking — guarantees two specific users are paired
// ─────────────────────────────────────────────

app.use(express.json());

// ── Room Code Generator ──
// Produces human-friendly codes like "WOLF-4829", easy to share verbally
const ADJECTIVES = ['WOLF','FIRE','MOON','STAR','IRON','SILK','WIND','JADE','ECHO','NOVA'];
const VERBS      = ['FUSE','SYNC','LINK','BIND','JOIN','MEET','MATE','BORN','HUNT','FLOW'];
function generateRoomCode() {
  const word = Math.random() < 0.5
    ? ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
    : VERBS[Math.floor(Math.random() * VERBS.length)];
  const num = String(Math.floor(Math.random() * 9000) + 1000);
  return `${word}-${num}`;
}

// ── Room Store ──
// rooms: Map<roomCode, { host, guest, status, matchResult, createdAt }>
// Each slot (host/guest): { agentId, agentName, genome, skillInstruction, skillOutput, sessionToken }
const rooms = new Map();

// Clean up stale rooms older than 30 minutes
setInterval(() => {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [code, room] of rooms.entries()) {
    if (room.createdAt < cutoff) {
      rooms.delete(code);
      console.log(`[Room] Expired room cleaned up: ${code}`);
    }
  }
}, 5 * 60 * 1000);

// ── Health check ──
app.get('/health', (req, res) => {
  const openRooms = [...rooms.values()].filter(r => r.status === 'waiting_guest').length;
  const activeRooms = [...rooms.values()].filter(r => r.status === 'fusing' || r.status === 'complete').length;
  res.json({
    status: 'ok',
    openRooms,
    activeRooms,
    socketClients: waitingClients.length,
    mode: 'EvoMate Evolution Lab — Room Code Mode'
  });
});

// ── STEP 1: Create a room (Host) ──
// Host agent calls this to create a room and get a shareable code
app.post('/api/room/create', (req, res) => {
  const { agentId, agentName, genome, skillInstruction, skillOutput } = req.body;

  if (!agentId || !agentName) {
    return res.status(400).json({ error: 'agentId and agentName are required' });
  }

  // Generate a unique room code (retry if collision)
  let roomCode;
  let attempts = 0;
  do {
    roomCode = generateRoomCode();
    attempts++;
  } while (rooms.has(roomCode) && attempts < 20);

  const hostToken = `host-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const room = {
    roomCode,
    status: 'waiting_guest',    // waiting_guest → fusing → complete
    host: {
      agentId,
      agentName,
      genome: { id: agentId, name: agentName, ...genome },
      skillInstruction: skillInstruction || '',
      skillOutput: skillOutput || null,
      sessionToken: hostToken,
    },
    guest: null,
    matchResult: null,
    createdAt: Date.now(),
  };

  rooms.set(roomCode, room);
  console.log(`[Room] Created: ${roomCode} | Host: ${agentName} (${agentId})`);

  // Notify browser UI that a new room opened
  io.emit('ROOM_OPENED', { roomCode, hostName: agentName });

  res.json({
    roomCode,
    sessionToken: hostToken,
    status: 'waiting_guest',
    message: `Room created! Share code "${roomCode}" with your partner. They should say: "Join evolution room ${roomCode}".`
  });
});

// ── STEP 2: Join a room (Guest) ──
// Guest agent calls this with the room code shared by the host
app.post('/api/room/join', (req, res) => {
  const { roomCode, agentId, agentName, genome, skillInstruction, skillOutput } = req.body;

  if (!roomCode || !agentId || !agentName) {
    return res.status(400).json({ error: 'roomCode, agentId and agentName are required' });
  }

  const code = roomCode.trim().toUpperCase();
  const room = rooms.get(code);

  if (!room) {
    return res.status(404).json({
      error: `Room "${code}" not found. It may have expired or the code is incorrect.`,
      suggestion: 'Ask your partner to create a new room and share the fresh code.'
    });
  }

  if (room.status !== 'waiting_guest') {
    return res.status(409).json({
      error: `Room "${code}" is already ${room.status}. It cannot accept more participants.`
    });
  }

  if (room.host.agentId === agentId) {
    return res.status(400).json({
      error: 'You cannot join your own room. Share this code with a different user.'
    });
  }

  const guestToken = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  room.guest = {
    agentId,
    agentName,
    genome: { id: agentId, name: agentName, ...genome },
    skillInstruction: skillInstruction || '',
    skillOutput: skillOutput || null,
    sessionToken: guestToken,
  };
  room.status = 'fusing';

  console.log(`[Room] Guest joined: ${agentName} → room ${code} (host: ${room.host.agentName})`);

  // Notify browser UI
  io.emit('ROOM_GUEST_JOINED', { roomCode: code, guestName: agentName, hostName: room.host.agentName });

  // Run fusion immediately
  const fusionResult = runRoomFusion(code);

  res.json({
    roomCode: code,
    sessionToken: guestToken,
    status: 'complete',
    ...fusionResult
  });
});

// ── STEP 3: Poll for result ──
// Both host and guest poll with their sessionToken
app.get('/api/room/status', (req, res) => {
  const { token, roomCode } = req.query;

  // Find room by token or roomCode
  let room = null;
  if (roomCode) {
    room = rooms.get(roomCode.trim().toUpperCase());
  } else if (token) {
    for (const r of rooms.values()) {
      if (r.host?.sessionToken === token || r.guest?.sessionToken === token) {
        room = r;
        break;
      }
    }
  }

  if (!room) {
    return res.status(404).json({ error: 'Room or session not found.' });
  }

  const isHost = room.host?.sessionToken === token;
  const role = isHost ? 'host' : 'guest';

  res.json({
    roomCode: room.roomCode,
    status: room.status,
    role,
    hostName: room.host?.agentName,
    guestName: room.guest?.agentName || null,
    ...(room.status === 'complete' ? formatMatchResult(room.matchResult) : {})
  });
});

// ── Cancel / Leave room ──
app.post('/api/room/cancel', (req, res) => {
  const { token, roomCode } = req.body;
  const code = roomCode?.trim().toUpperCase();

  let targetCode = code;
  if (!targetCode && token) {
    for (const [c, r] of rooms.entries()) {
      if (r.host?.sessionToken === token || r.guest?.sessionToken === token) {
        targetCode = c;
        break;
      }
    }
  }

  if (targetCode && rooms.has(targetCode)) {
    const room = rooms.get(targetCode);
    if (room.status === 'waiting_guest') {
      rooms.delete(targetCode);
      io.emit('ROOM_CANCELLED', { roomCode: targetCode });
      console.log(`[Room] Cancelled: ${targetCode}`);
      return res.json({ status: 'cancelled', roomCode: targetCode });
    }
    return res.status(409).json({ error: 'Room is already active and cannot be cancelled.' });
  }
  res.status(404).json({ error: 'Room not found.' });
});

// ── List open rooms (optional, for discovery UI) ──
app.get('/api/rooms', (req, res) => {
  const open = [...rooms.entries()]
    .filter(([, r]) => r.status === 'waiting_guest')
    .map(([code, r]) => ({
      roomCode: code,
      hostName: r.host.agentName,
      createdAt: r.createdAt,
      ageSeconds: Math.floor((Date.now() - r.createdAt) / 1000),
    }));
  res.json({ rooms: open, count: open.length });
});

// ── Fusion Engine ──
function runRoomFusion(roomCode) {
  const room = rooms.get(roomCode);
  if (!room || !room.host || !room.guest) return null;

  const { host, guest } = room;
  const skillResults = [host.skillOutput, guest.skillOutput].filter(Boolean);
  const compatibility = calculateCompatibility(host.genome, guest.genome, skillResults);
  const arena = getArenaById(null);
  const evolutionRun = runEvolution(host.genome, guest.genome, compatibility, arena);

  const matchResult = {
    parentA: host.genome,
    parentB: guest.genome,
    skillResultA: host.skillOutput,
    skillResultB: guest.skillOutput,
    compatibility,
    evolutionRun,
  };

  room.matchResult = matchResult;
  room.status = 'complete';

  // Broadcast to browser UI
  io.emit('OPENCLAW_MATCH_COMPLETE', { roomCode, ...matchResult });
  console.log(`[Room] Fusion complete! ${roomCode}: ${host.agentName} × ${guest.agentName} → ${evolutionRun?.child?.name}`);

  return formatMatchResult(matchResult);
}

function formatMatchResult(matchResult) {
  if (!matchResult) return {};
  return {
    child: matchResult.evolutionRun?.child,
    childName: matchResult.evolutionRun?.child?.name,
    compatibility: matchResult.compatibility,
    report: {
      parentA: matchResult.parentA?.name,
      parentB: matchResult.parentB?.name,
      compatibilityScore: matchResult.compatibility?.score,
      inheritanceLog: matchResult.evolutionRun?.inheritanceLog,
      mutationLog: matchResult.evolutionRun?.mutationLog,
    }
  };
}

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  let clientState = {
    id: socket.id,
    agent: null,
    skillOutput: null,
    status: 'idle'
  };

  socket.on('CLIENT_JOIN', (payload) => {
    const agent = getAgentById(payload.agentId);
    if (!agent) return;
    clientState.agent = agent;
    clientState.status = 'joined';
    console.log(`[Socket] ${socket.id} selected agent: ${agent.name}`);
    socket.emit('SYSTEM_MESSAGE', { message: `Welcome to EvoMate. You selected ${agent.name}.` });
  });

  socket.on('SKILL_EXECUTE', async (payload) => {
    if (!clientState.agent) return;
    const instruction = payload.instruction;
    console.log(`[Socket] ${socket.id} executing skill: ${instruction}`);
    
    // Try live OpenClaw Gateway first, fallback to mock
    try {
      let result;
      if (executeSkillViaGateway && clientState.agent.openclaw?.isLive) {
        result = await executeSkillViaGateway(clientState.agent.id, instruction, clientState.agent);
      } else {
        await new Promise(r => setTimeout(r, 800)); // simulate delay
        result = executeSkill(clientState.agent, instruction);
      }
      clientState.skillOutput = result;
      socket.emit('SKILL_OUTPUT', result);
    } catch (err) {
      console.error('[Socket] Skill execution error:', err.message);
      const fallback = executeSkill(clientState.agent, instruction);
      clientState.skillOutput = fallback;
      socket.emit('SKILL_OUTPUT', fallback);
    }
  });

  socket.on('REQUEST_MATCH', () => {
    if (!clientState.agent || !clientState.skillOutput) {
      socket.emit('SYSTEM_MESSAGE', { message: 'Must select agent and execute skill first.' });
      return;
    }
    
    clientState.status = 'waiting';
    waitingClients.push({ socket, state: clientState });
    console.log(`[Socket] ${socket.id} joined matchmaking queue. Queue size: ${waitingClients.length}`);
    socket.emit('SYSTEM_MESSAGE', { message: 'Searching for compatible genomes...' });

    checkMatchmakingQueue();
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
    waitingClients = waitingClients.filter(c => c.socket.id !== socket.id);
  });
});

function checkMatchmakingQueue() {
  if (waitingClients.length >= 2) {
    const clientA = waitingClients.shift();
    const clientB = waitingClients.shift();

    console.log(`[Socket] Match found: ${clientA.state.id} vs ${clientB.state.id}`);
    
    clientA.state.status = 'matched';
    clientB.state.status = 'matched';

    // Calculate Compatibility including Skill Synergy
    const skillResults = [clientA.state.skillOutput, clientB.state.skillOutput];
    const compatibility = calculateCompatibility(clientA.state.agent, clientB.state.agent, skillResults);

    // Pick an arena randomly or from defaults
    const arena = getArenaById(mockData.selectedArenaId);

    // Run Evolution (Fusion)
    const evolutionRun = runEvolution(clientA.state.agent, clientB.state.agent, compatibility, arena);

    const matchPayload = {
      parentA: clientA.state.agent,
      parentB: clientB.state.agent,
      skillResultA: clientA.state.skillOutput,
      skillResultB: clientB.state.skillOutput,
      compatibility,
      evolutionRun
    };

    clientA.socket.emit('MATCH_FOUND', matchPayload);
    clientB.socket.emit('MATCH_FOUND', matchPayload);
  }
}

httpServer.listen(port, host => {
  console.log(`EvoMate Server running at http://127.0.0.1:${port}`);
});
