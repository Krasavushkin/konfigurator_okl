import OKL_DB from "./OKL_DB.json";
import OKL_CABLE_MAP from "./OKL_CABLE_MAP.json";

// Импорт всех файлов с кабелями
import KPS from "./cables/KPS.json";
import KSB from "./cables/KSB.json";
import KSBG from "./cables/KSBG.json";
import KUNRS from "./cables/KUNRS.json";
import KUNRS_LTX from "./cables/KUNRS_LTX.json";
import LAN from "./cables/LAN.json";
import LTX from "./cables/LTX.json";
import SKAB from "./cables/SKAB.json";

export const ALL_CABLES = [
    ...KPS,
    ...KSB,
    ...KSBG,
    ...KUNRS,
    ...KUNRS_LTX,
    ...LAN,
    ...LTX,
    ...SKAB,
];

export { OKL_DB, OKL_CABLE_MAP };
