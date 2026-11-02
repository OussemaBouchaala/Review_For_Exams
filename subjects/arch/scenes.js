/* Explications animées pas à pas pour le module RT4, rattachées aux leçons par titre de section. */
StudyHub.addScenes("arch", "dp", {
  "Singleton": {
    title: "une seule instance pour tous",
    w: 620, h: 300,
    nodes: [
      { id: "c1", x: 85, y: 60, icon: "🧑‍💻", label: "Client A", w: 110 },
      { id: "c2", x: 85, y: 150, icon: "🧑‍💻", label: "Client B", w: 110 },
      { id: "c3", x: 85, y: 240, icon: "🧑‍💻", label: "Client C", w: 110 },
      { id: "cls", x: 310, y: 150, icon: "🔒", label: "Singleton\ngetInstance()", w: 150, kind: "accent" },
      { id: "inst", x: 530, y: 150, icon: "⭐", label: "instance\nunique", w: 120, at: 1 },
    ],
    edges: [{ from: "c1", to: "cls" }, { from: "c2", to: "cls" }, { from: "c3", to: "cls" }, { from: "cls", to: "inst" }],
    steps: [
      { say: "Client A appelle `getInstance()`. L'instance n'existe pas encore : `instance == null`.", send: [{ from: "c1", to: "cls", label: "getInstance()" }], note: { cls: "instance == null" } },
      { say: "Le Singleton crée **l'unique** instance. Son constructeur est **privé** : personne d'autre ne peut faire `new`.", send: [{ from: "cls", to: "inst", label: "new (privé)", tone: "alt" }], ok: ["inst"], note: { cls: "instance créée" } },
      { say: "Client B et Client C appellent aussi `getInstance()` : ils reçoivent **la même** référence.", send: [{ from: "c2", to: "cls", label: "getInstance()" }, { from: "c3", to: "cls", label: "getInstance()", delay: 300 }, { from: "cls", to: "c2", label: "même ref", tone: "good", delay: 1300 }, { from: "cls", to: "c3", label: "même ref", tone: "good", delay: 1500 }], ok: ["c2", "c3"] },
      { say: "`synchronized` : un seul thread à la fois dans `getInstance()`, donc jamais deux instances.", hl: ["cls"], note: { cls: "synchronized 🔒" } },
    ],
  },
  "Factory (Fabrique)": {
    title: "le client ne fait jamais new",
    w: 620, h: 290,
    nodes: [
      { id: "cl", x: 90, y: 145, icon: "🧑‍💻", label: "Client" },
      { id: "f", x: 305, y: 145, icon: "🏭", label: "ProductFactory", w: 150, kind: "accent" },
      { id: "p1", x: 525, y: 70, icon: "📦", label: "OneProduct", w: 130, at: 1 },
      { id: "p2", x: 525, y: 220, icon: "📦", label: "AnotherProduct", w: 140, at: 3 },
    ],
    edges: [{ from: "cl", to: "f" }, { from: "f", to: "p1" }, { from: "f", to: "p2" }],
    steps: [
      { say: "Le client ne fait pas `new OneProduct()`. Il demande à la **fabrique** : `createProduct(\"ID1\")`.", send: [{ from: "cl", to: "f", label: "create(\"ID1\")" }] },
      { say: "La fabrique contient la **logique d'instanciation** : elle choisit la classe concrète et la crée.", send: [{ from: "f", to: "p1", label: "new", tone: "alt" }], ok: ["p1"] },
      { say: "Elle renvoie l'objet via l'**interface commune** `Product` : le client ignore la classe concrète.", send: [{ from: "f", to: "cl", label: "Product", tone: "good" }], note: { cl: "Product p" } },
      { say: "Autre identifiant, autre classe. Le code client reste **identique** (cf. DocumentBuilderFactory, URLConnection).", send: [{ from: "cl", to: "f", label: "create(\"ID2\")" }, { from: "f", to: "p2", label: "new", tone: "alt", delay: 1200 }], ok: ["p2"] },
    ],
  },
  "Adaptateur (Adapter)": {
    title: "traduire une interface",
    w: 620, h: 290,
    nodes: [
      { id: "ap", x: 95, y: 145, icon: "🎵", label: "AudioPlayer", w: 130 },
      { id: "ad", x: 310, y: 145, icon: "🔌", label: "MediaAdapter", w: 140, kind: "accent", at: 1 },
      { id: "vlc", x: 525, y: 70, icon: "🎬", label: "VlcPlayer", w: 120, at: 2 },
      { id: "mp4", x: 525, y: 220, icon: "🎞️", label: "Mp4Player", w: 120, at: 3 },
    ],
    edges: [{ from: "ap", to: "ad" }, { from: "ad", to: "vlc" }, { from: "ad", to: "mp4" }],
    steps: [
      { say: "`AudioPlayer` implémente `MediaPlayer.play()` et sait lire le **mp3** tout seul.", hl: ["ap"], note: { ap: "mp3 ✓" } },
      { say: "Pour un **vlc**, il ne connaît pas l'interface `AdvancedMediaPlayer`. Il délègue à l'**adaptateur**.", send: [{ from: "ap", to: "ad", label: "play(\"vlc\")" }] },
      { say: "L'adaptateur **traduit** l'appel vers l'interface attendue : `playVlc(file)`.", send: [{ from: "ad", to: "vlc", label: "playVlc()", tone: "alt" }], ok: ["vlc"] },
      { say: "Même chose pour le mp4 : `playMp4(file)`. Le client garde **sa** propre interface, rien n'est modifié.", send: [{ from: "ap", to: "ad", label: "play(\"mp4\")" }, { from: "ad", to: "mp4", label: "playMp4()", tone: "alt", delay: 1200 }], ok: ["mp4", "ap"] },
    ],
  },
  "Composite": {
    title: "une délégation récursive",
    w: 620, h: 330,
    nodes: [
      { id: "ed", x: 95, y: 55, icon: "🖊️", label: "GraphicsEditor", w: 140 },
      { id: "cs", x: 330, y: 55, icon: "🧩", label: "ComplexShape", w: 140, kind: "accent" },
      { id: "l", x: 170, y: 180, icon: "📏", label: "Line", w: 100 },
      { id: "r", x: 310, y: 180, icon: "⬛", label: "Rectangle", w: 110 },
      { id: "cs2", x: 470, y: 180, icon: "🧩", label: "ComplexShape", w: 140 },
      { id: "l2", x: 400, y: 290, icon: "📏", label: "Line", w: 100 },
      { id: "r2", x: 540, y: 290, icon: "⬛", label: "Rectangle", w: 110 },
    ],
    edges: [{ from: "ed", to: "cs" }, { from: "cs", to: "l" }, { from: "cs", to: "r" }, { from: "cs", to: "cs2" }, { from: "cs2", to: "l2" }, { from: "cs2", to: "r2" }],
    steps: [
      { say: "L'éditeur appelle `renderShapeToScreen()` sur **une seule** forme. Il ne sait pas si elle est simple ou composée.", send: [{ from: "ed", to: "cs", label: "render()" }] },
      { say: "Le composite **délègue** l'appel à chacun de ses enfants (`shapeList`).", send: [{ from: "cs", to: "l", label: "render()" }, { from: "cs", to: "r", label: "render()", delay: 200 }, { from: "cs", to: "cs2", label: "render()", delay: 400 }], ok: ["l", "r"] },
      { say: "Un enfant peut lui-même être un composite : la délégation est **récursive**, à n'importe quelle profondeur.", send: [{ from: "cs2", to: "l2", label: "render()" }, { from: "cs2", to: "r2", label: "render()", delay: 200 }], ok: ["l2", "r2", "cs2"] },
      { say: "Feuilles et composites partagent l'interface `Shape` : le client les traite **uniformément** (structure arborescente).", ok: ["cs"], hl: ["ed"] },
    ],
  },
  "Commande (Command)": {
    title: "une demande devient un objet",
    w: 620, h: 270,
    nodes: [
      { id: "cl", x: 90, y: 135, icon: "🧑", label: "Client" },
      { id: "ag", x: 310, y: 135, icon: "🧑‍💼", label: "Agent\n(invocateur)", w: 140, kind: "accent" },
      { id: "st", x: 530, y: 135, icon: "📈", label: "StockTrade\n(récepteur)", w: 140 },
    ],
    edges: [{ from: "cl", to: "ag" }, { from: "ag", to: "st" }],
    steps: [
      { say: "Le client **encapsule** chaque demande dans un objet `Order` : `BuyStockOrder`, `SellStockOrder`.", send: [{ from: "cl", to: "ag", label: "BuyStockOrder", tone: "good" }, { from: "cl", to: "ag", label: "SellStockOrder", tone: "bad", delay: 800 }] },
      { say: "L'invocateur `Agent` les **met en file d'attente** (`m_ordersQueue`) sans savoir ce qu'elles font.", hl: ["ag"], note: { ag: "file : [Buy, Sell]" } },
      { say: "`placeOrders()` : l'agent appelle `execute()` sur chaque commande, qui agit sur le **récepteur** `StockTrade`.", send: [{ from: "ag", to: "st", label: "execute() → buy()", tone: "good" }, { from: "ag", to: "st", label: "execute() → sell()", tone: "bad", delay: 1200 }], note: { ag: "file : [ ]", st: "buy ✓  sell ✓" }, ok: ["st"] },
      { say: "Découplage total entre qui **demande** et qui **exécute** : on peut journaliser, annuler ou rejouer les commandes.", hl: ["ag"] },
    ],
  },
  "Observer (Observateur)": {
    title: "1 changement → N mises à jour",
    w: 620, h: 320,
    nodes: [
      { id: "s", x: 120, y: 160, icon: "📢", label: "Subject\nsetState()", w: 140, kind: "accent" },
      { id: "b", x: 500, y: 60, icon: "0️⃣", label: "BinaryObserver", w: 150 },
      { id: "o", x: 500, y: 160, icon: "8️⃣", label: "OctalObserver", w: 150 },
      { id: "x", x: 500, y: 260, icon: "🔣", label: "HexaObserver", w: 150 },
    ],
    edges: [{ from: "s", to: "b" }, { from: "s", to: "o" }, { from: "s", to: "x" }],
    steps: [
      { say: "Chaque observateur s'**abonne** au sujet : `attach(this)`.", send: [{ from: "b", to: "s", label: "attach", tone: "alt" }, { from: "o", to: "s", label: "attach", tone: "alt", delay: 250 }, { from: "x", to: "s", label: "attach", tone: "alt", delay: 500 }] },
      { say: "`setState(15)` : l'état du sujet change.", hl: ["s"], note: { s: "state = 15" } },
      { say: "Le sujet appelle `notifyAllObservers()` : chaque observateur reçoit `update()`.", send: [{ from: "s", to: "b", label: "update()" }, { from: "s", to: "o", label: "update()", delay: 150 }, { from: "s", to: "x", label: "update()", delay: 300 }] },
      { say: "Chacun réagit à sa façon : Binaire **1111**, Octal **17**, Hexa **F**.", ok: ["b", "o", "x"], note: { b: "1111", o: "17", x: "F" } },
      { say: "`setState(10)` → **1010, 12, A**. Le sujet ne connaît que l'interface Observer : **couplage faible**.", clear: true, note: { s: "state = 10", b: "1010", o: "12", x: "A" }, send: [{ from: "s", to: "b", label: "update()" }, { from: "s", to: "o", label: "update()", delay: 150 }, { from: "s", to: "x", label: "update()", delay: 300 }] },
    ],
  },
});

