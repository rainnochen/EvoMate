# Agent Evolver MVP

This module implements a practical agent evolver pipeline:

1. Parse two parent `agent.md` files into structured `agentGene`.
2. Run compatibility checks.
3. Execute role-aligned workflow crossover and conservative policy merge.
4. Apply repair-oriented mutations.
5. Render child markdown agent.
6. Run static evaluation and optional task evaluation.
7. Save child artifacts, lineage, mutation record, and evaluation record.

Run:

```bash
cd agent-evolver
npm run evolve
```

Outputs are written to:

- `outputs/children/`
- `outputs/genes/`
- `outputs/lineage/`
- `outputs/evaluations/`

