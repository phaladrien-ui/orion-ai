<a href="#">
  <img alt="Neural OS" src="app/(chat)/opengraph-image.png">
  <h1 align="center">Neural OS | Infrastructure Management</h1>
</a>

<p align="center">
    Orchestration system for the deployment and management of hybrid divisions (AI + Human).
    This software enables the structuring, recruitment, and steering of specialized operational units operating on a multi-agent communication bus.
</p>

<p align="center">
  <a href="#technical-architecture"><strong>Architecture</strong></a> ·
  <a href="#operational-features"><strong>Features</strong></a> ·
  <a href="#workflow"><strong>Workflow</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## 🏗 Technical Architecture

### 1. The Communication Bus (Neural Bus)
Synchronization protocol between specialized agent instances.
- **Actionable Object Exchange:** Structured communication (JSON) between Strategy (CEO) and Execution (CTO/CMO) hubs.
- **Context Graph Synchronization:** Unified graph database ensuring that any technical modification (Tech Division) is immediately reflected in the operational strategy (Ops Division).
- **Conflict Arbitration:** Automatic resolution loop between agents prior to human validation (e.g., security validation vs. deployment speed).

### 2. Division Management (Hybrid Squads)
Autonomous units composed of synthetic resources and human oversight.
- **Vertical Recruitment:** Deployment of agents trained on specific datasets (Code Audit, Growth, Legal).
- **Human Lead Integration:** Interface for recruiting external experts to steer agent squads on high-responsibility tasks.
- **Experience Engine (XP):** Success/failure log storage system in local Vector Stores. Agents accumulate contextual memory for each validated task.

### 3. Resource Lifecycle
Direct workforce management interface.
- **Provisioning (Hire):** Immediate instantiation of an agent or human expert within the sidebar.
- **Promotion / Allocation:** Extension of computing power and context access for high-performing agents.
- **De-provisioning (Fire):** Instance removal and automatic cleanup of associated data storage.

## 🛠 Operational Features

| Feature | Technical Description |
| :--- | :--- |
| **Neural Activity Stream** | Real-time "thinking logs" and inter-agent exchange feeds via WebSockets. |
| **Filesystem Access** | Direct read/write capabilities on the code repository for the CTO agent. |
| **Deployment Triggers** | Triggering of CI/CD builds upon division lead validation. |
| **Resource Monitor** | Tracking of token consumption and CPU load per department. |
| **API Connectors** | Native integration with GitHub, Stripe, AWS, and Ads Managers for direct execution. |

## 📊 Workflow

1. **Directive:** Definition of an objective in the command hub.
2. **Decomposition:** The Bus segments the objective into tasks for relevant divisions.
3. **Parallel Execution:** Simultaneous agent work (e.g., code authoring and security auditing).
4. **Validation:** Breakpoint for approval by the department's human lead.
5. **Archiving:** Output indexing in the system's long-term memory.

## Running locally

```bash
pnpm install
pnpm db:setup
pnpm dev