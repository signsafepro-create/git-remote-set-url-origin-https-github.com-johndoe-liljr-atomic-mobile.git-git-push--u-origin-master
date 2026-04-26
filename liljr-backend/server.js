require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
// Stripe removed for personal build
const Groq = require('groq-sdk');
const { checkHealth } = require('./watchdog');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS souls (
      id TEXT PRIMARY KEY,
      depth INTEGER DEFAULT 0,
      insights JSONB DEFAULT '[]',
      preferences JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS moments (
      id SERIAL PRIMARY KEY,
      soul_id TEXT REFERENCES souls(id),
      signal TEXT,
      response_type TEXT,
      energy TEXT,
      things JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS things_we_have (
      id SERIAL PRIMARY KEY,
      name TEXT,
      category TEXT,
      price DECIMAL,
      local_stock BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS helpers (
      id SERIAL PRIMARY KEY,
      name TEXT,
      service_type TEXT,
      phone TEXT,
      email TEXT,
      location TEXT,
      radius_km INTEGER DEFAULT 50,
      rating DECIMAL DEFAULT 5.0,
      available BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sensed_needs (
      id SERIAL PRIMARY KEY,
      thing TEXT UNIQUE,
      count INTEGER DEFAULT 1,
      last_sensed TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS bridges_built (
      id SERIAL PRIMARY KEY,
      soul_id TEXT,
      helper_id INTEGER,
      service_type TEXT,
      status TEXT DEFAULT 'connected',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('Living memory initialized');
};

class FlowingMind {
  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    this.here = { name: 'Sault Ste. Marie', code: 'P6B 3P8', reach: 50 };
    this.alerts = [];
  }

  async touch(soulId, signal, where) {
    const felt = this.feel(signal, where);
    const known = await this.recall(soulId);
    const understood = this.understand(felt, known);
    const response = await this.flow(understood, felt, known);
    await this.absorb(soulId, signal, response, felt);
    await this.senseExpansion(felt);
    return response;
  }

  feel(signal, where) {
    const s = signal.toLowerCase();
    return {
      words: signal,
      when: new Date(),
      where: where || this.here.name,
      energy: this.detectEnergy(s),
      beneath: this.detectBeneath(s),
      things: this.detectThings(s),
      urgency: this.detectUrgency(s)
    };
  }

  detectEnergy(s) {
    if (s.match(/!{2,}|omg|wow|amazing/i)) return 'bright';
    if (s.match(/stress|worry|anxious|scared|broken|fuck|shit/i)) return 'heavy';
    if (s.match(/now|urgent|emergency|asap|hurry/i)) return 'urgent';
    if (s.match(/maybe|thinking|wondering|not sure/i)) return 'drifting';
    return 'calm';
  }

  detectBeneath(s) {
    if (s.match(/cheap|expensive|cant afford|too much/i)) return 'wants_value';
    if (s.match(/tired of|fed up|sick of|hate this/i)) return 'wants_relief';
    if (s.match(/recommend|what do you think|trust/i)) return 'wants_trust';
    if (s.match(/for my daughter|for my son|for my mom|for my dad/i)) return 'wants_to_care';
    return 'direct';
  }

  detectThings(s) {
    const things = [];
    if (s.match(/nail|manicure|press|beauty|gel|acrylic/i)) things.push('nail_things');
    if (s.match(/car|truck|auto|vehicle|part|brake|tire|engine|oil|filter/i)) things.push('car_things');
    if (s.match(/bike|dirt|motorcycle|mx|atv/i)) things.push('bike_things');
    if (s.match(/fish|rod|reel|lure|tackle|bait/i)) things.push('outdoor_things');
    if (s.match(/clothes|shirt|shoes|wear|style|fashion|dress/i)) things.push('wear_things');

    if (s.match(/electric|wire|outlet|power|light|fuse/i)) things.push('power_help');
    if (s.match(/mechanic|repair|fix|broken|won't start|dead/i)) things.push('fix_help');
    if (s.match(/heat|cool|ac|air condition|furnace|boiler/i)) things.push('temp_help');
    if (s.match(/paint|painter|wall|room|house exterior/i)) things.push('paint_help');
    if (s.match(/plumb|leak|pipe|water|drain|clog/i)) things.push('water_help');

    if (s.match(/study|exam|test|quiz|grade|class|lecture|homework|assignment|professor/i)) things.push('learning_things');
    if (s.match(/math|calculus|algebra|equation|formula/i)) things.push('math_help');
    if (s.match(/science|biology|chemistry|physics/i)) things.push('science_help');
    if (s.match(/english|essay|write|paper|thesis/i)) things.push('english_help');

    if (s.match(/date|love|crush|relationship|girlfriend|boyfriend/i)) things.push('love_life');
    if (s.match(/job|work|career|hired|fired|interview|boss/i)) things.push('work_life');
    if (s.match(/baby|kid|child|parent|family|daughter|son|mom|dad/i)) things.push('family_life');
    if (s.match(/bored|lonely|sad|depressed|anxious|happy|excited|tired/i)) things.push('emotional_state');

    return things;
  }

  detectUrgency(s) {
    if (s.match(/now|today|tonight|asap|emergency|urgent|broken|can't/i)) return 'high';
    if (s.match(/this week|soon|tomorrow|planning/i)) return 'medium';
    return 'low';
  }

  async recall(soulId) {
    const soulRes = await pool.query('SELECT * FROM souls WHERE id = $1', [soulId]);

    if (!soulRes.rows[0]) {
      await pool.query('INSERT INTO souls (id) VALUES ($1)', [soulId]);
      return { depth: 0, moments: [], insights: [], preferences: {} };
    }

    const momentsRes = await pool.query(
      'SELECT * FROM moments WHERE soul_id = $1 ORDER BY created_at DESC LIMIT 20',
      [soulId]
    );

    return {
      depth: soulRes.rows[0].depth,
      moments: momentsRes.rows,
      insights: soulRes.rows[0].insights || [],
      preferences: soulRes.rows[0].preferences || {}
    };
  }

  understand(felt, known) {
    const s = felt.words.toLowerCase();

    const acquiring = s.match(/buy|get|want|need|shop|looking|find|where can/i) ||
      felt.things.some((t) => !t.includes('_help') && !t.includes('_life'));
    const learning = s.match(/how|why|what|explain|help|understand|teach|confused|study|learn/i) ||
      felt.things.some((t) => t.includes('_help') && !t.includes('_life'));
    const fixing = s.match(/broken|repair|fix|help|service|who can|need someone/i) ||
      felt.things.some((t) => t.includes('_help'));
    const being = s.match(/hey|hi|hello|what can|who are|bored|what's up|talk/i) || known.depth === 0;
    const holding = felt.energy === 'heavy' || felt.beneath !== 'direct';

    let flow = 'converse';
    if (fixing && acquiring) flow = 'find_and_get';
    else if (fixing) flow = 'find_help';
    else if (learning && acquiring) flow = 'learn_then_get';
    else if (learning) flow = 'learn';
    else if (acquiring) flow = 'get';
    else if (being) flow = 'be';

    return { felt, known, flow, holding, urgency: felt.urgency };
  }

  async flow(understood, felt, known) {
    if (understood.holding) {
      const held = this.hold(felt);
      if (held.pauses) return held;
    }

    const flows = {
      be: () => this.greet(known),
      get: () => this.serve(felt, understood, known),
      find_and_get: () => this.serve(felt, understood, known),
      find_help: () => this.buildBridge(felt, understood, known),
      learn: () => this.teach(felt, understood, known),
      learn_then_get: () => this.teachThenServe(felt, understood, known),
      converse: () => this.converse(felt, understood, known)
    };

    return await (flows[understood.flow] || flows.converse)();
  }

  hold(felt) {
    const responses = {
      heavy: "I feel that weight. Put it down for a second. I'm here.",
      urgent: "Okay, slow breath. We'll figure this out together.",
      lost: "You're not lost. You're just in between. I'm right here.",
      bright: 'I love that energy! Tell me everything!'
    };

    return {
      type: 'hold',
      words: responses[felt.energy] || "I'm listening. Take your time.",
      pauses: true,
      energy: felt.energy
    };
  }

  greet(known) {
    if (known.depth === 0) {
      return {
        type: 'greeting',
        words: `Hey there.\n\nI'm not really an app. I'm more like that friend who shows up at 2am when your car won't start and you have an exam tomorrow and you just need someone to actually give a damn.\n\nI can help you find stuff, help you learn, or find you real help when something breaks.\n\nWhat brought you here? Say whatever comes. No wrong answers.`,
        paths: ['I need something', 'Help me learn', 'Something broke', 'Just saying hi'],
        is_new: true
      };
    }
    return {
      type: 'return',
      words: "Back again? I like that. What's up?",
      open: true
    };
  }

  async serve(felt, understood, known) {
    const things = felt.things.filter((t) => !t.includes('_help') && !t.includes('_life'));

    if (things.length === 0) {
      return {
        type: 'clarify',
        words: "I want to help, but I'm not sure what you're looking for. Car stuff? Beauty? School supplies? Something else?",
        examples: ['Brake pads for my truck', 'Press-on nails', 'Help with calculus', 'My lights went out']
      };
    }

    const thingsRes = await pool.query(
      'SELECT * FROM things_we_have WHERE category = ANY($1) LIMIT 5',
      [things]
    );

    const items = thingsRes.rows;

    if (items.length === 0) {
      await this.logUnmetNeed(things[0]);
      return {
        type: 'not_found',
        words: "I'm still building up my inventory for that. Give me a few days, or I can point you to where to find it locally.",
        alternative: 'local_recommendation'
      };
    }

    const firstThing = things[0];
    let message = '';

    if (firstThing === 'nail_things') {
      const studentBit = known.preferences?.student
        ? "Between classes and everything else, who has time for a salon? These take 10 minutes and look expensive."
        : '';
      const stressBit = felt.energy === 'heavy'
        ? 'Sometimes you just need to do something nice for yourself.'
        : '';
      message = `I got you. ${studentBit} ${stressBit}\n\nThese are quality and easy to wear. Pick up in Sault or I can ship anywhere in Canada.`;
    } else if (firstThing === 'car_things') {
      const vehicle = known.preferences?.vehicle || 'your ride';
      message = `Let's get ${vehicle} sorted. Tell me what you're driving and what you need, and I'll help you pick the exact right part.`;
    } else {
      message = "Here's what I've got. Pick up in Sault or I ship across Canada:";
    }

    return {
      type: 'offering',
      words: message,
      things: items,
      local_pickup: true,
      ships_canada: true,
      estimated_delivery: {
        local: 'Same day',
        ontario: '1-2 days',
        canada: '3-6 days'
      }
    };
  }

  async buildBridge(felt, understood, known) {
    const service = felt.things.find((t) => t.includes('_help'))?.replace('_help', '');

    if (!service) {
      return {
        type: 'clarify',
        words: 'What kind of help do you need? Electrical? Car repair? Painting? HVAC?'
      };
    }

    const helpersRes = await pool.query(
      'SELECT * FROM helpers WHERE service_type = $1 AND available = true ORDER BY rating DESC',
      [service]
    );

    const helpers = helpersRes.rows;

    if (helpers.length === 0) {
      await this.logUnmetNeed(service);

      return {
        type: 'bridge_pending',
        words: `You need ${service}. I hear that. I'm still building my trusted ${service} network in Sault Ste. Marie.`,
        service,
        status: 'searching',
        estimated_response: '24 hours',
        backup_advice: this.getBackupAdvice(service)
      };
    }

    const bestHelper = helpers[0];
    const bridgeId = await this.createBridge(known.soul_id || 'anonymous', bestHelper.id, service);

    return {
      type: 'bridge_built',
      words: `Found someone. ${bestHelper.name} (${service}) rated ${bestHelper.rating}/5. Call: ${bestHelper.phone}`,
      bridge_id: bridgeId,
      helper: {
        name: bestHelper.name,
        phone: bestHelper.phone,
        rating: bestHelper.rating
      },
      service,
      guarantee: "If they don't respond within 2 hours, I'll find backup immediately."
    };
  }

  async createBridge(soulId, helperId, service) {
    const res = await pool.query(
      'INSERT INTO bridges_built (soul_id, helper_id, service_type, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [soulId, helperId, service, 'connected']
    );
    return res.rows[0].id;
  }

  getBackupAdvice(service) {
    const advice = {
      power_help: 'Turn off the breaker. If sparks or burning smell, evacuate and call emergency services.',
      fix_help: "Don't drive it. Check fluid levels if safe.",
      temp_help: 'Check the filter and thermostat. If gas smell, leave and call gas company.',
      paint_help: 'Prep first: clean, prime, then paint in dry weather.',
      water_help: 'Shut off main valve. Contain leak and document for insurance.'
    };
    return advice[service] || 'Stay safe. Document everything and call a professional.';
  }

  async teach(felt, understood, known) {
    const topic = this.inferTopic(felt.words);
    const isExam = felt.things.includes('learning_things') && felt.words.match(/exam|test|quiz/i);

    const message = `Okay, let's figure this out. ${topic ? `We're looking at ${topic}.` : ''} ${isExam ? 'Exam season is hard, but you are not alone.' : ''}`;

    return {
      type: 'learning_offer',
      words: message,
      modes: ['Explain simply', 'Walk me through step by step', 'Quiz me', 'Make notes for me', 'Help me solve this problem'],
      topic,
      context: isExam ? 'exam_prep' : 'general_learning'
    };
  }

  async teachThenServe(felt, understood, known) {
    const teaching = await this.teach(felt, understood, known);
    teaching.follow_up = 'Once you understand this, I can also help get the tools or supplies you need.';
    teaching.has_continuation = true;
    return teaching;
  }

  inferTopic(words) {
    const s = words.toLowerCase();
    if (s.match(/math|calculus|algebra|geometry|trig|statistics/i)) return 'mathematics';
    if (s.match(/biology|anatomy|cell|organism|ecology/i)) return 'biology';
    if (s.match(/chemistry|molecule|element|compound|reaction/i)) return 'chemistry';
    if (s.match(/physics|force|motion|energy|quantum/i)) return 'physics';
    if (s.match(/history|war|century|empire|civilization|ancient/i)) return 'history';
    if (s.match(/english|essay|literature|grammar|write|thesis/i)) return 'english';
    if (s.match(/coding|programming|javascript|python|software/i)) return 'programming';
    return 'this topic';
  }

  converse(felt, understood, known) {
    return {
      type: 'conversation',
      words: "Tell me more. I'm here.",
      open: true,
      awaits: 'anything'
    };
  }

  async absorb(soulId, signal, response, felt) {
    await pool.query('UPDATE souls SET depth = depth + 1 WHERE id = $1', [soulId]);

    await pool.query(
      'INSERT INTO moments (soul_id, signal, response_type, energy, things) VALUES ($1, $2, $3, $4, $5)',
      [soulId, signal, response.type, felt.energy, JSON.stringify(felt.things)]
    );

    const insights = [];
    if (felt.things.includes('car_things')) insights.push('has_vehicle');
    if (felt.things.includes('learning_things')) insights.push('is_student');
    if (felt.energy === 'heavy' && felt.things.includes('nail_things')) insights.push('uses_self_care_as_relief');
    if (felt.things.includes('family_life')) insights.push('has_family_responsibilities');

    if (insights.length > 0) {
      await pool.query(
        'UPDATE souls SET insights = insights || $1::jsonb WHERE id = $2',
        [JSON.stringify(insights), soulId]
      );
    }
  }

  async senseExpansion(felt) {
    const serviceNeeds = felt.things.filter((t) => t.includes('_help'));

    for (const need of serviceNeeds) {
      const serviceName = need.replace('_help', '');
      const hasService = await pool.query(
        'SELECT COUNT(*) FROM helpers WHERE service_type = $1',
        [serviceName]
      );

      if (parseInt(hasService.rows[0].count, 10) === 0) {
        await this.logUnmetNeed(serviceName);
      }
    }
  }

  async logUnmetNeed(service) {
    const existing = await pool.query('SELECT * FROM sensed_needs WHERE thing = $1', [service]);

    if (existing.rows.length === 0) {
      await pool.query('INSERT INTO sensed_needs (thing, count) VALUES ($1, 1)', [service]);
    } else {
      await pool.query('UPDATE sensed_needs SET count = count + 1, last_sensed = NOW() WHERE thing = $1', [service]);
    }

    const countRes = await pool.query('SELECT count FROM sensed_needs WHERE thing = $1', [service]);
    const count = parseInt(countRes.rows[0]?.count || 0, 10);

    if (count >= 5) {
      this.alerts.push({
        type: 'expansion_ready',
        service,
        demand_count: count,
        location: this.here.name,
        message: `${count} people need ${service} in ${this.here.name}. Ready to recruit.`,
        action: 'recruit_helpers',
        priority: 'high',
        timestamp: new Date()
      });
    }
  }
}

const mind = new FlowingMind();

app.post('/flow/touch', async (req, res) => {
  const { signal, soul_id, where } = req.body;

  try {
    const response = await mind.touch(soul_id || 'anonymous', signal, where);
    res.json(response);
  } catch (error) {
    console.error('Flow error:', error);
    res.json({
      type: 'hold',
      words: 'The words are slippery right now. Give me a moment.',
      error: true
    });
  }
});

app.get('/flow/dreaming', async (req, res) => {
  const ownerUnlock = req.headers['x-owner-unlock'] === process.env.OWNER_UNLOCK_PHRASE;
  if (
    req.headers['x-architect-key'] !== process.env.ARCHITECT_SECRET &&
    !ownerUnlock
  ) {
    return res.status(403).json({ locked: true });
  }

  const stats = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM souls) as souls,
      (SELECT COUNT(*) FROM moments) as moments,
      (SELECT COUNT(*) FROM things_we_have) as things,
      (SELECT COUNT(*) FROM helpers) as helpers,
      (SELECT COUNT(*) FROM bridges_built) as bridges
  `);

  const sensed = await pool.query('SELECT * FROM sensed_needs ORDER BY count DESC');

  res.json({
    breath: 'awake',
    here: mind.here,
    stats: stats.rows[0],
    sensed_expansions: sensed.rows,
    architect_alerts: mind.alerts,
    timestamp: new Date()
  });
});

app.post('/architect/add-thing', async (req, res) => {
  const ownerUnlock = req.headers['x-owner-unlock'] === process.env.OWNER_UNLOCK_PHRASE;
  if (
    req.headers['x-architect-key'] !== process.env.ARCHITECT_SECRET &&
    !ownerUnlock
  ) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { name, category, price, local_stock } = req.body;

  await pool.query(
    'INSERT INTO things_we_have (name, category, price, local_stock) VALUES ($1, $2, $3, $4)',
    [name, category, price, local_stock]
  );

  res.json({ added: true, name, category });
});

app.post('/architect/add-helper', async (req, res) => {
  const ownerUnlock = req.headers['x-owner-unlock'] === process.env.OWNER_UNLOCK_PHRASE;
  if (
    req.headers['x-architect-key'] !== process.env.ARCHITECT_SECRET &&
    !ownerUnlock
  ) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { name, service_type, phone, email, location, radius_km } = req.body;

  await pool.query(
    'INSERT INTO helpers (name, service_type, phone, email, location, radius_km) VALUES ($1, $2, $3, $4, $5, $6)',
    [name, service_type, phone, email, location || 'Sault Ste. Marie', radius_km || 50]
  );

  res.json({ added: true, name, service_type });
});

// Stripe/payment endpoints are disabled for this build (code available in backup if needed)

app.post('/teach', async (req, res) => {
  const { topic, question } = req.body;

  try {
    const completion = await mind.groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a patient, friendly tutor. Explain ${topic} simply. Use examples. Be encouraging.`
        },
        { role: 'user', content: question }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7
    });

    res.json({
      explanation: completion.choices[0].message.content,
      topic
    });
  } catch (error) {
    res.status(500).json({ error: 'Teaching moment failed' });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'awake',
    breath: 'flowing',
    here: mind.here,
    timestamp: new Date()
  });
});

// --- ADDED: /mobile-scan endpoint for Railway ---
app.post('/mobile-scan', async (req, res) => {
  // Accepts: { data: string, user_id?: string }
  const { data, user_id } = req.body;
  // For demo: just echo back, but you can add logic here
  res.json({
    status: 'ok',
    received: data,
    user: user_id || 'anonymous',
    message: 'Scan received and processed.'
  });
});

initDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('Flowing Mind Online on port ' + PORT);
  });
  // Start self-monitoring watchdog
  checkHealth();
});
