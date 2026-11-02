/* Exemples concrets du quotidien + scènes animées supplémentaires (pilotées par le défilement) pour le module RT4. */

// ---------- Chapitre 1 : patrons de conception ----------
StudyHub.addExamples("arch", "dp", {
  "Qu'est-ce qu'un patron de conception ?": "Une **recette de cuisine** : *nom* « pâte brisée », *problème* « une base de tarte qui ne se détrempe pas », *solution* « farine + beurre froid + cuisson à blanc », *conséquences* « plus long, mais croustillant ». Un patron de conception, c'est la même chose pour un problème de code qui revient souvent.",
  "Les patrons GoF : objectif et portée": "Ranger une **boîte à outils** : un tiroir pour *fabriquer* (création), un pour *assembler* (structure), un pour *faire travailler ensemble* (comportement). Portée **classe** = l'outil est vissé à l'établi (héritage, figé à la compilation) ; portée **objet** = l'outil est posé dessus, on peut le changer pendant l'exécution (composition).",
  "Singleton": "Le **président d'un pays** : un seul à la fois, et tout le monde passe par le même bureau pour le joindre. En code : le `Logger` de l'application, l'objet de **configuration**, le **pool de connexions** à la base. Tous les modules doivent écrire dans le *même* journal, pas dans 10 copies.",
  "Factory (Fabrique)": "Au **fast-food**, tu commandes « un menu n°3 » au comptoir : tu ne vas pas en cuisine, et tu ne sais pas qui le prépare ni comment. Le comptoir (la fabrique) choisit et te rend un plateau (l'interface commune). En Java : `DocumentBuilderFactory.newInstance()` te rend un parseur XML sans que tu connaisses sa classe.",
  "Adaptateur (Adapter)": "Ton chargeur de PC européen à **Londres** : l'**adaptateur de prise** transforme la prise anglaise en prise européenne. On ne modifie ni le mur ni le chargeur. En code : brancher une bibliothèque externe (API de paiement, lecteur vidéo) sur l'interface que ton application attend déjà.",
  "Composite": "Un **dossier** sur ton PC contient des fichiers *et* d'autres dossiers. Pour connaître sa taille, il additionne récursivement la taille de tout ce qu'il contient. Fichier et dossier répondent à la même question `taille()` : l'explorateur les traite de la même façon.",
  "Commande (Command)": "Une **télécommande programmable** : chaque bouton contient un objet commande (« allumer la TV », « baisser le son »). La télécommande ne sait pas comment fonctionne la TV, elle appelle juste `execute()`. Bonus : on peut enregistrer une suite de commandes (macro) ou annuler la dernière (Ctrl+Z dans un éditeur de texte).",
  "Observer (Observateur)": "Les **notifications Instagram** : tu suis un compte (`attach`). Quand il publie (changement d'état), tous ses abonnés reçoivent une notification (`update`), et chaque téléphone l'affiche à sa façon. Le compte ne connaît pas tes goûts, il sait seulement « prévenir les abonnés ». En Java : les écouteurs de clic (`ActionListener`).",
});

StudyHub.addScenes("arch", "dp", {
  "Les patrons GoF : objectif et portée": {
    title: "ranger les 23 patrons",
    w: 620, h: 320,
    nodes: [
      { id: "src", x: 310, y: 50, icon: "📚", label: "23 patrons GoF", w: 160, kind: "accent" },
      { id: "c", x: 105, y: 240, icon: "🏗️", label: "Création", w: 150 },
      { id: "s", x: 310, y: 240, icon: "🧱", label: "Structure", w: 150 },
      { id: "b", x: 515, y: 240, icon: "🤝", label: "Comportement", w: 150 },
    ],
    edges: [{ from: "src", to: "c" }, { from: "src", to: "s" }, { from: "src", to: "b" }],
    steps: [
      { say: "Le GoF (Gamma, Helm, Johnson, Vlissides) classe ses **23 patrons** d'abord selon leur **objectif** : à quoi servent-ils ?", hl: ["src"] },
      { say: "**Création** : comment fabriquer des objets sans figer leur classe. Singleton, Factory, Abstract Factory, Builder, Prototype → **5**.", send: [{ from: "src", to: "c", label: "Singleton" }, { from: "src", to: "c", label: "Factory", delay: 500 }, { from: "src", to: "c", label: "Builder", delay: 1000 }], note: { c: "5 patrons" }, ok: ["c"] },
      { say: "**Structure** : comment assembler classes et objets. Adaptateur, Composite, Decorator, Façade, Proxy, Bridge, Flyweight → **7**.", send: [{ from: "src", to: "s", label: "Adaptateur" }, { from: "src", to: "s", label: "Composite", delay: 500 }, { from: "src", to: "s", label: "Façade", delay: 1000 }], note: { s: "7 patrons" }, ok: ["s"] },
      { say: "**Comportement** : comment les objets collaborent et se répartissent le travail. Commande, Observer, Strategy, State, Iterator… → **11**.", send: [{ from: "src", to: "b", label: "Commande" }, { from: "src", to: "b", label: "Observer", delay: 500 }, { from: "src", to: "b", label: "Strategy", delay: 1000 }], note: { b: "11 patrons" }, ok: ["b"] },
      { say: "Deuxième axe, la **portée** : *classe* (héritage, statique) ou *objet* (composition, dynamique). À retenir : **5 + 7 + 11 = 23**.", note: { src: "5 + 7 + 11 = 23" } },
    ],
  },
});

