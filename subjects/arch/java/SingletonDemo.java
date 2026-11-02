// @section dp | Singleton
// Patron Singleton : une seule instance + point d'accès global.
// Compiler et lancer :  java SingletonDemo.java

public class SingletonDemo {
    public static void main(String[] args) throws InterruptedException {
        // On ne peut PAS écrire new Singleton() ici : le constructeur est privé.
        Singleton a = Singleton.getInstance();
        Singleton b = Singleton.getInstance();
        a.doSomething("premier appel");
        b.doSomething("deuxième appel");
        System.out.println("a == b ? " + (a == b));   // true : c'est le même objet

        // Multi-thread : grâce à synchronized, les 4 threads obtiennent la même instance.
        Thread[] threads = new Thread[4];
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> Singleton.getInstance().doSomething("thread"));
            threads[i].start();
        }
        for (Thread t : threads) t.join();
        System.out.println("Instances créées au total : " + Singleton.getCreations());
    }
}

class Singleton {
    private static Singleton instance;          // 1) l'instance unique, static et privée
    private static int creations = 0;           // pour vérifier qu'on ne crée qu'un objet
    private int compteur = 0;                   // état partagé par tout le programme

    private Singleton() {                       // 2) constructeur PRIVÉ
        creations++;
    }

    // 3) point d'accès global, static (appel sans objet) et synchronized (thread-safe)
    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();         // création paresseuse (lazy) au 1er appel
        }
        return instance;
    }

    public synchronized void doSomething(String qui) {
        compteur++;
        if (!qui.equals("thread")) System.out.println("Singleton utilisé par : " + qui + " (compteur = " + compteur + ")");
    }

    public static int getCreations() { return creations; }
}
