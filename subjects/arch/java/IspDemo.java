// @section solid | I — Interface Segregation Principle (ISP)
// ISP : aucun client ne doit dépendre de méthodes qu'il n'utilise pas.
// Compiler et lancer :  java IspDemo.java

public class IspDemo {
    public static void main(String[] args) {
        System.out.println("--- Avant (viole ISP) ---");
        EmployeAvant dev = new DeveloppeurAvant();
        dev.travailler();
        try { dev.nager(); } catch (UnsupportedOperationException e) { System.out.println("💥 " + e.getMessage()); }

        System.out.println("--- Après (respecte ISP) ---");
        ServiceImpl impl = new ServiceImpl();
        new ClientA(impl).run();   // ClientA ne voit QUE opA()
        new ClientB(impl).run();
        new ClientC(impl).run();
    }
}

// ❌ AVANT : interface « fourre-tout », chaque implémentation subit toutes les méthodes
interface EmployeAvant {
    void travailler();
    void nager();                  // n'a de sens que pour le maître-nageur
}
class DeveloppeurAvant implements EmployeAvant {
    public void travailler() { System.out.println("Le développeur code"); }
    public void nager() { throw new UnsupportedOperationException("méthode imposée mais inutile"); }
}

// ✅ APRÈS : une petite interface par client
interface ClientAService { void opA(); }
interface ClientBService { void opB(); }
interface ClientCService { void opC(); }

class ServiceImpl implements ClientAService, ClientBService, ClientCService {
    public void opA() { System.out.println("opA exécutée"); }
    public void opB() { System.out.println("opB exécutée"); }
    public void opC() { System.out.println("opC exécutée"); }
}

class ClientA {
    private final ClientAService service;   // dépend seulement de ce qu'il utilise
    ClientA(ClientAService s) { service = s; }
    void run() { service.opA(); }
}
class ClientB {
    private final ClientBService service;
    ClientB(ClientBService s) { service = s; }
    void run() { service.opB(); }
}
class ClientC {
    private final ClientCService service;
    ClientC(ClientCService s) { service = s; }
    void run() { service.opC(); }
}