// ---------- Chapitre 2 : SOLID, cohésion, couplage ----------
StudyHub.addExamples("arch", "solid", {
  "Pourquoi le code pourrit : les 7 risques": "Une **appli de livraison de repas** après 2 ans : ajouter le champ « allergènes » à `Produit` oblige à retoucher panier, facture, stock et appli livreur (**rigidité**). Changer la couleur du bouton profil casse le paiement, car ils partagent une variable globale (**fragilité**). Personne n'ose réutiliser le module SMS ailleurs (**immobilité**), et le nouveau stagiaire met 3 semaines à comprendre `traiter()` (**opacité**).",
  "S — Single Responsibility Principle (SRP)": "Dans un restaurant, si **le chef fait aussi la caisse et les livraisons**, un nouveau terminal de paiement oblige à « re-former » le chef, et une panne de scooter arrête la cuisine. Séparer : **chef** (métier), **caissier** (paiement), **livreur** (envoi). Chacun n'a qu'une raison de changer.",
  "O — Open/Closed Principle (OCP)": "Une **multiprise** : pour brancher un nouvel appareil, tu ajoutes une prise, tu ne recâbles pas le mur. Ajouter Apple Pay à une boutique en ligne = écrire une nouvelle classe `ApplePayPayment implements PaymentMethod`, sans ouvrir `PaymentProcessor` (déjà testé, déjà en production).",
  "L — Liskov Substitution Principle (LSP)": "Tu loues « une voiture » : on te donne une **voiture électrique**, tu conduis normalement → LSP respecté. On te donne une **voiture sans moteur** dont `demarrer()` lève une exception → contrat violé, ton trajet plante. Une sous-classe doit tenir **toutes** les promesses de la classe mère.",
  "I — Interface Segregation Principle (ISP)": "Une **télécommande universelle à 80 boutons** pour ta grand-mère qui veut juste allumer la TV et changer de chaîne. Chaque nouveau bouton ajouté l'oblige à « relire le mode d'emploi ». ISP : donne-lui une télécommande à 4 boutons, et une autre aux passionnés de home cinéma.",
  "D — Dependency Inversion Principle (DIP)": "Ta **lampe** ne dépend pas de la centrale électrique, elle dépend de la **prise standard** (l'abstraction). On peut changer de fournisseur (nucléaire, solaire) sans changer la lampe, et brancher la lampe chez n'importe qui. En test, on branche même une fausse source (un *mock*).",
  "Cohésion des packages : REP, CCP, CRP": "**REP** : une maison d'édition publie des **éditions numérotées** ; tu gardes ta v1 tant que tu veux. **CCP** : tout ce qui concerne la **TVA** dans le même tiroir, pour n'ouvrir qu'un tiroir quand la loi change. **CRP** : tu ne veux pas acheter toute la **boîte à outils** pour un tournevis (et payer le transport du marteau-piqueur).",
  "Le dilemme de l'architecte et la stratégie selon la maturité": "Une **startup** de 3 développeurs : deux gros packages `app` et `core` suffisent, on bouge vite (CCP). Trois ans plus tard : 4 équipes et des clients externes veulent l'authentification. On extrait `auth` en **v1.0.0** versionnée, petite et réutilisable (REP + CRP).",
  "Couplage des packages : ADP, SDP, SAP": "Une **maison** : les fondations sont stables et standard (abstraites), les meubles bougent souvent (concrets). Les meubles reposent sur les fondations, jamais l'inverse (**SDP**). Si deux pièces se « soutiennent » mutuellement, impossible d'en rénover une seule (**cycle, ADP**). Et des fondations « sur mesure » impossibles à modifier = **zone de rigidité** (SAP).",
  "Métriques : Ca, Ce, I, A et la distance D": "Package `Paiement` : 8 classes extérieures l'utilisent (**Ca = 8**), il utilise 2 bibliothèques (**Ce = 2**). **I = 2 / 10 = 0,2** → stable. Il contient 10 classes dont 2 interfaces : **A = 0,2**. **D = |0,2 + 0,2 − 1| = 0,6** : trop concret pour sa stabilité, il glisse vers la zone de rigidité. Remède : extraire des interfaces (`PaymentGateway`, `Refundable`) pour monter A.",
});

