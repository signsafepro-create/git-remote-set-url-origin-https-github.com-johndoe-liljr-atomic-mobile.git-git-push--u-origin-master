LIL JR COLLECTIVE - ONE BRAIN HANDOFF

Version: 1.0
Date: 2026-04-17
Owner: Architect

PURPOSE
Build one unified learning organism where every user can learn, teach, and improve the whole network.
The platform is not separate tools. It is one system:
- Learners ask
- Peers teach
- AI adapts explanations
- Teachers guide strategy
- The system gets better after every interaction

CORE PRINCIPLES
1) Everyone is both learner and teacher.
2) The AI is a connector and accelerator, not a replacement for people.
3) Every interaction must improve future outcomes.
4) Safety, trust, and measurable learning gains are mandatory.
5) Real-world skill transfer is the final success metric.

UNIFIED SYSTEM ARCHITECTURE

A) EXPERIENCE LAYER
- Mobile app (students, mentors)
- Web dashboard (teachers, admins)
- QR entry points (classroom, events, campuses)

B) INTELLIGENCE LAYER
- Conversation engine (AI tutor)
- Peer matching engine (who can help who)
- Group orchestration engine (auto study circles)
- Learning memory engine (what worked, for whom, in what context)
- Emotional support engine (confidence/stress aware nudges)

C) OPERATIONS LAYER
- Billing and subscriptions (tiered access)
- Institution analytics and alerts
- Moderation and abuse prevention
- Audit logs and governance

D) DATA LAYER
- User profiles and skill graph
- Topic mastery timeline
- Teaching contribution records
- Session outcomes and reflection history

SINGLE LOOP THAT MAKES THE ORGANISM ALIVE
1) User asks for help on topic T.
2) AI gives a first explanation in user style.
3) System checks confidence and confusion score.
4) If needed, system matches 1-3 peers with proven help quality on T.
5) Group session happens; AI facilitates, tracks what methods worked.
6) Outcomes are recorded: understanding delta, time to clarity, confidence delta.
7) The memory engine updates best strategies by topic + learner profile.
8) Next learner gets a better response from the start.

SYSTEM OBJECTS (MINIMUM)
- User: id, role, tier, skills[], learningStyle, confidence, contributionScore
- Topic: id, name, prerequisites[], difficulty
- Interaction: id, userId, topicId, intent, messages[], outcome
- Match: id, topicId, requesterId, helperIds[], qualityScore
- Outcome: understandingBefore, understandingAfter, confidenceBefore, confidenceAfter
- MemoryPattern: topicId, learnerType, method, effectivenessScore

API CONTRACT (MVP)
POST /chat
- input: { userId, message, topicId?, context? }
- output: { reply, confidenceEstimate, suggestedNextStep }

POST /match
- input: { userId, topicId, target: "peer"|"group" }
- output: { matchId, helpers[], reason }

POST /session/close
- input: { sessionId, userId, understandingBefore, understandingAfter, notes }
- output: { impact, rewards, memoryUpdated }

POST /teach
- input: { teacherId, learnerId, topicId, method }
- output: { contributionPoints, rankProgress }

GET /organism/health
- output: { uptime, activeUsers, activeGroups, avgLearningGain, safetyStatus }

MOBILE APP SECTIONS
- Learn: ask questions, get explanations, request peer help
- Teach: accept help requests, run mini tutoring sessions
- Connect: active group rooms and study circles
- Me: progress, contribution score, streaks, tier status

ADMIN DASHBOARD SECTIONS
- Live learning map: topic bottlenecks
- At-risk learner alerts
- Teaching contribution leaderboard
- Group effectiveness analytics
- Revenue and subscription metrics

RANKING AND REWARDS
- Users earn points for learning consistency and verified teaching impact.
- Teaching impact is weighted by learner improvement, not message count.
- Reduced subscription pricing can be unlocked by real contribution.

SAFETY AND TRUST RULES
- No unsafe content, harassment, or targeted abuse.
- Sessions are rate-limited and moderated.
- Instructor override always available.
- Audit trail for institution admins.


DEPLOYMENT TARGETS
- Standalone Python app (serves API and frontend)
- Database: Postgres
- Cache/queues: Redis (optional for scale)

ENVIRONMENT VARIABLES (MINIMUM)
- GROQ_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- DATABASE_URL
- JWT_SECRET
- NODE_ENV

DEFINITION OF DONE (100%)
1) Functional
- Chat works with AI responses.
- Peer matching works for at least one subject.
- Session close writes outcomes to database.
- Dashboard shows live stats.
- Subscriptions activate and store tier.

2) Quality
- P95 API latency under 1200ms for /chat.
- Crash-free mobile sessions >= 99%.
- No critical security findings.
- Basic automated test suite passes.

3) Learning Impact
- Average understanding gain per completed session is positive.
- Repeat help requests on same topic trend downward over time.
- Peer teaching satisfaction score above target.

IMPLEMENTATION PHASES

PHASE 1: CORE ORGANS (Week 1-2)
- Build /chat, /match, /session/close
- Persist users, topics, outcomes
- Ship mobile Learn screen

PHASE 2: COLLECTIVE INTELLIGENCE (Week 3-4)
- Add teaching flow and contribution scores
- Add group matching logic
- Add memory pattern ranking

PHASE 3: INSTITUTION MODE (Week 5-6)
- Admin dashboard, analytics, alerts
- Stripe tier activation and webhooks
- Role and permission controls

PHASE 4: WORLD READY (Week 7+)
- QR campaign funnel
- Cohort onboarding playbooks
- A/B test matching and explanation styles


WINDOWS FIRST STARTUP COMMANDS
From project root:
1) pip install -r requirements.txt
2) python server.py  (or: uvicorn server:app --host 0.0.0.0 --port 8000)

CHECKLIST FOR AGENT HANDOFF
- Confirm environment tools: node, npm, git
- Confirm backend starts and health endpoint responds
- Confirm mobile connects to backend URL
- Confirm one full loop: ask -> match -> close session -> memory update
- Confirm billing webhook flow in test mode
- Confirm daily analytics export

NON-NEGOTIABLE SUCCESS STATEMENT
This system wins only when people become better thinkers in real life:
- stronger problem solving
- stronger communication
- stronger collaboration
- stronger confidence under pressure

If those four rise together, the organism is working.
