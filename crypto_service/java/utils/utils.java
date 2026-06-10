package main.java;
import it.unisa.dia.gas.jpbc.Element;

public class utils {
    public static class TiSt {    
        public double t, b; //t1, t2, 
        public TiSt() {
            t = b = 0; //t1 = t2
        }
        public int getSize(Element element) {
            byte[] byteArray = element.toBytes();
            return byteArray.length;
        }
    }
}
