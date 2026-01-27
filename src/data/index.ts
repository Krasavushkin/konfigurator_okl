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


export { OKL_DB, OKL_CABLE_MAP };
