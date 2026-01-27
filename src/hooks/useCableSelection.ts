import {useMemo, useState} from "react";
import {CABLE_APPOINTMENT} from "../data/CABLE_APPOINTMENT";
import {BaseEntity, Cable} from "../data/data";



export const useCableSelection = (
    selectedOKL: string | null,
    oklList: any[],
    allCables: Cable[],
    getCompatibleCableAppointments: (selectedOKL: string, oklList: any[]) => string[],
    getCompatibleCablesForOKL: (
        oklId: string,
        cableTypeId: string | undefined,
        oklList: any[]
    ) => Cable[],
    getCablesByType: (selectedCableType: string) => Cable[],
    getAvailableCablesForOKL: (oklId: string, cables: Cable[]) => Cable[],
) => {


    const [selectedCableType, setSelectedCableType] = useState<string>("cable_type:all");
    const [selectedCable, setSelectedCable] = useState<string>('');
    const [meterCable, setMeterCable] = useState<number>(1);

    // Вся логика фильтрации кабелей



  /*  const filteredCables = useMemo(() => {
        let cables: Cable[] = [];

        // Базовая фильтрация по типу и совместимости
        if (!selectedOKL) {
            // Если выбрано "Все кабели" - показываем все
            cables = (selectedCableType === "cable_type:all" || !selectedCableType)
                ? allCables
                : getCablesByType(selectedCableType);
        } else {
            // Если выбрано "Все кабели" - показываем все совместимые
            cables = (selectedCableType === "cable_type:all" || !selectedCableType)
                ? getCompatibleCablesForOKL(selectedOKL, undefined, oklList)
                : getCompatibleCablesForOKL(selectedOKL, selectedCableType, oklList);
        }

        // ДОПОЛНИТЕЛЬНАЯ ФИЛЬТРАЦИЯ: оставляем только кабели, которые поместятся
        if (selectedOKL) {
            cables = getAvailableCablesForOKL(selectedOKL, cables);
        }

        return cables;
    }, [selectedOKL, selectedCableType, oklList, allCables]);

    const availableCableAppointments: BaseEntity[] = useMemo(() => {
        if (!selectedOKL) return CABLE_APPOINTMENT;

        // Получаем все совместимые кабели для выбранной ОКЛ
        const compatibleCables = getCompatibleCablesForOKL(selectedOKL, undefined, oklList);

        // Фильтруем только те кабели, которые реально можно добавить
        const availableCables = getAvailableCablesForOKL(selectedOKL, compatibleCables);

        // Получаем уникальные cableTypeId, которые доступны
        const availableTypes = Array.from(new Set(availableCables.map(c => c.cableTypeId)));

        // Строим список назначений кабеля (BaseEntity), включая "Все кабели"
        return CABLE_APPOINTMENT.filter(a =>
            a.id === 'cable_type:all' || availableTypes.includes(a.id)
        );
    }, [selectedOKL, oklList, filteredCables]);*/
    const availableCableAppointments: BaseEntity[] = useMemo(() => {
        if (!selectedOKL) return CABLE_APPOINTMENT;

        const allowedTypeIds = getCompatibleCableAppointments(selectedOKL, oklList);

        return CABLE_APPOINTMENT.filter(a =>
            allowedTypeIds.includes(a.id)
        );
    }, [selectedOKL, oklList]);

    const filteredCables = useMemo(() => {
        let cables: Cable[];

        if (!selectedOKL) {
            cables =
                selectedCableType === 'cable_type:all'
                    ? allCables
                    : getCablesByType(selectedCableType);
        } else {
            cables = getCompatibleCablesForOKL(
                selectedOKL,
                selectedCableType === 'cable_type:all' ? undefined : selectedCableType,
                oklList
            );
        }
        // 🔒 учитываем уже добавленные кабели
        if (selectedOKL) {
            cables = getAvailableCablesForOKL(selectedOKL, cables);
        }
        return cables;
    }, [selectedOKL, selectedCableType, oklList, allCables]);

    const resetCableFilters = () => {
        setSelectedCableType("cable_type:all");
        setSelectedCable('');
        setMeterCable(1)
    };

    const selectCableType = (id: string) => {
        setSelectedCableType(id);
        setSelectedCable('');
    };

    const selectCable = (id: string) => {
        setSelectedCable(id);
    };


    return {
        selectedCableType,
        selectedCable,
        meterCable,

        availableCableAppointments,
        filteredCables,

        resetCableFilters,
        selectCableType,
        selectCable,
        setMeterCable,

    };
};