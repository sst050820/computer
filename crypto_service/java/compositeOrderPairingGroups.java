package main.java;

import it.unisa.dia.gas.jpbc.Element;
import it.unisa.dia.gas.jpbc.Field;
import it.unisa.dia.gas.jpbc.Pairing;
import it.unisa.dia.gas.jpbc.PairingParameters;
import it.unisa.dia.gas.plaf.jpbc.pairing.PairingFactory;
import it.unisa.dia.gas.plaf.jpbc.pairing.a1.TypeA1CurveGenerator;
// import it.unisa.dia.gas.plaf.jpbc.pbc.curve.PBCTypeA1CurveGenerator;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class compositeOrderPairingGroups {
    private Field G, GT;
    private BigInteger p1, p2, p3; //子群的阶， N=p1p2p3
    private Element g, g1, g2, g3; //群G与三个子群的生成元
    private Pairing pairing;
    public BigInteger N;

    public compositeOrderPairingGroups() {
        // 产生 类型 A1 配对参数
        // TypeA1CurveGenerator parametersGenerator = new TypeA1CurveGenerator(
        //     3,  // 表示该合数阶是三个素数的乘积
        //     256 // 每个素数的位长: 517 256
        // );        
        // PairingParameters params = parametersGenerator.generate();        
        // List<BigInteger> primeList = new ArrayList<>(); //用于输出三个素数
        // // 获取并打印所有素数        
        // int i = 0;
        // int j = 1;
        // while (true) {
        //     String primeKey = "n" + i;
        //     if (!params.containsKey(primeKey)) {
        //         break;
        //     }
        //     String primeValue = params.getString(primeKey);
        //     primeList.add(new BigInteger(primeValue));
        //     i++;
        // }
        // for (BigInteger bigInteger : primeList) {
        //     System.out.println("Prime" + j + ": " + bigInteger); 
        //     j++;
        // }
        // System.out.println("Params" + params);
        
        // 创建配对样例
        this.pairing = PairingFactory.getPairing("params/a1_256.properties");
        this.G = pairing.getG1();
        this.GT = pairing.getGT();
        this.N = G.getOrder();

        this.g = G.newRandomElement().getImmutable();
        this.p1 = new BigInteger("80243940708853675482022959852510179600356331928091186278057478180058827283987"); // primeList.get(0);
        this.p2 = new BigInteger("61515745222865512190828839585881083782836020501390748534473040927912707489827"); // primeList.get(1);
        this.p3 = new BigInteger("78930511757363926814888905078714718791421373796557723480341952852131735145437"); // primeList.get(2);
        this.g1 = g.pow(N.divide(p1)).getImmutable();
        this.g2 = g.pow(N.divide(p2)).getImmutable();
        this.g3 = g.pow(N.divide(p3)).getImmutable();
    }


    public BigInteger getN() {
        return N;
    }

    public Field getG() {
        return G;
    }

    public BigInteger getp1() {
        return p1;
    }

    public BigInteger getp2() {
        return p2;
    }

    public BigInteger getp3() {
        return p3;
    }

    public Element getg() {
        return g;
    }

    public Element getg1() {
        return g1;
    }

    public Element getg2() {
        return g2;
    }

    public Element getg3() {
        return g3;
    }
    
    public Pairing getPair() {
        return pairing;
    }

    public BigInteger getRandomFromZN() {
        Random rand = new Random();
        return new BigInteger(this.N.bitLength(), rand).mod(N);
    } 
    public Element getRandomElementFromZr() {
        return pairing.getZr().newRandomElement().getImmutable();
    }
    public Element getRandomElementFromG() {
        return G.newRandomElement().getImmutable();
    }

    public Element getRandomElementFromGp1() {
        Element r = pairing.getZr().newRandomElement().getImmutable();
        return g1.powZn(r).getImmutable();
    }

    // public int orthogonality(Element g1, Element g2) {
    //     return 0;
    // }

    public static void main(String[] args){ //验证复合阶群及其正交性

        
        compositeOrderPairingGroups PG = new compositeOrderPairingGroups();

        Element g1 = PG.getg1();
        Element g2 = PG.getg2();
        Element g3 = PG.getg3();
        System.out.println("g1 = " + g1);
        System.out.println("g2 = " + g2);
        System.out.println("g3 = " + g3);

        Element egg12 = PG.pairing.pairing(g1, g2);
        Element egg13 = PG.pairing.pairing(g1, g3);
        Element egg23 = PG.pairing.pairing(g2, g3);

        System.out.println("e(g1,g2) = " + egg12);
        System.out.println("e(g1,g3) = " + egg13);
        System.out.println("e(g2,g3) = " + egg23);
    }

}
