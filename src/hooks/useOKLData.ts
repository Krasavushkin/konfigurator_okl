import { OKL_DB, OKL_CABLE_MAP, ALL_CABLES } from "../data";
import {CABLE_APPOINTMENT} from "../data/CABLE_APPOINTMENT";

export const useOKLData = () => {
    // Получить все ОКЛ
    const allOKL = OKL_DB;

    // Получить все кабели
    const allCables = ALL_CABLES;

    // Получить все типы кабелей
    const allAppointments = CABLE_APPOINTMENT;

    // Получить все зависимости
    const allOKLCableMap = OKL_CABLE_MAP

    // Найти, какие типы кабелей совместимы с данной ОКЛ
    const getCompatibleCableTypes = (oklType: string) => {
        return allOKLCableMap.filter(map => map.oklType.includes(oklType));
    };

    // Найти все кабели, которые подходят для конкретной ОКЛ
    const getCompatibleCables = (oklType: string) => {
        const compatibleTypes = getCompatibleCableTypes(oklType);
        const types = compatibleTypes.map(t => t.cableTypeId);
        return allCables.filter(cable => types.includes(cable.cableTypeId));
    };

    // Найти все назначения кабелей, которые подходят для конкретной ОКЛ
    const getCompatibleCableAppointments = (oklId: string) => {
        const okl = allOKL.find(o => o.id === oklId);
        if (!okl) return [];

        const compatibleMaps = allOKLCableMap.filter(map => map.oklType.includes(okl.type));
        const allowedCableTypeIds = compatibleMaps.map(map => map.cableTypeId);

        return allAppointments.filter(a => allowedCableTypeIds.includes(a.id));
    };
    // Получить кабели по типу (назначению)
    const getCablesByType = (cableTypeId: string) => {
        return allCables.filter(cable => cable.cableTypeId === cableTypeId);
    };
    // Найти максимальное время работы ОКЛ для конкретного типа кабеля
    const getMaxFireTime = (oklType: string, cableTypeId: string) => {
        const match = allOKLCableMap.find(
            m => m.oklType.includes(oklType) && m.cableTypeId === cableTypeId
        );
        return match?.maxFireWorkTime || null;
    };

    return {
        allOKL,
        allCables,
        getCompatibleCableTypes,
        getCompatibleCables,
        getMaxFireTime,
        getCablesByType,
        getCompatibleCableAppointments
    };
};
