/* Animated step-by-step explainers for the IoT subject, attached to lessons by section title. */
StudyHub.addScenes("iot", "ch1", {
  "The four IoT layers": {
    title: "a reading climbs the four layers",
    w: 620, h: 270,
    zones: [
      { x: 8, y: 14, w: 146, h: 242, label: "Device" },
      { x: 162, y: 14, w: 138, h: 242, label: "Edge / Fog", at: 1 },
      { x: 308, y: 14, w: 138, h: 242, label: "Network", at: 2 },
      { x: 454, y: 14, w: 158, h: 242, label: "Cloud", at: 3 },
    ],
    nodes: [
      { id: "th", x: 81, y: 90, icon: "🌡️", label: "Thermostat" },
      { id: "cam", x: 81, y: 190, icon: "📷", label: "Camera" },
      { id: "ctl", x: 231, y: 140, icon: "🎛️", label: "Controller", w: 118, at: 1 },
      { id: "rt", x: 377, y: 140, icon: "📶", label: "Router", w: 118, at: 2 },
      { id: "dc", x: 533, y: 140, icon: "🏢", label: "Data center", w: 132, at: 3 },
    ],
    edges: [
      { from: "th", to: "ctl" }, { from: "cam", to: "ctl" }, { from: "ctl", to: "rt" }, { from: "rt", to: "dc" },
    ],
    steps: [
      { say: "**Device layer**: sensors inside everyday objects measure the world. The thermostat reads 31 °C.", hl: ["th"], note: { th: "31 °C" } },
      { say: "**Edge / Fog layer**: the controller collects raw readings and processes them **locally** (filtering, protocol conversion).", hl: ["ctl"], send: [{ from: "th", to: "ctl", label: "31°C" }, { from: "cam", to: "ctl", label: "frame", delay: 300 }], note: { ctl: "filter + convert" } },
      { say: "**Network layer**: routers carry only the useful, summarised data across the IP network.", hl: ["rt"], send: [{ from: "ctl", to: "rt", label: "avg 30.6" }] },
      { say: "**Cloud layer**: data centers store it and run heavy analytics across thousands of homes.", hl: ["dc"], send: [{ from: "rt", to: "dc", label: "avg 30.6" }], note: { dc: "stored ✓" } },
      { say: "Decisions can travel back down: the cloud tells the device what to do, and an actuator acts.", send: [{ from: "dc", to: "rt", label: "cool", tone: "alt" }, { from: "rt", to: "ctl", label: "cool", tone: "alt", delay: 1100 }, { from: "ctl", to: "th", label: "AC on", tone: "alt", delay: 2200 }], ok: ["th"], note: { th: "AC on ❄️" } },
    ],
  },
  "Fog computing example: smart traffic lights (M2M)": {
    title: "decide locally, act locally",
    w: 620, h: 310,
    zones: [{ x: 14, y: 84, w: 592, h: 214, label: "Local network (fog)" }],
    nodes: [
      { id: "cloud", x: 310, y: 38, icon: "☁️", label: "Cloud", w: 110 },
      { id: "s1", x: 100, y: 140, icon: "🚗", label: "Sensor north" },
      { id: "s2", x: 100, y: 245, icon: "🚙", label: "Sensor east" },
      { id: "ctl", x: 310, y: 192, icon: "🎛️", label: "Fog controller", kind: "accent", w: 140 },
      { id: "l1", x: 520, y: 140, icon: "🚦", label: "Light north" },
      { id: "l2", x: 520, y: 245, icon: "🚦", label: "Light east" },
    ],
    edges: [
      { from: "s1", to: "ctl" }, { from: "s2", to: "ctl" }, { from: "ctl", to: "l1" }, { from: "ctl", to: "l2" },
      { from: "ctl", to: "cloud", dashed: true },
    ],
    steps: [
      { say: "Sensors watch the junction: **12 cars** waiting on the north road, **2** on the east road.", hl: ["s1", "s2"], note: { s1: "12 cars", s2: "2 cars" } },
      { say: "They report to the **fog controller** on the local network. Machines talking to machines: **M2M**.", send: [{ from: "s1", to: "ctl", label: "12" }, { from: "s2", to: "ctl", label: "2", delay: 250 }] },
      { say: "The controller computes the best light pattern **locally**. Nothing is sent beyond the local network.", hl: ["ctl"], dim: ["cloud"], cut: [4], note: { ctl: "north: green 40 s" } },
      { say: "It sends commands straight to the light **actuators**.", send: [{ from: "ctl", to: "l1", label: "GREEN", tone: "good" }, { from: "ctl", to: "l2", label: "RED", tone: "bad", delay: 200 }], ok: ["l1"], note: { l1: "green", l2: "red" } },
      { say: "Decide locally, act locally: a few milliseconds instead of a round trip to the cloud.", ok: ["ctl"], dim: ["cloud"] },
    ],
  },
  "MQTT: publish / subscribe through a broker": {
    title: "publish, subscribe, broker",
    w: 620, h: 300,
    nodes: [
      { id: "p1", x: 95, y: 80, icon: "🌡️", label: "Temp sensor" },
      { id: "p2", x: 95, y: 220, icon: "🚪", label: "Door sensor" },
      { id: "b", x: 310, y: 150, icon: "📮", label: "Broker", kind: "accent", w: 120 },
      { id: "s1", x: 525, y: 80, icon: "📱", label: "Phone app" },
      { id: "s2", x: 525, y: 220, icon: "🔥", label: "Heating ctrl" },
    ],
    edges: [
      { from: "p1", to: "b", label: "home/temp" }, { from: "p2", to: "b", label: "home/door" },
      { from: "b", to: "s1" }, { from: "b", to: "s2" },
    ],
    steps: [
      { say: "Subscribers first tell the **broker** which **topics** they want. Phone: `home/temp` and `home/door`. Heating: `home/temp`.", send: [{ from: "s1", to: "b", label: "SUB home/temp", tone: "alt" }, { from: "s2", to: "b", label: "SUB home/temp", tone: "alt", delay: 300 }, { from: "s1", to: "b", label: "SUB home/door", tone: "alt", delay: 1400 }], note: { s1: "temp + door", s2: "temp" } },
      { say: "The temp sensor **publishes** 22 °C on topic `home/temp`. It has no idea who is listening.", hl: ["p1"], send: [{ from: "p1", to: "b", label: "22°C" }] },
      { say: "The broker distributes **by topic**: both subscribers of `home/temp` receive the value.", hl: ["b"], send: [{ from: "b", to: "s1", label: "22°C" }, { from: "b", to: "s2", label: "22°C" }], ok: ["s1", "s2"] },
      { say: "The door sensor publishes on `home/door`. Only the phone subscribed to that topic, so only the phone gets it.", clear: true, send: [{ from: "p2", to: "b", label: "open", tone: "bad" }, { from: "b", to: "s1", label: "open", tone: "bad", delay: 1200 }], dim: ["s2"] },
      { say: "Publishers and subscribers **never talk directly**: everything goes through the broker, over **TCP**.", hl: ["b"] },
    ],
  },
  "CoAP: REST for tiny devices": {
    title: "request / response over UDP",
    w: 620, h: 260,
    nodes: [
      { id: "c", x: 110, y: 130, icon: "📱", label: "Client" },
      { id: "srv", x: 505, y: 130, icon: "🌡️", label: "Sensor\n(CoAP server)", w: 140 },
    ],
    edges: [
      { from: "c", to: "srv", bend: -70, label: "request (UDP)" },
      { from: "srv", to: "c", bend: -70, label: "response" },
    ],
    steps: [
      { say: "The client asks for a **resource** by its URI: `GET coap://sensor/temperature`.", send: [{ from: "c", to: "srv", label: "GET /temperature", dur: 1300 }] },
      { say: "The sensor answers directly: **2.05 Content \"22.5 °C\"**. Request/response like HTTP, but over **UDP**.", send: [{ from: "srv", to: "c", label: "2.05 22.5°C", tone: "good", dur: 1300 }], note: { c: "22.5 °C" } },
      { say: "**PUT** changes a resource: switch the sensor's LED on.", send: [{ from: "c", to: "srv", label: "PUT /led on", tone: "alt", dur: 1300 }] },
      { say: "Reply **2.04 Changed**. No broker in the middle, and a CoAP server fits in **10 KB of RAM**.", send: [{ from: "srv", to: "c", label: "2.04 Changed", tone: "good", dur: 1300 }], ok: ["srv"], note: { srv: "LED on 💡" } },
    ],
  },
});