StudyHub.addScenes("arch", "solid", {
  "Pourquoi le code pourrit : les 7 risques": {
    title: "rigidité et fragilité en action",
    w: 620, h: 320,
    nodes: [
      { id: "p", x: 310, y: 160, icon: "🍔", label: "Produit", w: 130, kind: "accent" },
      { id: "f", x: 95, y: 60, icon: "🧾", label: "Facturation", w: 130 },
      { id: "pa", x: 525, y: 60, icon: "🛒", label: "Panier", w: 120 },
      { id: "st", x: 95, y: 265, icon: "📦", label: "Stock", w: 120 },
      { id: "li", x: 525, y: 265, icon: "🛵", label: "Appli livreur", w: 140 },
      { id: "g", x: 310, y: 280, icon: "🌐", label: "variable globale", w: 160, kind: "ghost", at: 2 },
    ],
    edges: [
      { from: "f", to: "p" }, { from: "pa", to: "p" }, { from: "st", to: "p" }, { from: "li", to: "p" },
      { from: "pa", to: "g", dashed: true }, { from: "f", to: "g", dashed: true },
    ],
    steps: [
      { say: "Une appli de livraison. Quatre modules utilisent directement la classe `Produit`.", hl: ["p"] },
      { say: "**Rigidité** : on ajoute le champ « allergènes » à `Produit`… et les 4 modules doivent être réécrits. Effet domino.", note: { p: "+ allergènes" }, send: [{ from: "p", to: "f", label: "💥", tone: "bad" }, { from: "p", to: "pa", label: "💥", tone: "bad", delay: 200 }, { from: "p", to: "st", label: "💥", tone: "bad", delay: 400 }, { from: "p", to: "li", label: "💥", tone: "bad", delay: 600 }], fail: ["f", "pa", "st", "li"] },
      { say: "**Fragilité** : le Panier et la Facturation partagent en cachette une **variable globale**…", clear: true, note: { p: "" }, hl: ["g"] },
      { say: "…on corrige un détail d'affichage dans le Panier, et la **Facturation casse**, alors qu'on n'y a pas touché.", send: [{ from: "pa", to: "g", label: "modifie", tone: "alt" }, { from: "g", to: "f", label: "💥", tone: "bad", delay: 1200 }], fail: ["f"] },
      { say: "Remède : dépendre d'**abstractions** et supprimer les raccourcis globaux. C'est exactement ce que SOLID apporte.", clear: true, ok: ["p"] },
    ],
  },
  "S — Single Responsibility Principle (SRP)": {
    title: "une classe, une raison de changer",
    w: 620, h: 300,
    nodes: [
      { id: "u", x: 150, y: 150, icon: "😵", label: "User\nregister · email · save", w: 200, until: 3 },
      { id: "u2", x: 150, y: 150, icon: "🙂", label: "User\nregister()", w: 150, at: 3 },
      { id: "mail", x: 470, y: 70, icon: "📧", label: "EmailService", w: 140, at: 3 },
      { id: "repo", x: 470, y: 230, icon: "💾", label: "UserRepository", w: 150, at: 3 },
      { id: "chg", x: 470, y: 150, icon: "🔁", label: "Nouveau fournisseur\nd'e-mail", w: 170, kind: "ghost", at: 1, until: 3 },
    ],
    edges: [{ from: "chg", to: "u" }, { from: "u2", to: "mail" }, { from: "u2", to: "repo" }],
    steps: [
      { say: "`User` fait trois métiers : inscrire, **envoyer des e-mails**, **sauvegarder en base**. Trois raisons de changer.", hl: ["u"] },
      { say: "On change de fournisseur d'e-mail (Gmail → SendGrid)…", send: [{ from: "chg", to: "u", label: "changement", tone: "alt" }] },
      { say: "…et il faut **rouvrir `User`**, la retester, avec le risque de casser l'inscription. Mauvais signe.", fail: ["u"] },
      { say: "SRP : on sépare. `User` (métier), `EmailService` (envoi), `UserRepository` (persistance).", clear: true, send: [{ from: "u2", to: "mail", label: "envoyer()" }, { from: "u2", to: "repo", label: "save()", delay: 400 }] },
      { say: "Nouveau fournisseur d'e-mail ? On ne touche **que** `EmailService`. `User` ne bouge pas.", note: { mail: "SendGrid ✓" }, ok: ["mail", "u2"] },
    ],
  },
  "O — Open/Closed Principle (OCP)": {
    title: "étendre sans modifier",
    w: 620, h: 320,
    nodes: [
      { id: "pp", x: 130, y: 160, icon: "⚙️", label: "PaymentProcessor", w: 170 },
      { id: "i", x: 330, y: 160, icon: "🧩", label: "«interface»\nPaymentMethod", w: 160, kind: "accent" },
      { id: "cc", x: 530, y: 50, icon: "💳", label: "CreditCard", w: 130 },
      { id: "cash", x: 530, y: 160, icon: "💵", label: "Cash", w: 110 },
      { id: "ap", x: 530, y: 270, icon: "📱", label: "ApplePay", w: 120, at: 2 },
    ],
    edges: [{ from: "pp", to: "i" }, { from: "cc", to: "i", dashed: true }, { from: "cash", to: "i", dashed: true }, { from: "ap", to: "i", dashed: true }],
    steps: [
      { say: "`PaymentProcessor` ne connaît qu'une **interface** `PaymentMethod`. Carte et espèces l'implémentent.", send: [{ from: "pp", to: "i", label: "pay(42€)" }] },
      { say: "Le polymorphisme choisit la bonne implémentation à l'exécution, **sans switch**.", send: [{ from: "i", to: "cc", label: "pay()", tone: "good" }], ok: ["cc"] },
      { say: "Le client veut **Apple Pay**. On **ajoute** une classe `ApplePayPayment`… (ouvert à l'extension)", send: [{ from: "ap", to: "i", label: "implémente", tone: "alt" }] },
      { say: "…et `PaymentProcessor` n'a **pas été modifié** : déjà testé, il reste fermé à la modification.", send: [{ from: "pp", to: "i", label: "pay(42€)" }, { from: "i", to: "ap", label: "pay()", tone: "good", delay: 1100 }], ok: ["ap", "pp"] },
    ],
  },
  "L — Liskov Substitution Principle (LSP)": {
    title: "le pingouin qui ne vole pas",
    w: 620, h: 300,
    nodes: [
      { id: "code", x: 110, y: 150, icon: "🧑‍💻", label: "for (o : oiseaux)\n  o.voler()", w: 170 },
      { id: "ai", x: 470, y: 60, icon: "🦅", label: "Aigle", w: 120 },
      { id: "pi", x: 470, y: 150, icon: "🐧", label: "Pingouin", w: 120 },
      { id: "vo", x: 470, y: 245, icon: "🪽", label: "«interface» Volant", w: 170, kind: "accent", at: 3 },
    ],
    edges: [{ from: "code", to: "ai" }, { from: "code", to: "pi", until: 3 }, { from: "code", to: "vo", at: 3 }, { from: "ai", to: "vo", dashed: true, at: 3 }],
    steps: [
      { say: "Le code parcourt une liste d'`Oiseau` et appelle `voler()` sur chacun. Pour l'aigle, tout va bien.", send: [{ from: "code", to: "ai", label: "voler()" }], ok: ["ai"] },
      { say: "Mais `Pingouin extends Oiseau`… et un pingouin ne vole pas : `voler()` **lève une exception**.", send: [{ from: "code", to: "pi", label: "voler()" }], fail: ["pi"], note: { pi: "Exception !" } },
      { say: "Violation de LSP : on ne peut pas **remplacer** un Oiseau par un Pingouin sans casser le programme.", hl: ["pi"] },
      { say: "Correction : `Oiseau` n'a que `seDeplacer()`. Seuls les oiseaux qui volent implémentent **`Volant`**. Le code qui veut voler manipule des `Volant`.", clear: true, note: { pi: "seDeplacer() ✓" }, send: [{ from: "code", to: "vo", label: "voler()" }, { from: "ai", to: "vo", label: "implémente", tone: "alt", delay: 300 }], ok: ["pi", "ai", "vo"] },
    ],
  },
  "I — Interface Segregation Principle (ISP)": {
    title: "petites interfaces ciblées",
    w: 620, h: 310,
    nodes: [
      { id: "a", x: 90, y: 60, icon: "🅰️", label: "Client A", w: 110 },
      { id: "b", x: 90, y: 155, icon: "🅱️", label: "Client B", w: 110 },
      { id: "c", x: 90, y: 250, icon: "©️", label: "Client C", w: 110 },
      { id: "big", x: 330, y: 155, icon: "🐘", label: "Service\nopA · opB · opC", w: 170, until: 3 },
      { id: "ia", x: 330, y: 60, label: "ClientAService", w: 150, at: 3 },
      { id: "ib", x: 330, y: 155, label: "ClientBService", w: 150, at: 3 },
      { id: "ic", x: 330, y: 250, label: "ClientCService", w: 150, at: 3 },
      { id: "impl", x: 540, y: 155, icon: "⚙️", label: "ServiceImpl", w: 130 },
    ],
    edges: [
      { from: "a", to: "big" }, { from: "b", to: "big" }, { from: "c", to: "big" }, { from: "impl", to: "big", dashed: true },
      { from: "a", to: "ia" }, { from: "b", to: "ib" }, { from: "c", to: "ic" },
      { from: "impl", to: "ia", dashed: true }, { from: "impl", to: "ib", dashed: true }, { from: "impl", to: "ic", dashed: true },
    ],
    steps: [
      { say: "Une grosse interface `Service` avec les méthodes de **tous** les clients. Chaque client la voit en entier.", hl: ["big"] },
      { say: "On modifie `opC` pour le client C…", note: { big: "opC modifiée" }, send: [{ from: "c", to: "big", label: "opC v2", tone: "alt" }] },
      { say: "…et A et B doivent être **recompilés et retestés** pour une méthode qu'ils n'utilisent même pas.", send: [{ from: "big", to: "a", label: "recompile", tone: "bad" }, { from: "big", to: "b", label: "recompile", tone: "bad", delay: 200 }], fail: ["a", "b"] },
      { say: "ISP : une interface **par client**. `ServiceImpl` les implémente toutes, chaque client ne voit que la sienne.", clear: true, send: [{ from: "a", to: "ia", label: "opA" }, { from: "b", to: "ib", label: "opB", delay: 200 }, { from: "c", to: "ic", label: "opC", delay: 400 }] },
      { say: "Modifier `opC` ne touche plus que le client C. A et B dorment tranquilles.", note: { ic: "opC v2" }, ok: ["a", "b", "c"] },
    ],
  },
  "Cohésion des packages : REP, CCP, CRP": {
    title: "la loi fiscale (CCP)",
    w: 620, h: 310,
    nodes: [
      { id: "loi", x: 95, y: 155, icon: "⚖️", label: "Nouvelle\nloi fiscale", w: 130, kind: "accent" },
      { id: "calc", x: 330, y: 60, icon: "🧮", label: "Calculs (TVA)", w: 150, until: 3 },
      { id: "ui", x: 330, y: 155, icon: "🖥️", label: "UI (facture)", w: 150, until: 3 },
      { id: "ex", x: 330, y: 250, icon: "📤", label: "Exports (compta)", w: 160, until: 3 },
      { id: "ff", x: 330, y: 155, icon: "🗂️", label: "Facturation_Fiscale\nTVA · facture · export", w: 200, at: 3 },
      { id: "dep", x: 540, y: 155, icon: "🚀", label: "Déploiement", w: 130 },
    ],
    edges: [
      { from: "loi", to: "calc" }, { from: "loi", to: "ui" }, { from: "loi", to: "ex" },
      { from: "calc", to: "dep" }, { from: "ui", to: "dep" }, { from: "ex", to: "dep" },
      { from: "loi", to: "ff" }, { from: "ff", to: "dep" },
    ],
    steps: [
      { say: "La loi change : il faut modifier le calcul de **TVA**, l'**affichage légal** et l'**export comptable**.", hl: ["loi"] },
      { say: "Ces 3 classes sont dans **3 packages** différents : il faut les ouvrir, modifier et tester tous les trois…", send: [{ from: "loi", to: "calc", label: "modif" }, { from: "loi", to: "ui", label: "modif", delay: 250 }, { from: "loi", to: "ex", label: "modif", delay: 500 }] },
      { say: "…puis **redéployer 3 packages**. Cher et risqué.", send: [{ from: "calc", to: "dep", label: "v+1", tone: "bad" }, { from: "ui", to: "dep", label: "v+1", tone: "bad", delay: 250 }, { from: "ex", to: "dep", label: "v+1", tone: "bad", delay: 500 }], note: { dep: "3 releases" } },
      { say: "**CCP** : ce qui change **ensemble** va **ensemble** : un seul package `Facturation_Fiscale`.", note: { dep: "" }, hl: ["ff"] },
      { say: "Prochaine loi : **un** package modifié, **une** release. (CCP = le SRP appliqué aux packages.)", send: [{ from: "loi", to: "ff", label: "modif" }, { from: "ff", to: "dep", label: "v+1", tone: "good", delay: 1100 }], note: { dep: "1 release" }, ok: ["ff", "dep"] },
    ],
  },
});

