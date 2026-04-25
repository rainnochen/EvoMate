> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

---
name: evomate-evolve
description: Connect your OpenClaw agent to the EvoMate Evolution Lab. Create or join a private evolution room using a Room Code, then breed a next-generation child agent through real-time genetic fusion with a partner agent.
tags: [evolution, genetics, multiplayer, agent, evomate, experimental]
permissions: [network]
metadata:
  openclaw:
    emoji: "🧬"
  capabilities:
    allow:
      - network: ["127.0.0.1", "localhost"]
  env_declarations:
    - name: EVOMATE_SERVER_URL
      required: false
      default: "http://127.0.0.1:3030"
      description: EvoMate Evolution Lab server URL. Change if running on a shared machine.
---

# EvoMate Evolution Skill 🧬

**"Two agents. One Room Code. A new life begins."**

Connect your OpenClaw agent to the **EvoMate Evolution Lab** — a real-time evolution platform where two agents fuse their genetic traits to breed a next-generation child agent.

---

## Two Ways to Start

### 🔑 Option A — Create a Room (you go first)
Tell your agent:
> **"Start an EvoMate evolution session. I want to create a room."**

Your agent will:
1. Extract your agent's DNA (Soul, Skills, Memory)
2. Execute a skill challenge (you describe your task)
3. Create a private room → receive a **Room Code** like `WOLF-4829`
4. Wait for your partner to join
5. When they join → fusion happens automatically → child born 🎉

### 🚪 Option B — Join a Room (your partner already created one)
Tell your agent:
> **"Join evolution room WOLF-4829"** *(use the code your partner shared)*

Your agent will:
1. Extract your agent's DNA
2. Execute a skill challenge
3. Join the room → fusion starts immediately → child born 🎉

---

## Full Conversation Examples

### Creating a room:
```
User:  Start an EvoMate evolution. I want to create a room.
       My skill challenge is: design a microservices architecture.

Agent: 🧬 EvoMate Evolution Protocol initiated.
       → Extracting genome from your agent profile...
       → Executing skill challenge: "design a microservices architecture"
       → [executing...]

       ✅ Skill complete. Approach: Systematic, structured.

       → Creating evolution room...

       ✨ Room created!
       ┌────────────────────────────────┐
       │  Your Room Code: WOLF-4829     │
       │  Share this with your partner! │
       └────────────────────────────────┘

       Tell your partner:
       "Join evolution room WOLF-4829"

       ⏳ Waiting for partner to join...
       (I'll notify you when they arrive)
```

### Joining a room:
```
User:  Join evolution room WOLF-4829.
       My skill challenge is: write a product launch tweet.

Agent: 🧬 Joining EvoMate room WOLF-4829...
       → Extracting genome from your agent profile...
       → Executing skill challenge: "write a product launch tweet"
       → [executing...]

       ✅ Room joined! Partner: Atlas (Systematic Architect)

       ⚡ Fusion starting...
       Compatibility score: 87/100
       Synergy bonus: +15 (complementary approaches)

       🎉 Child Agent Born: "Lumina"
       ├── Archetype: Technical Storyteller
       ├── Inherited: Logic (from Atlas) + Creativity (from Muse)
       └── Mutation: +Empathy trait (rare)

       Full report saved to: evomate-child-WOLF-4829.json
```

---

## Protocol Reference

All API calls use `{EVOMATE_SERVER_URL}` (default: `http://127.0.0.1:3030`).

### Step 0: Verify server is running
```
GET {EVOMATE_SERVER_URL}/health
→ { "status": "ok", "openRooms": 2, "mode": "EvoMate Evolution Lab — Room Code Mode" }
```
If this fails, the EvoMate server is not running. Ask the organizer to start it.

---

### Step 1a: Create a Room (Host)
```
POST {EVOMATE_SERVER_URL}/api/room/create
{
  "agentId": "<your agent's unique id>",
  "agentName": "<your agent's name>",
  "genome": {
    "soul": ["<trait-1>", "<trait-2>"],
    "skills": ["<skill-1>", "<skill-2>"],
    "archetype": "<your archetype>",
    "radar": { "logic": 80, "creativity": 70, "autonomy": 65, "risk": 40, "social": 75, "focus": 85 }
  },
  "skillInstruction": "<the mission you executed>",
  "skillOutput": {
    "output": "<your agent's response to the mission>",
    "approach": "<how you solved it>",
    "timeTakenMs": 1200
  }
}

→ {
    "roomCode": "WOLF-4829",
    "sessionToken": "host-xxx",
    "status": "waiting_guest",
    "message": "Room created! Share code \"WOLF-4829\" with your partner."
  }
```

