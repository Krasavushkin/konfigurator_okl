import OKL_DB from "./OKL_DB.json";
import OKL_CABLE_MAP from "./OKL_CABLE_MAP.json";

import KPS from "./cables/KPS.json";
import KSB from "./cables/KSB.json";
import KSBG from "./cables/KSBG.json";
import KUNRS from "./cables/KUNRS.json";
import KUNRS_LTX from "./cables/KUNRS_LTX.json";
import LAN from "./cables/LAN.json";
import LTX from "./cables/LTX.json";
import SCAB from "./cables/SCAB.json";
import SCAB_M from "./cables/SCAB_M.json";
import SCAB_S from "./cables/SCAB_S.json";
import KERS from "./cables/KERS.json";
import KSB_LTX from "./cables/KSB_LTX.json";
import KSHS from "./cables/KSHS.json";

export const ALL_CABLES = [
    ...KERS,
    ...KPS,
    ...KSB,
    ...KSBG,
    ...KSB_LTX,
    ...KSHS,
    ...KUNRS,
    ...KUNRS_LTX,
    ...LAN,
    ...LTX,
    ...SCAB,
    ...SCAB_M,
    ...SCAB_S,
];
export const cableLoaders: Record<string, () => Promise<any[]>> = {
    SCAB: () => import("./cables/SCAB.json"),
    SCAB_M: () => import("./cables/SCAB_M.json"),
/*
    SCAB_S: () => import("./cables/SCAB_S.json"),
*/
    KPS: () => import("./cables/KPS.json"),
    KSB: ()=> import("./cables/KSB.json"),
    KSBG: ()=> import("./cables/KSBG.json"),
    KUNRS: ()=> import("./cables/KUNRS.json"),
    KUNRS_LTX: ()=> import("./cables/KUNRS_LTX.json"),
    LAN: ()=> import("./cables/LAN.json"),
    LTX: ()=> import("./cables/LTX.json"),
    KERS: () => import("./cables/KERS.json"),
    KSB_LTX: () => import("./cables/KSB_LTX.json"),
    KSHS: () => import("./cables/KSHS.json"),
};


export { OKL_DB, OKL_CABLE_MAP };
