import React, {useState, useMemo, useEffect, useRef} from 'react';
import styles from './styles/Konfigurator2.module.css';
import {OKLconfig} from "./infoOKL/OKLconfig";
import {useOKLManager} from "../hooks/useOKLManager";
import {useOKLData} from "../hooks/useOKLData";
import {OKLFilterSection} from "./OKLFilterSection";
import {OKLSelector} from "./OKLSelector";
import {CableSelector} from "./CableSelector";
import {useOKLFilters} from "../hooks/useOKLFilters";
import {useCableSelection} from "../hooks/useCableSelection";
import {useOKLCapacity} from "../hooks/useOKLCapacity";
import {FITTINGS} from "../data/data";


export const Konfigurator2 = () => {

    const {
        allOKL,
        allCables,
        getCablesByType,
        getCompatibleCableAppointments,
        getCompatibleCablesForOKL,
        getCompatibleCables
    } = useOKLData();

    const {
        oklList,
        selectedOKL,
        setSelectedOKL,
        addOKL,
        addCable,
        removeCable,
        deleteOKL,
        copyOKL,
        deleteAllOKL,
        getAvailableCablesForOKL,
        canAddCableToOKL,
        canAddAnyCableFromList,
        getAvailableCablesCount,
        getOKLCapacityInfo,
        selectedOKLInfo
    } = useOKLManager(
        allOKL
    );

    const {
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
    } =
        useOKLFilters(
            allOKL
        );

    const {
        selectedCableType,
        selectedCable,
        meterCable,
        availableCableAppointments,
        filteredCables,
        selectCableType,
        selectCable,
        setMeterCable,
        resetCableFilters
    } =
        useCableSelection(
            selectedOKL,
            oklList,
            allCables,
            getCompatibleCableAppointments,
            getCompatibleCablesForOKL,
            getCablesByType,
            getAvailableCablesForOKL
        );

    const {
        capacityInfo,
        capacityStatusData,
        canAddCable
    } =
        useOKLCapacity(
            selectedOKL,
            selectedCable,
            oklList,
            selectedCableType,
            getCompatibleCablesForOKL,
            getAvailableCablesCount,
            getOKLCapacityInfo,
            canAddCableToOKL
        );

    const [meter, setMeterOKL] = useState<number>(1);
    const prevOKLCountRef = useRef(oklList.length);
    const [justAdded, setJustAdded] = useState(false);


    useEffect(() => {
        if (oklList.length <= prevOKLCountRef.current) return;

        resetCableFilters();
        setJustAdded(true);

        const timer = setTimeout(() => setJustAdded(false), 600);
        prevOKLCountRef.current = oklList.length;

        return () => clearTimeout(timer);
    }, [oklList.length, resetCableFilters]); // <-- добавили resetCableFilters



    const handleAddOKL = () => {
        if (!selectedOKL) return;
        const specification = {
            suspension: selectedSuspension || " ",
            surface: selectedSurface || " ",
            fitting: selectedFitting ?
                FITTINGS.find(f => f.id === selectedFitting)?.name : undefined,
        };
        addOKL(selectedOKL, meter, specification);
        setMeterOKL(1);
    };

    const handleDeleteAllOKL = () => {
        if (window.confirm('Вы уверены, что хотите удалить все ОКЛ? Это действие нельзя отменить.')) {
            deleteAllOKL();
            syncFiltersWithOKL(null);

        }
    };

    const isOKLAlreadyAdded = useMemo(() => {
        if (!selectedOKL) return false;
        return oklList.some(okl => okl.id === selectedOKL);
    }, [selectedOKL, oklList]);

    const handleAddCableToOKL = () => {
        if (!selectedCable || !selectedOKL) return;
        addCable(selectedOKL, selectedCable, meterCable);
    };

    const handleSelectOKL = (id: string) => {
        setSelectedOKL(id);
        syncFiltersWithOKL(id, selectedFitting);
    };

    return (
        <>
            {/* <Header/>*/}
            <div className={styles.container}>
                <OKLFilterSection selectedOKL={selectedOKL}
                                  availableSurfaces={availableSurfaces}
                                  availableFittings={availableFittings}
                                  availableOKL={availableOKL}
                                  onSelectSuspension={selectSuspension}
                                  onSelectFitting={selectFitting}
                                  onSelectSurface={selectSurface}
                                  selectedFitting={selectedFitting}
                                  selectedSurface={selectedSurface}
                                  selectedSuspension={selectedSuspension}
                                  resetFilters={resetFilters}

                />
                <OKLSelector availableOKL={availableOKL}
                             selectedOKL={selectedOKL}
                             handleSelect={handleSelectOKL}
                             handleAddOKL={handleAddOKL}
                             isOKLAlreadyAdded={isOKLAlreadyAdded}
                             justAdded={justAdded}
                             setMeterOKL={setMeterOKL}
                             meter={meter}
                             oklListLength={oklList.length}
                />
                <CableSelector availableCableAppointments={availableCableAppointments}
                               selectedOKL={selectedOKL}
                               handleSelectCableType={selectCableType}
                               handleSelectCable={selectCable}
                               selectedCable={selectedCable}
                               canAddCable={canAddCable}
                               filteredCables={filteredCables}
                               handleAddCableToOKL={handleAddCableToOKL}
                               meterCable={meterCable}
                               selectedCableType={selectedCableType}
                               setMeterCable={setMeterCable}
                               capacityInfo={capacityInfo}
                               capacityStatusData={capacityStatusData}
                               selectedOKLInfo={selectedOKLInfo}
                />
            </div>
            <OKLconfig
                oklList={oklList}
                onRemoveCable={removeCable}
                onDeleteOKL={deleteOKL}
                onCopyOKL={copyOKL}
                getOKLCapacityInfo={getOKLCapacityInfo}
                selectedOKL={selectedOKL}
                onSelectOKL={setSelectedOKL}
                onDeleteAllOKL={handleDeleteAllOKL}
                canAddAnyCableFromList={canAddAnyCableFromList}
                getAvailableCablesCount={getAvailableCablesCount}
                getCompatibleCables={getCompatibleCables}
            />
        </>
    );
};


