/* Diagram-first visuals for DevOps: every lesson gets at least one picture. */
(() => {
  const M = (caption, content) => ({ type: "mermaid", caption, content });

  StudyHub.addDiagrams("devops", "intro", {
    "Roadblock 2: conflict of interest": M("Same goal, opposite incentives", `flowchart LR
  D["👩‍💻 Developers<br/>🏃 speed: ship features"] -->|push| X(("⚔️ Conflict"))
  O["🛠️ Operations<br/>🛡️ stability: nothing breaks"] -->|resist| X
  D -.-> G["🎯 Shared goal<br/>quality apps, fast"]
  O -.-> G`),
    "DevSecOps: security is a roadblock too": [
      M("Security moves inside the pipeline", `flowchart LR
  C["💻 Code"] --> S1["🔒 Static analysis<br/>tfsec"] --> B["📦 Build image"] --> S2["🔒 Image scan"] --> D["🚀 Deploy"]
  V["🔑 Secrets in a vault<br/>Ansible Vault"] -.-> D`),
      M("Shift left: the earlier, the cheaper", `flowchart LR
  A["✍️ Code<br/>💲"] --> B["🧪 Test<br/>💲💲"] --> C["🚀 Production<br/>💲💲💲💲"]
  F["🔍 Find security bugs here"] -.-> A`),
    ],
    "Boundaries: what a DevOps engineer must know": M("DevOps sits where Dev and Ops meet", `flowchart LR
  D["👩‍💻 Development<br/>Git workflow · config · tests"] --> E(("♾️ DevOps<br/>engineer"))
  O["🐧 Operations<br/>Linux · CLI · networking"] --> E
  T["🧰 DevOps tools<br/>Docker · CI/CD · cloud · K8s<br/>monitoring · IaC · scripting"] --> E
  E -.-> N["Sys admins, network and<br/>security engineers stay<br/>their own professions"]`),
    "DevOps vs SRE": [
      M("DevOps says what, SRE says how", `flowchart LR
  D["♾️ DevOps<br/>culture · WHAT<br/>speed of delivery"] -->|implemented by| S["📏 SRE<br/>discipline · HOW<br/>reliability, SLIs, SLOs"]
  S --> G["🎯 Fast AND stable"]`),
      M("The error budget decides", `flowchart LR
  O["SLO: 99.9% of requests succeed"] --> Q{"Budget<br/>left?"}
  Q -->|yes| F["🚀 Ship fast"]
  Q -->|no| R["🛠️ Slow down, fix reliability"]`),
    ],
  });

  StudyHub.addDiagrams("devops", "cicd", {
    "How should we release? Continuously and automatically": [
      M("From the repository to the servers", `flowchart LR
  G["👩‍💻 Code repository<br/>Git"] -->|"CONTINUOUSLY + AUTOMATED<br/>CI/CD pipeline"| S["🖥️ Servers<br/>users"]`),
      M("Big releases vs small continuous ones", `flowchart LR
  subgraph Old["🐌 Old way"]
    direction LR
    o1["months of changes"] --> o2["💥 one huge risky release"]
  end
  subgraph New["⚡ DevOps way"]
    direction LR
    n1["small change"] --> n2["release"] --> n3["small change"] --> n4["release"]
  end`),
    ],
    "Tools along the pipeline": M("One tool family per step", `flowchart LR
  subgraph J["🤖 Jenkins / GitLab CI automates everything"]
    direction LR
    G["🌿 Git<br/>store code"] --> B["🔨 Maven · Gradle · npm<br/>package"] --> D["🐳 Docker<br/>build image"] --> R["🗄️ Nexus · Docker Hub<br/>store artifact"]
  end
  R --> P["🚀 Deploy"]
  J -.-> S["💬 Slack notify"]`),
    "Cloud providers (IaaS)": M("Rent instead of buying", `flowchart LR
  OP["🏢 On-premise<br/>buy and maintain servers 💸"] -->|move to| I(("☁️ IaaS<br/>pay for use"))
  I --> A["AWS<br/>leader"]
  I --> Z["Azure"]
  I --> G["Google Cloud"]
  A & Z & G --> S["servers · networks<br/>databases · Kubernetes"]`),
    "Container orchestration": M("When containers multiply", `flowchart LR
  F["📦📦 a few containers"] --> C["🐙 Docker Compose"]
  H["📦📦📦📦📦📦<br/>hundreds on many servers"] --> K["☸️ Kubernetes"]
  K --> K1["deploy"]
  K --> K2["scale"]
  K --> K3["restart"]
  K --> K4["load-balance"]`),
    "Monitoring": M("Watch, alert, improve", `flowchart LR
  A["📱 App<br/>errors, response time"] -->|metrics| P["🔥 Prometheus / Nagios"]
  I["🖥️ Infra<br/>CPU, RAM, disk"] -->|metrics| P
  P --> G["📊 Grafana dashboard"]
  P -->|alert| O["📟 On-call engineer"]
  O -->|fix and new ideas| A`),
    "Scripting and version control for everything": M("Everything is code, so everything goes to Git", `flowchart LR
  A["💻 App code"] --> G
  P["🤖 Pipeline code<br/>Jenkinsfile"] --> G
  I["🏗️ Infrastructure code<br/>Terraform, Ansible"] --> G
  S["📜 Scripts<br/>Bash, Python"] --> G
  G[("🌿 Git repository")]`),
  });

  StudyHub.addDiagrams("devops", "iac", {
    "Traditional infrastructure deployment": M("Clicking by hand: three environments, three surprises", `flowchart LR
  E["🧑‍💻 Engineer<br/>clicks in the GUI"] --> D["🧪 Dev"]
  E --> T["🔬 Test"]
  E --> P["🏭 Prod"]
  D & T & P --> X["⚠️ slightly different<br/>slow · error-prone · not repeatable"]`),
    "Benefits of IaC": M("One code base, identical environments", `flowchart LR
  C["📄 Infrastructure code<br/>in Git"] -->|apply| D["🧪 Dev"]
  C -->|apply| T["🔬 Test"]
  C -->|apply| P["🏭 Prod"]
  C -.-> B["✅ automation · consistency<br/>history and rollback<br/>rebuild after disaster"]`),
    "Drawbacks of IaC": M("Configuration drift", `flowchart LR
  C["📄 Code says<br/>port 22 closed"] --> R["🖥️ Real server"]
  H["🙋 Manual change<br/>opens port 22"] --> R
  R --> P{"terraform plan:<br/>code = reality?"}
  P -->|no, drift!| F["🔧 Find the gap, fix it"]`),
    "Declarative vs imperative": [
      M("Imperative: you list the steps", `flowchart LR
  S1["create server"] --> S2["create server"] --> S3["create server"] --> R["run twice → 6 servers ❌"]`),
      M("Declarative: you describe the end state", `flowchart LR
  W["🎯 Wanted: 3 servers"] --> T["🛠️ Tool compares<br/>with reality"] --> A["creates only<br/>what is missing"] --> R["run twice → still 3 ✅"]`),
    ],
    "IaC tool families: provisioning vs configuration management": M("First create, then configure", `flowchart LR
  P["🏗️ Provisioning<br/>Terraform · CloudFormation<br/>ARM · Deployment Manager"] -->|creates| I["🖥️🖥️ Servers, network,<br/>load balancer"]
  I --> C["🔧 Configuration management<br/>Ansible · Puppet · Chef"]
  C -->|installs and deploys| A["🚀 Running app"]`),
    "Terraform: what it is (and isn't)": [
      M("How Terraform works", `flowchart LR
  F["📄 .tf files<br/>HCL, declarative"] --> T["🌍 Terraform<br/>HashiCorp · Go · 2014"]
  T --> A["AWS"]
  T --> Z["Azure"]
  T --> G["GCP"]
  T --> K["Kubernetes"]`),
      M("What it is NOT", `flowchart LR
  T["🌍 Terraform"] -.-x N1["❌ one code for all clouds<br/>AWS code stays AWS code"]
  T -.-x N2["❌ installing apps on servers<br/>that's Ansible's job"]`),
    ],
    "Terraform best practices": M("A well-organised Terraform project", `flowchart LR
  G["🌿 Git repo"] --> M["🧩 Modules<br/>vpc · ec2 · lb"]
  G --> V["🎚️ Variables<br/>dev / prod"]
  M & V --> T["🌍 terraform apply"]
  T <--> S[("🔒 Remote state<br/>S3 + DynamoDB lock")]
  G --> C["🛡️ tfsec in CI"]`),
    "Ansible concepts: playbooks, inventory, modules, roles": M("From the control node to the servers", `flowchart LR
  subgraph CN["🎛️ Control node"]
    direction TB
    R["📚 Role<br/>organises playbooks"] --> PB["📒 Playbook YAML<br/>plays → tasks → modules"]
    INV["📋 Inventory<br/>web: s1, s2 · db: s3"]
  end
  PB -->|SSH: push module, run, remove| S1["🖥️ s1"]
  PB --> S2["🖥️ s2"]
  PB --> S3["🖥️ s3"]
  INV -.-> PB`),
    "Ansible advanced: Vault and Galaxy": [
      M("Vault: keep secrets encrypted", `flowchart LR
  P["🔓 secrets.yml"] -->|"ansible-vault encrypt"| E["🔒 encrypted file<br/>safe in Git"]
  E -->|"decrypted at run time"| R["▶️ ansible-playbook"]`),
      M("Galaxy: reuse community roles", `flowchart LR
  G["🌌 Ansible Galaxy<br/>roles and collections"] -->|install| Y["📒 your playbook"]`),
    ],
    "Terraform vs Ansible": M("The classic combo", `flowchart LR
  T["🌍 Terraform<br/>creates VPC, EC2, LB"] -->|"outputs server IPs"| I["📋 Ansible inventory"]
  I --> A["🔧 Ansible<br/>installs Docker, deploys app"] --> R["🚀 Running service"]`),
  });

  StudyHub.addDiagrams("devops", "k8s", {
    "Why orchestration? From monolith to microservices": M("From one block to 100 containers", `flowchart LR
  M["🧱 Monolith"] --> S["📦📦📦 Microservices<br/>one container each"]
  S --> H["😵 100 containers"]
  H --> Q1["scale?"]
  H --> Q2["update?"]
  H --> Q3["monitor?"]
  H --> Q4["server dies?"]
  Q1 & Q2 & Q3 & Q4 --> O["☸️ Orchestrator"]`),
    "What orchestration tools offer": M("Three guarantees", `flowchart LR
  O(("☸️ Orchestrator")) --> A["🟢 High availability<br/>no downtime"]
  O --> S["📈 Scalability<br/>up or down with load"]
  O --> D["💾 Disaster recovery<br/>backup and restore"]`),
    "Kubernetes: definition and roles": M("You declare, Kubernetes does", `flowchart LR
  Y["👩‍💻 You: desired state"] --> K["☸️ Kubernetes<br/>open source, from Google"]
  K --> A["🚀 deploy on servers"]
  K --> B["⚖️ load-balance"]
  K --> C["📈 autoscale"]
  K --> D["👀 monitor health"]
  K --> E["❤️‍🩹 replace failed containers"]
  A & B & C & D & E --> R["🖥️ physical · VM · cloud · hybrid<br/>Docker · containerd · CRI-O"]`),
    "Service types: ClusterIP, NodePort, LoadBalancer": M("Each type wraps the previous one", `flowchart LR
  U["🌍 Internet"] --> LB["☁️ LoadBalancer<br/>public IP"]
  U2["🧪 Tester"] --> NP
  subgraph CL["Cluster"]
    direction LR
    NP["🚪 NodePort<br/>node IP : 30000–32767"] --> CI["🔒 ClusterIP<br/>internal only"]
    IN["📦 other pod"] --> CI
    CI --> P1["pod"]
    CI --> P2["pod"]
  end
  LB --> NP`),
    "Deployment: replicas and rolling updates": M("A Deployment keeps N copies alive", `flowchart TB
  D["📜 Deployment<br/>image myapp:1.0 · replicas 3"] --> R["ReplicaSet"]
  R --> P1["pod ✅"]
  R --> P2["pod ✅"]
  R --> P3["pod 💥 crashed"]
  P3 -.->|controller notices| P4["new pod ✅"]`),
    "kubectl: the command line": [
      M("Every client talks to the API server", `flowchart LR
  K["⌨️ kubectl"] --> A
  U["🖥️ UI"] --> A
  P["🔌 API"] --> A
  A["🧠 API server<br/>master node"] --> W1["🖥️ worker"]
  A --> W2["🖥️ worker"]`),
      M("The commands you need", `flowchart LR
  K(("kubectl")) --> G["get pods · get nodes<br/>list"]
  K --> AP["apply -f file.yaml<br/>create / update"]
  K --> D["describe pod x<br/>details"]
  K --> L["logs pod x<br/>output"]
  K --> S["scale --replicas=5"]
  K --> DE["delete -f file.yaml"]`),
    ],
    "Minikube: a local cluster": M("A whole cluster on your laptop", `flowchart LR
  subgraph L["💻 Laptop"]
    direction LR
    KC["⌨️ kubectl"] --> N
    subgraph V["VM or Docker container"]
      N["☸️ minikube node<br/>master + worker<br/>runtime · pods"]
    end
  end`),
  });

  StudyHub.addDiagrams("devops", "deploy", {
    "The problem: shipping a new version safely": M("How do we move users from v1 to v2?", `flowchart LR
  U["👥 Users"] --> V1["v1 🟦"]
  V1 -->|"deployment strategy<br/>= how traffic moves"| V2["v2 🟩"]
  V2 -.-> C["💭 Choose by: downtime allowed?<br/>cost? risk?"]`),
    "Feature deployment (feature toggles)": M("Code ships to all, the flag decides who sees it", `flowchart LR
  C["🚀 v2 deployed to everyone"] --> F{"🎚️ flag on?"}
  F -->|no| O["old behaviour"]
  F -->|yes| N["✨ new feature"]
  N --> S1["employees"] --> S2["1% of users"] --> S3["everyone"]`),
    "Sum-up: which strategy when?": M("Pick a strategy in 4 questions", `flowchart TB
  Q1{"Downtime OK?"} -->|yes| R["Recreate"]
  Q1 -->|no| Q2{"Confident in<br/>the release?"}
  Q2 -->|yes| Q3{"Need instant rollback<br/>and can pay ×2?"}
  Q3 -->|yes| BG["Blue/Green"]
  Q3 -->|no| RA["Ramped"]
  Q2 -->|no| Q4{"Who tests it?"}
  Q4 -->|"a % of users"| CA["Canary"]
  Q4 -->|"targeted users"| AB["A/B testing"]
  Q4 -->|"nobody, a copy of traffic"| SH["Shadow"]`),
  });
})();