StudyHub.addScenes("arch", "solid", {
  "D — Dependency Inversion Principle (DIP)": {
    title: "inverser la flèche",
    w: 620, h: 310,
    nodes: [
      { id: "sn", x: 130, y: 160, icon: "🔔", label: "ServiceNotification\n(haut niveau)", w: 180 },
      { id: "i", x: 330, y: 50, icon: "🧩", label: "«interface»\nMessageService", w: 170, kind: "accent", at: 2 },
      { id: "em", x: 510, y: 160, icon: "📧", label: "EmailService\n(bas niveau)", w: 150 },
      { id: "sms", x: 510, y: 262, icon: "💬", label: "SmsService", w: 130, at: 4 },
    ],
    edges: [
      { from: "sn", to: "em", until: 2 },
      { from: "sn", to: "i" }, { from: "em", to: "i", dashed: true, label: "implémente" }, { from: "sms", to: "i", dashed: true },
    ],
    steps: [
      { say: "Avant : `ServiceNotification` (haut niveau) crée et appelle **directement** `EmailService` (bas niveau).", send: [{ from: "sn", to: "em", label: "new EmailService()" }], hl: ["sn"] },
      { say: "Problème : passer aux SMS oblige à **modifier le haut niveau**. Il dépend fortement du détail concret.", fail: ["sn"], cut: [0] },
      { say: "DIP : on introduit une **abstraction** `MessageService`. Le haut niveau ne dépend plus que d'elle…", clear: true, send: [{ from: "sn", to: "i", label: "envoyer(msg)" }] },
      { say: "…et le détail l'**implémente** : la flèche de dépendance est **inversée**, elle pointe vers l'abstraction.", send: [{ from: "em", to: "i", label: "implémente", tone: "alt" }], ok: ["em"] },
      { say: "Ajouter `SmsService` ne touche plus au haut niveau. C'est la base de l'**architecture hexagonale** (ports & adaptateurs).", send: [{ from: "sms", to: "i", label: "implémente", tone: "alt" }], ok: ["sms", "sn"] },
    ],
  },
  "Couplage des packages : ADP, SDP, SAP": {
    title: "casser un cycle (ADP)",
    w: 620, h: 300,
    nodes: [
      { id: "a", x: 140, y: 80, icon: "📦", label: "Package A" },
      { id: "b", x: 480, y: 80, icon: "📦", label: "Package B" },
      { id: "c", x: 310, y: 235, icon: "📦", label: "Package C\n(commun)", w: 140, kind: "accent", at: 2 },
    ],
    edges: [
      { from: "a", to: "b", bend: -40 }, { from: "b", to: "a", bend: -40, until: 2 },
      { from: "a", to: "c" }, { from: "b", to: "c" },
    ],
    steps: [
      { say: "A dépend de B **et** B dépend de A : un **cycle**. Le graphe de packages n'est plus un DAG.", send: [{ from: "a", to: "b", label: "dépend" }, { from: "b", to: "a", label: "dépend", tone: "bad", delay: 1100 }] },
      { say: "**Syndrome du lendemain matin** : une modification dans B casse le build de A… qui casse B.", note: { b: "modifié hier soir" }, send: [{ from: "b", to: "a", label: "💥", tone: "bad" }, { from: "a", to: "b", label: "💥", tone: "bad", delay: 1200 }], fail: ["a", "b"] },
      { say: "Solution 2 : extraire les classes communes responsables du cycle dans un **nouveau package C** (solution 1 : DIP, une interface inverse une flèche).", clear: true, note: { b: "" }, send: [{ from: "a", to: "c", label: "dépend" }, { from: "b", to: "c", label: "dépend", delay: 300 }] },
      { say: "Le graphe redevient **acyclique** : A → B, A → C, B → C. Chaque build est de nouveau prévisible.", ok: ["a", "b", "c"] },
    ],
  },
  "Métriques : Ca, Ce, I, A et la distance D": {
    title: "calculer l'instabilité I",
    w: 620, h: 310,
    nodes: [
      { id: "i1", x: 85, y: 60, icon: "🔹", label: "Classe X", w: 110 },
      { id: "i2", x: 85, y: 155, icon: "🔹", label: "Classe Y", w: 110 },
      { id: "i3", x: 85, y: 250, icon: "🔹", label: "Classe Z", w: 110 },
      { id: "p", x: 310, y: 155, icon: "📦", label: "Package P", w: 140, kind: "accent" },
      { id: "o1", x: 530, y: 155, icon: "📚", label: "Lib externe", w: 120 },
    ],
    edges: [{ from: "i1", to: "p" }, { from: "i2", to: "p" }, { from: "i3", to: "p" }, { from: "p", to: "o1" }],
    steps: [
      { say: "**Ca (couplage afférent)** : les classes extérieures qui **dépendent de P**. Ici 3 → c'est sa **responsabilité**.", hl: ["i1", "i2", "i3"], send: [{ from: "i1", to: "p", label: "→" }, { from: "i2", to: "p", label: "→", delay: 250 }, { from: "i3", to: "p", label: "→", delay: 500 }], note: { p: "Ca = 3" } },
      { say: "**Ce (couplage efférent)** : les classes extérieures **dont P dépend**. Ici 1 → sa **dépendance**.", send: [{ from: "p", to: "o1", label: "→", tone: "alt" }], note: { p: "Ca = 3 · Ce = 1" } },
      { say: "**I = Ce / (Ca + Ce) = 1 / (3 + 1) = 0,25** : plutôt **stable**, beaucoup de monde compte sur lui.", ok: ["p"], note: { p: "I = 0,25" } },
      { say: "SAP : un package stable doit être **abstrait**. Avec A = 0,75 → **D = |0,75 + 0,25 − 1| = 0** : sur la séquence principale.", hl: ["p"], note: { p: "A = 0,75 → D = 0" } },
    ],
  },
});

