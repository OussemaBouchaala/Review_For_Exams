// @section dp | Factory (Fabrique)
// Patron Factory : le client demande un produit, la fabrique choisit la classe concrète.
// Compiler et lancer :  java FactoryDemo.java

public class FactoryDemo {
    public static void main(String[] args) {
        ProductFactory factory = new ProductFactory();

        // Le client ne connaît que l'interface Product, jamais OneProduct / AnotherProduct.
        Product p1 = factory.createProduct("ID1");
        Product p2 = factory.createProduct("ID2");
        p1.use();
        p2.use();

        Product inconnu = factory.createProduct("ID9");
        System.out.println("ID9 -> " + inconnu);   // null : identifiant inconnu
    }
}

interface Product {                     // interface commune renvoyée au client
    void use();
}

class OneProduct implements Product {   // produit concret n°1
    public void use() { System.out.println("J'utilise OneProduct"); }
}

class AnotherProduct implements Product { // produit concret n°2
    public void use() { System.out.println("J'utilise AnotherProduct"); }
}

class ProductFactory {
    public Product createProduct(String productID) {
        // Attention : en Java on compare des String avec equals(), pas avec ==
        if ("ID1".equals(productID)) {
            return new OneProduct();
        }
        if ("ID2".equals(productID)) {
            return new AnotherProduct();
        }
        // Ajouter un produit = ajouter une classe + une ligne ici ; le client ne change pas.
        return null;
    }
}
