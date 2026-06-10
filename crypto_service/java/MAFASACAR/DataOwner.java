package main.java.MAFASACAR;

import it.unisa.dia.gas.jpbc.*;

import main.java.utils.*;
import main.java.MAFASACAR.PublicStructure.*;

import java.time.Duration;
import java.time.Instant;

public class DataOwner {
    // private Element msg;
    private Element s;
    public Ciphertext CT;
    private Element CUC;

    public TiSt SetLSSS(GlobalPP GPP, int l) {
        TiSt ts = new TiSt();
        Instant start = Instant.now();

        // CT = new Ciphertext();
        // CT.M = new Element[l][l]; //测试用，后面不用
        Element value;
        for (int i = 0; i < l; i++) {
            CT.M[i][0] = GPP.PG.getPair().getZr().newElement().setToOne().getImmutable();
            // System.out.println("生成的M[i][0]如下：" + CT.M[i][0]);
            value = GPP.PG.getRandomElementFromZr();
            // System.out.println("生成的value如下：" + value);
            for (int j = 1; j < l; j++) {
                // CT.M[i][j] = value.pow(BigInteger.valueOf(j)).getImmutable();
                CT.M[i][j] = CT.M[i][j - 1].mul(value).getImmutable();  ///使用这个，后面的值会把前面的覆盖掉。这个问题要解决。加一个getImmutable()就能解决了
                // System.out.println(CT.M[i][j - 1]);
                // System.out.println(CT.M[i][j]);
            }
        }

        Instant end = Instant.now();
        // 计算持续时间
        Duration dur = Duration.between(start, end);
        ts.t = dur.toMillis(); //毫秒

        // System.out.println("生成的访问结构矩阵如下：");
        // for (int i = 0; i < l; i++) { 
        //     for (int j = 0; j < l; j++) {
        //         System.out.println(CT.M[i][j]);
        //         // ts.b += CT.M[i][j].bitLength(); 
        //     }
        // }

        return ts;
    }

    public TiSt Encrypt(GlobalPP GPP, Element msg, int l, int n, AttributeAuthority[] AA) {
        TiSt ts = new TiSt();
        Instant start = Instant.now();

        //配置
        CT = new Ciphertext();
        // for (int i = 0; i < l; i++) { 
        //     for (int j = 0; j < n; j++) {
        //         System.out.println(CT.M[i][j]);
        //         // ts.b += CT.M[i][j].bitLength(); 
        //     }
        // }
        CT.M = new Element[l][n];
        CT.l = l;
        CT.n = n;
        SetLSSS(GPP, l);
        // System.out.println("生成的访问结构矩阵如下：");
        // for (int i = 0; i < l; i++) { 
        //     for (int j = 0; j < l; j++) {
        //         System.out.println(CT.M[i][j]);
        //     }
        // }

        s = GPP.PG.getRandomElementFromZr();

        // System.out.println("秘密值s为：" + s);

        Element[] VA = new Element[n]; 
        Element[] VB = new Element[n]; 
        VA[0] = s.getImmutable();
        VB[0] = s.negate().getImmutable(); // s.negate().getImmutable();
        // System.out.println("秘密值s为：" + s);
        
        // System.out.println("VA[0]为：" + s);
        for(int i = 1; i<n; i++) {
            VA[i] = GPP.PG.getRandomElementFromZr();
            VB[i] = GPP.PG.getRandomElementFromZr();
        }
        
        Element[] sigmaA = new Element[l]; 
        Element[] sigmaB = new Element[l]; 
        for(int i = 0; i<l; i++) {
            // System.out.println("i = " + i);
            sigmaA[i] = GPP.PG.getPair().getZr().newElement().setToZero().getImmutable();
            sigmaB[i] = GPP.PG.getPair().getZr().newElement().setToZero().getImmutable();
            for(int j = 0; j<n; j++) {
                sigmaA[i] = sigmaA[i].add(CT.M[i][j].mul(VA[j])).getImmutable();
                // System.out.println("VA[j] = " + VA[j]);
                // System.out.println("CT.M[i][j] = " + CT.M[i][j]);
                sigmaB[i] = sigmaB[i].add(CT.M[i][j].mul(VB[j])).getImmutable();
                // System.out.println("CT.M[i][j] = " + CT.M[i][j]);
                // System.out.println("VB[j] = " + VB[j]);
            }
        }

        //加密
        CUC = GPP.g1.powZn(s).getImmutable();
        CT.MC = GPP.PG.getPair().pairing(CUC, GPP.RP).getImmutable();
        // System.out.println("e(g1,h)^s = " + CT.C);
        CT.MC = CT.MC.mul(msg).getImmutable();
        Element CC;
        Element[] rA = new Element[l]; 
        Element[] rB = new Element[l]; 
        CT.C1A = new Element[l];
        CT.C1B = new Element[l];
        CT.C2A = new Element[l];
        CT.C2B = new Element[l];

        for(int x=0; x<l; x++){
            rA[x] = GPP.PG.getRandomElementFromZr().getImmutable();
            rB[x] = GPP.PG.getRandomElementFromZr().getImmutable();

            CT.C1A[x] = GPP.g1.powZn(rA[x]).getImmutable();
            CT.C1B[x] = GPP.g1.powZn(rB[x]).getImmutable();

            CC = GPP.g1.powZn(sigmaA[x]).getImmutable();
            CT.C2A[x] = AA[x].PAu.powZn(rA[x]).getImmutable();
            CT.C2A[x] = CT.C2A[x].mul(CC).getImmutable();

            CC = GPP.g1.powZn(sigmaB[x]).getImmutable();            
            CT.C2B[x] = AA[x].PBu.powZn(rB[x]).getImmutable();
            CT.C2B[x] = CT.C2B[x].mul(CC).getImmutable();
        }


        Instant end = Instant.now();
        // 计算持续时间
        Duration dur = Duration.between(start, end);
        ts.t = dur.toMillis(); //毫秒

        ts.b += CT.MC.toBytes().length;
        for(int i = 0; i < l; i++){
            ts.b += CT.C1A[i].toBytes().length;
            ts.b += CT.C1B[i].toBytes().length;
            ts.b += CT.C2A[i].toBytes().length;
            ts.b += CT.C2B[i].toBytes().length;
            for(int j = 0; j < n; j++){
                ts.b += CT.M[i][j].toBytes().length;                
            }
        }

        return ts;
    }

    public TiSt CTUpd(GlobalPP GPP, Element msg) {
        TiSt ts = new TiSt();
        Instant start = Instant.now();

        //密文更新

        CT.MC = GPP.PG.getPair().pairing(CUC, GPP.RP).getImmutable();
        // System.out.println("e(g1,h^T)^s = " + CT.C);
        CT.MC = CT.MC.mul(msg).getImmutable();


        Instant end = Instant.now();
        // 计算持续时间
        Duration dur = Duration.between(start, end);
        ts.t = dur.toMillis(); //毫秒
        ts.b += CT.MC.toBytes().length;

        return ts;
    }


    public static void main(String[] args) {
        GlobalPP GPP = new GlobalPP();
        DataOwner DO1 = new DataOwner();

        DO1.SetLSSS(GPP, 3);
    }
}
