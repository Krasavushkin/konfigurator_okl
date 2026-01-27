import {Cable, NewCable, newOKLItem, OKLBaseType} from "../data/data";
import {useMemo, useState} from "react";
import {ALL_CABLES, OKL_DB} from "../data";

export const useOKLManager = (
    allOKL: OKLBaseType[]
) => {
    const [oklList, setOklList] = useState<newOKLItem[]>([]);
    const [selectedOKL, setSelectedOKL] = useState<string>('');

    // генератор уникальных ID
    const generateUniqueId = () =>
        Date.now().toString(36) + Math.random().toString(36).slice(2);

    // добавление ОКЛ
    const addOKL = (oklId: string, length: number) => {
        const oklData = OKL_DB.find(o => o.id === oklId);
        if (!oklData) {
            return null;
        }

        const newOKL: newOKLItem = {
            id: generateUniqueId(),
            name: oklData.name,
            length,
            cables: [],
            sectionOKL: oklData.sectionOKL,
            type: oklData.type,
            TU: oklData.TU,

        };
        setOklList(prev => [...prev, newOKL]);
        setSelectedOKL(newOKL.id);
        return newOKL.id;
    };

    // Намеренный выбор ОКЛ
    const selectOKL = (oklId: string) => {
        setSelectedOKL(oklId);
    };

    // добавление кабеля с проверкой вместимости
    const addCable = (oklId: string, cableId: string, length: number) => {
        const cableData = ALL_CABLES.find(c => c.id === cableId);
        const okl = oklList.find(o => o.id === oklId);

        if (!cableData || !okl) {
            return;
        }

        //ПРОВЕРКА ВМЕСТИМОСТИ В ХУКЕ
        if (!canAddCableToOKL(oklId, cableId)) {
            return;
        }

        const cable: NewCable = {
            id: generateUniqueId(),
            name: cableData.name,
            cableTypeId: cableData.cableTypeId,
            cores: cableData.cores,
            outerDiameter: cableData.outerDiameter,
            TU: cableData.TU,
            length: length,
        };

        setOklList(prev =>
            prev.map(okl =>
                okl.id === oklId ?
                    {...okl, cables: [...okl.cables, cable]} : okl
            )
        );
    };

    // проверка возможности добавления кабеля
    const canAddCableToOKL = (oklId: string, cableId: string): { canAdd: boolean; reason?: string } => {
        const okl = oklList.find(o => o.id === oklId);
        const cableData = ALL_CABLES.find(c => c.id === cableId);

        if (!okl || !cableData) {
            return { canAdd: false};
        }

        // Проверка количества кабелей
        if (okl.cables.length >= 8) {
            return { canAdd: false};
        }

        // Проверка площади сечения
        if (okl.sectionOKL && cableData.outerDiameter) {
            const usedArea = calculateUsedArea(okl.cables);
            const newCableArea = calculateCableArea(cableData.outerDiameter);

            if ((usedArea + newCableArea) > okl.sectionOKL) {
                return {canAdd: false,};
            }
        }

        return { canAdd: true };
    };

    const canAddAnyCable = (oklId: string, availableCables: any[]): { canAdd: boolean; reason?: string } => {
        const okl = oklList.find(o => o.id === oklId);
        if (!okl) return { canAdd: false};

        // Проверка количества кабелей
        if (okl.cables.length >= 8) {
            return { canAdd: false};
        }

        // Проверка: есть ли ХОТЯ БЫ ОДИН кабель, который поместится по объему
        if (okl.sectionOKL) {
            const usedArea = calculateUsedArea(okl.cables);
            const freeArea = okl.sectionOKL - usedArea;

            const canFitAnyCable = availableCables.some(cable => {
                if (!cable.outerDiameter) return false;
                const cableArea = calculateCableArea(cable.outerDiameter);
                return cableArea <= freeArea;
            });

            if (!canFitAnyCable) {
                return {canAdd: false,}
            };
        }

        return { canAdd: true };
    };
    //  ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ РАСЧЕТОВ
    const calculateCableArea = (outerDiameter: number): number => {
        const radius = outerDiameter / 2;
        return Math.PI * Math.pow(radius, 2);
    };

    const calculateUsedArea = (cables: NewCable[]): number => {
        return cables.reduce((sum, cable) => {
            if (!cable.outerDiameter) return sum;
            return sum + calculateCableArea(cable.outerDiameter);
        }, 0);
    };

    // получение информации о заполненности ОКЛ
    const getOKLCapacityInfo = (oklId: string) => {
        const okl = oklList.find(o => o.id === oklId);
        if (!okl) return null;

        const usedArea = calculateUsedArea(okl.cables);
        const cableCount = okl.cables.length;
        const maxArea = okl.sectionOKL || 0;

        return {
            cableCount,
            usedArea,
            maxArea,
            freeArea: maxArea - usedArea,
            isFull: cableCount >= 8 || usedArea >= maxArea
        };
    };

    // Удаление кабеля
    const removeCable = (oklId: string, cableId: string) => {
        setOklList(prev => prev.map(okl => okl.id === oklId ?
                { ...okl, cables: okl.cables.filter(c => c.id !== cableId) } : okl
            )
        );
    };

    // Удаление ОКЛ
    const deleteOKL = (oklId: string) => {
        setOklList(prev => prev.filter(okl => okl.id !== oklId));
    };

    // Копирование ОКЛ
    const copyOKL = (oklId: string) => {
        const original = oklList.find(o => o.id === oklId);
        if (!original) return;
        const copy: newOKLItem = {
            ...original,
            id: generateUniqueId(),
            cables: original.cables.map(c => ({ ...c, id: generateUniqueId() })),
        };
        setOklList(prev => [...prev, copy]);
    };
    // Удаление всех ОКЛ
    const deleteAllOKL = () => {
        setOklList([]);
        setSelectedOKL('');
    };

    const getAvailableCablesForOKL = (oklId: string, cables: Cable[]) => {
        const okl = oklList.find(o => o.id === oklId);
        if (!okl || !okl.sectionOKL) return cables;

        const usedArea = calculateUsedArea(okl.cables);
        const freeArea = okl.sectionOKL - usedArea;

        return cables.filter(cable => {
            if (!cable.outerDiameter) return false;

            // Проверяем, поместится ли кабель в свободное место
            const cableArea = calculateCableArea(cable.outerDiameter);
            return cableArea <= freeArea;
        });
    };

    const canAddAnyCableFromList = (oklId: string, cables: any[]): boolean => {
        const okl = oklList.find(o => o.id === oklId);
        if (!okl || !okl.sectionOKL) return false;

        const usedArea = calculateUsedArea(okl.cables);
        const freeArea = okl.sectionOKL - usedArea;

        return cables.some(cable => {
            if (!cable.outerDiameter) return false;
            const cableArea = Math.PI * Math.pow(cable.outerDiameter / 2, 2);
            return cableArea <= freeArea;
        });
    };

// функция для подсчета количества оставшегося кабеля после добавления в ОКЛ
    const getAvailableCablesCount = (oklId: string, cables: any[]): number => {
        const okl = oklList.find(o => o.id === oklId);
        if (!okl || !okl.sectionOKL) return 0;

        const usedArea = calculateUsedArea(okl.cables);
        const freeArea = okl.sectionOKL - usedArea;

        return cables.filter(cable => {
            if (!cable.outerDiameter) return false;
            const cableArea = Math.PI * Math.pow(cable.outerDiameter / 2, 2);
            return cableArea <= freeArea;
        }).length;
    };

    const selectedOKLInfo = useMemo(() => {
        if (!selectedOKL) return {name: '', index: -1};

        const index = oklList.findIndex(okl => okl.id === selectedOKL) + 1;

        // Ищем название
        let name = '';
        const oklFromList = oklList.find(o => o.id === selectedOKL);
        if (oklFromList && oklFromList.name) {
            name = oklFromList.name;
        } else {
            const oklFromDB = allOKL.find(o => o.id === selectedOKL);
            name = oklFromDB?.name || 'Неизвестная ОКЛ';
        }

        return {name, index};
    }, [selectedOKL, oklList, allOKL]);

    return {
        oklList,
        selectedOKL,

        setSelectedOKL: selectOKL,
        addOKL,
        addCable,
        removeCable,
        deleteOKL,
        copyOKL,
        canAddCableToOKL,
        getOKLCapacityInfo,
        canAddAnyCable,
        deleteAllOKL,
        getAvailableCablesForOKL,
        canAddAnyCableFromList,
        getAvailableCablesCount,

        selectedOKLInfo
    };
};




