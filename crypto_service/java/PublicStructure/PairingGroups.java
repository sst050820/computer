package main.java.PublicStructure;

// import java.math.BigInteger;  

import it.unisa.dia.gas.jpbc.*;

import main.java.compositeOrderPairingGroups;

public class PairingGroups {

    public Element message;
    private static compositeOrderPairingGroups PG = null;
    public PairingGroups() {
        PG = new compositeOrderPairingGroups();
    }

    public static compositeOrderPairingGroups getPG(){
        if (PG == null) {
            PG = new compositeOrderPairingGroups();
        }
        return PG;
    }

    // public static Element H(int GID) {
    //     BigInteger bigInt = BigInteger.valueOf(GID);
    //     Field G = PG.getG();
    //     Element hash = G.newElementFromHash(bigInt.toByteArray(), 0, bigInt.toByteArray().length);
    //     return hash;
    // }
    
    public static void main(String[] args) {
        // JPBC_Hash hasher = new JPBC_Hash("params/a.properties");
        // GlobalPP GPP = new GlobalPP();
        // Element elem = H(123);
        // System.out.println("Hash: " + elem);
    }
}

