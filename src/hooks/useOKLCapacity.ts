import { useMemo } from "react";
import {Cable, NewCable, newOKLItem} from "../data/data";

export const useOKLCapacity = (
    selectedOKL: string | null,
    selectedCable: string | null,
    oklList: newOKLItem[],
    selectedCableType: string,
    getCompatibleCablesForOKL: (
        oklId: string,
        cableTypeId: string | undefined,
        oklList: newOKLItem[]
    ) => Cable[],
    getAvailableCablesCount: (oklId: string, cables: Cable[]) => number,
    getOKLCapacityInfo: (oklId: string) => {
        cableCount: number;
        usedArea: number;
        maxArea: number;
        freeArea: number;
        isFull: boolean;
    } | null,
    canAddCableToOKL: (oklId: string, cableId: string) => { canAdd: boolean }
) => {

    const capacityInfo = useMemo(
        () => (selectedOKL ? getOKLCapacityInfo(selectedOKL) : null),
        [selectedOKL, oklList]
    );

    const capacityStatusData = useMemo(() => {
        if (!selectedOKL || !capacityInfo) return null;

        const cablesForDropdown =
            selectedCableType === "cable_type:all"
                ? getCompatibleCablesForOKL(selectedOKL, undefined, oklList)
                : getCompatibleCablesForOKL(selectedOKL, selectedCableType, oklList);

        const allCompatibleCables =
            getCompatibleCablesForOKL(selectedOKL, undefined, oklList);

        const availableFromFilteredCount =
            getAvailableCablesCount(selectedOKL, cablesForDropdown);

        const availableFromAllCount =
            getAvailableCablesCount(selectedOKL, allCompatibleCables);

        return {
            capacityInfo,
            hasOtherCables: availableFromAllCount > availableFromFilteredCount,
            filteredCablesCount: cablesForDropdown.length,
            allCablesCount: allCompatibleCables.length,
            availableFromFilteredCount,
            availableFromAllCount,
        };
    }, [selectedOKL, selectedCableType, oklList, capacityInfo]);

    const canAddCable = useMemo(() => {
        if (!selectedOKL || !selectedCable) return false;
        return canAddCableToOKL(selectedOKL, selectedCable).canAdd;
    }, [selectedOKL, selectedCable, oklList]);

    return {
        capacityInfo,
        capacityStatusData,
        canAddCable,
    };
};
