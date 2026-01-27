import {useMemo, useState} from "react";
import {SUSPENSIONS} from "../data/SUSPENSIONS";
import {FITTINGS, OKLBaseType} from "../data/data";
import {SURFACES} from "../data/SURFACES";



export const useOKLFilters = (allOKL: OKLBaseType[]) => {

    const [selectedSuspension, setSelectedSuspension] = useState<string | null>(null);
    const [selectedSurface, setSelectedSurface] = useState<string |  null>(null);
    const [selectedFitting, setSelectedFitting] = useState<string | null>(null);



    const selectSuspension = (id: string) => {
        setSelectedSuspension(id);
        setSelectedSurface(null);
        setSelectedFitting(null);
    };

    const selectSurface = (id: string) => {
        setSelectedSurface(id);
        setSelectedFitting(null);
    };

    const selectFitting = (id: string) => {
        setSelectedFitting(id);
    };



//1.получение доступной поверхности для выбора ОКЛ из БД
    const availableSurfaces = useMemo(() => {
        if (selectedSuspension === null) return SURFACES;

        // Получаем поверхности, совместимые с выбранной подвесной системой
        const surfacesForSuspension = new Set<string>();

        allOKL.forEach(okl => {
            if (okl.compatibleSuspensions.includes(selectedSuspension)) {
                okl.compatibleSurfaces.forEach(surface => {
                    surfacesForSuspension.add(surface);
                });
            }
        });

        return SURFACES.filter(surface =>
            surfacesForSuspension.has(surface.id as string)
        );
    }, [selectedSuspension, allOKL]);

//2. выбор доступных креплений
    const availableFittings = useMemo(() => {
        if (!selectedSuspension || !selectedSurface) return FITTINGS;

        const suspension = SUSPENSIONS.find(s => s.id === selectedSuspension);
        const fittingIds = suspension?.defaultFittings[selectedSurface] || [];

        return FITTINGS.filter(fitting =>
            fittingIds.includes(fitting.id)
        );
    }, [selectedSuspension, selectedSurface]);

//3. Выбор доступой ОКЛ
    //3. Выбор доступных ОКЛ (простая последовательная фильтрация)
    const availableOKL = useMemo(() => {
        let filtered = allOKL;

        // Фильтр 1: по подвесной системе
        if (selectedSuspension) {
            filtered = filtered.filter(o =>
                o.compatibleSuspensions.includes(selectedSuspension)
            );
        }

        // Фильтр 2: по поверхности (после подвесной системы)
        if (selectedSurface) {
            filtered = filtered.filter(o =>
                o.compatibleSurfaces.includes(selectedSurface)
            );
        }

        // Фильтр 3: по креплению,если есть связь с ОКЛ
        if (selectedFitting && selectedSuspension && selectedSurface) {
            // Проверяем, что выбранное крепление совместимо с выбранной комбинацией
            const suspension = SUSPENSIONS.find(s => s.id === selectedSuspension);
            const fittingsForSurface = suspension?.defaultFittings[selectedSurface] || [];

            if (!fittingsForSurface.includes(selectedFitting)) {
                // Если крепление не совместимо, очищаем список
                filtered = [];
            }
        }

        return filtered;
    }, [selectedSuspension, selectedSurface, selectedFitting, allOKL]);

    const syncFiltersWithOKL = (oklId: string | null, preservedFitting?: string | null) => {
        if (!oklId) {
            // если ОКЛ не выбран — сбрасываем только подвеску и поверхность
            setSelectedSuspension(null);
            setSelectedSurface(null);
            setSelectedFitting(preservedFitting ?? null); // сохраняем крепеж
            return;
        }

        const okl = allOKL.find(o => o.id === oklId);
        if (!okl) return;

        setSelectedSuspension(okl.compatibleSuspensions?.[0] ?? null);
        setSelectedSurface(okl.compatibleSurfaces?.[0] ?? null);

        // сохраняем выбранный крепеж только если он совместим с новой подвеской и поверхностью
        if (preservedFitting) {
            const suspension = SUSPENSIONS.find(s => s.id === okl.compatibleSuspensions?.[0]);
            const fittingsForSurface = suspension?.defaultFittings[okl.compatibleSurfaces?.[0]] || [];

            if (fittingsForSurface.includes(preservedFitting)) {
                setSelectedFitting(preservedFitting);
            } else {
                setSelectedFitting(null);
            }
        } else {
            setSelectedFitting(null);
        }
    };


    const resetFilters = () => {
        setSelectedSuspension(null);
        setSelectedSurface(null);
        setSelectedFitting(null);
    };
    return {
        selectedSuspension,
        selectedSurface,
        selectedFitting,

        availableSurfaces,
        availableFittings,
        availableOKL,

        selectSuspension,
        selectSurface,
        selectFitting,

        syncFiltersWithOKL,
        resetFilters
    };
};