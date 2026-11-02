// @section archlog | Synchrone vs asynchrone
// Synchrone : le client attend toute la chaîne. Asynchrone : on publie dans une file et on continue.
// Compiler et lancer :  java SyncAsyncDemo.java

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class SyncAsyncDemo {
    public static void main(String[] args) throws Exception {
        System.out.println("=== SYNCHRONE (REST / gRPC) ===");
        ServiceStock stock = new ServiceStock();
        ServiceCommande commande = new ServiceCommande(stock);
        long t0 = System.currentTimeMillis();
        commande.passerCommande("CMD-1");                       // bloque ~600 ms
        System.out.println("Client libéré après " + arrondi(System.currentTimeMillis() - t0) + " ms");
        stock.enPanne = true;
        try {
            commande.passerCommande("CMD-2");
        } catch (IllegalStateException e) {
            System.out.println("💥 Effet domino : " + e.getMessage());
        }

        System.out.println();
        System.out.println("=== ASYNCHRONE (Kafka / RabbitMQ) ===");
        Bus bus = new Bus();
        Consommateur facturation = new Consommateur("Facturation", 300);
        Consommateur livraison   = new Consommateur("Livraison", 500);
        bus.abonner(facturation);
        bus.abonner(livraison);
        facturation.start();
        livraison.start();

        t0 = System.currentTimeMillis();
        bus.publier("CMD-3");                                   // ne bloque pas
        bus.publier("CMD-4");
        System.out.println("Client libéré après " + arrondi(System.currentTimeMillis() - t0) + " ms");

        facturation.terminer();                                 // attend la fin du traitement
        livraison.terminer();
        System.out.println("Tous les événements ont été traités (cohérence éventuelle)");
    }

    static long arrondi(long ms) { return Math.round(ms / 100.0) * 100; }
    static void pause(int ms) { try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); } }
}

// ---------- Synchrone : appels directs en chaîne ----------
class ServiceStock {
    boolean enPanne = false;
    void reserver(String id) {
        if (enPanne) throw new IllegalStateException("ServiceStock indisponible, " + id + " échoue");
        SyncAsyncDemo.pause(400);
        System.out.println("  Stock réservé pour " + id);
    }
}

class ServiceCommande {
    private final ServiceStock stock;
    ServiceCommande(ServiceStock stock) { this.stock = stock; }
    void passerCommande(String id) {
        SyncAsyncDemo.pause(200);
        stock.reserver(id);                 // attend la réponse : couplage temporel
        System.out.println("  Commande " + id + " confirmée");
    }
}

// ---------- Asynchrone : bus + une file par consommateur ----------
class Bus {
    private final List<Consommateur> abonnes = new ArrayList<>();
    void abonner(Consommateur c) { abonnes.add(c); }
    void publier(String evenement) {
        System.out.println("  Événement « commande créée » " + evenement + " publié");
        for (Consommateur c : abonnes) c.file.offer(evenement);   // dépose et repart
    }
}

class Consommateur extends Thread {
    private static final String FIN = "__FIN__";
    final BlockingQueue<String> file = new LinkedBlockingQueue<>();
    private final String nom;
    private final int duree;
    Consommateur(String nom, int duree) { this.nom = nom; this.duree = duree; }

    @Override public void run() {
        try {
            while (true) {
                String ev = file.take();                    // traite à SON rythme
                if (ev.equals(FIN)) return;
                SyncAsyncDemo.pause(duree);
                System.out.println("  [" + nom + "] a traité " + ev);
            }
        } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }

    void terminer() throws InterruptedException { file.offer(FIN); join(); }
}
