// @section dp | Composite
// Patron Composite : feuilles (Line) et composites (Rectangle, ComplexShape) partagent l'interface Shape.
// Compiler et lancer :  java CompositeDemo.java

import java.util.ArrayList;
import java.util.List;

public class CompositeDemo {
    public static void main(String[] args) {
        Shape l1 = new Line("L1");
        Shape r1 = new Rectangle("R1");

        ComplexShape dessin = new ComplexShape("Dessin");   // composite contenant d'autres formes
        dessin.addToShape(l1);
        dessin.addToShape(r1);

        ComplexShape page = new ComplexShape("Page");      // un composite peut contenir un composite
        page.addToShape(dessin);
        page.addToShape(new Line("L2"));

        GraphicsEditor editor = new GraphicsEditor();
        editor.draw(l1);     // une feuille...
        editor.draw(page);   // ...ou tout un arbre : même appel (traitement uniforme)

        System.out.println("Page éclatée en " + page.explodeShape().length + " éléments directs");
    }
}

// Composant : interface commune aux feuilles et aux composites
interface Shape {
    void renderShapeToScreen(String indent);
    Shape[] explodeShape();
}

// Feuille : élément simple
class Line implements Shape {
    private final String name;
    Line(String name) { this.name = name; }
    public void renderShapeToScreen(String indent) { System.out.println(indent + "Ligne " + name); }
    public Shape[] explodeShape() { return new Shape[] { this }; }   // se renvoie elle-même
}

// Rectangle : composé de ses 4 arêtes (rectangleEdges)
class Rectangle implements Shape {
    private final String name;
    private final List<Shape> rectangleEdges = new ArrayList<>();
    Rectangle(String name) {
        this.name = name;
        for (int i = 1; i <= 4; i++) rectangleEdges.add(new Line(name + "-arête" + i));
    }
    public void renderShapeToScreen(String indent) {
        System.out.println(indent + "Rectangle " + name);
        for (Shape edge : rectangleEdges) edge.renderShapeToScreen(indent + "  ");
    }
    public Shape[] explodeShape() { return rectangleEdges.toArray(new Shape[0]); }
}

// Composite : contient une liste de Shape et délègue à chacun (récursivité)
class ComplexShape implements Shape {
    private final String name;
    private final List<Shape> shapeList = new ArrayList<>();
    ComplexShape(String name) { this.name = name; }

    public void addToShape(Shape shapeToAdd) { shapeList.add(shapeToAdd); }

    public void renderShapeToScreen(String indent) {
        System.out.println(indent + "Groupe " + name);
        for (Shape s : shapeList) {
            s.renderShapeToScreen(indent + "  ");   // polymorphisme : appel selon le type réel
        }
    }
    public Shape[] explodeShape() { return shapeList.toArray(new Shape[0]); }
}

// Client : ne fait aucune différence entre feuille et composite
class GraphicsEditor {
    public void draw(Shape shape) {
        shape.renderShapeToScreen("");
        System.out.println("---");
    }
}