// ---------- Chapitre 3 : architecture logicielle ----------
StudyHub.addExamples("arch", "archlog", {
  "Définition de l'architecture logicielle": "Le **plan d'un aéroport** : les terminaux (sous-systèmes), les règles de circulation des passagers et des bagages (règles d'interaction), les portes d'embarquement et les tapis roulants (interfaces). La marque des chaises dans la salle d'attente, c'est du design, pas de l'architecture.",
  "Architecture vs design : les 4 critères": "« Utiliser une `ArrayList` ou une `LinkedList` dans une méthode » → **design** (une classe, 2 lignes à changer, aucun attribut de qualité en jeu, le dev décide seul). « Tous les services partagent une seule base MySQL » → **architecture** : portée globale, migration coûteuse, performance et sécurité en jeu, DBA et métier concernés.",
  "Pourquoi investir dans l'architecture ?": "Construire une **maison sans plan** avec 20 ouvriers : chacun pose ses murs, l'électricien découvre trop tard qu'il n'y a pas de gaines, et il faut casser. Avec un plan, maçons et électriciens travaillent **en parallèle**, et les erreurs se corrigent **sur le papier**, là où elles coûtent presque rien.",
  "Le rôle de l'architecte : « le Sage »": "Le client dit : « je veux une appli rapide, sûre et pas chère, pour dans 3 mois ». L'architecte **traduit** : « monolithe modulaire (équipe de 4), PostgreSQL managé, API REST, chiffrement TLS, POC du paiement en semaine 1 ». Il arbitre quand sécurité, performance et budget tirent dans des sens opposés.",
  "Les 4 couches d'abstraction d'un système": "**Commander une pizza en ligne** : *métier* = le processus vente → préparation → livraison ; *fonctionnelle* = les cas d'usage « passer commande », « suivre le livreur » ; *applicative* = service Commandes, service Paiement, service Suivi ; *technique* = serveurs, base PostgreSQL, réseau 4G, conteneurs Docker.",
  "Les 5 types d'architecture (niveaux de zoom)": "Zoom sur une **banque** : *entreprise* = la stratégie SI de la banque ; *système* = agences + appli mobile + SI central + partenaires ; *applicative* = l'appli mobile organisée en MVC ; *macro* = le framework Spring partagé par tous les projets ; *micro* = un Observer dans le code des notifications.",
  "Familles de produits (ligne de produits)": "Une **gamme de smartphones** (modèle de base, Plus, Pro) : même architecture (carte mère, OS, appli photo), mais des **points de variation** configurables : taille d'écran, nombre de caméras, stockage. On ne réécrit pas un téléphone pour chaque modèle.",
  "Besoins fonctionnels (BF) vs non-fonctionnels (BNF)": "**Appli bancaire** : BF = « faire un virement ». BNF = le virement se fait en moins de 2 s (**performance**), il est chiffré et authentifié (**sécurité**), l'appli tient 1 million de clients le jour de la paie (**scalabilité**), et tourne sur Android et iOS (**portabilité**).",
  "Prioriser avec MoSCoW": "**Appli de covoiturage (MVP en 3 mois)** : *Must* = publier un trajet, réserver une place. *Should* = paiement en ligne. *Could* = mode sombre. *Won't (cette fois)* = covoiturage en avion. Si le temps manque, on sacrifie d'abord le Could, jamais le Must.",
  "Le scénario de qualité (6 éléments)": "**Disponibilité ShopExpress** : *Source* 50 000 clients ; *Stimulus* panne du service de recommandation ; *Artifact* reco + catalogue + paiement ; *Environment* Black Friday (surcharge) ; *Response* le paiement continue en mode dégradé, alerte envoyée ; *Measure* 99,9 % de disponibilité, 0 commande perdue.",
  "Pas d'architecture parfaite : arbitrer": "Une **voiture** ne peut pas être à la fois la plus sûre, la plus rapide et la moins chère. Une Formule 1 et un utilitaire sont deux **bonnes** architectures… pour deux objectifs différents. Même chose en logiciel : un chiffrement plus fort rassure la banque mais ralentit chaque requête.",
  "Tendances 2026 : monolithe modulaire, event-driven, AI-ready": "Monolithe modulaire = une **maison avec des pièces bien séparées** (portes fermées, chacune son usage) : un seul toit, une seule facture, mais on pourra transformer une pièce en studio indépendant (un microservice) le jour où ce sera utile.",
});

