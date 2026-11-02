// @section solid | O — Open/Closed Principle (OCP)
// OCP : ouvert à l'extension, fermé à la modification.
// Compiler et lancer :  java OcpDemo.java

import java.util.List;

public class OcpDemo {
    public static void main(String[] args) {
        System.out.println("--- Avant (viole OCP) ---");
        PaymentProcessorAvant avant = new PaymentProcessorAvant();
        avant.pay("CREDIT_CARD", 100);
        avant.pay("PAYPAL", 50);

        System.out.println("--- Après (respecte OCP) ---");
        PaymentProcessor processor = new PaymentProcessor();
        List<PaymentMethod> methodes = List.of(
            new CreditCardPayment("4970-xxxx-1234"),
            new CashPayment(),
            new PaypalPayment("sami@insat.tn"),
            new D17Payment()            // NOUVEAU moyen ajouté sans toucher PaymentProcessor
        );
        for (PaymentMethod m : methodes) processor.process(m, 80);
    }
}

// ❌ AVANT : chaque nouveau moyen de paiement oblige à MODIFIER ce switch
class PaymentProcessorAvant {
    void pay(String type, double amount) {
        switch (type) {
            case "CREDIT_CARD": System.out.println("Carte : " + amount + " DT"); break;
            case "PAYPAL":      System.out.println("PayPal : " + amount + " DT"); break;
            case "CASH":        System.out.println("Espèces : " + amount + " DT"); break;
            default: throw new IllegalArgumentException("Type inconnu : " + type);
        }
    }
}

// ✅ APRÈS : une abstraction + du polymorphisme
interface PaymentMethod {
    void pay(double amount);
}

class CreditCardPayment implements PaymentMethod {
    private final String numero;
    CreditCardPayment(String numero) { this.numero = numero; }
    public void pay(double amount) { System.out.println("Carte " + numero + " : " + amount + " DT"); }
}

class CashPayment implements PaymentMethod {
    public void pay(double amount) { System.out.println("Espèces : " + amount + " DT"); }
}

class PaypalPayment implements PaymentMethod {
    private final String compte;
    PaypalPayment(String compte) { this.compte = compte; }
    public void pay(double amount) { System.out.println("PayPal (" + compte + ") : " + amount + " DT"); }
}

class D17Payment implements PaymentMethod {   // extension : une nouvelle classe, zéro modification
    public void pay(double amount) { System.out.println("D17 mobile : " + amount + " DT"); }
}

class PaymentProcessor {                      // FERMÉ à la modification
    void process(PaymentMethod method, double amount) {
        method.pay(amount);                   // ne connaît que l'interface
    }
}
