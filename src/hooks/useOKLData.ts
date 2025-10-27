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
    const getCompatibleCableAppointments = (oklId: string, oklList: any[] = []) => {
        // Ищем ОКЛ сначала в добавленных, потом в базе данных
        let okl = oklList.find(o => o.id === oklId);
        if (!okl) {
            okl = allOKL.find(o => o.id === oklId);
        }

        if (!okl) {
            return allAppointments; // возвращаем все, включая "Все кабели"
        }

        // Ищем совместимые типы кабелей
        const compatibleMaps = allOKLCableMap.filter(map =>
            map.oklType.includes(okl!.type!)
        );

        const allowedCableTypeIds = compatibleMaps.map(map => map.cableTypeId);

        // Фильтруем назначения, но оставляем "Все кабели"
        const filteredAppointments = allAppointments.filter(a =>
            a.id === "cable_type:all" || allowedCableTypeIds.includes(a.id)
        );

        return filteredAppointments;
    };

    const getCompatibleCablesForOKL = (oklId: string, cableTypeId?: string, oklList: any[] = []) => {
        // Ищем ОКЛ сначала в добавленных, потом в базе
        let okl = oklList.find(o => o.id === oklId);
        if (!okl) {
            okl = allOKL.find(o => o.id === oklId);
        }

        if (!okl) {
            return cableTypeId ? getCablesByType(cableTypeId) : allCables;
        }

        // Получаем совместимые назначения
        const compatibleAppointments = getCompatibleCableAppointments(oklId, oklList);
        const allowedCableTypeIds = compatibleAppointments.map(a => a.id);

        let compatibleCables = allCables.filter(cable =>
            allowedCableTypeIds.includes(cable.cableTypeId)
        );

        if (cableTypeId) {
            compatibleCables = compatibleCables.filter(cable =>
                cable.cableTypeId === cableTypeId
            );
        }

        return compatibleCables;
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
        getCompatibleCableAppointments,
        getCompatibleCablesForOKL
    };
};