StudyHub.addScenes("arch", "archlog", {
  "Architecture vs design : les 4 critères": {
    title: "une décision passe les 4 portes",
    w: 620, h: 300,
    nodes: [
      { id: "d", x: 70, y: 150, icon: "🤔", label: "Décision", w: 110, kind: "accent" },
      { id: "g1", x: 205, y: 70, label: "1 · Portée", w: 110 },
      { id: "g2", x: 335, y: 70, label: "2 · Coût\nchangement", w: 110 },
      { id: "g3", x: 465, y: 70, label: "3 · Impact\nqualité", w: 110 },
      { id: "g4", x: 560, y: 160, label: "4 · Parties\nprenantes", w: 110 },
      { id: "dz", x: 250, y: 240, icon: "✏️", label: "DESIGN", w: 120 },
      { id: "ar", x: 450, y: 250, icon: "🏛️", label: "ARCHITECTURE", w: 150 },
    ],
    edges: [{ from: "d", to: "g1" }, { from: "g1", to: "g2" }, { from: "g2", to: "g3" }, { from: "g3", to: "g4" }, { from: "g4", to: "dz" }, { from: "g1", to: "ar", dashed: true }],
    steps: [
      { say: "Chaque décision passe 4 questions. **Un seul « oui » suffit** pour qu'elle soit architecturale.", hl: ["g1", "g2", "g3", "g4"] },
      { say: "Décision 1 : « **tri rapide ou tri fusion** dans une fonction ». Portée ? Une fonction → non. Coût ? 2 lignes → non…", note: { d: "tri rapide" }, send: [{ from: "d", to: "g1", label: "non" }, { from: "g1", to: "g2", label: "non", delay: 1000 }, { from: "g2", to: "g3", label: "non", delay: 2000 }] },
      { say: "…Impact qualité ? Aucun → non. Accord nécessaire ? Le dev seul → non. **4 non = DESIGN.**", send: [{ from: "g3", to: "g4", label: "non" }, { from: "g4", to: "dz", label: "design", tone: "good", delay: 1000 }], ok: ["dz"] },
      { say: "Décision 2 : « **une BDD partagée entre 3 services** ». Portée ? Plusieurs composants → **oui** dès la première porte.", clear: true, note: { d: "BDD partagée" }, send: [{ from: "d", to: "g1", label: "oui !", tone: "bad" }, { from: "g1", to: "ar", label: "architecture", tone: "alt", delay: 1100 }], ok: ["ar"] },
      { say: "Même verdict pour « passer au **chiffrement de bout en bout** » : oui partout (sécurité **et** performance en jeu).", note: { d: "chiffrement E2E" }, send: [{ from: "d", to: "g1", label: "oui !", tone: "bad" }, { from: "g1", to: "ar", label: "architecture", tone: "alt", delay: 1100 }], ok: ["ar"] },
    ],
  },
  "Les 4 couches d'abstraction d'un système": {
    title: "une pizza traverse les 4 couches",
    w: 620, h: 330,
    zones: [
      { x: 10, y: 8, w: 600, h: 72, label: "4 · Processus métier" },
      { x: 10, y: 88, w: 600, h: 72, label: "3 · Fonctionnelle", at: 1 },
      { x: 10, y: 168, w: 600, h: 72, label: "2 · Applicative", at: 2 },
      { x: 10, y: 248, w: 600, h: 74, label: "1 · Technique", at: 3 },
    ],
    nodes: [
      { id: "m", x: 330, y: 48, icon: "🍕", label: "Vendre et livrer des pizzas", w: 240, h: 52 },
      { id: "f", x: 330, y: 128, icon: "📝", label: "Cas d'usage « Passer commande »", w: 260, h: 52, at: 1 },
      { id: "a1", x: 240, y: 208, label: "Service Commandes", w: 160, h: 46, at: 2 },
      { id: "a2", x: 440, y: 208, label: "Service Paiement", w: 150, h: 46, at: 2 },
      { id: "t", x: 330, y: 288, icon: "🖥️", label: "Serveurs · PostgreSQL · réseau", w: 260, h: 52, at: 3 },
    ],
    edges: [{ from: "m", to: "f" }, { from: "f", to: "a1" }, { from: "f", to: "a2" }, { from: "a1", to: "t" }, { from: "a2", to: "t" }],
    steps: [
      { say: "**Couche 4, processus métier** (la plus abstraite) : ce que fait l'entreprise. Propriété des lignes métier.", hl: ["m"] },
      { say: "**Couche 3, fonctionnelle** : les cas d'utilisation. Partagée entre métier et IT.", send: [{ from: "m", to: "f", label: "↓" }], hl: ["f"] },
      { say: "**Couche 2, applicative** : les composants logiciels, modules, microservices qui réalisent le cas d'usage.", send: [{ from: "f", to: "a1", label: "↓" }, { from: "f", to: "a2", label: "↓", delay: 250 }] },
      { say: "**Couche 1, technique** (la plus concrète) : serveurs, bases, réseau, conteneurs, OS. Propriété de l'IT.", send: [{ from: "a1", to: "t", label: "↓" }, { from: "a2", to: "t", label: "↓", delay: 250 }], ok: ["t"] },
      { say: "Ordre à réciter du concret à l'abstrait : **Technique 1, Applicative 2, Fonctionnelle 3, Métier 4**.", ok: ["m", "f", "a1", "a2", "t"] },
    ],
  },
  "Prioriser avec MoSCoW": {
    title: "trier le backlog d'une appli de covoiturage",
    w: 620, h: 300,
    nodes: [
      { id: "bk", x: 310, y: 50, icon: "📋", label: "Backlog du MVP", w: 170, kind: "accent" },
      { id: "M", x: 85, y: 230, icon: "🔴", label: "Must", w: 120 },
      { id: "S", x: 235, y: 230, icon: "🟠", label: "Should", w: 120 },
      { id: "C", x: 385, y: 230, icon: "🟡", label: "Could", w: 120 },
      { id: "W", x: 535, y: 230, icon: "⚪", label: "Won't (ici)", w: 120 },
    ],
    edges: [{ from: "bk", to: "M" }, { from: "bk", to: "S" }, { from: "bk", to: "C" }, { from: "bk", to: "W" }],
    steps: [
      { say: "MVP d'une appli de covoiturage en 3 mois. Il faut **prioriser** le backlog.", hl: ["bk"] },
      { say: "**Must** : sans eux le produit n'a pas de sens. Publier un trajet, réserver une place.", send: [{ from: "bk", to: "M", label: "publier" }, { from: "bk", to: "M", label: "réserver", delay: 600 }], ok: ["M"], note: { M: "publier · réserver" } },
      { say: "**Should** : prioritaire si possible dans cette version. Le paiement en ligne.", send: [{ from: "bk", to: "S", label: "paiement" }], note: { S: "paiement" } },
      { say: "**Could** : souhaité, mais sacrifié en premier si le temps manque. Le mode sombre.", send: [{ from: "bk", to: "C", label: "mode sombre" }], note: { C: "mode sombre" } },
      { say: "**Won't** : écarté de **ce** livrable, avec l'accord des parties prenantes. Pas « jamais » : peut-être en v2.", send: [{ from: "bk", to: "W", label: "covoit' avion", tone: "alt" }], note: { W: "en v2 ?" }, dim: ["W"] },
    ],
  },
  "Tendances 2026 : monolithe modulaire, event-driven, AI-ready": {
    title: "du monolithe modulaire au microservice",
    w: 620, h: 300,
    zones: [{ x: 10, y: 20, w: 380, h: 260, label: "Un seul déploiement" }],
    nodes: [
      { id: "cat", x: 110, y: 90, icon: "🛍️", label: "Catalogue", w: 130 },
      { id: "cmd", x: 290, y: 90, icon: "🧾", label: "Commandes", w: 130 },
      { id: "st", x: 110, y: 215, icon: "📦", label: "Stock", w: 130 },
      { id: "pay", x: 290, y: 215, icon: "💳", label: "Paiement", w: 130, until: 3 },
      { id: "pay2", x: 520, y: 215, icon: "💳", label: "Paiement\n(microservice)", w: 150, kind: "accent", at: 3 },
    ],
    edges: [
      { from: "cat", to: "cmd" }, { from: "cmd", to: "st" }, { from: "cmd", to: "pay" },
      { from: "cmd", to: "pay2", label: "réseau (API)", at: 3 },
    ],
    steps: [
      { say: "Un **monolithe modulaire** : un seul déploiement, mais des modules **strictement séparés** (chacun ses données, des interfaces claires).", hl: ["cat", "cmd", "st", "pay"] },
      { say: "Les modules s'appellent **en mémoire** : zéro latence réseau, un seul serveur à payer, une petite équipe suffit.", send: [{ from: "cat", to: "cmd", label: "appel" }, { from: "cmd", to: "st", label: "appel", delay: 500 }, { from: "cmd", to: "pay", label: "appel", delay: 1000 }] },
      { say: "Le paiement doit maintenant tenir un pic de charge **indépendamment** du reste…", hl: ["pay"], note: { pay: "charge ×10" } },
      { say: "…comme ses frontières sont propres, on l'**extrait** facilement en microservice. Le reste ne bouge pas.", send: [{ from: "cmd", to: "pay2", label: "payer()", dur: 1400 }], ok: ["pay2"] },
      { say: "Avantage clé (QCM) : **découplage logique strict sans la complexité réseau et financière** des microservices, et transition facile quand c'est utile.", ok: ["cat", "cmd", "st", "pay2"] },
    ],
  },
});

