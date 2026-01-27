import { OKL_DB, OKL_CABLE_MAP, ALL_CABLES } from "../data";
import {CABLE_APPOINTMENT} from "../data/CABLE_APPOINTMENT";
import {normalizeCable} from "./normalizeCable";
import {useCallback, useMemo} from "react";
import {Cable, OKLCableMapItem} from "../data/data";

export const useOKLData = () => {
    // Получить все ОКЛ
    const allOKL = OKL_DB;

    // Получить все кабели
    const allCables: Cable[] = useMemo(
        () => ALL_CABLES.map(normalizeCable),
        []
    );

    // Получить все типы кабелей
    const allAppointments = CABLE_APPOINTMENT;

    // Получить все зависимости
    const allOKLCableMap: OKLCableMapItem[] = OKL_CABLE_MAP



    const isCableAllowedByRule = useCallback(
        (cable: Cable, rule: OKLCableMapItem): boolean => {
            if (cable.cableTypeId !== rule.cableTypeId) return false;

            if (cable.coreSection !== undefined) {
                if (rule.minSection !== undefined && cable.coreSection < rule.minSection) return false;
                if (rule.maxSection !== undefined && cable.coreSection > rule.maxSection) return false;
                return true;
            }

            if (cable.coreDiameter !== undefined) {
                if (rule.minDiameter !== undefined && cable.coreDiameter < rule.minDiameter) return false;
                if (rule.maxDiameter !== undefined && cable.coreDiameter > rule.maxDiameter) return false;
                return true;
            }

            return false;
        },
        []
    );


    const getCompatibleCableAppointments = useCallback(
        (oklId: string, oklList: any[] = []): string[] => {
            const okl =
                oklList.find(o => o.id === oklId) ||
                allOKL.find(o => o.id === oklId);

            if (!okl) return allAppointments.map(a => a.id);

            const rules = allOKLCableMap.filter(rule =>
                rule.oklType.includes(okl.type!)
            );

            return Array.from(
                new Set([
                    "cable_type:all",
                    ...rules.map(r => r.cableTypeId),
                ])
            );
        },
        [allOKL, allAppointments, allOKLCableMap]
    );





    // Найти, какие типы кабелей совместимы с данной ОКЛ
    const getCompatibleCableTypes = useCallback(
        (oklType: string) => {
            return allOKLCableMap.filter(map =>
                map.oklType.includes(oklType)
            );
        },
        [allOKLCableMap]
    );

    // Найти все кабели, которые подходят для конкретной ОКЛ
    const getCompatibleCables = useCallback(
        (oklType: string) => {
            const compatibleTypes = getCompatibleCableTypes(oklType);
            const types = compatibleTypes.map(t => t.cableTypeId);
            return allCables.filter(cable =>
                types.includes(cable.cableTypeId)
            );
        },
        [allCables, getCompatibleCableTypes]
    );
    // Получить кабели по типу (назначению)
    const getCablesByType = useCallback(
        (cableTypeId: string) => {
            return allCables.filter(cable => cable.cableTypeId === cableTypeId);
        },
        [allCables]
    );


    // В хук useOKLData добавляем функцию
    const getCompatibleOKLForCable = (cableId: string) => {
        const cableData = allCables.find(c => c.id === cableId);
        if (!cableData) return [];

        return allOKL.filter(okl => {
            const compatibleCables = getCompatibleCablesForOKL(okl.id, undefined, []);
            return compatibleCables.some(cable => cable.id === cableId);
        });
    };

    const getCompatibleCablesForOKL = useCallback(
        (
            oklId: string,
            cableTypeId?: string,
            oklList: any[] = []
        ): Cable[] => {
            const okl =
                oklList.find(o => o.id === oklId) ||
                allOKL.find(o => o.id === oklId);

            if (!okl) {
                return cableTypeId
                    ? getCablesByType(cableTypeId)
                    : allCables;
            }

            const rules = allOKLCableMap.filter(rule =>
                rule.oklType.includes(okl.type!)
            );

            const filteredRules = cableTypeId
                ? rules.filter(r => r.cableTypeId === cableTypeId)
                : rules;

            return allCables.filter(cable =>
                filteredRules.some(rule =>
                    isCableAllowedByRule(cable, rule)
                )
            );
        },
        [allOKL, allCables, allOKLCableMap, getCablesByType, isCableAllowedByRule]
    );
    return {
        allOKL,
        allCables,
        getCompatibleCableTypes,
        getCompatibleCables,
        getCablesByType,
        getCompatibleCableAppointments,
        getCompatibleCablesForOKL,
        getCompatibleOKLForCable
    };
};

/* const getCompatibleCableAppointments = (oklId: string, oklList: any[] = []): string[] => {
     const okl = oklList.find(o => o.id === oklId) || allOKL.find(o => o.id === oklId);
     if (!okl) return allAppointments.map(a => a.id);

     const compatibleMaps = allOKLCableMap.filter(map => map.oklType.includes(okl.type!));
     const allowedCableTypeIds = compatibleMaps.map(map => map.cableTypeId);

     return allAppointments
         .filter(a => a.id === "cable_type:all" || allowedCableTypeIds.includes(a.id))
         .map(a => a.id); // <- возвращаем только id
 };

 const getCompatibleCablesForOKL = (oklId: string, cableTypeId?: string, oklList: any[] = []) => {
     let okl = oklList.find(o => o.id === oklId) || allOKL.find(o => o.id === oklId);
     if (!okl) {
         return cableTypeId ? getCablesByType(cableTypeId) : allCables;
     }

     // Получаем совместимые назначения (уже string[])
     const compatibleAppointments = getCompatibleCableAppointments(oklId, oklList);
     const allowedCableTypeIds = compatibleAppointments; // просто используем массив строк

     let compatibleCables = allCables.filter(cable =>
         allowedCableTypeIds.includes(cable.cableTypeId)
     );

     if (cableTypeId) {
         compatibleCables = compatibleCables.filter(cable =>
             cable.cableTypeId === cableTypeId
         );
     }

     return compatibleCables;
 };*/