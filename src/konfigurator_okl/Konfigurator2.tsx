import React, {useState, useMemo, useEffect, useRef} from 'react';
import {CABLE_APPOINTMENT, FITTINGS} from './data';
import styles from './styles/Konfigurator2.module.css';
import {Dropdown} from './Dropdown';
import {Header} from './Header';
import {Input} from './Input';
import {Button} from './Button';
import {OKLconfig} from "./infoOKL/OKLconfig";
import {useOKLManager} from "../hooks/useOKLManager";
import {useOKLData} from "../hooks/useOKLData";
import {SURFACES} from "../data/SURFACES";
import {SUSPENSIONS} from "../data/SUSPENSIONS";
import {OKL_DB} from "../data";
import {CapacityStatus} from "./CapacityStatus";


export const Konfigurator2 = () => {


    const {
        allOKL,
        allCables,
        getCompatibleCables,
        getMaxFireTime,
        getCablesByType,
        getCompatibleCableAppointments,
        getCompatibleCablesForOKL
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
        canAddCableToOKL,
        getOKLCapacityInfo,
        deleteAllOKL,
        getAvailableCablesForOKL,

        canAddAnyCableFromList,
        getAvailableCablesCount
    } = useOKLManager();

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const [selectedSuspension, setSelectedSuspension] = useState<string>('');
    const [selectedSurface, setSelectedSurface] = useState<string>('');
    const [selectedFitting, setSelectedFitting] = useState<string>('');

    const [selectedCableType, setSelectedCableType] = useState<string>("cable_type:all");
    const [selectedCable, setSelectedCable] = useState<string>('');

    const [meter, setMeterOKL] = useState<number>(1);
    const [meterCable, setMeterCable] = useState<number>(1);

    const prevOKLCountRef = useRef(oklList.length);

    useEffect(() => {
        if (oklList.length > prevOKLCountRef.current) {
            resetCableFilters();
        }
        prevOKLCountRef.current = oklList.length;
    }, [oklList.length]);

    // 🔧 СБРОС ПРИ СМЕНЕ ВЫБРАННОЙ ОКЛ
    useEffect(() => {
        resetCableFilters();
    }, [selectedOKL]);

    // 🔧 ФУНКЦИЯ ДЛЯ СБРОСА ФИЛЬТРОВ КАБЕЛЕЙ
    const resetCableFilters = () => {
        setSelectedCableType("cable_type:all");
        setSelectedCable('');
        setMeterCable(1)
    };


//??????
    const [isEditingOKL, setIsEditingOKL] = useState<string | null>(null);

//1.получение доступной поверхности для выбора ОКЛ из БД
    const availableSurfaces = useMemo(() => {
        if (!selectedSuspension) return [];
        const oklWithSuspension = OKL_DB.filter(okl =>
            okl.compatibleSuspensions.includes(selectedSuspension)
        );
        const surfacesFromOKL = new Set(
            oklWithSuspension.flatMap(okl => okl.compatibleSurfaces)
        );
        return SURFACES.filter(surface => surfacesFromOKL.has(surface.id));
    }, [selectedSuspension]);

//2. выбор доступных креплений
    const availableFittings = useMemo(
        () => selectedSuspension && selectedSurface ?
            FITTINGS.filter((f) =>
                SUSPENSIONS.find(
                    (s) => s.id === selectedSuspension
                )?.defaultFittings[selectedSurface]?.includes(f.id)
            )
            : FITTINGS,
        [selectedSuspension, selectedSurface]
    );

//3. Выбор доступой ОКЛ
    const availableOKL = useMemo(
        () =>
            selectedSuspension && selectedSurface
                ? allOKL.filter(
                    (o) =>
                        o.compatibleSuspensions.includes(selectedSuspension) &&
                        o.compatibleSurfaces.includes(selectedSurface)
                )
                : allOKL,
        [selectedSuspension, selectedSurface, allOKL]
    );

//... Выбор доступных типов кабелей
    const availableCableAppointments = useMemo(() => {
        if (!selectedOKL) return CABLE_APPOINTMENT;
        return getCompatibleCableAppointments(selectedOKL, oklList);
    }, [selectedOKL, oklList]);

    const filteredCables = useMemo(() => {
        let cables = [];

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

    const allCompatibleCables = useMemo(() => {
        if (!selectedOKL) return [];

        // Если выбрано "Все кабели" - возвращаем все совместимые
        return (selectedCableType === "cable_type:all" || !selectedCableType)
            ? getCompatibleCablesForOKL(selectedOKL, undefined, oklList)
            : getCompatibleCablesForOKL(selectedOKL, selectedCableType, oklList);
    }, [selectedOKL, selectedCableType, oklList]);

    const toggleDropdown = (dropdownName: string) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };


    const handleSelect = (type: string) => (id: string, name: string) => {
        switch (type) {
            case 'cableType':
                setSelectedCableType(id);
                setSelectedCable('');
                break;
            case 'cable':
                setSelectedCable(id);
                break;
            case 'suspension':
                setSelectedSuspension(id);
                setSelectedSurface('');
                setSelectedOKL('');
                break;
            case 'surface':
                setSelectedSurface(id);
                setSelectedFitting('');
                setSelectedOKL('');
                break;
            case 'fitting':
                setSelectedFitting(id);
                break;
            case 'OKL':
                setSelectedOKL(id);
                break;
        }
        setActiveDropdown(null);
    };

    const getSelectedName = (items: { id: string; name: string }[], id: string) =>
        items.find((item) => item.id === id)?.name || 'Не выбрано';

    // 4. Добавление ОКЛ через хук
    const handleAddOKL = () => {
        if (!selectedOKL) return;
        addOKL(selectedOKL, meter);
    };


    const handleShowTime = (oklType: string, cableTypeId: string) => {
        const time = getMaxFireTime(oklType, cableTypeId);
        console.log(`⏱ Время работы ${oklType} с ${cableTypeId}: ${time} мин`);
    };
    // 5. добавление кабеля через хук
    const handleAddCableToOKL = () => {
        if (!selectedCable || !selectedOKL) return;
        addCable(selectedOKL, selectedCable, meterCable);
    };


    const handleRemoveCable = removeCable;
    const handleDeleteOKL = deleteOKL;
    const handleCopyOKL = copyOKL;

    const handleEditOKL = (oklId: string) => {
        setIsEditingOKL(oklId);
    };

    const handleAddCable = (oklId: string) => {
        setSelectedOKL(oklId);
    };

    const capacityInfo = useMemo(() =>
            selectedOKL ? getOKLCapacityInfo(selectedOKL) : null,
        [selectedOKL, oklList]);


    const cableValidation = useMemo(() =>
            selectedOKL && selectedCable ? canAddCableToOKL(selectedOKL, selectedCable) : {canAdd: false},
        [selectedOKL, selectedCable, oklList]);

    const canAddCable = cableValidation.canAdd;

// Обработчик удаления всех ОКЛ
    const handleDeleteAllOKL = () => {
        if (window.confirm('Вы уверены, что хотите удалить все ОКЛ? Это действие нельзя отменить.')) {
            deleteAllOKL();
        }
    };


    const capacityStatusData = useMemo(() => {
        if (!selectedOKL || !capacityInfo) return null;

        // 1. Кабели для дропдауна (без площади)
        const cablesForDropdown = selectedOKL
            ? (selectedCableType === "cable_type:all"
                ? getCompatibleCablesForOKL(selectedOKL, undefined, oklList)
                : getCompatibleCablesForOKL(selectedOKL, selectedCableType, oklList))
            : (selectedCableType === "cable_type:all" ? allCables : getCablesByType(selectedCableType));

        // 2. Все совместимые (без площади)
        const allCompatibleCables = selectedOKL
            ? getCompatibleCablesForOKL(selectedOKL, undefined, oklList)
            : allCables;

        // 3. Сколько помещается
        const availableFromFilteredCount = getAvailableCablesCount(selectedOKL, cablesForDropdown);
        const availableFromAllCount = getAvailableCablesCount(selectedOKL, allCompatibleCables);

        // 4. Есть ли "другие" кабели, которые помещаются
        const hasOtherCables = availableFromAllCount > availableFromFilteredCount;

        return {
            capacityInfo,
            hasOtherCables,
            filteredCablesCount: cablesForDropdown.length,
            allCablesCount: allCompatibleCables.length,
            availableFromFilteredCount,
            availableFromAllCount
        };
    }, [selectedOKL, capacityInfo, selectedCableType, oklList]);



    return (
        <>
            <Header/>
            <div className={styles.container}>


                <div className={styles.dropdowns}>
                    <h2>Фильтры для подбора ОКЛ</h2>

                    <Dropdown
                        id="dropdown-suspension"
                        title="Тип кабеленесущего элемента"
                        items={SUSPENSIONS}
                        selectedId={selectedSuspension}
                        isOpen={activeDropdown === 'suspension'}
                        onToggle={() => toggleDropdown('suspension')}
                        onSelect={handleSelect('suspension')}
                    />
                    <Dropdown
                        title="Поверхность монтажа"
                        items={availableSurfaces}
                        selectedId={selectedSurface}
                        isOpen={activeDropdown === 'surface'}
                        onToggle={() => selectedSuspension && toggleDropdown('surface')}
                        onSelect={handleSelect('surface')}
                        disabled={!selectedSuspension}

                    />
                    <Dropdown
                        title="Тип крепежа"
                        items={availableFittings}
                        selectedId={selectedFitting}
                        isOpen={activeDropdown === 'fitting'}
                        onToggle={() => selectedSurface && toggleDropdown('fitting')}
                        onSelect={handleSelect('fitting')}
                        disabled={!selectedSurface}
                    />

                    {!selectedOKL && (<div className={`${styles.filterStatus} ${selectedSuspension && selectedSurface && selectedFitting ? styles.completed : styles.active}`}>
                        {selectedSuspension && selectedSurface && selectedFitting ? (
                            <div className={styles.statusMessage}>
                                <span className={styles.successIcon}>✓</span>
                                <span>Все фильтры выбраны! Теперь вы можете выбрать ОКЛ из доступных вариантов в карточке "Выбор марки ОКЛ"</span>
                            </div>
                        ) : (
                            <div className={styles.statusMessage}>
                                <span className={styles.infoIcon}>i</span>
                                <span>
                                    {!selectedSuspension && "Выберите тип кабеленесущего элемента чтобы начать подбор "}
                                    {selectedSuspension && !selectedSurface && "Теперь выберите поверхность монтажа "}
                                    {selectedSuspension && selectedSurface && !selectedFitting && "Осталось выбрать тип крепежа "}
                                    {!selectedSuspension && "или воспользуйтесь поиском ОКЛ в карточке \"Выбор марки ОКЛ\", если знаете нужную марку"}
                                </span>
                            </div>
                        )}
                    </div>)}
                </div>
                <div className={styles.dropdowns}>
                    <h2>Выбор марки ОКЛ</h2>
                    <Dropdown
                        title="Огнестойкая кабельная линия"
                        items={availableOKL}
                        selectedId={selectedOKL}
                        isOpen={activeDropdown === 'OKL'}
                        onToggle={() => toggleDropdown('OKL')}
                        onSelect={handleSelect('OKL')}
                        disabled={false}
                        searchable={true}
                        placeholder="Поиск ОКЛ..."
                    />
                    <Input
                        title="Длина в метрах"
                        value={meter}
                        onChange={(e) => setMeterOKL(Number(e))}
                        placeholder="длина в метрах"
                    />
                    <Button
                        title="+ Добавить ОКЛ"
                        onClick={handleAddOKL}
                        disabled={!selectedOKL || meter < 1}
                    />
                    {!selectedOKL &&  (<div className={`${styles.filterStatus} ${styles.active}`}>
                        <div className={styles.statusMessage}>
                            <span className={styles.infoIcon}>i</span>
                            <span>После выбора ОКЛ введите длину в метрах и нажмите кнопку "+ Добавить ОКЛ".
                                Затем перейдите к выбору и добавлению кабеля.
                            </span>
                        </div>
                    </div>)}
                </div>
                <div className={styles.dropdowns}>
                    <h2>Подбор кабеля для ОКЛ</h2>
                    {!selectedOKL && (
                        <div className={`${styles.filterStatus} ${styles.active}`}>
                            <div className={styles.statusMessage}>
                                <span className={styles.infoIcon}>i</span>
                                <span>Сначала добавьте ОКЛ в карточке "Выбор марки ОКЛ"</span>
                            </div>
                        </div>
                    )}
                    <Dropdown
                        title="Назначение кабеля"
                        items={availableCableAppointments}
                        selectedId={selectedCableType}
                        isOpen={activeDropdown === 'cableType'}
                        onToggle={() => toggleDropdown('cableType')}
                        onSelect={handleSelect('cableType')}
                    />

                    <Dropdown
                        title="Марка кабеля"
                        items={filteredCables}
                        selectedId={selectedCable}
                        isOpen={activeDropdown === 'cable'}
                        onToggle={() => toggleDropdown('cable')}
                        onSelect={handleSelect('cable')}
                        searchable={true}
                        placeholder="Поиск кабеля..."
                    />
                    <Input
                        title="Длина в метрах"
                        value={meterCable}
                        onChange={(e) => setMeterCable(Number(e))}
                        placeholder="длина в метрах"
                    />
                    <Button
                        title="+ Добавить кабель в ОКЛ"
                        onClick={handleAddCableToOKL}
                        disabled={!canAddCable || meterCable < 1}
                    />
                    {selectedCable && !canAddCable && cableValidation.reason && (
                        <div className={styles.validationError}>
                            <div className={styles.errorIcon}>⚠</div>
                            <div className={styles.errorText}>
                                <strong>Нельзя добавить кабель:</strong>
                                <span>{cableValidation.reason}</span>
                            </div>
                        </div>
                    )}
                    {capacityInfo && <CapacityStatus capacityStatusData={capacityStatusData} compact={false}/>}
                </div>
            </div>
            <OKLconfig
                oklList={oklList}
                onRemoveCable={handleRemoveCable}
                onDeleteOKL={handleDeleteOKL}
                onEditOKL={handleEditOKL}
                onAddCable={handleAddCable}
                onCopyOKL={handleCopyOKL}
                getOKLCapacityInfo={getOKLCapacityInfo}
                selectedOKL={selectedOKL}
                onSelectOKL={setSelectedOKL}
                onDeleteAllOKL={handleDeleteAllOKL}
                canAddAnyCableFromList={canAddAnyCableFromList}
                getAvailableCablesCount={getAvailableCablesCount}
            />
        </>

    );
};



