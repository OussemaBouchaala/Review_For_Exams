// @section solid | Métriques : Ca, Ce, I, A et la distance D
// Calcul des métriques de Robert Martin pour quelques packages.
// Compiler et lancer :  java MetriquesDemo.java

import java.util.List;

public class MetriquesDemo {
    public static void main(String[] args) {
        List<Package> packages = List.of(
            //           nom          Ca  Ce  Nc  Na
            new Package("domaine",     5,  0,  10, 10),   // stable et abstrait : idéal
            new Package("ui",          0,  6,  8,   0),   // instable et concret : idéal
            new Package("utilitaires", 6,  1,  12,  0),   // stable mais concret : zone de douleur
            new Package("contrats",    0,  1,  5,   5)    // instable et abstrait : zone d'inutilité
        );
        System.out.printf("%-12s %4s %4s %6s %6s %6s  %s%n", "Package", "Ca", "Ce", "I", "A", "D", "Diagnostic");
        for (Package p : packages) {
            System.out.printf("%-12s %4d %4d %6.2f %6.2f %6.2f  %s%n",
                p.nom, p.ca, p.ce, p.instabilite(), p.abstraction(), p.distance(), p.diagnostic());
        }
    }
}

class Package {
    final String nom;
    final int ca;   // couplage afférent : packages qui dépendent de moi (entrants)
    final int ce;   // couplage efférent : packages dont je dépends (sortants)
    final int nc;   // nombre total de classes
    final int na;   // nombre de classes abstraites / interfaces

    Package(String nom, int ca, int ce, int nc, int na) {
        this.nom = nom; this.ca = ca; this.ce = ce; this.nc = nc; this.na = na;
    }

    double instabilite() {                 // I = Ce / (Ca + Ce), entre 0 (stable) et 1 (instable)
        return (ca + ce) == 0 ? 0 : (double) ce / (ca + ce);
    }

    double abstraction() {                 // A = Na / Nc, entre 0 (concret) et 1 (abstrait)
        return nc == 0 ? 0 : (double) na / nc;
    }

    double distance() {                    // D = |A + I - 1| : 0 = sur la séquence principale
        return Math.abs(abstraction() + instabilite() - 1);
    }

    String diagnostic() {
        if (distance() <= 0.3) return "OK (proche de la séquence principale)";
        if (abstraction() + instabilite() < 1) return "Zone de douleur (stable + concret)";
        return "Zone d'inutilité (instable + abstrait)";
    }
}
