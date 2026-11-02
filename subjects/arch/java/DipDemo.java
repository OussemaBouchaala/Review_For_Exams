// @section solid | D — Dependency Inversion Principle (DIP)
// DIP : haut niveau et bas niveau dépendent tous deux d'une abstraction.
// Compiler et lancer :  java DipDemo.java

public class DipDemo {
    public static void main(String[] args) {
        System.out.println("--- Avant (viole DIP) ---");
        new ServiceNotificationAvant().notifier("Examen lundi 8h");

        System.out.println("--- Après (respecte DIP) ---");
        // Injection de dépendances : c'est main() qui choisit l'implémentation
        ServiceNotification parEmail = new ServiceNotification(new EmailService());
        ServiceNotification parSms   = new ServiceNotification(new SmsService());
        parEmail.notifier("Examen lundi 8h");
        parSms.notifier("Examen lundi 8h");

        // Test unitaire facile : on injecte un faux service
        FakeService fake = new FakeService();
        new ServiceNotification(fake).notifier("test");
        System.out.println("Messages capturés par le faux service : " + fake.recus);
    }
}

// ❌ AVANT : le module haut niveau crée et appelle directement un détail concret
class EmailServiceAvant {
    void envoyerEmail(String msg) { System.out.println("E-mail : " + msg); }
}
class ServiceNotificationAvant {
    private final EmailServiceAvant email = new EmailServiceAvant();   // couplage fort
    void notifier(String msg) { email.envoyerEmail(msg); }             // passer au SMS = modifier ici
}

// ✅ APRÈS : l'abstraction (le « port ») appartient au haut niveau
interface MessageService {
    void envoyer(String msg);
}

class ServiceNotification {                     // haut niveau : ne connaît que l'interface
    private final MessageService service;
    ServiceNotification(MessageService service) { this.service = service; }   // injection
    void notifier(String msg) { service.envoyer(msg); }
}

class EmailService implements MessageService {  // bas niveau : dépend de l'abstraction
    public void envoyer(String msg) { System.out.println("E-mail : " + msg); }
}

class SmsService implements MessageService {
    public void envoyer(String msg) { System.out.println("SMS : " + msg); }
}

class FakeService implements MessageService {
    int recus = 0;
    public void envoyer(String msg) { recus++; }
}
