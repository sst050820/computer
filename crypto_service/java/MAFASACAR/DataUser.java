package main.java.MAFASACAR;

import it.unisa.dia.gas.jpbc.*;

// import main.java.compositeOrderPairingGroups;
import main.java.MAFASACAR.PublicStructure.*;
// import static main.java.FADMAABE.PublicStructure.*;
import main.java.utils.TiSt;


import java.time.Duration;
import java.time.Instant;

public class DataUser {
    public int GID;
    // private Element HGID;
    public int AttNum; //用户的属性数量
    // private Element DK;
    private SKDU SK[];
    // private Element KA[], KB[];
    private Element invM[][];  //第一行即为omege[i]，也就是说，omega[i] = invM[0][i]
    private Element getMsg;
    public Element HGID;
    // public Element PK;

    public DataUser(GlobalPP GPP, int gid, int attNum) {
        GID = gid;
        AttNum = attNum;
        HGID = GPP.H(GID).getImmutable();        
    }

    public TiSt KeyGen(GlobalPP GPP, AttributeAuthority[] AA) {
        TiSt ts = new TiSt();
        Instant start = Instant.now();

        // DK = GPP.PG.getRandomElementFromZr().getImmutable();
        // PK = HGID.powZn(DK).getImmutable();

        SK = new SKDU[AttNum];
        // KA = new Element[AttNum];
        // KB = new Element[AttNum];
        for(int x = 0; x < AttNum; x++ ) {            
            SK[x] = AA[x].KeyGen(GPP, HGID);
        }

        Instant end = Instant.now();
        // 计算持续时间
        Duration dur = Duration.between(start, end);
        ts.t = dur.toMillis(); //毫秒

        for(int x = 0; x < AttNum; x++ ) {
            ts.b += SK[x].KA.toBytes().length;
            ts.b += SK[x].KB.toBytes().length;
        }

        return ts;
    }

    public TiSt KeyUpd(GlobalPP GPP, AttributeAuthority[] AA, int attNum) {
        TiSt ts = new TiSt();
        Instant start = Instant.now();

        this.AttNum = attNum; //更新后的属性集合

        // SK = new SKDU[AttNum];
        // KA = new Element[AttNum];
        // KB = new Element[AttNum];
        for(int x = 0; x < AttNum; x++ ) {            
            SK[x].KA = AA[x].KeyUpd(GPP, HGID);
        }

        Instant end = Instant.now();
        // 计算持续时间
        Duration dur = Duration.between(start, end);
        ts.t = dur.toMillis(); //毫秒
        
        for(int x = 0; x < AttNum; x++ ) {
            ts.b += SK[x].KA.toBytes().length;
            // ts.b += SK[x].KB.toBytes().length;
        }

        return ts;
    }

    public TiSt InvM(GlobalPP GPP, Ciphertext CT) {
        int S = CT.l; //其实应该是M_I的行数，因为是模拟，所以我们选择最简单的情况
        TiSt ts = new TiSt();
        Instant start = Instant.now();


        int i, j, k;
        Element[][] W = new Element[S][2 * S];
        Element w1, w2, w3; //, w_;

        // Initialize the augmented matrix
        for (i = 0; i < S; i++) {
            for (j = 0; j < 2 * S; j++) {
                W[i][j] = GPP.PG.getPair().getZr().newElement().getImmutable(); 
                if (j < S) // Left half of augmented matrix
                    W[i][j] = CT.M[i][j];
                else // Right half of augmented matrix
                    W[i][j] = (j - S == i ? GPP.PG.getPair().getZr().newOneElement() : GPP.PG.getPair().getZr().newZeroElement()).getImmutable(); //正确之后要简化验证
            }
        }

        w1 = GPP.PG.getPair().getZr().newElement().getImmutable();
        w2 = GPP.PG.getPair().getZr().newElement().getImmutable();
        w3 = GPP.PG.getPair().getZr().newElement().getImmutable();
        // w_ = GPP.PG.getPair().getZr().newElement();

        for (i = 0; i < S; i++) {
            w1 = W[i][i];
            for (j = 0; j < 2 * S; j++)
                W[i][j] = W[i][j].div(w1).getImmutable(); //通过除法把每行的第一个变为1

            for (j = i + 1; j < S; j++) {
                w2 = W[j][i];
                for (k = i; k < 2 * S; k++) {
                    // w_.set(w2.mul(W[i][k]));
                    W[j][k] = W[j][k].sub(w2.mul(W[i][k]).getImmutable()).getImmutable();
                    // System.out.println("w2 = " + w2);
                }
            }
        }

        // Normalizing the anterior part of the matrix
        for (i = S - 1; i >= 0; i--) {
            for (j = i - 1; j >= 0; j--) {
                w3 = W[j][i];
                for (k = i; k < 2 * S; k++) {
                    // w_.mul(w3, );
                    W[j][k] = W[j][k].sub(w3.mul(W[i][k]).getImmutable()).getImmutable();
                }
            }
        }

        // Get inverse matrix
        
        invM = new Element[S][S];
        for (i = 0; i < S; i++)
            for (j = 0; j < S; j++) {
                invM[i][j] = GPP.PG.getPair().getZr().newElement(); //
                // System.out.println(W[i][j + S]);
                invM[i][j].set(W[i][j + S]).getImmutable();
            }

        // ...

        // w1.setToZero();
        // w2.setToZero();
        // w3.setToZero();
        // w_.setToZero();
        // for (i = 0; i < S; i++)
        //     for (j = 0; j < 2 * S; j++)
        //         W[i][j].setToZero();

        Instant end = Instant.now();
        // 计算持续时间
        Duration dur = Duration.between(start, end);
        ts.t = dur.toMillis(); //毫秒
        // for (i = 0; i < S; i++) {
        //     for (j = 0; j < S; j++) {
        //         ts.b += b += invM[i][j].toBytes().length;
        //     }
        // }

        return ts;
    }

    public TiSt Decrypt(GlobalPP GPP, Ciphertext CT) {
        TiSt ts = new TiSt();
        Instant start = Instant.now();

        Element DA, DB, D;
        Element HGID = GPP.H(GID).getImmutable();
        D = GPP.PG.getPair().getGT().newOneElement().getImmutable(); //这应该是比较规范的写法
        // System.out.println("D是：" + D);
        for(int x = 0; x<CT.l; x++) {
            // System.out.println("D是：" + D);
            DA = GPP.PG.getPair().pairing(CT.C2A[x], HGID.mul(GPP.RP)).div(GPP.PG.getPair().pairing(CT.C1A[x], SK[x].KA)).getImmutable();
            DB = GPP.PG.getPair().pairing(CT.C2B[x], HGID).div(GPP.PG.getPair().pairing(CT.C1B[x], SK[x].KB)).getImmutable();
            D = D.mul(DA.mul(DB).powZn(invM[0][x])).getImmutable();
        }
        // System.out.println("D是：" + D);
        getMsg = CT.MC.div(D).getImmutable();

        // System.out.println("解密得到的密文是：" + getMsg);
        
        Instant end = Instant.now();
        // 计算持续时间
        Duration dur = Duration.between(start, end);
        ts.t = dur.toMillis(); //毫秒
        // for (int i = 0; i < l; i++) { 
        //     for (int j = 1; j < l; j++) {
        //         ts.b += ts.getSize(CT.M[i][j]); 
        //     }
        // }

        return ts;
    }

    public Element getM(){
        // System.out.println("get msg = " + getMsg);
        return getMsg;
    }
}
