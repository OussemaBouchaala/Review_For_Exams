// @section dp | Stratégie (Strategy)
// Patron Stratégie : des algorithmes interchangeables, choisis à l'exécution par le Context.
// Compiler et lancer :  java StrategyDemo.java

public class StrategyDemo {
    public static void main(String[] args) {
        double panier = 200.0;

        Context caisse = new Context(new PrixNormal());     // stratégie de départ
        caisse.execute(panier);

        caisse.setStrategy(new PrixEtudiant());             // on change d'algorithme à l'exécution
        caisse.execute(panier);

        caisse.setStrategy(new PrixSoldes(30));
        caisse.execute(panier);

        // Nouvel algorithme sans toucher au Context : une simple lambda suffit (interface fonctionnelle)
        caisse.setStrategy(montant -> montant > 150 ? montant - 20 : montant);
        caisse.execute(panier);
    }
}

// Strategy : interface commune à tous les algorithmes
interface Strategy {
    double execute(double montant);
}

// ConcreteStrategyA
class PrixNormal implements Strategy {
    public double execute(double montant) { return montant; }
}

// ConcreteStrategyB
class PrixEtudiant implements Strategy {
    public double execute(double montant) { return montant * 0.8; }   // -20 %
}

// ConcreteStrategyC (paramétrable)
class PrixSoldes implements Strategy {
    private final int pourcentage;
    PrixSoldes(int pourcentage) { this.pourcentage = pourcentage; }
    public double execute(double montant) { return montant * (100 - pourcentage) / 100.0; }
}

// Context : garde une Strategy et lui délègue le calcul (composition)
class Context {
    private Strategy strategy;

    Context(Strategy strategy) { this.strategy = strategy; }

    public void setStrategy(Strategy strategy) { this.strategy = strategy; }

    public void execute(double montant) {
        String nom = strategy.getClass().getSimpleName();
        if (nom.contains("Lambda") || nom.contains("$")) nom = "Remise fidélité (lambda)";
        System.out.printf("%-26s : %.2f DT -> %.2f DT%n", nom, montant, strategy.execute(montant));
    }
}