// ---------- Itérateur et Stratégie (chapitre 1) ----------
StudyHub.addExamples("arch", "dp", {
  "Itérateur (Iterator)": "Ta **playlist Spotify** : le bouton « suivant » passe au titre d'après, que la playlist soit stockée en tableau, en liste ou sur un serveur. Tu ne vois jamais la structure, seulement « y a-t-il un titre suivant ? » (`hasNext`) et « donne-le » (`next`). En Java, chaque `for (String s : liste)` utilise un `Iterator` en cachette.",
  "Stratégie (Strategy)": "**Google Maps** : même trajet, mais tu choisis l'algorithme d'itinéraire : *voiture*, *à pied* ou *transports*. L'application (le Context) ne change pas, seule la stratégie de calcul change, et tu peux basculer en un clic. En caisse : prix normal, tarif étudiant ou soldes = 3 stratégies de calcul du prix.",
});

StudyHub.addScenes("arch", "dp", {
  "Itérateur (Iterator)": {
    title: "parcourir sans regarder dedans",
    w: 620, h: 330,
    nodes: [
      { id: "cl", x: 90, y: 180, icon: "🧑", label: "Client" },
      { id: "it", x: 300, y: 180, icon: "👉", label: "Iterator\nposition", w: 130, kind: "accent" },
      { id: "e1", x: 520, y: 85, icon: "🎵", label: "Titre 1", w: 120 },
      { id: "e2", x: 520, y: 180, icon: "🎵", label: "Titre 2", w: 120 },
      { id: "e3", x: 520, y: 275, icon: "🎵", label: "Titre 3", w: 120 },
    ],
    zones: [{ x: 445, y: 12, w: 150, h: 314, label: "Playlist (Aggregate)" }],
    edges: [{ from: "cl", to: "it" }, { from: "it", to: "e1" }, { from: "it", to: "e2" }, { from: "it", to: "e3" }],
    steps: [
      { say: "Le client demande à la collection son itérateur : `playlist.createIterator()`. Il ne voit **pas** le tableau interne.", send: [{ from: "cl", to: "it", label: "createIterator()", tone: "alt" }], note: { it: "position = 0" } },
      { say: "`hasNext()` → **true**, puis `next()` rend le **titre 1** et avance la position.", send: [{ from: "it", to: "e1", label: "next()" }], ok: ["e1"], note: { it: "position = 1" } },
      { say: "Même appel, élément suivant : `next()` → **titre 2**.", send: [{ from: "it", to: "e2", label: "next()" }], ok: ["e2"], note: { it: "position = 2" } },
      { say: "`next()` → **titre 3**. Puis `hasNext()` → **false** : la boucle `while (it.hasNext())` s'arrête.", send: [{ from: "it", to: "e3", label: "next()" }], ok: ["e3"], note: { it: "hasNext() = false" } },
      { say: "Si demain la playlist devient une liste chaînée ou un arbre, **le code du client ne change pas** : il ne connaît que `hasNext / next / remove`.", hl: ["it"] },
    ],
  },
  "Stratégie (Strategy)": {
    title: "changer d'algorithme en cours de route",
    w: 620, h: 300,
    nodes: [
      { id: "cx", x: 130, y: 150, icon: "🧾", label: "Context\n(caisse)", w: 140, kind: "accent" },
      { id: "a", x: 490, y: 55, icon: "💵", label: "PrixNormal", w: 150 },
      { id: "b", x: 490, y: 150, icon: "🎓", label: "PrixEtudiant", w: 150 },
      { id: "c", x: 490, y: 245, icon: "🏷️", label: "PrixSoldes 30 %", w: 150 },
    ],
    edges: [{ from: "cx", to: "a" }, { from: "cx", to: "b" }, { from: "cx", to: "c" }],
    steps: [
      { say: "Le **Context** garde une seule référence `strategy`. Au départ : `PrixNormal`.", hl: ["a"], dim: ["b", "c"], note: { cx: "strategy = Normal" } },
      { say: "`execute(200)` : le Context **délègue** le calcul à sa stratégie → **200 DT**.", send: [{ from: "cx", to: "a", label: "execute(200)" }, { from: "a", to: "cx", label: "200", tone: "good", delay: 900 }], dim: ["b", "c"] },
      { say: "Un étudiant arrive : `setStrategy(new PrixEtudiant())`. **Rien ne change dans le Context.**", hl: ["b"], dim: ["a", "c"], note: { cx: "strategy = Étudiant" } },
      { say: "Même appel `execute(200)`, autre algorithme → **160 DT**.", send: [{ from: "cx", to: "b", label: "execute(200)" }, { from: "b", to: "cx", label: "160", tone: "good", delay: 900 }], dim: ["a", "c"] },
      { say: "Période de soldes : `setStrategy(new PrixSoldes(30))` → **140 DT**. Ajouter un algorithme = **ajouter une classe** (OCP), sans aucun `switch`.", send: [{ from: "cx", to: "c", label: "execute(200)" }, { from: "c", to: "cx", label: "140", tone: "good", delay: 900 }], dim: ["a", "b"], note: { cx: "strategy = Soldes" }, ok: ["c"] },
    ],
  },
});
