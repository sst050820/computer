package main.java.MAFASACAR;

import it.unisa.dia.gas.jpbc.*;

import main.java.utils.TiSt;
import main.java.MAFASACAR.PublicStructure.*;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;

public class MAFASACAR {
    private Element msg;
    private String plainText;
    public GlobalPP GPP;
    public int U; //全局属性数量
    public AttributeAuthority AA[];
    public DataOwner DO;
    public DataUser DU;
    public MAFASACAR() {

    }

    public TiSt GlobalSetup(){
        TiSt ts = new TiSt();
        Instant start = Instant.now();

        GPP = new GlobalPP();

        Instant end = Instant.now();
        // 计算持续时间
        Duration dur = Duration.between(start, end);
        ts.t = dur.toMillis(); //毫秒
        // System.out.println("g1 = " + GPP.g1);
        // System.out.println("h = " + GPP.h);
        ts.b += GPP.g1.toBytes().length;
        ts.b += GPP.RP.toBytes().length;

        return ts;
    }

    public TiSt AuthSetup(int n){ //n表示AA的数量，在这篇文章中，授权方数量与全局属性数量等同
        TiSt ts = new TiSt();
        Instant start = Instant.now();
        AA = new AttributeAuthority[n]; 
        for(int i = 0; i<n; i++) {
            AA[i] = new AttributeAuthority(GPP);
            // System.out.println("第" + i + "个AA的信息如下：");
            // System.out.println("---AID：" + AA[i].AID);
            // System.out.println("---PA：" + AA[i].PAu);
            // System.out.println("---PB：" + AA[i].PBu);
        }

        Instant end = Instant.now();
        // 计算持续时间
        Duration dur = Duration.between(start, end);
        ts.t = dur.toMillis(); //毫秒

        for(int i = 0; i<n; i++) {
            ts.b += AA[i].getKeyByte();
            ts.b += AA[i].PAu.toBytes().length;
            ts.b += AA[i].PBu.toBytes().length;
        }
        
        // ts.b += GPP.h.toBytes().length;

        return ts;
    }

    public void setM(GlobalPP GPP) {
        byte[] m = "mssage".getBytes(StandardCharsets.UTF_8);
        msg = GPP.PG.getPair().getGT().newElementFromHash(m, 0, m.length);
        plainText = new String(m, StandardCharsets.UTF_8);
        // System.out.println("要加密的消息是：" + msg);
    }

    public void setM(GlobalPP GPP, String text) {
        byte[] m = text.getBytes(StandardCharsets.UTF_8);
        msg = GPP.PG.getPair().getGT().newElementFromHash(m, 0, m.length);
        plainText = text;
    }

    public String getPlainText() {
        return plainText;
    }

    public TiSt Enc(GlobalPP GPP, int l, int k){  //访问结构M是l行k列的, Element msg, 消息使用前面设置的默认消息测试
        TiSt ts = new TiSt();
        Instant start = Instant.now();
        DO = new DataOwner();
        // System.out.println("要加密的消息是：" + msg);

        DO.Encrypt(GPP, msg, l, k, AA); //ts = 

        Instant end = Instant.now();
        // 计算持续时间
        Duration dur = Duration.between(start, end);
        ts.t = dur.toMillis(); //毫秒
        
        ts.b += DO.CT.MC.toBytes().length;
        for(int i = 0; i < l; i++){
            ts.b += DO.CT.C1A[i].toBytes().length;
            ts.b += DO.CT.C1B[i].toBytes().length;
            ts.b += DO.CT.C2A[i].toBytes().length;
            ts.b += DO.CT.C2B[i].toBytes().length;
            for(int j = 0; j < k; j++){
                ts.b += DO.CT.M[i][j].toBytes().length;                
            }
        }

        return ts;
    }

