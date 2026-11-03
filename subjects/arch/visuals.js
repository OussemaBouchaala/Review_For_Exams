/* Schémas d'abord : chaque leçon d'architecture a au moins une image. */
(() => {
  const M = (caption, content) => ({ type: "mermaid", caption, content });

  StudyHub.addDiagrams("arch", "dp", {
    "Qu'est-ce qu'un patron de conception ?": [
      M("Les 4 éléments d'un patron", `flowchart LR
  N["🏷️ Nom<br/>vocabulaire commun"] --> P["❓ Problème<br/>contexte, contraintes"]
  P --> S["💡 Solution<br/>éléments + relations"]
  S --> C["⚖️ Conséquences<br/>avantages, limites"]`),
      M("Un modèle, pas du code à copier", `flowchart LR
  R["🔁 Problème récurrent"] --> T["📐 Patron<br/>= modèle réutilisable"]
  T --> A["💻 Code du projet A"]
  T --> B["💻 Code du projet B"]
  T --> C["💻 Code du projet C"]`),
    ],
    "Patrons structurels : principe": [
      M("Assembler des petites pièces en grande structure", `flowchart LR
  P["🧱 Classes et objets"] -->|composer| G["🏗️ Structure plus grande"]
  G --> H["Classes structurelles<br/>héritage · statique"]
  G --> O["Objets structurels<br/>composition · modifiable à l'exécution ✅"]`),
      M("Quatre exemples en un coup d'œil", `flowchart LR
  subgraph AD["Adapter"]
    direction LR
    c1["Client"] --> a1["Adapter"] --> o1["Ancienne interface"]
  end
  subgraph PR["Proxy"]
    direction LR
    c2["Client"] --> p2["Proxy"] --> r2["Objet réel"]
  end
  subgraph CO["Composite"]
    direction TB
    k3["Composite"] --> f3["Feuille"]
    k3 --> k4["Composite"] --> f4["Feuille"]
  end
  subgraph BR["Bridge"]
    direction LR
    ab["Abstraction"] -->|a une| im["Implémentation"]
  end`),
    ],
    "Patrons comportementaux : principe": [
      M("Qui fait quoi, et avec quel algorithme ?", `flowchart LR
  B(("🎭 Comportement")) --> C["De classe<br/>héritage répartit le travail"]
  B --> O["D'objets<br/>composition : des objets pairs<br/>coopèrent pour la tâche"]`),
      M("Quatre exemples en un coup d'œil", `flowchart LR
  subgraph CM["Command"]
    direction LR
    i1["Invocateur"] -->|"execute()"| c1["Commande"]
  end
  subgraph IT["Iterator"]
    direction LR
    i2["Client"] -->|"hasNext() / next()"| c2["Itérateur"] --> l2["Collection"]
  end
  subgraph OB["Observer"]
    direction LR
    s3["Sujet"] -->|"notify()"| o3["Observateur 1"]
    s3 -->|"notify()"| o4["Observateur 2"]
  end
  subgraph ST["Strategy"]
    direction LR
    x4["Contexte"] -->|"execute()"| y4["Stratégie A ou B"]
  end`),
    ],
  });

  StudyHub.addDiagrams("arch", "solid", {
    "SOLID : vue d'ensemble": M("5 lettres, un même but : couplage ↓, testabilité ↑", `flowchart LR
  S["S · SRP<br/>une seule raison de changer"] --> G
  O["O · OCP<br/>ajouter sans modifier"] --> G
  L["L · LSP<br/>la fille remplace la mère"] --> G
  I["I · ISP<br/>pas de méthodes inutiles"] --> G
  D["D · DIP<br/>dépendre d'abstractions"] --> G
  G(("🎯 Code souple<br/>et testable"))`),
    "Feuille de route : refactoring évolutif": M("Appliquer les principes par phases", `flowchart LR
  A["🚀 1. Démarrage<br/>vélocité · CCP<br/>peu de packages"] --> B["🏛️ 2. Structurer le cœur<br/>SAP · DIP · ADP<br/>pas de cycles, tests sans BDD"]
  B --> C["🌳 3. Maturité<br/>REP · CRP · SemVer<br/>métriques I et A dans le CI/CD"]`),
  });

  StudyHub.addDiagrams("arch", "archlog", {
    "Définition de l'architecture logicielle": [
      M("Les 3 ingrédients : sous-systèmes, règles, interfaces", `flowchart LR
  subgraph L["💻 Logiciel"]
    direction LR
    A["🧩 Sous-système A"] -->|"interface = contrat"| B["🧩 Sous-système B"]
    B -->|"règle : asynchrone"| C["🧩 Sous-système C"]
  end`),
      M("Est-ce une décision d'architecture ?", `flowchart LR
  Q["🤔 Décision"] --> S{"Structure<br/>le système ?"}
  S -->|non| N["🔧 Détail<br/>d'implémentation"]
  S -->|oui| K{"Coûteuse à<br/>changer plus tard ?"}
  K -->|non| N
  K -->|oui| Y["🏛️ Architecture"]`),
    ],
    "Le rôle de l'architecte : « le Sage »": [
      M("Le Sage entre le métier et la technique", `flowchart LR
  M["💼 Métier<br/>besoins · budget · délais"] --> A["🧙 Architecte<br/>vision globale, arbitre"]
  A --> T["🛠️ Technique<br/>équipes · infra · contraintes"]`),
      M("Ses 5 tâches, dans l'ordre", `flowchart LR
  T1["1 · Capturer les BNF"] --> T2["2 · Choisir styles<br/>et patrons"] --> T3["3 · Définir API<br/>et contrats"] --> T4["4 · Valider par POC"] --> T5["5 · Encadrer<br/>les équipes"]`),
    ],
    "Les 5 types d'architecture (niveaux de zoom)": M("Du plus large au plus proche du code", `flowchart TB
  E["🔭 5 · Entreprise<br/>stratégie ↔ SI"] --> S["4 · Système<br/>plusieurs applications"]
  S --> A["3 · Applicative<br/>MVC, Clean Architecture"]
  A --> F["2 · Macro<br/>frameworks partagés"]
  F --> P["🔬 1 · Micro<br/>design patterns"]`),
    "Familles de produits (ligne de produits)": M("Un socle commun, des points de variation", `flowchart LR
  C["🏛️ Architecture commune<br/>(figée)"] --> V1["🖥️ Affichage"]
  C --> V2["📷 Caméra"]
  C --> V3["⚙️ OS iOS / Android"]
  C --> V4["✉️ Messagerie"]
  C --> V5["📶 Connectivité"]
  V1 & V2 & V3 & V4 & V5 --> P1["📱 Modèle d'entrée"]
  V1 & V2 & V3 & V4 & V5 --> P2["📱 Modèle premium"]`),
    "Les 10 attributs de qualité": M("Deux familles de 5", `flowchart LR
  Q(("⭐ Qualité")) --> F1["🔧 Évolution et exploitation"]
  Q --> F2["🧭 Traçabilité, temps et usage"]
  F1 --> a1["Maintenabilité · changer facilement"]
  F1 --> a2["Portabilité · plusieurs plateformes"]
  F1 --> a3["Fiabilité · tient dans le temps"]
  F1 --> a4["Scalabilité · 5 comme 5 000"]
  F1 --> a5["Flexibilité · plier sans casser"]
  F2 --> b1["Auditabilité · retrouver les causes"]
  F2 --> b2["Documentation · à jour"]
  F2 --> b3["Performance · délais tenus"]
  F2 --> b4["Sécurité · auth, intégrité…"]
  F2 --> b5["Utilisabilité · facile à apprendre"]`),
    "Typologie des BNF et contraintes du projet": [
      M("Les BNF selon le moment où on les observe", `flowchart LR
  B(("📋 BNF")) --> D["👩‍💻 Développement<br/>maintenabilité · testabilité<br/>portabilité · réutilisabilité"]
  B --> E["⚡ Exécution<br/>performance · sécurité<br/>disponibilité · fiabilité"]
  B --> C["📐 Conception<br/>modularité · découplage<br/>extensibilité · scalabilité"]`),
      M("Les 4 familles de contraintes", `flowchart LR
  K(("🚧 Contraintes")) --> T["🖥️ Techniques<br/>infra imposée, legacy"]
  K --> M["💶 Métier<br/>budget, time-to-market"]
  K --> L["⚖️ Légales<br/>RGPD, NIS2, ISO 27001"]
  K --> O["👥 Organisationnelles<br/>compétences, culture DevOps"]`),
    ],
    "Pas d'architecture parfaite : arbitrer": M("Chaque gain se paie ailleurs : l'architecte arbitre", `flowchart LR
  S1["🔐 Sécurité"] <-->|vs| P1["⚡ Performance"]
  D1["🧩 Découplage"] <-->|vs| C1["🌀 Complexité, coût"]
  A1["📜 Auditabilité"] <-->|vs| P2["⚡ Performance"]
  V1["🟢 Disponibilité"] <-->|vs| C2["🔁 Cohérence"]
  S2["🔐 Sécurité"] <-->|vs| U1["🙂 Utilisabilité"]`),
    "Synthèse : atelier télé-médecine et 5 principes": [
      M("Q4 · Les 4 couches de la plateforme", `flowchart TB
  M["💼 Métier<br/>parcours de soin, téléconsultation"] --> F["🧩 Fonctionnelle<br/>RDV, dossier, alertes, assistant IA"]
  F --> A["🖥️ Applicative<br/>services RDV, dossiers, streaming, RAG"]
  A --> T["🔧 Technique<br/>serveurs HDS, BDD chiffrée, bus, conteneurs"]`),
      M("Q3 · Constantes vitales en asynchrone", `flowchart LR
  C["🩺 Capteurs patient"] --> K["📨 Flux d'événements<br/>type Kafka"]
  K --> D["📁 Dossier patient"]
  K --> AL["🚨 Alerte critique<br/>traitement prioritaire"]`),
      M("Les 5 principes de l'architecte", `flowchart LR
  P1["1 · Qualité dès le jour 1"] --> P2["2 · Découpler pour évoluer"] --> P3["3 · Assumer les compromis"] --> P4["4 · Rester pragmatique<br/>monolithe modulaire d'abord"] --> P5["5 · Anticiper IA et Green IT"]`),
    ],
  });
})();
