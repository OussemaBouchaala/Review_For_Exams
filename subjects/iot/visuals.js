/* Diagram-first visuals for IoT: every lesson gets at least one picture. */
(() => {
  const M = (caption, content) => ({ type: "mermaid", caption, content });

  StudyHub.addDiagrams("iot", "ch1", {
    "What IoT is and why it matters": [
      M("IoT in one loop: sense → share → decide → act", `flowchart LR
  T["🌡️ Things<br/>meters · cars · fridges · machines"] -->|sense| D["📡 Data<br/>shared over the Internet"]
  D -->|analyse| K["🧠 Decisions<br/>better and faster"]
  K -->|act| T`),
      M("What it brings", `flowchart LR
  I(("🌐 IoT")) --> B1["♻️ Optimised resources"]
  I --> B2["⏱️ Less time and cost"]
  I --> B3["📊 Better decisions<br/>from real-time data"]
  I --> B4["✨ Innovative services"]
  I --> R["💰 $181.5 B in 2020<br/>→ about $621.6 B in 2030"]`),
    ],
    "Where IoT is used: application domains": M("8 families of IoT applications", `flowchart LR
  I(("🌐 IoT")) --> A["🚚 Transport & logistics<br/>fleets, goods tracking"]
  I --> B["⚡ Utilities<br/>smart meters, smart grid"]
  I --> C["🏙️ Smart city<br/>parking, waste"]
  I --> D["🏠 Smart building<br/>smoke detectors, home automation"]
  I --> E["⌚ Consumers<br/>wearables, trackers"]
  I --> F["🏭 Industrial<br/>process control, maintenance"]
  I --> G["🌍 Environment<br/>food, pollution alerts"]
  I --> H["🌾 Agriculture<br/>crops, livestock"]`),
    "Real-world IoT examples from the course": M("Every case study follows the same path", `flowchart LR
  F["🐟 RFID tags on fish"] --> S
  P["💊 Seemoto temperature sensors"] --> S
  V["🚗 LiDAR on self-driving cars"] --> S
  E["⚡ Smart energy meters"] --> S
  S["📟 Sensor measures"] --> G["📶 Gateway<br/>Internet or mobile network"] --> C["☁️ Cloud<br/>stores and analyses"] --> A["👤 Someone acts<br/>alert, route, bill"]`),
    "IoT devices: small, cheap, battery-powered": M("Weak hardware drives every design choice", `flowchart LR
  D["📟 IoT device"] --> L1["💾 Tiny memory<br/>tens of KB"]
  D --> L2["🔋 Battery<br/>must last years"]
  D --> L3["🐢 Moderate CPU"]
  D --> L4["📶 Lossy narrow radio<br/>802.15.4, kbit/s"]
  L1 --> C1["TinyOS / Contiki"]
  L2 --> C2["Low-power radios"]
  L3 --> C3["Light protocols<br/>MQTT, CoAP"]
  L4 --> C3`),
    "Network connections and constrained communication": M("Two kinds of networks", `flowchart LR
  subgraph U["🏎️ Unconstrained"]
    direction TB
    U1["Ethernet · Wi-Fi · fibre"] --> U2["fast, low latency"] --> U3["❌ high energy<br/>not for end devices"]
  end
  subgraph K["🐢 Constrained = IoT"]
    direction TB
    K1["802.15.4 · Bluetooth · RFID"] --> K2["about 1 Mbit/s, long latency"] --> K3["✅ very low energy"]
  end
  K --> W["🌍 Long distance for things<br/>LoRaWAN · NB-IoT"]`),
    "Wireless technologies: Wi-Fi, Bluetooth, Zigbee and LPWAN": [
      M("From short to long range", `flowchart TB
  subgraph S["📏 Short range"]
    direction LR
    R["RFID / NFC"]
    B["Bluetooth<br/>720 kbps · 10–100 m · 1 week"]
  end
  subgraph Md["🏠 Medium range"]
    direction LR
    Z["Zigbee 802.15.4<br/>250 kbps · 100 m · years 🔋"]
    W["Wi-Fi 802.11<br/>54 Mbps · 100+ m · hours"]
  end
  subgraph L["🌍 Long range"]
    direction LR
    C["Cellular 2G–5G<br/>high bandwidth"]
    P["LPWAN<br/>5–40 km · 10 years 🔋"]
  end
  S --> Md --> L`),
      M("LPWAN: far, slow and frugal", `flowchart LR
  S1["🌡️ sensor"] --> BS
  S2["💧 meter"] --> BS
  S3["🐄 tracker"] --> BS
  BS["📡 one base station<br/>thousands of devices<br/>5–40 km"] --> N["☁️ Network server"]
  BS -.-> T["LoRaWAN · Sigfox<br/>Weightless-N · RPMA"]`),
    ],
    "Application connections: M2M, M2G, M2C and app-layer protocols": [
      M("Three ways to connect", `flowchart LR
  D1["📟 Device"] <-->|M2M| D2["📟 Device"]
  D1 -->|M2G| G["📶 Gateway"]
  G -->|M2C| C["☁️ Cloud"]
  D2 -->|M2C| C`),
      M("Three app-layer protocols", `flowchart LR
  P(("🗣️ Same language")) --> Q["MQTT<br/>light messaging, pub/sub"]
  P --> R["REST<br/>HTTP + URLs"]
  P --> C["CoAP<br/>REST for tiny devices, UDP"]`),
    ],
    "MQTT vs CoAP": [
      M("MQTT: publish / subscribe through a broker (TCP)", `flowchart LR
  S["🌡️ Sensor"] -->|"publish home/temp = 22"| B["📮 Broker"]
  B -->|deliver| A1["📱 App"]
  B -->|deliver| A2["📊 Dashboard"]
  A1 -.->|"subscribe home/temp"| B
  A2 -.->|"subscribe home/temp"| B`),
      M("CoAP: request / response like the web (UDP)", `sequenceDiagram
  participant C as 📱 Client
  participant S as 🌡️ Sensor (server)
  C->>S: GET /temp (UDP, tiny header)
  S-->>C: 2.05 Content: 22 °C
  Note over C,S: light and fast, but delivery not guaranteed`),
    ],
  });

  StudyHub.addDiagrams("iot", "ch2", {
    "Edge categories: thick, thin and micro edge (and where the fog sits)": M("Closer to the data = faster", `flowchart LR
  C["📟 Micro edge C<br/>sensors, devices<br/>under 1 m · under 0.1 ms"]
  subgraph F["🌫️ Fog: the middle zone"]
    direction LR
    B["🔀 Thin edge B<br/>network gear, controllers<br/>up to 1 km · 0.1–1 ms"]
    A["🏢 Thick edge A<br/>cell-tower and on-site DCs<br/>1–10 km · 1–10 ms"]
  end
  K["☁️ Cloud<br/>regional, national DCs<br/>10+ km · 10+ ms"]
  C --> B --> A --> K`),
    "Use cases and enabling technologies": M("What makes the edge possible, and where it is used", `flowchart LR
  T1["🌐 IoT"] --> E
  T2["📶 5G"] --> E
  T3["📦 Docker / Kubernetes"] --> E
  T4["🤖 AI / ML"] --> E
  T5["🌫️ Fog"] --> E
  E(("⚡ Edge<br/>computing")) --> U1["🏥 Healthcare"]
  E --> U2["🚗 Autonomous cars"]
  E --> U3["🏭 Industry 4.0"]
  E --> U4["🚦 Smart cities"]
  E --> U5["📷 Cameras and sensors"]`),
    "Edge AI and intelligent edge": M("Think locally, send only what matters", `flowchart LR
  S["📷 Raw data<br/>video, vibrations"] --> E["🤖 Edge AI<br/>filter · clean · infer"]
  E -->|"real-time action"| A["⚙️ Machine / car"]
  E -->|"only insights"| C["☁️ Cloud"]
  E -.-> W["✅ low latency · privacy<br/>less bandwidth · works offline"]`),
    "Multi-access Edge Computing (MEC) by ETSI": M("MEC puts a mini cloud next to the antenna", `flowchart LR
  U["📱🚗 Users"] --> R["📡 4G/5G base station<br/>(RAN)"]
  R --> M["🖥️ MEC server<br/>AR/VR · CDN · gaming<br/>network APIs: location, QoS"]
  M --> N["🛰️ Core network"] --> C["☁️ Far cloud"]
  M -.-> S["📜 ETSI standard<br/>on NFV · 5G via 3GPP"]`),
    "Kubernetes basics (qu'est-ce que Kubernetes ?)": M("Cluster → nodes → pods → containers", `flowchart TB
  CP["🧠 Control plane<br/>decides and watches"] --> N1
  CP --> N2
  subgraph N1["🖥️ Node 1"]
    P1["Pod · IP 10.0.0.5<br/>📦 container"]
    P2["Pod · IP 10.0.0.6<br/>📦 📦 two containers"]
  end
  subgraph N2["🖥️ Node 2"]
    P3["Pod · IP 10.0.1.4<br/>📦 container"]
  end`),
    "What Kubernetes provides": M("Eight things Kubernetes does for you", `flowchart LR
  K(("☸️ K8s")) --> A["🔎 Discovery + load balancing"]
  K --> B["💽 Storage mounting"]
  K --> C["🔄 Rollouts and rollbacks"]
  K --> D["🧩 Bin packing CPU/RAM"]
  K --> E["❤️‍🩹 Self-healing"]
  K --> F["🔑 Secrets and config"]
  K --> G["📦 Batch jobs"]
  K --> H["📈 Horizontal scaling"]`),
    "IoT edge challenges and how Kubernetes helps": [
      M("Problems at the edge → what Kubernetes brings", `flowchart LR
  P1["🐜 Limited CPU / RAM"] --> S1["📦 Containers start in ms<br/>scale up or down"]
  P2["🛰️ Remote management"] --> S2["🔄 Progressive updates<br/>no service cut"]
  P3["🔐 Security and trust"] --> S3["🌐 Own IP per pod<br/>restart on failure"]`),
      M("Kubernetes at the edge: 3 layers", `flowchart LR
  A["☁️ 1. Cloud and data center"] <--> B["🔀 2. Aggregation<br/>between cloud and edge"] <--> C["📟 3. Last-mile edge<br/>acquires and processes data"]`),
    ],
    "Lightweight Kubernetes: K3s, MicroK8s, Rancher, KubeEdge and managed services": M("Slimmer Kubernetes for small machines", `flowchart LR
  F["☸️ Full K8s<br/>2 GB RAM per master"] -->|too heavy for the edge| L(("🪶 Light versions"))
  L --> K3["K3s · Rancher<br/>512 MB · SQLite · under 40 MB"]
  L --> MK["MicroK8s · Canonical<br/>self-healing HA"]
  L --> KE["KubeEdge · Huawei<br/>cloud ↔ edge nodes"]
  R["🐮 Rancher<br/>manages many clusters"] -.-> K3
  R -.-> MK`),
    "DQN applied to offloading (DQL model) and results": [
      M("The reinforcement learning loop", `flowchart LR
  A["🤖 DQN agent"] -->|"action a<br/>give bandwidth b, CPU c"| E["🚗 Internet of Vehicles<br/>+ MEC servers"]
  E -->|"state s = free Ba, Ca"| A
  E -->|"reward r = time saved"| A`),
      M("Reward = time saved", `flowchart LR
  T["🧾 Task"] --> L["🚗 run locally<br/>r = 0"]
  T --> M["🖥️ offload to MEC<br/>r = t_local − t_mec"]
  T --> C["☁️ offload to cloud<br/>r = t_local − t_cloud"]`),
    ],
    "Queueing models for edge / fog": [
      M("One queue: tasks arrive at λ, served at μ", `flowchart LR
  A["📥 arrivals λ<br/>Poisson"] --> Q["⏳ queue<br/>▮▮▮▮"] --> S["⚙️ c servers<br/>rate μ"] --> O["📤 done"]`),
      M("Fog model: who uses which queue", `flowchart LR
  CS["📱 Client servers<br/>M/M/1"] --> F["🌫️ Fog nodes<br/>M/M/N"]
  F -->|"not enough power"| ES
  subgraph Cloud["☁️ Cloud"]
    direction LR
    ES["Entry ES<br/>M/M/1"] --> PS["Processing PS<br/>M/M/R"] --> DS["Database DS<br/>M/M/1"] --> OS["Output OS<br/>M/M/1"]
  end
  OS --> CS
  F --> CS`),
    ],
  });
})();
