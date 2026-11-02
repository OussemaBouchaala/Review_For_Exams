// @section dp | Commande (Command)
// Patron Commande : chaque ordre de bourse est un objet que l'Agent met en file puis exécute.
// Compiler et lancer :  java CommandDemo.java

import java.util.ArrayDeque;
import java.util.Deque;

public class CommandDemo {                       // Client : crée et configure les commandes
    public static void main(String[] args) {
        StockTrade stock = new StockTrade();
        Order buy  = new BuyStockOrder(stock);
        Order sell = new SellStockOrder(stock);

        Agent agent = new Agent();
        agent.placeOrder(buy);                   // l'agent ne sait pas ce que fait l'ordre
        agent.placeOrder(sell);
        agent.placeOrder(new BuyStockOrder(stock));

        agent.processOrders();                   // exécution différée, dans l'ordre d'arrivée (FIFO)
    }
}

// Commande : interface avec une seule méthode execute()
interface Order {
    void execute();
}

// Récepteur : fait le vrai travail
class StockTrade {
    public void buy()  { System.out.println("You want to buy stocks"); }
    public void sell() { System.out.println("You want to sell stocks"); }
}

// Commandes concrètes : relient une action à un récepteur
class BuyStockOrder implements Order {
    private final StockTrade stock;
    public BuyStockOrder(StockTrade st) { stock = st; }
    public void execute() { stock.buy(); }
}

class SellStockOrder implements Order {
    private final StockTrade stock;
    public SellStockOrder(StockTrade st) { stock = st; }
    public void execute() { stock.sell(); }
}

// Invocateur : stocke les commandes dans une file d'attente et les déclenche
class Agent {
    private final Deque<Order> ordersQueue = new ArrayDeque<>();

    public void placeOrder(Order order) {
        ordersQueue.addLast(order);
        System.out.println("Ordre ajouté à la file (" + ordersQueue.size() + " en attente)");
    }

    public void processOrders() {
        while (!ordersQueue.isEmpty()) {
            Order o = ordersQueue.pollFirst();   // retire le premier
            o.execute();
        }
    }
}
