// @section dp | Itérateur (Iterator)
// Patron Itérateur : parcourir une collection sans connaître sa structure interne.
// Compiler et lancer :  java IteratorDemo.java

public class IteratorDemo {
    public static void main(String[] args) {
        Playlist playlist = new Playlist(5);          // ConcreteAggregate (tableau en interne)
        playlist.add("Bohemian Rhapsody");
        playlist.add("Imagine");
        playlist.add("Hotel California");
        playlist.add("Billie Jean");

        // Le client ne sait pas que c'est un tableau : il n'utilise que l'Iterator
        System.out.println("--- Parcours complet ---");
        Iterator it = playlist.createIterator();
        while (it.hasNext()) {
            System.out.println("▶ " + it.next());
        }

        // remove() : on supprime pendant le parcours
        System.out.println("--- Suppression de « Imagine » pendant le parcours ---");
        Iterator it2 = playlist.createIterator();
        while (it2.hasNext()) {
            String titre = (String) it2.next();
            if (titre.equals("Imagine")) it2.remove();
        }

        // Deux itérateurs indépendants peuvent parcourir la même collection en même temps
        Iterator a = playlist.createIterator();
        Iterator b = playlist.createIterator();
        a.next();
        System.out.println("Itérateur A est sur le 2e titre : " + a.next());
        System.out.println("Itérateur B est encore sur le 1er : " + b.next());

        System.out.println("--- Playlist finale ---");
        Iterator it3 = playlist.createIterator();
        while (it3.hasNext()) System.out.println("▶ " + it3.next());
    }
}

// Iterator : l'interface de parcours (hasNext, next, remove)
interface Iterator {
    boolean hasNext();
    Object next();
    void remove();
}

// Aggregate : la collection sait fabriquer son itérateur
interface Aggregate {
    Iterator createIterator();
}

// ConcreteAggregate : la vraie structure (ici un tableau, mais le client ne le voit pas)
class Playlist implements Aggregate {
    private final String[] titres;
    private int taille = 0;

    Playlist(int capacite) { titres = new String[capacite]; }

    void add(String titre) { titres[taille++] = titre; }

    @Override
    public Iterator createIterator() { return new PlaylistIterator(); }

    // ConcreteIterator : garde la position courante (classe interne, accès au tableau)
    private class PlaylistIterator implements Iterator {
        private int position = 0;

        @Override
        public boolean hasNext() { return position < taille; }

        @Override
        public Object next() {
            if (!hasNext()) throw new java.util.NoSuchElementException();
            return titres[position++];
        }

        @Override
        public void remove() {            // supprime le dernier élément rendu par next()
            if (position == 0) throw new IllegalStateException("appeler next() d'abord");
            for (int i = position - 1; i < taille - 1; i++) titres[i] = titres[i + 1];
            titres[--taille] = null;
            position--;
        }
    }
}
