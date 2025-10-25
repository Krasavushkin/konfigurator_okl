import {newOKLItem} from "../konfigurator_okl/data";
import {useState} from "react";
import {NewCable} from "../konfigurator_okl/infoOKL/OKLCard";
import {ALL_CABLES, OKL_DB} from "../data";

export const useOKLManager = () => {
    const [oklList, setOklList] = useState<newOKLItem[]>([]);
    const [selectedOKL, setSelectedOKL] = useState<string>('');

    // Генератор уникальных ID
    const generateUniqueId = () =>
        Date.now().toString(36) + Math.random().toString(36).slice(2);

    // 🔧 УПРОЩЕННОЕ добавление ОКЛ - ищем по ID, а не по имени
    const addOKL = (oklId: string, length: number) => {
        const oklData = OKL_DB.find(o => o.id === oklId);
        if (!oklData) {
            console.error('ОКЛ не найдена в базе:', oklId);
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
            description: oklData.description,
        };
        setOklList(prev => [...prev, newOKL]);
        setSelectedOKL(newOKL.id);
        return newOKL.id;
    };

    // 🔧 УПРОЩЕННОЕ добавление кабеля с проверкой вместимости
    const addCable = (oklId: string, cableId: string, length: number) => {
        const cableData = ALL_CABLES.find(c => c.id === cableId);
        const okl = oklList.find(o => o.id === oklId);

        if (!cableData || !okl) {
            console.error('Данные не найдены:', { cableId, oklId });
            return;
        }

        // 🔧 ПРОВЕРКА ВМЕСТИМОСТИ В ХУКЕ
        if (!canAddCableToOKL(oklId, cableId)) {
            console.error('Нельзя добавить кабель: превышена вместимость');
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

    // 🔧 НОВАЯ ФУНКЦИЯ: проверка возможности добавления кабеля
    /*const canAddCableToOKL = (oklId: string, cableId: string) => {
        const okl = oklList.find(o => o.id === oklId);
        const cableData = ALL_CABLES.find(c => c.id === cableId);

        if (!okl || !cableData) return false;

        // Проверка количества кабелей
        if (okl.cables.length >= 8) return false;

        // Проверка площади сечения
        if (okl.sectionOKL && cableData.outerDiameter) {
            const usedArea = calculateUsedArea(okl.cables);
            const newCableArea = calculateCableArea(cableData.outerDiameter);
            return (usedArea + newCableArea) <= okl.sectionOKL;
        }

        return true;
    };*/
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
    // 🔧 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ РАСЧЕТОВ
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

    // 🔧 НОВАЯ ФУНКЦИЯ: получение информации о заполненности ОКЛ
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

    // Удаление всей ОКЛ
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

    return {
        oklList,
        selectedOKL,
        setSelectedOKL,
        addOKL,
        addCable,
        removeCable,
        deleteOKL,
        copyOKL,
        canAddCableToOKL, // 🔧 ЭКСПОРТИРУЕМ НОВЫЕ ФУНКЦИИ
        getOKLCapacityInfo,

        canAddAnyCable
    };
};



/*
import {newOKLItem} from "../konfigurator_okl/data";
import {useState} from "react";
import {NewCable} from "../konfigurator_okl/infoOKL/OKLCard";
import {ALL_CABLES, OKL_DB} from "../data";

export const useOKLManager = () => {
    const [oklList, setOklList] = useState<newOKLItem[]>([]);
    const [selectedOKL, setSelectedOKL] = useState<string>('');

    // Генератор уникальных ID
    const generateUniqueId = () =>
        Date.now().toString(36) + Math.random().toString(36).slice(2);

    // Добавление новой ОКЛ
    const addOKL = (oklName: string, length: number) => {
        const oklData = OKL_DB.find(o => o.name === oklName);
        if (!oklData) {
            console.error('ОКЛ не найдена в базе:', oklName);
            return;
        }

        const newOKL: newOKLItem = {
            id: generateUniqueId(),
            name: oklData.name,
            length,
            cables: [],
            sectionOKL: oklData.sectionOKL,
            type: oklData.type,
            TU: oklData.TU,
            description: oklData.description,
        };
        setOklList(prev => [...prev, newOKL]);
        setSelectedOKL(newOKL.id);
    };

    // Добавление кабеля в выбранную ОКЛ
    const addCable = (oklId: string, cableId: string, length: number) => {
        const cableData = ALL_CABLES.find(c => c.id === cableId);
        if (!cableData) {
            console.error('Кабель не найден в базе:', cableId);
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


    // Удаление кабеля
    const removeCable = (oklId: string, cableId: string) => {
        setOklList(prev => prev.map(okl => okl.id === oklId ?
                { ...okl, cables: okl.cables.filter(c => c.id !== cableId) } : okl
            )
        );
    };

    // Удаление всей ОКЛ
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




    return {
        oklList,
        selectedOKL,
        setSelectedOKL,
        addOKL,
        addCable,
        removeCable,
        deleteOKL,
        copyOKL,
    };
};
*/
