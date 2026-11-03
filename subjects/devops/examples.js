/* Concrete, real-world examples for the DevOps lessons. */
StudyHub.addExamples("devops", "intro", {
  "The application release process": "A Tunisian startup builds a food-delivery app. **Idea**: let users track their courier live. **Code**: the map feature. **Test**: does it work on Android and iOS? **Build**: an APK and a backend Docker image. **Deploy**: on a cloud server with the firewall opened on port 443. **Monitor**: are orders failing at lunchtime rush?",
  "It never ends: continuous delivery of new versions": "Instagram, WhatsApp or your banking app update every few weeks: bug fixes, new stickers, faster loading. Each update is one more trip through code → test → build → deploy.",
  "Roadblock 1: miscommunication and lack of collaboration": "The dev team says \"it works on my machine\" and hands over a ZIP with a 2-line README. Ops discover on deployment day that the app needs Java 21 and a Redis server nobody mentioned. Two weeks of emails follow.",
  "Roadblock 2: conflict of interest": "Marketing wants the new \"Black Friday\" feature live tomorrow (devs push hard). Ops refuse to deploy on the busiest sales week of the year (stability). Same company, opposite incentives.",
  "Roadblock 3: security, testing and manual work": "An engineer deploys by SSH-ing into the server and typing 30 commands from a wiki page. He forgets one, the site breaks at 2 a.m., and nobody can tell exactly what was changed or rebuild the server identically.",
  "DevOps: removing any roadblock": "Amazon is famous for deploying to production thousands of times per day: small changes, fully automated pipelines, and teams that own their service from code to production.",
  "DevOps in practice: the DevOps engineer": "A typical job ad: \"build and maintain our CI/CD pipelines in GitLab CI, containerise services with Docker, deploy on Kubernetes (EKS), manage infrastructure with Terraform, monitoring with Prometheus/Grafana.\"",
  "DevOps vs SRE": "Google invented SRE: a team agrees an **SLO** such as \"99.9% of requests succeed each month\". As long as the error budget isn't spent, developers can ship fast; if it is, releases slow down to fix reliability.",
});

StudyHub.addExamples("devops", "cicd", {
  "Continuous Integration (CI)": "A student project on GitHub with **GitHub Actions**: every push runs `mvn test`; a red ❌ appears on the commit within 3 minutes if a classmate broke something, instead of discovering it the night before the demo.",
  "Continuous Delivery vs Continuous Deployment (CD)": "A bank uses **Continuous Delivery**: every build is ready, but a release manager clicks \"deploy\" on Tuesday mornings. Netflix-style teams use **Continuous Deployment**: a green pipeline goes straight to production.",
  "Virtual machines vs containers": "On one laptop you can run 2–3 VirtualBox VMs before it slows down, but 20 Docker containers (a database, a cache, 5 microservices...) start in seconds with `docker compose up`.",
  "Cloud providers (IaaS)": "Instead of buying a 5,000 € server, a startup rents an AWS EC2 instance for a few euros a day, adds a managed database (RDS), and shuts everything down at night to pay less.",
  "Container orchestration": "Spotify, Airbnb and most large platforms run thousands of containers on Kubernetes; nobody could restart crashed containers by hand at that scale.",
  "Monitoring": "A Grafana dashboard fed by Prometheus shows response time climbing from 200 ms to 3 s at 12:05. An alert pings the on-call engineer on Slack before customers start complaining.",
});

StudyHub.addExamples("devops", "iac", {
  "Traditional infrastructure deployment": "Setting up a test environment by clicking in the AWS console: 40 screens, VPC, subnets, security groups, instances. Three months later, nobody remembers which checkbox made it work, and the production copy behaves differently.",
  "What is Infrastructure as Code (IaC)?": "The same `main.tf` creates the **dev**, **staging** and **prod** environments, only the variables change (instance size, number of servers). A new colleague gets a full environment with one command.",
  "Drawbacks of IaC": "Drift in real life: during an incident, someone opens port 22 to the whole internet by hand \"just for 5 minutes\" and forgets. The Terraform code still says it's closed; the next `terraform plan` reveals the difference.",
  "Declarative vs imperative": "Imperative: a Bash script that runs `create server`, `create server`, `create server`. Run it twice → 6 servers. Declarative: Terraform says `count = 3`. Run it twice → still 3 servers.",
  "The Terraform workflow: Write → Plan → Apply": "A pull request changes `instance_type` from t2.micro to t2.large. CI runs `terraform plan` and posts \"1 to change\" in the PR; after review, `terraform apply` resizes the server.",
  "Ansible: introduction": "A university IT team updates nginx on 50 lab servers with one `ansible-playbook` command over SSH, without installing anything on the servers, and re-running it is harmless.",
  "Terraform vs Ansible": "Common combo: Terraform creates 3 EC2 instances and a load balancer, outputs their IPs into an Ansible inventory, then Ansible installs Docker and deploys the app on them.",
});

StudyHub.addExamples("devops", "k8s", {
  "Why orchestration? From monolith to microservices": "An e-commerce site split into catalogue, cart, payment, user, search and notification services, each with 3–10 copies: that's already 40+ containers before counting databases.",
  "Architecture: master node and worker nodes": "On a managed cloud cluster (AWS EKS, Google GKE, Azure AKS), the provider runs the master node for you; you only pay for and see the worker nodes.",
  "Service: a stable address and load balancer": "The cart service calls `http://payment:80` (the Service's DNS name) instead of a pod IP; pods of the payment service can be restarted, moved or scaled from 2 to 20 without changing the cart's code.",
  "Service types: ClusterIP, NodePort, LoadBalancer": "Database: **ClusterIP** (never exposed). Quick demo on Minikube: **NodePort** (`minikube service my-app`). Public website on GKE: **LoadBalancer** gets a public IP.",
  "Minikube: a local cluster": "`minikube start --driver=docker` then `kubectl get nodes` shows a single node named `minikube`: master and worker at once, on your laptop.",
});

StudyHub.addExamples("devops", "deploy", {
  "Recreate (Big Bang)": "A university's grade portal shows \"Maintenance tonight 22:00–23:00\": they stop the old version, migrate the database and start the new one. Acceptable because nobody needs it at night.",
  "Ramped (rolling update, incremental)": "Running `kubectl set image deploy/my-app my-app=myapp:2.0` on a 10-pod Deployment: pods are replaced a couple at a time, and the website never goes down.",
  "Blue/Green (red/black)": "An online bank keeps two identical production environments. Release night: green is tested end-to-end, the router flips to green at 2 a.m.; a bug at 2:10 → flip back to blue in seconds.",
  "Canary": "Mobile app stores do it too: Google Play's **staged rollout** releases an update to 5% of users first, then 20%, 50%, 100% if the crash rate stays low.",
  "A/B testing": "An online shop shows a green \"Buy now\" button to half of its French visitors and the old blue one to the other half, and keeps the version with the higher conversion rate.",
  "Shadow (mirrored, dark)": "A payment company rewrites its fraud-detection service. For two weeks, the new version receives a copy of every real transaction and its decisions are only logged and compared, never applied.",
  "Feature deployment (feature toggles)": "Large platforms do this daily: the code for a new feature ships to everyone, but a flag turns it on only for employees, then 1% of users, then everyone.",
});
