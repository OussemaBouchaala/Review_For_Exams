// @section dp | Observer (Observateur)
// Patron Observer : un changement d'état du Subject notifie automatiquement tous les observateurs.
// Compiler et lancer :  java ObserverDemo.java

import java.util.ArrayList;
import java.util.List;

public class ObserverDemo {
    public static void main(String[] args) {
        Subject subject = new Subject();

        new HexaObserver(subject);     // chaque observateur s'abonne dans son constructeur
        new OctalObserver(subject);
        new BinaryObserver(subject);

        System.out.println("First state change: 15");
        subject.setState(15);
        System.out.println("Second state change: 10");
        subject.setState(10);
    }
}

// Sujet : garde l'état et la liste des abonnés
class Subject {
    private final List<Observer> observers = new ArrayList<>();
    private int state;

    public int getState() { return state; }

    public void setState(int state) {
        this.state = state;
        notifyAllObservers();          // changement d'état -> notification
    }

    public void attach(Observer observer) { observers.add(observer); }

    public void notifyAllObservers() {
        for (Observer observer : observers) {
            observer.update();
        }
    }
}

// Observateur abstrait
abstract class Observer {
    protected Subject subject;
    public abstract void update();
}

// Observateurs concrets
class BinaryObserver extends Observer {
    public BinaryObserver(Subject subject) {
        this.subject = subject;
        this.subject.attach(this);
    }
    public void update() {
        System.out.println("Binary String: " + Integer.toBinaryString(subject.getState()));
    }
}

class OctalObserver extends Observer {
    public OctalObserver(Subject subject) {
        this.subject = subject;
        this.subject.attach(this);
    }
    public void update() {
        System.out.println("Octal String: " + Integer.toOctalString(subject.getState()));
    }
}

class HexaObserver extends Observer {
    public HexaObserver(Subject subject) {
        this.subject = subject;
        this.subject.attach(this);
    }
    public void update() {
        System.out.println("Hex String: " + Integer.toHexString(subject.getState()).toUpperCase());
    }
}
