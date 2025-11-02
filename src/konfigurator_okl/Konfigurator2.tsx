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
import {CounterBadge} from "./services/CounterBadge";
import {StatusHint} from "./services/StatusHint";


export const Konfigurator2 = () => {

    const {
        allOKL,
        allCables,

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

        setMeterOKL(1);

    };

    const isOKLAlreadyAdded = useMemo(() => {
        if (!selectedOKL) return false;
        return oklList.some(okl => okl.id === selectedOKL);
    }, [selectedOKL, oklList]);

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

    const [justAdded, setJustAdded] = useState(false);

    useEffect(() => {
        if (oklList.length > prevOKLCountRef.current) {
            setJustAdded(true);
            const timer = setTimeout(() => setJustAdded(false), 600);
            return () => clearTimeout(timer);
        }
    }, [oklList.length]);



    const selectedOKLInfo = useMemo(() => {
        if (!selectedOKL) return { name: '', index: -1 };

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

        return { name, index };
    }, [selectedOKL, oklList, allOKL]);


    // 🔄 ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ РЕЖИМА
    const [selectionMode, setSelectionMode] = useState<'okl-first' | 'cable-first'>('okl-first');
    const [selectedCableForOKL, setSelectedCableForOKL] = useState<string>('');

    // 🔄 ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ РЕЖИМА
    const toggleSelectionMode = () => {
        setSelectionMode(prev => prev === 'okl-first' ? 'cable-first' : 'okl-first');
        // Сброс выбранных значений при переключении
        setSelectedOKL('');
        setSelectedCable('');
        setSelectedCableForOKL('');
    };

    // 🔄 ПОЛУЧЕНИЕ ДОСТУПНЫХ ОКЛ ДЛЯ ВЫБРАННОГО КАБЕЛЯ
    const availableOKLForCable = useMemo(() => {
        if (!selectedCableForOKL) return [];

        const cableData = allCables.find(c => c.id === selectedCableForOKL);
        if (!cableData) return [];

        // Фильтруем ОКЛ, которые совместимы с выбранным кабелем
        return allOKL.filter(okl => {
            // Проверяем совместимость по типу кабеля
            const compatibleCables = getCompatibleCablesForOKL(okl.id, undefined, []);
            return compatibleCables.some(cable => cable.id === selectedCableForOKL);
        });
    }, [selectedCableForOKL, allOKL, allCables]);

    // 🔄 ОБНОВЛЕННАЯ ЛОГИКА ДОБАВЛЕНИЯ
    const handleAddOKLWithCable = () => {
        if (!selectedOKL || !selectedCableForOKL) return;

        // Сначала добавляем ОКЛ
        const newOKLId = addOKL(selectedOKL, meter);
        if (newOKLId) {
            // Затем добавляем кабель
            addCable(newOKLId, selectedCableForOKL, meterCable);

            // Сброс
            setSelectedCableForOKL('');
            setMeterOKL(1);
            setMeterCable(1);
        }
    };

    return (
        <>
            <Header/>
            {/* 🔄 ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ */}
            {/*<div className={styles.modeSwitch}>
                <button
                    className={`${styles.modeButton} ${selectionMode === 'okl-first' ? styles.active : ''}`}
                    onClick={() => setSelectionMode('okl-first')}
                >
                    Сначала ОКЛ → потом кабель
                </button>
                <button
                    className={`${styles.modeButton} ${selectionMode === 'cable-first' ? styles.active : ''}`}
                    onClick={() => setSelectionMode('cable-first')}
                >
                    Сначала кабель → потом ОКЛ
                </button>
            </div>*/}
            <div className={styles.container}>
                <>
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

                        {!selectedOKL  && oklList.length === 0 && (
                            <StatusHint
                                type={selectedSuspension && selectedSurface && selectedFitting ? 'success' : 'info'}
                            >
                                {selectedSuspension && selectedSurface && selectedFitting
                                    ? "Все фильтры выбраны! Теперь выберите ОКЛ в поле 'Огнестойкая кабельная линия'."
                                    : !selectedSuspension
                                        ? "Выберите тип кабеленесущего элемента. Если знаете марку ОКЛ — выберите сразу из списка 'Огнестойкая кабельная линия'."
                                        : !selectedSurface
                                            ? "Выберите поверхность монтажа"
                                            : "Выберите тип крепежа"
                                }
                            </StatusHint>
                        )}
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
                        {isOKLAlreadyAdded && oklList.length > 0 && (
                            <StatusHint type="info">
                                Вы добавили ОКЛ в конфигурацию! Можете добавить в неё кабели или выберите новую ОКЛ, введите длину и нажмите "+ Добавить ОКЛ".
                            </StatusHint>
                        )}
                        <Button
                            title="Добавить ОКЛ"
                            onClick={handleAddOKL}
                            disabled={!selectedOKL || meter < 1 || isOKLAlreadyAdded}
                        />

                        <CounterBadge
                            label="Добавлено ОКЛ"
                            value={oklList.length}
                            highlight={justAdded}
                        />

                        {!selectedOKL  && oklList.length === 0 && (
                            <StatusHint type="info">
                                После выбора ОКЛ введите длину в метрах и нажмите "+ Добавить ОКЛ".
                                Затем перейдите к выбору и добавлению кабеля.
                            </StatusHint>
                        )}
                    </div>
                    <div className={styles.dropdowns}>
                        <h2>Подбор кабеля для ОКЛ</h2>
                        {!selectedOKL  && oklList.length === 0 && (
                            <StatusHint type="info">
                                Сначала добавьте ОКЛ в карточке "Выбор марки ОКЛ"
                            </StatusHint>
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
                            title="Добавить кабель в ОКЛ"
                            onClick={handleAddCableToOKL}
                            disabled={!canAddCable || meterCable < 1}
                        />
                        {selectedCable && !canAddCable && (
                            <StatusHint type="error">
                                Нельзя добавить кабель в выбранную ОКЛ. Можете добавить новую или удалить кабели из выбранной.
                            </StatusHint>
                        )}
                        {!selectedCable && selectedOKL && (
                            <StatusHint type="warning">
                                Выберите кабель, чтобы добавить в ОКЛ.
                            </StatusHint>
                        )}
                        {capacityInfo && <CapacityStatus capacityStatusData={capacityStatusData} compact={false} selectedOKLInfo={selectedOKLInfo}/>}
                    </div>
                </>
              {/*  {selectionMode === 'okl-first' && (
                    <>
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

                            {!selectedOKL  && oklList.length === 0 && (
                                <StatusHint
                                    type={selectedSuspension && selectedSurface && selectedFitting ? 'success' : 'info'}
                                >
                                    {selectedSuspension && selectedSurface && selectedFitting
                                        ? "Все фильтры выбраны! Теперь выберите ОКЛ в поле 'Огнестойкая кабельная линия'."
                                        : !selectedSuspension
                                            ? "Выберите тип кабеленесущего элемента. Если знаете марку ОКЛ — выберите сразу из списка 'Огнестойкая кабельная линия'."
                                            : !selectedSurface
                                                ? "Выберите поверхность монтажа"
                                                : "Выберите тип крепежа"
                                    }
                                </StatusHint>
                            )}
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
                            {isOKLAlreadyAdded && oklList.length > 0 && (
                                <StatusHint type="info">
                                    Вы добавили ОКЛ в конфигурацию! Можете добавить в неё кабели или выберите новую ОКЛ, введите длину и нажмите "+ Добавить ОКЛ".
                                </StatusHint>
                            )}
                            <Button
                                title="Добавить ОКЛ"
                                onClick={handleAddOKL}
                                disabled={!selectedOKL || meter < 1 || isOKLAlreadyAdded}
                            />


                             СЧЁТЧИК ПОД КНОПКОЙ
                            <CounterBadge
                                label="Добавлено ОКЛ"
                                value={oklList.length}
                                highlight={justAdded}
                            />

                            {!selectedOKL  && oklList.length === 0 && (
                                <StatusHint type="info">
                                    После выбора ОКЛ введите длину в метрах и нажмите "+ Добавить ОКЛ".
                                    Затем перейдите к выбору и добавлению кабеля.
                                </StatusHint>
                            )}
                        </div>
                        <div className={styles.dropdowns}>
                            <h2>Подбор кабеля для ОКЛ</h2>
                            {!selectedOKL  && oklList.length === 0 && (
                                <StatusHint type="info">
                                    Сначала добавьте ОКЛ в карточке "Выбор марки ОКЛ"
                                </StatusHint>
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
                                title="Добавить кабель в ОКЛ"
                                onClick={handleAddCableToOKL}
                                disabled={!canAddCable || meterCable < 1}
                            />
                            {selectedCable && !canAddCable && (
                                <StatusHint type="error">
                                    Нельзя добавить кабель в выбранную ОКЛ. Можете добавить новую или удалить кабели из выбранной.
                                </StatusHint>
                            )}
                            {!selectedCable && selectedOKL && (
                                <StatusHint type="warning">
                                    Выберите кабель, чтобы добавить в ОКЛ.
                                </StatusHint>
                            )}
                            {capacityInfo && <CapacityStatus capacityStatusData={capacityStatusData} compact={false} selectedOKLInfo={selectedOKLInfo}/>}
                        </div>
                    </>)}
                 🔄 РЕЖИМ 2: СНАЧАЛА КАБЕЛЬ
                {selectionMode === 'cable-first' && (
                    <>
                        <div className={styles.dropdowns}>
                            <h2>Выбор кабеля</h2>
                            <Dropdown
                                title="Назначение кабеля"
                                items={CABLE_APPOINTMENT}
                                selectedId={selectedCableType}
                                isOpen={activeDropdown === 'cableType'}
                                onToggle={() => toggleDropdown('cableType')}
                                onSelect={handleSelect('cableType')}
                            />
                            <Dropdown
                                title="Марка кабеля"
                                items={filteredCables}
                                selectedId={selectedCableForOKL}
                                isOpen={activeDropdown === 'cableForOKL'}
                                onToggle={() => toggleDropdown('cableForOKL')}
                                onSelect={(id, name) => {
                                    setSelectedCableForOKL(id);
                                    setActiveDropdown(null);
                                }}
                                searchable={true}
                                placeholder="Поиск кабеля..."
                            />
                            {selectedOKL && (
                                <Input
                                    title="Длина кабеля в метрах"
                                    value={meterCable}
                                    onChange={(e) => setMeterCable(Number(e))}
                                    placeholder="длина в метрах"
                                />
                            )}

                            {selectedCableForOKL && (
                                <StatusHint type="success">
                                    Кабель выбран! Теперь подберите подходящую ОКЛ.
                                </StatusHint>
                            )}
                        </div>
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

                            {!selectedOKL  && oklList.length === 0 && (
                                <StatusHint
                                    type={selectedSuspension && selectedSurface && selectedFitting ? 'success' : 'info'}
                                >
                                    {selectedSuspension && selectedSurface && selectedFitting
                                        ? "Все фильтры выбраны! Теперь выберите ОКЛ в поле 'Огнестойкая кабельная линия'."
                                        : !selectedSuspension
                                            ? "Выберите тип кабеленесущего элемента. Если знаете марку ОКЛ — выберите сразу из списка 'Огнестойкая кабельная линия'."
                                            : !selectedSurface
                                                ? "Выберите поверхность монтажа"
                                                : "Выберите тип крепежа"
                                    }
                                </StatusHint>
                            )}
                        </div>
                        <div className={styles.dropdowns}>
                            <h2>Подбор ОКЛ для кабеля</h2>
                            <Dropdown
                                title="Огнестойкая кабельная линия"
                                items={availableOKLForCable}
                                selectedId={selectedOKL}
                                isOpen={activeDropdown === 'OKLForCable'}
                                onToggle={() => selectedCableForOKL && toggleDropdown('OKLForCable')}
                                onSelect={handleSelect('OKL')}
                                disabled={!selectedCableForOKL}
                                searchable={true}
                                placeholder="Поиск ОКЛ..."
                            />
                            <Input
                                title="Длина ОКЛ в метрах"
                                value={meter}
                                onChange={(e) => setMeterOKL(Number(e))}
                                placeholder="длина в метрах"
                            />
                            <Button
                                title="Добавить ОКЛ с кабелем"
                                onClick={handleAddOKLWithCable}
                                disabled={!selectedOKL || !selectedCableForOKL || meter < 1 || meterCable < 1}
                            />
                            {!selectedCableForOKL && (
                                <StatusHint type="info">
                                    Сначала выберите кабель в карточке "Выбор кабеля"
                                </StatusHint>
                            )}
                            <CounterBadge
                                label="Добавлено ОКЛ"
                                value={oklList.length}
                                highlight={justAdded}
                            />
                        </div>
                    </>
                )}*/}
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