    public TiSt KeyGen(GlobalPP GPP, int gid, int attNum){ //n表示AA的数量，在这篇文章中，授权方数量与全局属性数量等同 . DataUser DU, AttributeAuthority[] AA, 
        TiSt ts = new TiSt();
        TiSt ts_ = new TiSt();
        Instant start = Instant.now();
        // AttributeAuthority AA[] = new AttributeAuthority[n]; 
        // for(int i = 0; i<n; i++) {

        // }
        DU = new DataUser(GPP, gid, attNum);
        ts_ = DU.KeyGen(GPP, AA);

        Instant end = Instant.now();
        // 计算持续时间
        Duration dur = Duration.between(start, end);
        ts.t = dur.toMillis(); //毫秒
        
        ts.b = ts_.b;

        return ts;
    }

    public TiSt SysUpd(){ //n表示AA的数量，在这篇文章中，授权方数量与全局属性数量等同 . DataUser DU, AttributeAuthority[] AA, 
        TiSt ts = new TiSt();
        Instant start = Instant.now();

        GPP.RP = GPP.PG.getRandomElementFromGp1().getImmutable(); //重新更新h为g_1^T

        Instant end = Instant.now();
        // 计算持续时间
        Duration dur = Duration.between(start, end);
        ts.t = dur.toMillis(); //毫秒
        
        return ts;
    }

    public TiSt KeyUpd(GlobalPP GPP, int gid, int attNum){ //n表示AA的数量，在这篇文章中，授权方数量与全局属性数量等同 . DataUser DU, AttributeAuthority[] AA, 
        TiSt ts = new TiSt();
        // TiSt ts_ = new TiSt();
        // Instant start = Instant.now();
        // AttributeAuthority AA[] = new AttributeAuthority[n]; 
        // for(int i = 0; i<n; i++) {

        // }
        // DU = new DataUser(GPP, gid, attNum);

        ts = DU.KeyUpd(GPP, AA, attNum);

        // Instant end = Instant.now();
        
        // ts.b = ts_.b;

        return ts;
    }

    public TiSt CTUpd(GlobalPP GPP){ 
        TiSt ts = new TiSt();
        Instant start = Instant.now();
        // DO = new DataOwner();
        // System.out.println("要加密的消息是：" + msg);

        DO.CTUpd(GPP, msg); //ts = 

        Instant end = Instant.now();
        // 计算持续时间
        Duration dur = Duration.between(start, end);
        ts.t = dur.toMillis(); //毫秒
        ts.b += DO.CT.MC.toBytes().length;

        return ts;
    }

    public TiSt Dec(GlobalPP GPP) {
        TiSt ts = new TiSt();
        TiSt ts_ = new TiSt();
        Instant start = Instant.now();
        DU.InvM(GPP, DO.CT);
        DU.Decrypt(GPP, DO.CT);

        Instant end = Instant.now();
        // 计算持续时间
        Duration dur = Duration.between(start, end);
        ts.t = dur.toMillis(); //毫秒
        ts.b = ts_.b;

        return ts;
    }

    public boolean validDec() {
        return msg != null && msg.isEqual(DU.getM());
    }

    public static void main(String[] args) {
        int ii = 3;
        MAFASACAR p4 = new MAFASACAR();
        System.out.println("--------GlobalSetup--------");
        p4.GlobalSetup();
        System.out.println("--------AuthSetup--------");
        p4.AuthSetup(ii+2);
        System.out.println("--------KeyGen--------");
        p4.KeyGen(p4.GPP, 0, ii);
        System.out.println("--------Enc--------");
        p4.setM(p4.GPP);
        p4.Enc(p4.GPP, ii, ii);

        System.out.println("--------Dec--------");
        p4.Dec(p4.GPP);
        p4.validDec();

        System.out.println("--------Rev--------");
        p4.SysUpd();
        p4.KeyUpd(p4.GPP, 0, ii);
        p4.CTUpd(p4.GPP);


        System.out.println("--------Dec--------");
        p4.Dec(p4.GPP);
        p4.validDec();
    }

}