StudyHub.addScenes("iot", "ch2", {
  "What edge computing is and why IoT needs it": {
    title: "telemetry, response, batches",
    w: 620, h: 290,
    zones: [{ x: 196, y: 40, w: 210, h: 220, label: "On-premise" }],
    nodes: [
      { id: "m", x: 80, y: 150, icon: "🏭", label: "Machine" },
      { id: "e", x: 301, y: 150, icon: "🖥️", label: "Edge\n(processing + ML)", w: 150, kind: "accent" },
      { id: "ci", x: 530, y: 85, icon: "☁️", label: "Cloud ingestion", w: 140 },
      { id: "cs", x: 530, y: 220, icon: "🗄️", label: "Cloud storage", w: 140 },
    ],
    edges: [{ from: "m", to: "e", bend: -45, label: "telemetry" }, { from: "e", to: "m", bend: -45, label: "response" }, { from: "e", to: "ci" }, { from: "ci", to: "cs" }],
    steps: [
      { say: "The machine streams **telemetry** to the edge, many times per second.", send: [{ from: "m", to: "e", label: "71°" }, { from: "m", to: "e", label: "72°", delay: 450 }, { from: "m", to: "e", label: "75°", delay: 900 }] },
      { say: "The edge processes it **on-premise** (storage + ML) and sends a **response** back in real time.", hl: ["e"], note: { e: "ML: overheating!" }, send: [{ from: "e", to: "m", label: "slow down", tone: "alt" }], ok: ["m"] },
      { say: "Only **batched telemetry** goes to the cloud. Less bandwidth, more privacy.", send: [{ from: "e", to: "ci", label: "batch ×1000" }, { from: "ci", to: "cs", label: "store", delay: 1200 }], note: { cs: "history ✓" } },
    ],
  },
  "Latency numbers: why the edge wins": {
    title: "the latency race",
    w: 620, h: 290,
    nodes: [
      { id: "d", x: 90, y: 150, icon: "🚗", label: "Car sensor" },
      { id: "e", x: 260, y: 240, icon: "🗼", label: "Edge server", w: 120 },
      { id: "c", x: 530, y: 60, icon: "☁️", label: "Central cloud", w: 130 },
    ],
    edges: [{ from: "d", to: "e", label: "< 20 ms" }, { from: "d", to: "c", label: "up to 250 ms" }],
    steps: [
      { say: "A car detects an obstacle and needs a decision **now**. Two options: the far cloud, or the nearby edge.", hl: ["d"] },
      { say: "Cloud path: the request crosses the whole network to the central cloud and back: up to **250 ms**.", send: [{ from: "d", to: "c", label: "request", dur: 2000 }, { from: "c", to: "d", label: "answer", dur: 2000, delay: 2000 }], note: { c: "≈ 250 ms" } },
      { say: "Now race them. The edge is next door: under **20 ms**. Its answer is back before the cloud request has even arrived.", send: [{ from: "d", to: "c", label: "request", dur: 2000 }, { from: "d", to: "e", label: "req", dur: 300 }, { from: "e", to: "d", label: "answer", tone: "good", dur: 300, delay: 300 }], ok: ["e"], note: { e: "< 20 ms ✓", c: "still travelling…" } },
      { say: "5G alone improves the cloud round trip by only **~2%**. Moving the workload to the edge is what wins.", hl: ["e"] },
    ],
  },
  "Kubernetes architecture": {
    title: "how a Pod gets scheduled",
    w: 640, h: 320,
    zones: [
      { x: 128, y: 14, w: 292, h: 296, label: "Control plane" },
      { x: 434, y: 14, w: 196, h: 140, label: "Worker node 1" },
      { x: 434, y: 170, w: 196, h: 140, label: "Worker node 2" },
    ],
    nodes: [
      { id: "dev", x: 62, y: 160, icon: "👩‍💻", label: "You\nkubectl", w: 104 },
      { id: "api", x: 275, y: 70, icon: "🚪", label: "kube-apiserver", kind: "accent", w: 150 },
      { id: "etcd", x: 192, y: 168, icon: "🗃️", label: "etcd", w: 100 },
      { id: "cm", x: 352, y: 168, icon: "🛠️", label: "Controller\nmanager", w: 112, at: 5 },
      { id: "sch", x: 275, y: 262, icon: "🧭", label: "Scheduler", w: 120 },
      { id: "k1", x: 532, y: 84, icon: "🤖", label: "kubelet" },
      { id: "k2", x: 532, y: 240, icon: "🤖", label: "kubelet" },
    ],
    edges: [
      { from: "dev", to: "api" }, { from: "api", to: "etcd" }, { from: "api", to: "sch" }, { from: "cm", to: "api" },
      { from: "api", to: "k1" }, { from: "api", to: "k2" },
    ],
    steps: [
      { say: "You ask for a new Pod. Every request enters through the **kube-apiserver**, the cluster's front door.", send: [{ from: "dev", to: "api", label: "create Pod" }], hl: ["api"] },
      { say: "The API server records the desired state in **etcd**, the key-value store of cluster state.", send: [{ from: "api", to: "etcd", label: "Pod: pending" }], note: { etcd: "pending" } },
      { say: "The **scheduler** watches for Pods with **no node assigned** and picks the best node (create_to_schedule).", hl: ["sch"], send: [{ from: "api", to: "sch", label: "unassigned" }, { from: "sch", to: "api", label: "→ node 2", tone: "alt", delay: 1300 }] },
      { say: "The **kubelet** on node 2 notices and launches the containers (schedule_to_run).", send: [{ from: "api", to: "k2", label: "run Pod" }], ok: ["k2"], note: { k2: "Pod ▶ running" } },
      { say: "Status flows back: a GET on the API now shows **Running** (run_to_watch).", send: [{ from: "k2", to: "api", label: "Running", tone: "good" }], note: { etcd: "running" } },
      { say: "Node 2 goes down. The **controller manager** reacts, and the Pod is restarted on node 1.", fail: ["k2"], note: { k2: "✕ node down", k1: "Pod ▶ running" }, hl: ["cm"], send: [{ from: "cm", to: "api", label: "replace Pod", tone: "bad" }, { from: "api", to: "k1", label: "run Pod", delay: 1300 }], ok: ["k1"] },
    ],
  },
  "Task offloading: local, edge or cloud?": {
    title: "where should task m run?",
    w: 620, h: 280,
    nodes: [
      { id: "v", x: 85, y: 170, icon: "🚗", label: "Vehicle\ntask m", w: 120 },
      { id: "rsu", x: 300, y: 170, icon: "📡", label: "RSU + MEC", w: 130 },
      { id: "cl", x: 535, y: 170, icon: "☁️", label: "Cloud", w: 110 },
    ],
    edges: [{ from: "v", to: "rsu", label: "d / λ" }, { from: "rsu", to: "cl", label: "½ RTT" }],
    steps: [
      { say: "Option 1: run **locally**. t_local = c / f. With c = 1000 cycles on a 1 MHz chip, **t = 1 ms**.", hl: ["v"], note: { v: "t = c / f" } },
      { say: "Option 2: **offload to the edge (MEC)**. First pay the transmission time **d / λ**, then compute fast: **c / f_mec**.", send: [{ from: "v", to: "rsu", label: "d bits", dur: 1600 }], note: { rsu: "d/λ + c/f_mec" } },
      { say: "Option 3: go on to the **cloud**: add **½ RTT** over fibre, then compute.", send: [{ from: "v", to: "rsu", label: "d bits", dur: 1300 }, { from: "rsu", to: "cl", label: "½ RTT", tone: "alt", delay: 1300, dur: 1300 }], note: { cl: "+ RTT/2" } },
      { say: "The task runs in **exactly one** place: P_local + P_edge + P_cloud = 1. Offload only when the time saved beats the transmission cost.", hl: ["v", "rsu"] },
    ],
  },
  "Reinforcement learning: Q-learning, DQN and Double DQN": {
    title: "the RL loop",
    w: 620, h: 260,
    nodes: [
      { id: "ag", x: 150, y: 130, icon: "🤖", label: "Agent", kind: "accent", w: 120 },
      { id: "env", x: 470, y: 130, icon: "🌍", label: "Environment", w: 140 },
    ],
    edges: [{ from: "ag", to: "env", bend: -70, label: "action a" }, { from: "env", to: "ag", bend: -70, label: "state s', reward r" }],
    steps: [
      { say: "The **agent** observes the state **s** (for offloading: free MEC resources {Ba, Ca}).", send: [{ from: "env", to: "ag", label: "s", dur: 1300 }] },
      { say: "It picks an **action** with **ε-greedy**: usually the best Q(s, a), sometimes a random one to explore.", note: { ag: "ε-greedy" }, send: [{ from: "ag", to: "env", label: "a", tone: "alt", dur: 1300 }] },
      { say: "The environment returns a **reward** r (time saved vs. running locally) and a new state **s'**.", send: [{ from: "env", to: "ag", label: "r, s'", tone: "good", dur: 1300 }] },
      { say: "Update: **Q(s,a) ← Q(s,a) + α [r + γ max Q(s',a') − Q(s,a)]**. Repeat thousands of times and a good **policy** emerges.", hl: ["ag"], note: { ag: "Q updated ↑" } },
    ],
  },
});