StudyHub.addScenes("arch", "archlog", {
  "Mise en situation : le crash de ShopExpress": {
    title: "l'effet domino du Black Friday",
    w: 620, h: 300,
    zones: [{ x: 182, y: 14, w: 196, h: 272, label: "Un seul gros bloc" }],
    nodes: [
      { id: "u", x: 80, y: 150, icon: "👥", label: "50 000\nutilisateurs", w: 120 },
      { id: "cat", x: 280, y: 65, icon: "🛍️", label: "Catalogue", w: 130 },
      { id: "pay", x: 280, y: 150, icon: "💳", label: "Paiement", w: 130 },
      { id: "rec", x: 280, y: 235, icon: "✨", label: "Recommandations", w: 150 },
      { id: "db", x: 520, y: 150, icon: "🗄️", label: "BDD centrale", w: 130 },
    ],
    edges: [
      { from: "u", to: "cat" }, { from: "u", to: "pay" }, { from: "u", to: "rec" },
      { from: "cat", to: "db" }, { from: "pay", to: "db" }, { from: "rec", to: "db" },
    ],
    steps: [
      { say: "Black Friday : **50 000 utilisateurs** simultanés frappent un seul bloc où tout est imbriqué.", send: [0, 1, 2, 3, 4, 5].map((i) => ({ from: "u", to: ["cat", "pay", "rec"][i % 3], label: "req", delay: i * 220 })) },
      { say: "Tous les modules interrogent la **même base centrale**. Elle **sature**.", send: [0, 1, 2, 3, 4, 5].map((i) => ({ from: ["cat", "pay", "rec"][i % 3], to: "db", label: "SQL", delay: i * 200 })), fail: ["db"], note: { db: "saturée" } },
      { say: "Effet domino : les commandes échouent, le paiement **gèle**… et même une panne de recommandation bloque l'achat.", fail: ["cat", "pay", "rec"], note: { pay: "gelé" } },
      { say: "Ce n'est pas un bug de code : c'est un problème d'**architecture**. Scalabilité, disponibilité et découplage ont été négligés.", hl: ["db"] },
    ],
  },
  "Même fonctionnalités, qualités différentes : 3 versions": {
    title: "BDD partagée vs base par service",
    w: 620, h: 300,
    zones: [{ x: 8, y: 14, w: 296, h: 276, label: "V1 · BDD partagée" }, { x: 316, y: 14, w: 296, h: 276, label: "V3 · une base par service" }],
    nodes: [
      { id: "a1", x: 80, y: 75, label: "A1", w: 90 }, { id: "a2", x: 80, y: 160, label: "A2", w: 90 }, { id: "a3", x: 80, y: 245, label: "A3", w: 90 },
      { id: "db", x: 225, y: 160, icon: "🗄️", label: "Data\npartagée", w: 110 },
      { id: "b1", x: 385, y: 75, label: "A1", w: 90 }, { id: "b2", x: 385, y: 160, label: "A2", w: 90 }, { id: "b3", x: 385, y: 245, label: "A3", w: 90 },
      { id: "d1", x: 535, y: 75, icon: "🗄️", label: "Data 1", w: 100 }, { id: "d2", x: 535, y: 160, icon: "🗄️", label: "Data 2", w: 100 }, { id: "d3", x: 535, y: 245, icon: "🗄️", label: "Data 3", w: 100 },
    ],
    edges: [
      { from: "a1", to: "db" }, { from: "a2", to: "db" }, { from: "a3", to: "db" },
      { from: "b1", to: "d1" }, { from: "b2", to: "d2" }, { from: "b3", to: "d3" },
      { from: "b2", to: "b1", dashed: true, at: 4, label: "API" },
    ],
    steps: [
      { say: "Mêmes fonctionnalités des deux côtés. **V1** : une base **partagée**. **V3** : chaque service possède **ses** données.", hl: ["db", "d1", "d2", "d3"] },
      { say: "V1 : A1 modifie une table pour ses propres besoins…", send: [{ from: "a1", to: "db", label: "ALTER TABLE", tone: "alt" }], note: { db: "schéma modifié" } },
      { say: "…et **A2 casse sans avertissement** : couplage fort par les données.", send: [{ from: "db", to: "a2", label: "💥", tone: "bad" }], fail: ["a2"] },
      { say: "V3 : A1 modifie **sa** base. Les autres ne voient rien : évolution et tests **indépendants**.", send: [{ from: "b1", to: "d1", label: "ALTER TABLE", tone: "alt" }], ok: ["b1", "b2", "b3"] },
      { say: "Le prix : pour obtenir des données d'A1, A2 doit passer par le **réseau** → performance en retrait. Un BNF se gagne au prix d'un autre.", send: [{ from: "b2", to: "b1", label: "GET" }, { from: "b1", to: "b2", label: "data", tone: "good", delay: 1100 }], note: { b2: "+ latence réseau" } },
    ],
  },
  "Le scénario de qualité (6 éléments)": {
    title: "S · S · A · E · R · M",
    w: 620, h: 320,
    nodes: [
      { id: "s", x: 105, y: 75, icon: "😈", label: "1 · Source\nhacker externe", w: 170 },
      { id: "st", x: 310, y: 75, icon: "⚡", label: "2 · Stimulus\nmodifier des données", w: 180, at: 1 },
      { id: "a", x: 515, y: 75, icon: "🗄️", label: "3 · Artifact\nBDD + service", w: 170, at: 2 },
      { id: "env", x: 515, y: 245, icon: "🌡️", label: "4 · Environment\nserveur en surcharge", w: 180, kind: "ghost", at: 3 },
      { id: "r", x: 310, y: 245, icon: "🛡️", label: "5 · Response\naccès bloqué + log", w: 180, at: 4 },
      { id: "m", x: 105, y: 245, icon: "📏", label: "6 · Measure\n0 perte · alerte < 1 s", w: 180, kind: "accent", at: 5 },
    ],
    edges: [{ from: "s", to: "st" }, { from: "st", to: "a" }, { from: "env", to: "a", dashed: true }, { from: "a", to: "r" }, { from: "r", to: "m" }],
    steps: [
      { say: "**1. Source** : qui déclenche l'événement ? Ici un **hacker externe**.", hl: ["s"] },
      { say: "**2. Stimulus** : l'événement lui-même : tenter de **modifier des données confidentielles**.", send: [{ from: "s", to: "st", label: "attaque", tone: "bad" }] },
      { say: "**3. Artifact** : la partie du système sollicitée : la **base de données et le service de données**.", send: [{ from: "st", to: "a", label: "requête", tone: "bad" }] },
      { say: "**4. Environment** : dans quelles conditions ? **Serveur en surcharge**.", hl: ["env"] },
      { say: "**5. Response** : ce que fait le système : **accès bloqué, trace dans l'audit log**.", send: [{ from: "a", to: "r", label: "bloqué", tone: "good" }], ok: ["a"] },
      { say: "**6. Response measure** : le critère **chiffré et testable** : 0 donnée perdue, alerte en moins d'1 s.", send: [{ from: "r", to: "m", label: "mesure", tone: "good" }], ok: ["r", "m"] },
    ],
  },
  "Synchrone vs asynchrone": {
    title: "attendre ou déposer",
    w: 620, h: 340,
    zones: [{ x: 8, y: 10, w: 604, h: 120, label: "Synchrone · REST / gRPC" }, { x: 8, y: 145, w: 604, h: 188, label: "Asynchrone · Kafka / RabbitMQ" }],
    nodes: [
      { id: "c1", x: 80, y: 75, icon: "🧑", label: "Client", w: 104 },
      { id: "s1", x: 290, y: 75, label: "Service 1", w: 110 },
      { id: "s2", x: 500, y: 75, label: "Service 2", w: 110 },
      { id: "c2", x: 80, y: 240, icon: "🧑", label: "Client", w: 104 },
      { id: "t1", x: 245, y: 240, label: "Service 1", w: 110 },
      { id: "q", x: 400, y: 240, icon: "📬", label: "File / bus", w: 110, kind: "accent" },
      { id: "u2", x: 545, y: 190, label: "Service 2", w: 100 },
      { id: "u3", x: 545, y: 290, label: "Service 3", w: 100 },
    ],
    edges: [
      { from: "c1", to: "s1" }, { from: "s1", to: "s2" },
      { from: "c2", to: "t1" }, { from: "t1", to: "q" }, { from: "q", to: "u2" }, { from: "q", to: "u3" },
    ],
    steps: [
      { say: "**Synchrone** : le client attend que **toute la chaîne** ait répondu. Les latences s'additionnent.", note: { c1: "⏳ attend…" }, send: [{ from: "c1", to: "s1", label: "req" }, { from: "s1", to: "s2", label: "req", delay: 1000 }, { from: "s2", to: "s1", label: "rép", tone: "good", delay: 2000 }, { from: "s1", to: "c1", label: "rép", tone: "good", delay: 3000 }] },
      { say: "Si Service 2 tombe, la panne **remonte** jusqu'au client : **effet domino** (couplage temporel fort).", fail: ["s2"], send: [{ from: "c1", to: "s1", label: "req" }, { from: "s1", to: "s2", label: "req", delay: 1000 }, { from: "s1", to: "c1", label: "erreur", tone: "bad", delay: 2100 }], note: { c1: "✕ erreur" } },
      { say: "**Asynchrone** : Service 1 **dépose** un événement dans la file et répond tout de suite. Le client n'attend pas.", send: [{ from: "c2", to: "t1", label: "req" }, { from: "t1", to: "q", label: "event", delay: 1000 }, { from: "t1", to: "c2", label: "OK", tone: "good", delay: 1100 }], note: { c2: "✓ pas d'attente" } },
      { say: "Les consommateurs traitent **à leur rythme**. Si l'un tombe, ses messages l'attendent : **résilience**, au prix d'une **cohérence éventuelle**.", fail: ["u3"], ok: ["u2"], send: [{ from: "q", to: "u2", label: "event" }, { from: "q", to: "u3", label: "event", delay: 600 }], note: { q: "1 msg en attente" } },
    ],
  },
});
