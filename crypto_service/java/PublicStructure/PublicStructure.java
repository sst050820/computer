package main.java.MAFASACAR;

import java.math.BigInteger;

// import java.math.BigInteger;  

import it.unisa.dia.gas.jpbc.*;

import main.java.compositeOrderPairingGroups;
import main.java.PublicStructure.PairingGroups;

public class PublicStructure {
    public static int numGID = 100;

    public static class GlobalPP {
        public compositeOrderPairingGroups PG;
        public Element g1, RP;
        // public int[] GID; //用户身份标识不用在这里初始化

        public GlobalPP() {
            PG = PairingGroups.getPG();
            g1 = PG.getg1();
            RP = PG.getRandomElementFromGp1();

            // GID = new int[numGID]; //用户身份标识不用在这里初始化
            // for(int i = 0; i < numGID; i++) {
            //     GID[i] = i;
            // }
        }

        public Element H(int GID) {
            BigInteger bigInt = BigInteger.valueOf(GID);
            Field G = PG.getG();
            Element hash = G.newElementFromHash(bigInt.toByteArray(), 0, bigInt.toByteArray().length);
            return hash;
        }
    }

    public static class Ciphertext {
        public Element MC;
        public Element[] C1A, C2A, C1B, C2B;
        public Element[][] M;
        int l, n;
    }

    public static class SKDU {
        public Element KA, KB;
        
        public SKDU() {

        }
    }

    // public static void main(String[] args) {
    //     // JPBC_Hash hasher = new JPBC_Hash("params/a.properties");
    //     GlobalPP GPP = new GlobalPP();
    //     Element elem = GPP.H(123);
    //     System.out.println("Hash: " + elem);
    // }
}

