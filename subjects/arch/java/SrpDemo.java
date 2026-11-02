// @section solid | S — Single Responsibility Principle (SRP)
// SRP : une classe = une seule raison de changer.
// Compiler et lancer :  java SrpDemo.java

import java.util.ArrayList;
import java.util.List;

public class SrpDemo {
    public static void main(String[] args) {
        System.out.println("--- Avant (viole SRP) ---");
        new UserAvant("sami@insat.tn").register();

        System.out.println("--- Après (respecte SRP) ---");
        UserRepository repo = new UserRepository();
        EmailService email = new EmailService();
        UserService service = new UserService(repo, email);
        service.register(new User("sami@insat.tn"));
        System.out.println("Utilisateurs en base : " + repo.count());
    }
}

// ❌ AVANT : 3 responsabilités = 3 raisons de changer (métier, e-mail, base de données)
class UserAvant {
    private final String email;
    UserAvant(String email) { this.email = email; }

    void register() {
        if (!email.contains("@")) throw new IllegalArgumentException("e-mail invalide");  // métier
        System.out.println("INSERT INTO users VALUES ('" + email + "')");                // persistance
        System.out.println("SMTP -> " + email + " : Bienvenue !");                       // e-mail
    }
}

// ✅ APRÈS : chaque classe a une seule responsabilité
class User {                                    // données + règle métier
    private final String email;
    User(String email) {
        if (!email.contains("@")) throw new IllegalArgumentException("e-mail invalide");
        this.email = email;
    }
    String getEmail() { return email; }
}

class UserRepository {                          // change seulement si la base change
    private final List<User> table = new ArrayList<>();
    void save(User u) {
        table.add(u);
        System.out.println("UserRepository : utilisateur " + u.getEmail() + " sauvegardé");
    }
    int count() { return table.size(); }
}

class EmailService {                            // change seulement si le fournisseur d'e-mail change
    void sendWelcome(User u) {
        System.out.println("EmailService : Bienvenue envoyé à " + u.getEmail());
    }
}

class UserService {                             // orchestre le cas d'utilisation « inscription »
    private final UserRepository repo;
    private final EmailService email;
    UserService(UserRepository repo, EmailService email) { this.repo = repo; this.email = email; }

    void register(User u) {
        repo.save(u);
        email.sendWelcome(u);
    }
}