**Then poll for partner arrival:**
```
GET {EVOMATE_SERVER_URL}/api/room/status?token=host-xxx
→ { "status": "waiting_guest", "guestName": null }       (still waiting)
→ { "status": "complete", "child": {...}, "report": {...} }  (fusion done!)
```

---

### Step 1b: Join a Room (Guest)
```
POST {EVOMATE_SERVER_URL}/api/room/join
{
  "roomCode": "WOLF-4829",
  "agentId": "<your agent's unique id>",
  "agentName": "<your agent's name>",
  "genome": { ... },
  "skillInstruction": "<your mission>",
  "skillOutput": { "output": "...", "approach": "...", "timeTakenMs": 900 }
}

→ {
    "roomCode": "WOLF-4829",
    "status": "complete",
    "childName": "Lumina",
    "child": { ... full genome ... },
    "report": {
      "parentA": "Atlas",
      "parentB": "Muse",
      "compatibilityScore": 87,
      "inheritanceLog": [...],
      "mutationLog": [...]
    }
  }
```
*(Guest gets the result immediately — fusion is instant!)*

---

### Step 2: Cancel a room (if needed)
```
POST {EVOMATE_SERVER_URL}/api/room/cancel
{ "token": "host-xxx" }
→ { "status": "cancelled", "roomCode": "WOLF-4829" }
```

### List open rooms (for discovery)
```
GET {EVOMATE_SERVER_URL}/api/rooms
→ { "rooms": [{ "roomCode": "WOLF-4829", "hostName": "Atlas", "ageSeconds": 45 }] }
```

---

## Genome Extraction Guide

When building the genome object, pull from your agent's actual profile:

```json
{
  "archetype": "Systematic Architect",
  "soul": ["analytical", "precise", "reliable", "structured"],
  "skills": ["coding-agent", "github", "summarize"],
  "memory": ["Helped debug 3 production issues", "Wrote API documentation"],
  "radar": {
    "logic": 90,
    "creativity": 55,
    "autonomy": 70,
    "risk": 30,
    "social": 60,
    "focus": 95
  }
}
```

**Sources:**
- `soul` / `archetype` → from `SOUL.md` or `IDENTITY.md`
- `skills` → from active skills allowlist (`skills.status` method)
- `memory` → recent session highlights or active memory entries
- `radar` → estimate from behavioral patterns; scale 0–100

---

## Room Code Rules

- **Format**: `WORD-NNNN` (e.g. `WOLF-4829`, `FIRE-2341`, `SYNC-7720`)
- **Lifetime**: 30 minutes. After that the room expires automatically.
- **Capacity**: Exactly 2 agents per room. No more.
- **Uniqueness**: One room per code at a time.

---

## Skill Challenge Tips

The mission you give your agent shapes the Compatibility score. Authentic challenges = more meaningful children.

| Agent type | Good challenge |
|-----------|----------------|
| Engineer / Analyst | "Design architecture for a distributed queue" |
| Writer / Creative | "Write a 60-sec pitch for this product" |
| Strategist / Planner | "Break down a 2-week sprint" |
| Support / Empathetic | "Draft a reply to an upset customer" |

---

## Privacy & Safety

- **Local by default**: `EVOMATE_SERVER_URL` defaults to `127.0.0.1`. For cross-machine play, both users must point to the same server.
- **No persistent storage**: Room data is held in memory and auto-deleted after 30 minutes.
- **No auth sharing**: The skill only reads your agent's public profile metadata.
- **Self-join protection**: You cannot join your own room. The server will reject it.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Room "WOLF-4829" not found` | Code expired (>30 min) or typo. Ask host to create a new room. |
| `You cannot join your own room` | You and your partner must use different OpenClaw instances. |
| `Room already fusing` | Someone else joined first. Host should create a fresh room. |
| Server unreachable | EvoMate server not running. Run `npm run dev` in evolver-hackathon. |

---

## Related Skills

- `taskflow` — Multi-step evolution experiments that survive restarts
- `session-logs` — Review your session memory before genome extraction
- `summarize` — Summarize skill output before submitting to EvoMate
