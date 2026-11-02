StudyHub.addChapter("arch", {
  id: "dp",
  number: 1,
  title: "Patrons de conception (Design Patterns)",
  short: "Design Patterns",
  overview: "Ce qu'est un patron de conception, la classification GoF (23 patrons : création, structure, comportement ; portée classe ou objet), puis les 6 patrons étudiés en détail avec le code Java du cours : **Singleton, Factory, Adaptateur, Composite, Commande, Observer**.",
  bigPicture: "Un patron = une **recette éprouvée** pour un problème de conception qui revient souvent. Le GoF en propose **23**, classés selon **l'objectif** (créer des objets / composer des structures / répartir des comportements) et **la portée** (classe = héritage, statique ; objet = composition, dynamique). Pour chaque patron du cours, sache dire : **quel problème, quelle solution (classes + relations), quel exemple de code, quand l'utiliser**.",
  bigPictureDiagram: {
    type: "mermaid",
    caption: "Les patrons du cours dans la classification GoF",
    content: "flowchart TB\n  G[\"Patrons GoF (23)\"] --> C[\"Création<br/>abstraire l'instanciation\"]\n  G --> S[\"Structurels<br/>composer classes & objets\"]\n  G --> B[\"Comportementaux<br/>algorithmes & responsabilités\"]\n  C --> C1[Singleton] & C2[Factory]\n  S --> S1[Adaptateur] & S2[Composite]\n  B --> B1[Commande] & B2[Observer]",
  },
  sections: [
    {
      title: "Qu'est-ce qu'un patron de conception ?",
      simple: "Un **patron de conception** (design pattern) est une **solution générale et réutilisable** à un problème qui revient souvent lors de la conception d'un logiciel. Ce n'est **pas du code fini** qu'on copie : c'est une **description / un modèle** applicable dans de nombreuses situations différentes.",
      analogy: "C'est comme une **recette de cuisine** : tu ne recopies pas l'assiette du chef, tu réutilises sa méthode pour ton propre plat, sans repartir de zéro.",
      table: {
        headers: ["Élément", "Contenu"],
        rows: [
          ["**Nom**", "Identifiant unique, vocabulaire commun, référence rapide"],
          ["**Problème**", "Contexte d'application, situation logicielle, contraintes initiales"],
          ["**Solution**", "Éléments d'architecture, interactions / relations, abstraction conceptuelle"],
          ["**Conséquences**", "Avantages obtenus, limites techniques, compromis acceptés"],
        ],
      },
      points: [
        "En résumé : **Nom → Quel problème ? → Quelle solution ? → Quels effets ?**",
      ],
      examTip: "Question classique : « Citez les 4 éléments d'un patron ». Réponse : **Nom, Problème, Solution, Conséquences**.",
    },
    {
      title: "Les patrons GoF : objectif et portée",
      simple: "Le **Gang of Four (GoF)** = les 4 auteurs du livre *Design Patterns: Elements of Reusable Object-Oriented Software* : **Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides**. Ils définissent **23 patrons**, des solutions **éprouvées et réutilisables**, classées selon deux axes complémentaires.",
      table: {
        headers: ["Axe", "Catégorie", "Signification"],
        rows: [
          ["Objectif", "**Créationnel**", "Concerne le processus de création d'objets et de classes"],
          ["Objectif", "**Structurel**", "Concerne la composition des classes et des objets"],
          ["Objectif", "**Comportemental**", "Caractérise l'interaction et la répartition des responsabilités"],
          ["Portée", "**Classe**", "Relations entre classes et sous-classes (héritage), définies **statiquement**"],
          ["Portée", "**Objet**", "Relations entre objets, **dynamiques** (modifiables à l'exécution)"],
        ],
      },
      points: [
        "Portée **classe** : Factory Method, Adaptateur (de classe), Interpreter, Template Method.",
        "Création (objet) : **Abstract Factory, Builder, Prototype, Singleton**.",
        "Structure (objet) : **Adaptateur (d'objet), Bridge, Composite, Decorator, Façade, Flyweight, Proxy**.",
        "Comportement (objet) : **Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Visitor**.",
        "Les deux axes sont **complémentaires** : un patron a un objectif **et** une portée.",
      ],
      analogy: "Objectif = « à quoi sert l'outil » (scie, marteau, tournevis). Portée = « est-il soudé à l'établi (classe, figé) ou posé dessus (objet, déplaçable) ».",
      examTip: "Retiens les nombres : **5 créationnels, 7 structurels, 11 comportementaux = 23**.",
    },
    {
      title: "Patrons de création : principe",
      simple: "Les patrons de création **abstraient le processus d'instanciation** et rendent un système **indépendant de la manière dont ses objets sont créés, composés et représentés**.",
      points: [
        "Création **de classes** : utilise **l'héritage** pour faire varier la classe instanciée. Le créateur (Factory) décide quelle classe concrète instancier parmi plusieurs.",
        "Création **d'objets** : **délègue** l'instanciation à un autre objet (un délégué crée l'objet et le retourne au client).",
      ],
      diagram: {
        type: "mermaid",
        caption: "Classe (héritage) vs objet (délégation)",
        content: "flowchart LR\n  subgraph Classe[Création de classes]\n    Cl1[Client] --> Cr[\"Créateur (Factory)\"]\n    Cr -.-> A[ConcrèteA] & B[ConcrèteB]\n  end\n  subgraph Objet[Création d'objets]\n    Cl2[Client] --> D[\"Délégué (Créateur)\"] --> P[Produit]\n  end",
      },
    },
    {
      title: "Singleton",
      simple: "Le **Singleton** garantit qu'**une seule instance** d'une classe est créée et fournit un **point d'accès global** à cet objet.",
      diagram: {
        type: "code",
        caption: "Code du cours (Java)",
        content: `class Singleton {
    private static Singleton instance;      // l'instance unique

    private Singleton() { ... }             // constructeur PRIVÉ : pas de new depuis l'extérieur

    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();      // créée à la demande (lazy)
        }
        return instance;
    }
    public void doSomething() { ... }
}`,
      },
      points: [
        "**Constructeur privé** : personne d'autre ne peut faire `new Singleton()`.",
        "**static** : la méthode appartient à la **classe**, pas à un objet → on l'appelle sans créer d'objet : `Singleton.getInstance()`.",
        "**synchronized** : verrouille la méthode pour qu'**un seul thread** l'exécute à la fois ; si deux threads arrivent en même temps, l'un passe après l'autre (évite deux instances).",
        "Quand l'utiliser : une seule instance nécessaire ; instance disponible **dans tout le code** ; en **multi-thread** quand plusieurs threads accèdent aux mêmes ressources via le même objet.",
        "Usages : **Logger**, **classes de configuration** (ConfigurationManager), **ressources partagées** (ex. compteur partagé).",
        "D'autres patrons sont souvent implémentés en Singleton : **Factory, Abstract Factory, Builder, Prototype**. Combinaison : **Factory** → comment créer les objets ; **Singleton** → une seule instance de la Factory.",
      ],
      analogy: "Le **président de la République** : il n'y en a qu'un à la fois, et tout le monde y accède par la même adresse officielle.",
      examTip: "Les 3 ingrédients à citer : **attribut static privé**, **constructeur privé**, **méthode static getInstance()** (synchronized en multi-thread).",
    },
    {
      title: "Factory (Fabrique)",
      simple: "La **Factory** crée des objets **sans exposer la logique d'instanciation au client**, et renvoie l'objet créé via une **interface commune**. Le client demande « un produit », la fabrique choisit la classe concrète.",
      diagram: {
        type: "code",
        caption: "Code du cours (Java)",
        content: `public class ProductFactory {
    public Product createProduct(String productID) {
        if (productID == "ID1") {
            return new OneProduct();
        }
        if (productID == "ID2") {
            return new AnotherProduct();
        }
        ...
        return null;
    }
}
// Le client ne connaît que l'interface Product :
Product p = factory.createProduct("ID1");`,
      },
      points: [
        "Structure : **Client** → utilise l'interface **Product** ; **Factory.createProduct()** crée le **ConcreteProduct**.",
        "Version GoF (Factory Method) : un **Creator** déclare `create(): Product`, les **ConcreteCreatorA/B** décident quelle classe instancier.",
        "Intérêt : **découpler le client des classes concrètes** ; **ajouter facilement de nouvelles variantes**. Exemple : `ShapeFactory` qui crée `Circle`, `Rectangle`.",
        "Quand l'utiliser : un framework **délègue à l'usine** la création d'objets d'une **superclasse commune** ; besoin de **flexibilité pour ajouter de nouveaux types**.",
        "Dans l'API Java : `javax.xml.parsers.DocumentBuilderFactory` (→ `newDocumentBuilder()`, parseur **DOM**), `javax.xml.parsers.SAXParserFactory` (→ `newSAXParser()`, parseur **SAX** événementiel), `java.net.URLConnection` (`url.openConnection()` renvoie HttpURLConnection, FileURLConnection, JarURLConnection selon le protocole).",
      ],
      analogy: "Tu commandes « une pizza » au comptoir : la cuisine (fabrique) décide comment la fabriquer. Tu reçois une pizza, sans jamais voir la recette.",
      examTip: "Si on te demande un exemple réel : **DocumentBuilderFactory / SAXParserFactory** fournissent des parseurs XML **sans exposer leur implémentation concrète**.",
    },
    {
      title: "Patrons structurels : principe",
      simple: "Les patrons structurels s'intéressent à la façon dont **les classes et les objets sont composés pour former des structures plus grandes**.",
      table: {
        headers: ["Type", "Mécanisme", "Remarque"],
        rows: [
          ["Modèles de **classes** structurelles", "**Héritage** pour composer des interfaces ou des implémentations", "Statique"],
          ["Modèles **d'objets** structurels", "**Composition d'objets** pour de nouvelles fonctionnalités", "**Souplesse** : la composition peut être **modifiée à l'exécution**, impossible avec des classes statiques"],
        ],
      },
      points: ["Exemples : **Adapter** (interface existante → nouvelle interface), **Proxy** (client → proxy → objet réel), **Bridge** (abstraction ◇ implémentation), **Composite** (composant / feuille / composite)."],
    },
    {
      title: "Adaptateur (Adapter)",
      simple: "L'**Adaptateur** **convertit l'interface d'une classe en une autre interface attendue par le client**. Il permet à des classes de travailler ensemble alors que leurs **interfaces sont incompatibles**.",
      analogy: "Un **adaptateur de prise** : ton chargeur européen (interface existante) se branche dans une prise anglaise (interface attendue) sans modifier ni le chargeur ni le mur.",
      diagram: {
        type: "mermaid",
        caption: "Exemple du cours : lecteur audio",
        content: "classDiagram\n  class MediaPlayer {\n    <<interface>>\n    +play(audioType, filename)\n  }\n  class AdvancedMediaPlayer {\n    <<interface>>\n    +playVLC(filename)\n    +playMP4(filename)\n  }\n  MediaPlayer <|.. AudioPlayer\n  MediaPlayer <|.. MediaAdapter\n  AdvancedMediaPlayer <|.. VLCPlayer\n  AdvancedMediaPlayer <|.. MP4Player\n  AudioPlayer --> MediaAdapter : utilise\n  MediaAdapter --> AdvancedMediaPlayer : amp",
      },
      diagrams: [
        {
          type: "code",
          caption: "Les classes clés (Java)",
          content: `public class AudioPlayer implements MediaPlayer {
    MediaAdapter mediaAdapter;
    public void play(String audioType, String filename) {
        if (audioType.equalsIgnoreCase("mp3")) {
            System.out.println("Playing MP3 file: " + filename);   // supporté directement
        } else if (audioType.equalsIgnoreCase("vlc") || audioType.equalsIgnoreCase("mp4")) {
            mediaAdapter = new MediaAdapter(audioType);              // passe par l'adaptateur
            mediaAdapter.play(audioType, filename);
        } else {
            System.out.println("Invalid Media format: " + audioType);
        }
    }
}

public class MediaAdapter implements MediaPlayer {
    AdvancedMediaPlayer amp;
    public MediaAdapter(String audioType) {
        if (audioType.equalsIgnoreCase("vlc")) amp = new VLCPlayer();
        else if (audioType.equalsIgnoreCase("mp4")) amp = new MP4Player();
    }
    public void play(String audioType, String filename) {
        if (audioType.equalsIgnoreCase("vlc")) amp.playVLC(filename);
        else if (audioType.equalsIgnoreCase("mp4")) amp.playMP4(filename);
    }
}`,
        },
      ],
      points: [
        "**Cible** (interface attendue par le client) : `MediaPlayer.play(audioType, filename)`.",
        "**Adapté** (interface incompatible) : `AdvancedMediaPlayer.playVLC() / playMP4()`, implémentée par `VLCPlayer` et `MP4Player`.",
        "**Adaptateur** : `MediaAdapter` implémente `MediaPlayer` et contient un `AdvancedMediaPlayer` (composition → adaptateur **d'objet**).",
        "Déroulé MP4 : Client → `AudioPlayer.play(\"mp4\", …)` → `MediaAdapter.play(\"mp4\", …)` → `MP4Player.playMP4(…)`. Pour MP3, pas besoin d'adaptateur.",
        "Démo : `play(\"mp3\")`, `play(\"mp4\")`, `play(\"vlc\")` fonctionnent ; `play(\"avi\")` → « Invalid Media format: avi ».",
      ],
      examTip: "Sache identifier les 3 rôles **Cible / Adaptateur / Adapté** dans un diagramme et expliquer le chemin d'appel pour un fichier MP4.",
    },
    {
      title: "Composite",
      simple: "Le **Composite** **compose des objets en arborescence** pour représenter des hiérarchies partie-tout, et permet au client de **traiter de la même manière un objet individuel et une composition d'objets**.",
      analogy: "Un **dossier** sur ton ordinateur : il contient des fichiers **ou** d'autres dossiers. « Supprimer » ou « calculer la taille » marche pareil sur un fichier seul ou sur un dossier entier.",
      diagram: {
        type: "mermaid",
        caption: "Exemple du cours : éditeur graphique",
        content: "classDiagram\n  class Shape {\n    <<interface>>\n    +renderShapeToScreen()\n    +explodeShape() Shape[]\n  }\n  Shape <|.. Line\n  Shape <|.. Rectangle\n  Shape <|.. ComplexShape\n  ComplexShape *-- Shape : shapeList\n  GraphicsEditor ..> Shape : utilise",
      },
      diagrams: [
        {
          type: "code",
          caption: "Composite (Java)",
          content: `public class ComplexShape implements Shape {
    List shapeList = new ArrayList();
    public void addToShape(Shape shapeToAdd) { shapeList.add(shapeToAdd); }
    public Shape[] explodeShape() { return (Shape[]) shapeList.toArray(); }
    public void renderShapeToScreen() {
        for (Shape s : shapeList) {
            s.renderShapeToScreen();   // appel selon le type RÉEL de s (polymorphisme)
        }
    }
}`,
        },
      ],
      points: [
        "**Composant** : l'interface `Shape` (`renderShapeToScreen()`, `explodeShape()`).",
        "**Feuille** : `Line` (élément simple, `explodeShape()` se renvoie lui-même).",
        "**Composite** : `ComplexShape` (contient une `shapeList` de `Shape` et délègue à chaque enfant). `Rectangle` se comporte aussi en composite de ses arêtes (`rectangleEdges`).",
        "Relation clé : **composition** (losange plein) de `ComplexShape` vers `Shape` → arbre récursif.",
      ],
      examTip: "Mot-clé à écrire : **traitement uniforme** des feuilles et des composites grâce à une **interface commune** + **récursivité**.",
    },
    {
      title: "Patrons comportementaux : principe",
      simple: "Les patrons comportementaux concernent **les algorithmes et l'attribution des responsabilités entre les objets** (choisir le type de l'objet au moment de l'exécution).",
      table: {
        headers: ["Type", "Mécanisme"],
        rows: [
          ["Modèles comportementaux **de classe**", "Utilisent **l'héritage** pour répartir le comportement entre classes"],
          ["Modèles d'objets comportementaux", "Utilisent **la composition** plutôt que l'héritage ; un groupe d'objets pairs **coopère** pour une tâche qu'aucun ne peut réaliser seul"],
        ],
      },
      points: ["Exemples : **Commande** (Command.execute()), **Iterator** (hasNext/next/remove), **Observer** (attach/detach/notify + update), **Strategy** (Context utilise une Strategy.execute())."],
    },
    {
      title: "Commande (Command)",
      simple: "Le patron **Commande** **encapsule une demande dans un objet**. On peut alors **paramétrer des clients** avec différentes demandes, et **mettre les demandes en file d'attente**.",
      analogy: "Au restaurant, le serveur note ta commande sur un **ticket** (l'objet Commande) et le pose sur la pile de la cuisine. Le cuisinier (récepteur) l'exécute quand c'est son tour. Le serveur n'a pas besoin de savoir cuisiner.",
      diagram: {
        type: "mermaid",
        caption: "Exemple du cours : ordres de bourse",
        content: "classDiagram\n  class Order {\n    <<interface>>\n    +execute()\n  }\n  Order <|.. BuyStockOrder\n  Order <|.. SellStockOrder\n  BuyStockOrder --> StockTrade : stock.buy()\n  SellStockOrder --> StockTrade : stock.sell()\n  Agent o-- Order : m_ordersQueue\n  class Agent {\n    +placeOrder(Order)\n  }",
      },
      diagrams: [
        {
          type: "code",
          caption: "Code du cours (Java, simplifié)",
          content: `public interface Order { void execute(); }          // Commande

class StockTrade {                                   // Récepteur
    public void buy()  { System.out.println("You want to buy stocks"); }
    public void sell() { System.out.println("You want to sell stocks"); }
}

class BuyStockOrder implements Order {               // Commande concrète
    private StockTrade stock;
    public BuyStockOrder(StockTrade st) { stock = st; }
    public void execute() { stock.buy(); }
}
// SellStockOrder idem avec stock.sell()

class Agent {                                        // Invocateur (file d'attente)
    private List m_ordersQueue = new ArrayList();
    void placeOrder(Order order) {
        m_ordersQueue.addLast(order);
        Order o = m_ordersQueue.getFirstAndRemove();
        o.execute();
    }
}

// Client
StockTrade stock = new StockTrade();
Agent agent = new Agent();
agent.placeOrder(new BuyStockOrder(stock));   // → "You want to buy stocks"
agent.placeOrder(new SellStockOrder(stock));  // → "You want to sell stocks"`,
        },
      ],
      table: {
        headers: ["Rôle GoF", "Classe du cours"],
        rows: [
          ["Commande (interface)", "`Order` avec `execute()`"],
          ["Commande concrète", "`BuyStockOrder`, `SellStockOrder`"],
          ["Récepteur (fait le vrai travail)", "`StockTrade` (`buy()`, `sell()`)"],
          ["Invocateur (stocke / déclenche)", "`Agent` (`placeOrder()`, `m_ordersQueue`)"],
          ["Client (crée et configure)", "`Client.main()`"],
        ],
      },
      examTip: "Les 3 bénéfices à réciter : **encapsuler la demande**, **paramétrer les clients**, **file d'attente** (et donc historique / annulation possibles).",
    },
    {
      title: "Observer (Observateur)",
      simple: "L'**Observer** définit une **dépendance un-à-plusieurs** : quand un objet (le **sujet**) change d'état, **tous ses dépendants (observateurs) sont notifiés et mis à jour automatiquement**.",
      analogy: "Une **chaîne YouTube** : tu t'abonnes une fois (attach). À chaque nouvelle vidéo (changement d'état), tous les abonnés reçoivent la notification (update) sans rien demander.",
      diagram: {
        type: "mermaid",
        caption: "Déroulé : 1 changement → N mises à jour",
        content: "sequenceDiagram\n  participant Main\n  participant S as Subject\n  participant B as BinaryObserver\n  participant H as HexaObserver\n  Main->>B: new BinaryObserver(subject)\n  B->>S: attach(this)\n  Main->>S: setState(15)\n  S->>S: notifyAllObservers()\n  S->>B: update()\n  B->>S: getState() = 15\n  Note over B: Binary String: 1111\n  S->>H: update()\n  Note over H: Hex String: F",
      },
      diagrams: [
        {
          type: "code",
          caption: "Code du cours (Java)",
          content: `public class Subject {
    private List<Observer> observers = new ArrayList<Observer>();
    private int state;
    public int getState() { return state; }
    public void setState(int state) {
        this.state = state;
        notifyAllObservers();                 // changement d'état → notification
    }
    public void attach(Observer observer) { observers.add(observer); }
    public void notifyAllObservers() {
        for (Observer observer : observers) observer.update();
    }
}

public abstract class Observer {
    protected Subject subject;
    public abstract void update();
}

public class BinaryObserver extends Observer {
    public BinaryObserver(Subject subject) {
        this.subject = subject;
        this.subject.attach(this);            // s'abonne lui-même
    }
    public void update() {
        System.out.println("Binary String: " + Integer.toBinaryString(subject.getState()));
    }
}

// main : new HexaObserver(s); new OctalObserver(s); new BinaryObserver(s);
// s.setState(15) → Hex F, Octal 17, Binary 1111
// s.setState(10) → Hex A, Octal 12, Binary 1010`,
        },
      ],
      points: [
        "**Sujet** (`Subject`) : liste d'observateurs + état ; méthodes `attach()`, `getState()`, `setState()`, `notifyAllObservers()`.",
        "**Observateur** (classe abstraite `Observer`) : `update()` ; concrets : `BinaryObserver`, `OctalObserver`, `HexaObserver`.",
        "Sortie pour 15 : **F / 17 / 1111** ; pour 10 : **A / 12 / 1010**.",
      ],
      examTip: "Calcul possible en examen : convertir l'état dans les 3 bases. 15 = 0xF = 017 = 1111b ; 10 = 0xA = 012 = 1010b.",
    },
  ],
  cheatsheet: [
    { term: "Patron de conception", def: "Solution générale et réutilisable à un problème de conception récurrent ; un modèle, pas du code fini." },
    { term: "4 éléments", def: "Nom, Problème, Solution, Conséquences." },
    { term: "GoF", def: "Gang of Four : Gamma, Helm, Johnson, Vlissides. 23 patrons." },
    { term: "Classification", def: "Objectif (créationnel, structurel, comportemental) × portée (classe = héritage/statique, objet = composition/dynamique)." },
    { term: "Créationnels (5)", def: "Factory Method, Abstract Factory, Builder, Prototype, Singleton." },
    { term: "Structurels (7)", def: "Adapter, Bridge, Composite, Decorator, Façade, Flyweight, Proxy." },
    { term: "Comportementaux (11)", def: "Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor." },
    { term: "Patron de création", def: "Abstrait l'instanciation ; système indépendant de la façon dont les objets sont créés." },
    { term: "Singleton", def: "Une seule instance + point d'accès global. Attribut static privé, constructeur privé, getInstance() static synchronized." },
    { term: "static", def: "La méthode appartient à la classe : appel sans créer d'objet." },
    { term: "synchronized", def: "Un seul thread à la fois exécute la méthode (évite deux instances en multi-thread)." },
    { term: "Factory", def: "Crée des objets sans exposer la logique d'instanciation ; renvoie via une interface commune." },
    { term: "Factories Java", def: "DocumentBuilderFactory (DOM), SAXParserFactory (SAX), URLConnection (openConnection)." },
    { term: "Patron structurel", def: "Comment classes et objets sont composés pour former de plus grandes structures." },
    { term: "Adaptateur", def: "Convertit une interface en une autre attendue par le client ; fait collaborer des interfaces incompatibles." },
    { term: "Composite", def: "Arborescence partie-tout ; traitement uniforme des objets simples et composés." },
    { term: "Patron comportemental", def: "Algorithmes et répartition des responsabilités entre objets." },
    { term: "Commande", def: "Encapsule une demande dans un objet ; paramètre les clients ; file d'attente." },
    { term: "Observer", def: "Dépendance un-à-plusieurs : changement d'état du sujet → tous les observateurs notifiés et mis à jour." },
  ],
  compare: [
    {
      title: "Les 6 patrons du cours en un coup d'œil",
      headers: ["Patron", "Catégorie", "Problème résolu", "Exemple du cours"],
      rows: [
        ["Singleton", "Création", "Garantir une seule instance accessible partout", "Logger, configuration"],
        ["Factory", "Création", "Créer sans exposer la classe concrète", "ProductFactory, DocumentBuilderFactory"],
        ["Adaptateur", "Structure", "Interfaces incompatibles", "MediaAdapter (VLC/MP4 → MediaPlayer)"],
        ["Composite", "Structure", "Traiter pareil un élément et un groupe", "Shape / Line / ComplexShape"],
        ["Commande", "Comportement", "Encapsuler une requête, la mettre en file", "Order / BuyStockOrder / Agent"],
        ["Observer", "Comportement", "Notifier automatiquement les dépendants", "Subject / Binary-Octal-HexaObserver"],
      ],
    },
    {
      title: "Rôles dans chaque patron",
      headers: ["Patron", "Rôles"],
      rows: [
        ["Adaptateur", "Client → Cible (MediaPlayer) ← Adaptateur (MediaAdapter) → Adapté (AdvancedMediaPlayer)"],
        ["Composite", "Composant (Shape), Feuille (Line), Composite (ComplexShape)"],
        ["Commande", "Client, Invocateur (Agent), Commande (Order), Commande concrète (Buy/SellStockOrder), Récepteur (StockTrade)"],
        ["Observer", "Sujet (Subject), Observateur (Observer), Observateurs concrets"],
      ],
    },
  ],
  mnemonics: [
    "**5-7-11 = 23** : créationnels, structurels, comportementaux.",
    "Singleton = **« 3 P » : Privé (constructeur), Partagé (static), Protégé (synchronized)**.",
    "Adaptateur = **prise de voyage** ; Composite = **dossier/fichiers** ; Commande = **ticket de restaurant** ; Observer = **abonnement YouTube**.",
    "4 éléments d'un patron : **N-P-S-C** → « **N**e **P**as **S**auter les **C**onséquences ».",
  ],
  flashcards: [
    { q: "Définition d'un patron de conception ?", a: "Une **solution générale et réutilisable** à un problème de conception récurrent ; un **modèle**, pas une conception finie transformable directement en code." },
    { q: "Les 4 éléments essentiels d'un patron ?", a: "**Nom, Problème, Solution, Conséquences**." },
    { q: "Qui est le Gang of Four ?", a: "**Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides**, auteurs de *Design Patterns: Elements of Reusable OO Software*." },
    { q: "Combien de patrons GoF ?", a: "**23** : 5 créationnels, 7 structurels, 11 comportementaux." },
    { q: "Les deux axes de classification GoF ?", a: "**Objectif** (créationnel, structurel, comportemental) et **portée** (classe, objet)." },
    { q: "Portée classe vs portée objet ?", a: "Classe : relations classe/sous-classes par **héritage**, **statiques**. Objet : relations entre objets, **dynamiques**." },
    { q: "Patrons de portée classe ?", a: "**Factory Method, Adaptateur (de classe), Interpreter, Template Method**." },
    { q: "Rôle des patrons de création ?", a: "**Abstraire l'instanciation** et rendre le système **indépendant** de la façon dont les objets sont créés, composés, représentés." },
    { q: "Création de classes vs création d'objets ?", a: "Classes : **héritage** pour varier la classe instanciée. Objets : **délèguent** l'instanciation à un autre objet." },
    { q: "Que garantit le Singleton ?", a: "**Une seule instance** de la classe et un **point d'accès global**." },
    { q: "Pourquoi le constructeur du Singleton est privé ?", a: "Pour **interdire `new`** depuis l'extérieur : seule `getInstance()` crée l'instance." },
    { q: "Rôle de `static` dans getInstance() ?", a: "La méthode appartient à **la classe** : on l'appelle **sans créer d'objet**." },
    { q: "Rôle de `synchronized` dans getInstance() ?", a: "**Un seul thread à la fois** : évite que deux threads créent deux instances." },
    { q: "Usages typiques du Singleton ?", a: "**Logger**, **configuration**, **ressources partagées** (compteur), instance unique d'une **Factory**." },
    { q: "Que fait la Factory ?", a: "Crée des objets **sans exposer la logique d'instanciation** au client et les renvoie via une **interface commune**." },
    { q: "Quand utiliser une Factory ?", a: "Quand un framework délègue la création d'objets d'une **superclasse commune** ; quand on veut **ajouter facilement de nouveaux types**." },
    { q: "Exemples de Factory dans l'API Java ?", a: "**DocumentBuilderFactory** (DOM), **SAXParserFactory** (SAX), **URLConnection** (`openConnection()`)." },
    { q: "Combiner Factory et Singleton ?", a: "**Factory** dit comment créer ; **Singleton** garantit **une seule instance de la Factory**." },
    { q: "Définition des patrons structurels ?", a: "Comment **classes et objets sont composés** pour former des **structures plus grandes**." },
    { q: "Avantage des modèles d'objets structurels sur ceux de classes ?", a: "**Souplesse** : la composition peut être **modifiée à l'exécution**, impossible avec l'héritage statique." },
    { q: "Que fait l'Adaptateur ?", a: "**Convertit l'interface** d'une classe en celle attendue par le client ; fait collaborer des **interfaces incompatibles**." },
    { q: "Dans l'exemple audio, qui est l'Adaptateur, la Cible, l'Adapté ?", a: "Adaptateur : **MediaAdapter**. Cible : **MediaPlayer**. Adapté : **AdvancedMediaPlayer** (VLCPlayer, MP4Player)." },
    { q: "Chemin d'appel pour lire un MP4 ?", a: "Client → **AudioPlayer.play** → **MediaAdapter.play** → **MP4Player.playMP4**." },
    { q: "Que fait le Composite ?", a: "Compose des objets en **arborescence** et permet de traiter **uniformément** objets simples et compositions." },
    { q: "Rôles dans l'exemple Composite ?", a: "Composant **Shape**, Feuille **Line**, Composite **ComplexShape** (liste de Shape)." },
    { q: "Définition des patrons comportementaux ?", a: "Concernent **les algorithmes et l'attribution des responsabilités** entre objets." },
    { q: "Que fait le patron Commande ?", a: "**Encapsule une demande dans un objet** ; permet de **paramétrer** les clients et de mettre les demandes **en file d'attente**." },
    { q: "Rôles dans l'exemple Commande ?", a: "Commande **Order**, commandes concrètes **BuyStockOrder/SellStockOrder**, récepteur **StockTrade**, invocateur **Agent**, **Client**." },
    { q: "Que fait l'Observer ?", a: "Dépendance **un-à-plusieurs** : quand le sujet change d'état, **tous les observateurs sont notifiés et mis à jour automatiquement**." },
    { q: "Méthodes du Subject dans le cours ?", a: "`getState()`, `setState()` (appelle notify), `attach()`, `notifyAllObservers()`." },
    { q: "Sortie de setState(15) avec Hexa, Octal, Binary ?", a: "**F, 17, 1111**." },
    { q: "Sortie de setState(10) ?", a: "**A, 12, 1010**." },
  ],
  quiz: [
    { q: "Un patron de conception est :", options: ["Un code fini à copier tel quel", "Une solution générale et réutilisable à un problème de conception récurrent", "Une bibliothèque Java", "Un diagramme UML obligatoire"], answer: 1, explain: "C'est un **modèle / une recette** applicable dans de nombreuses situations, **pas du code fini**." },
    { q: "Quels sont les 4 éléments essentiels d'un patron ?", options: ["Nom, Problème, Solution, Conséquences", "Classe, Objet, Interface, Méthode", "Création, Structure, Comportement, Portée", "Contexte, Code, Test, Déploiement"], answer: 0, explain: "**Nom → Problème → Solution → Conséquences**." },
    { q: "Combien de patrons définit le GoF ?", options: ["12", "16", "23", "32"], answer: 2, explain: "**23** patrons : 5 créationnels, 7 structurels, 11 comportementaux." },
    { q: "Une portée « classe » signifie que les relations sont :", options: ["Dynamiques, entre objets", "Définies statiquement par héritage", "Toujours via une interface", "Gérées par un thread"], answer: 1, explain: "Portée classe = relations classe/sous-classes, **statiques** (héritage). Portée objet = **dynamique**." },
    { q: "Lequel est un patron de portée classe ?", options: ["Singleton", "Observer", "Template Method", "Composite"], answer: 2, explain: "Portée classe : **Factory Method, Adaptateur de classe, Interpreter, Template Method**." },
    { q: "Lequel n'est PAS un patron de création ?", options: ["Builder", "Prototype", "Proxy", "Abstract Factory"], answer: 2, explain: "**Proxy** est **structurel**. Créationnels : Factory Method, Abstract Factory, Builder, Prototype, Singleton." },
    { q: "Lequel est un patron structurel ?", options: ["Strategy", "Decorator", "Memento", "Iterator"], answer: 1, explain: "**Decorator** est structurel ; les trois autres sont comportementaux." },
    { q: "Les patrons de création d'objets :", options: ["Utilisent l'héritage pour varier la classe instanciée", "Délèguent l'instanciation à un autre objet", "Interdisent l'instanciation", "Créent toujours un Singleton"], answer: 1, explain: "Création d'**objets** = **délégation** ; création de **classes** = **héritage**." },
    { q: "Dans le Singleton, pourquoi le constructeur est-il privé ?", options: ["Pour accélérer le code", "Pour empêcher toute création d'instance avec new depuis l'extérieur", "Pour permettre l'héritage", "Pour le rendre thread-safe"], answer: 1, explain: "Seule `getInstance()` peut créer l'instance unique." },
    { q: "Que garantit le mot-clé `synchronized` sur getInstance() ?", options: ["Que la méthode est statique", "Qu'un seul thread à la fois exécute la méthode", "Que l'instance est sérialisable", "Que l'objet est immuable"], answer: 1, explain: "Il **verrouille** la méthode : deux threads passent l'un après l'autre, donc pas de double instance." },
    { q: "Le mot-clé `static` de getInstance() permet :", options: ["D'appeler la méthode sans créer d'objet", "De créer plusieurs instances", "D'hériter de la classe", "D'éviter le garbage collector"], answer: 0, explain: "La méthode appartient **à la classe** : `Singleton.getInstance()`." },
    { q: "Usage typique du Singleton selon le cours :", options: ["Parseur XML DOM", "Classe Logger ou de configuration", "Lecteur MP4", "Ordre de bourse"], answer: 1, explain: "**Logger**, **configuration**, **ressources partagées**." },
    { q: "La Factory permet principalement de :", options: ["Garantir une seule instance", "Créer des objets sans exposer la logique d'instanciation au client", "Notifier des observateurs", "Convertir une interface"], answer: 1, explain: "Le client passe par une **interface commune**, sans connaître la classe concrète." },
    { q: "Quelle classe Java est citée comme exemple de Factory ?", options: ["java.util.ArrayList", "javax.xml.parsers.DocumentBuilderFactory", "java.lang.Thread", "java.io.File"], answer: 1, explain: "**DocumentBuilderFactory**, **SAXParserFactory** et **URLConnection**." },
    { q: "En combinant Factory et Singleton :", options: ["La Factory devient un Observer", "Le Singleton garantit une seule instance de la Factory", "La Factory crée des Singletons uniquement", "Ils sont incompatibles"], answer: 1, explain: "**Factory** → comment créer ; **Singleton** → **une seule instance de la Factory**." },
    { q: "L'avantage des modèles d'objets structurels est :", options: ["La composition peut être modifiée à l'exécution", "Ils utilisent uniquement l'héritage", "Ils sont plus rapides", "Ils n'utilisent pas d'interfaces"], answer: 0, explain: "**Souplesse supplémentaire** : on peut changer la composition à l'exécution." },
    { q: "Le patron Adaptateur sert à :", options: ["Créer des familles d'objets", "Faire collaborer des classes aux interfaces incompatibles", "Encapsuler une requête", "Construire une arborescence"], answer: 1, explain: "Il **convertit l'interface** d'une classe en celle attendue par le client." },
    { q: "Dans l'exemple audio, quelle classe joue le rôle d'adaptateur ?", options: ["AudioPlayer", "MediaAdapter", "VLCPlayer", "AdvancedMediaPlayer"], answer: 1, explain: "**MediaAdapter** implémente `MediaPlayer` et utilise un `AdvancedMediaPlayer`." },
    { q: "Que se passe-t-il pour audioPlayer.play(\"mp3\", …) ?", options: ["Passage par MediaAdapter", "Lecture directe par AudioPlayer, sans adaptateur", "Erreur Invalid Media format", "Appel à VLCPlayer"], answer: 1, explain: "Le MP3 est **supporté directement** ; seuls VLC et MP4 passent par l'adaptateur." },
    { q: "Et pour play(\"avi\", …) ?", options: ["Lecture via MP4Player", "« Invalid Media format: avi »", "Lecture via VLCPlayer", "Exception NullPointerException"], answer: 1, explain: "Le format n'est géré ni directement ni par l'adaptateur." },
    { q: "Le patron Composite permet :", options: ["De traiter uniformément objets individuels et compositions", "D'avoir une seule instance", "De notifier les dépendants", "De mettre des requêtes en file"], answer: 0, explain: "**Arborescence** + **traitement uniforme** via une interface commune." },
    { q: "Dans l'exemple Composite, ComplexShape :", options: ["Est une feuille", "Contient une liste de Shape et délègue renderShapeToScreen() à chaque élément", "Hérite de Line", "Est un Singleton"], answer: 1, explain: "C'est le **composite** : il parcourt `shapeList` et appelle `renderShapeToScreen()` sur chaque enfant (selon son type réel)." },
    { q: "Les patrons comportementaux concernent :", options: ["La création d'objets", "La composition de structures", "Les algorithmes et la répartition des responsabilités entre objets", "Le déploiement"], answer: 2, explain: "Définition du cours." },
    { q: "Le patron Commande :", options: ["Encapsule une demande dans un objet", "Convertit une interface", "Garantit une instance unique", "Crée une arborescence"], answer: 0, explain: "Il **encapsule la demande**, permet de **paramétrer les clients** et une **file d'attente**." },
    { q: "Dans l'exemple Commande, quel est le récepteur qui fait le vrai travail ?", options: ["Agent", "Order", "StockTrade", "Client"], answer: 2, explain: "`StockTrade.buy()/sell()`. `Agent` est l'**invocateur**, `Order` la **commande**." },
    { q: "Dans l'exemple Commande, le rôle d'Agent est :", options: ["Récepteur", "Invocateur qui stocke les ordres dans une file et les exécute", "Commande concrète", "Observateur"], answer: 1, explain: "`Agent.placeOrder()` ajoute à `m_ordersQueue` puis exécute." },
    { q: "L'Observer définit une dépendance :", options: ["Un-à-un", "Un-à-plusieurs", "Plusieurs-à-un", "Circulaire"], answer: 1, explain: "Un **sujet** → **plusieurs observateurs** notifiés automatiquement." },
    { q: "Dans le code Observer, quelle méthode déclenche la notification ?", options: ["attach()", "getState()", "setState()", "update()"], answer: 2, explain: "`setState()` modifie l'état puis appelle `notifyAllObservers()`." },
    { q: "subject.setState(10) affiche pour l'HexaObserver :", options: ["10", "A", "12", "1010"], answer: 1, explain: "10 en hexadécimal = **A** (octal 12, binaire 1010)." },
    { type: "tf", q: "Un patron de conception peut être transformé directement en code sans adaptation.", answer: false, explain: "Faux : c'est une **description / un modèle**, pas une conception finie." },
    { type: "tf", q: "Un patron possède à la fois un objectif et une portée.", answer: true, explain: "Vrai : les deux classements sont **complémentaires**." },
    { type: "tf", q: "Le Singleton est un patron structurel.", answer: false, explain: "Faux : c'est un patron **de création**." },
    { type: "tf", q: "Dans l'Observer, chaque BinaryObserver s'attache lui-même au sujet dans son constructeur.", answer: true, explain: "Vrai : `this.subject.attach(this)`." },
    { type: "tf", q: "Commande, Iterator, Observer et Strategy sont des patrons comportementaux.", answer: true, explain: "Vrai : ce sont les 4 exemples donnés par le cours." },
  ],
  written: [
    { q: "Définissez un patron de conception et ses 4 éléments essentiels. Comment les patrons GoF sont-ils classés ?", answer: "Solution **générale et réutilisable** à un problème de conception **récurrent** ; un modèle, pas du code fini (comme une recette).\n4 éléments : **Nom** (vocabulaire commun), **Problème** (contexte, contraintes), **Solution** (éléments, relations, abstraction), **Conséquences** (avantages, limites, compromis).\nGoF (Gamma, Helm, Johnson, Vlissides) : **23 patrons** classés par **objectif** (créationnel 5, structurel 7, comportemental 11) et par **portée** (classe : héritage, statique ; objet : composition, dynamique)." },
    { q: "Écrivez un Singleton thread-safe en Java et expliquez chaque élément.", answer: "class Singleton {\n  private static Singleton instance;\n  private Singleton() {}\n  public static synchronized Singleton getInstance() {\n    if (instance == null) instance = new Singleton();\n    return instance;\n  }\n}\n**private static instance** : l'unique instance. **Constructeur privé** : interdit `new`. **static getInstance()** : appel sans objet, point d'accès global. **synchronized** : un seul thread à la fois → pas de double instance. Usages : Logger, configuration, ressources partagées, instance unique d'une Factory." },
    { q: "Expliquez le patron Adaptateur à l'aide de l'exemple MediaPlayer du cours.", answer: "But : faire collaborer des **interfaces incompatibles** en convertissant une interface en celle attendue.\n**Cible** : `MediaPlayer.play(type, file)`. **Adapté** : `AdvancedMediaPlayer.playVLC/playMP4` (VLCPlayer, MP4Player). **Adaptateur** : `MediaAdapter implements MediaPlayer`, contient un `AdvancedMediaPlayer` choisi selon le type.\n`AudioPlayer` lit le MP3 directement ; pour VLC/MP4 il crée un `MediaAdapter` et appelle `play()`, qui appelle `playVLC()` ou `playMP4()`. Autre format → « Invalid Media format »." },
    { q: "Expliquez le patron Commande avec l'exemple des ordres de bourse (rôles et déroulé).", answer: "Encapsule une **demande dans un objet** → paramétrer les clients, **file d'attente**.\nRôles : **Order** (interface `execute()`), **BuyStockOrder / SellStockOrder** (commandes concrètes, gardent une référence à `StockTrade`), **StockTrade** (récepteur : `buy()`, `sell()`), **Agent** (invocateur : `placeOrder()` ajoute à `m_ordersQueue` puis exécute), **Client** (crée stock, ordres, agent).\nDéroulé : `agent.placeOrder(bso)` → `bso.execute()` → `stock.buy()` → « You want to buy stocks »." },
    { q: "Expliquez le patron Observer et donnez la sortie du programme du cours.", answer: "Dépendance **un-à-plusieurs** : quand le **sujet** change d'état, **tous ses observateurs sont notifiés et mis à jour automatiquement**.\n`Subject` : liste d'observateurs, `state`, `attach()`, `setState()` (→ `notifyAllObservers()`), `getState()`. `Observer` abstrait avec `update()` ; `BinaryObserver`, `OctalObserver`, `HexaObserver` s'attachent dans leur constructeur.\nSortie : setState(15) → **Hex F, Octal 17, Binary 1111** ; setState(10) → **Hex A, Octal 12, Binary 1010**." },
    { q: "Comparez Composite et Adaptateur (catégorie, problème, structure).", answer: "Tous deux **structurels**.\n**Adaptateur** : problème = interfaces **incompatibles** ; solution = une classe intermédiaire qui implémente l'interface cible et délègue à l'adapté (MediaAdapter).\n**Composite** : problème = traiter de la même façon un élément et un groupe ; solution = interface commune (`Shape`), feuilles (`Line`) et composites (`ComplexShape` avec liste de `Shape`) → **arborescence récursive** et **traitement uniforme**." },
  ],
});
