package main.java.MAFASACAR;

import it.unisa.dia.gas.jpbc.Element;

// import main.java.compositeOrderPairingGroups;
import main.java.MAFASACAR.PublicStructure.*;
// import main.java.PublicStructure.PairingGroups.GlobalPP;

public class AttributeAuthority {
    public Element AID;
    public Element PAu, PBu;
    private Element yAu, yBu;
    public AttributeAuthority(GlobalPP GPP) {
        // compositeOrderPairingGroups PG = new compositeOrderPairingGroups();
        AID = GPP.PG.getRandomElementFromZr();

        yAu = GPP.PG.getRandomElementFromZr();
        yBu = GPP.PG.getRandomElementFromZr();
        // System.out.println("yAu: " + yAu);
        // System.out.println("yBu: " + yBu);

        Element g1 = GPP.g1.getImmutable();

        PAu = g1.powZn(yAu).getImmutable();
        PBu = g1.powZn(yBu).getImmutable();
        // System.out.println("PAu: " + PAu);
        // System.out.println("PBu: " + PBu);
    }

    public long getKeyByte(){
        return AID.toBytes().length + yAu.toBytes().length + yBu.toBytes().length;
    }

    public SKDU KeyGen(GlobalPP GPP, Element HGID) { //, Element KA, Element KB
        // Element HGID = GPP.H(GID).getImmutable();
        SKDU SK = new SKDU();
        SK.KA = HGID.mul(GPP.RP).getImmutable();
        SK.KA = SK.KA.powZn(yAu).getImmutable();
        SK.KB = HGID.powZn(yBu).getImmutable();

        return SK;
    }

    // public Element SysUpd(GlobalPP GPP) {
    //     return GPP.PG.getRandomElementFromGp1();
    // }

    public Element KeyUpd(GlobalPP GPP, Element HGID) { //SKDU
        
        // SKDU SK = new SKDU();
        // SK.KA = HGID.mul(GPP.RP).powZn(yAu).getImmutable();

        Element KA = HGID.mul(GPP.RP).powZn(yAu).getImmutable();
        // SK.KB = HGID.powZn(yBu).getImmutable();

        return KA;
    }

    public void valid(GlobalPP GPP){
        int GID = 0;
        Element Key = GPP.H(GID).powZn(yBu);
        Element A = GPP.PG.getPair().pairing(GPP.g1, Key);
        Element B = GPP.PG.getPair().pairing(PBu, GPP.H(GID));

        // SKDU SK = KeyGen(GPP, GID);


        if(A.isEqual(B)){
            System.out.println("GPP验证通过");
        } else{
            System.out.println("GPP验证失败");
        }

        // if(A.isEqual(B)){
        //     System.out.println("GPP验证通过");
        // } else{
        //     System.out.println("GPP验证失败");
        // }
    }

    public static void main(String[] args){ //验证复合阶群的正交性
        GlobalPP GPP = new GlobalPP();
        AttributeAuthority AA1 = new AttributeAuthority(GPP);
        
        AA1.valid(GPP);

    }

}
