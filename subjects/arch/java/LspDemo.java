// @section solid | L — Liskov Substitution Principle (LSP)
// LSP : une sous-classe doit pouvoir remplacer sa classe mère sans surprise.
// Compiler et lancer :  java LspDemo.java

import java.util.List;

public class LspDemo {
    public static void main(String[] args) {
        System.out.println("--- Avant (viole LSP) ---");
        List<OiseauAvant> oiseaux = List.of(new AigleAvant(), new PingouinAvant());
        for (OiseauAvant o : oiseaux) {
            try {
                o.voler();                       // le client croit que TOUT oiseau vole
            } catch (UnsupportedOperationException e) {
                System.out.println("💥 Erreur : " + e.getMessage());
            }
        }

        System.out.println("--- Après (respecte LSP) ---");
        List<Oiseau> tous = List.of(new Aigle(), new Pingouin());
        for (Oiseau o : tous) o.seDeplacer();    // valable pour TOUS les oiseaux

        List<Volant> volants = List.of(new Aigle());   // seuls ceux qui volent sont ici
        for (Volant v : volants) v.voler();
    }
}

// ❌ AVANT : Pingouin hérite d'une méthode qu'il ne peut pas honorer
class OiseauAvant {
    void voler() { System.out.println("Je vole"); }
}
class AigleAvant extends OiseauAvant {
    @Override void voler() { System.out.println("L'aigle plane à 3000 m"); }
}
class PingouinAvant extends OiseauAvant {
    @Override void voler() { throw new UnsupportedOperationException("un pingouin ne vole pas !"); }
}

// ✅ APRÈS : la classe mère ne promet que ce que TOUS savent faire
abstract class Oiseau {
    abstract void seDeplacer();
}

interface Volant {                           // capacité séparée
    void voler();
}

class Aigle extends Oiseau implements Volant {
    void seDeplacer() { System.out.println("L'aigle se déplace en volant"); }
    public void voler() { System.out.println("L'aigle plane à 3000 m"); }
}

class Pingouin extends Oiseau {              // n'est PAS obligé d'implémenter Volant
    void seDeplacer() { System.out.println("Le pingouin se déplace en nageant"); }
}
