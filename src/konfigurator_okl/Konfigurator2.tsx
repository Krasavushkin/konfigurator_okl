import React, {useState, useMemo} from 'react';
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
        getCompatibleCableAppointments
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

        canAddCableToOKL, // 🔧 ИСПОЛЬЗУЕМ НОВЫЕ ФУНКЦИИ
        getOKLCapacityInfo
    } = useOKLManager();

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const [selectedSuspension, setSelectedSuspension] = useState<string>('');
    const [selectedSurface, setSelectedSurface] = useState<string>('');
    const [selectedFitting, setSelectedFitting] = useState<string>('');

    const [selectedCableType, setSelectedCableType] = useState<string>('');
    const [selectedCable, setSelectedCable] = useState<string>('');

    const [meter, setMeterOKL] = useState<number>(1);
    const [meterCable, setMeterCable] = useState<number>(1);

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
        return getCompatibleCableAppointments(selectedOKL);
    }, [selectedOKL]);

//... Выбор доступного кабеля
    const filteredCables = useMemo(
        () =>
            selectedCableType
                ? getCablesByType(selectedCableType)
                : allCables,
        [selectedCableType, allCables]
    );


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
    // добавленные
    const handleSelectOKL = (oklType: string) => {
        const cables = getCompatibleCables(oklType);
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

    const canAddCable = useMemo(() =>
            selectedOKL && selectedCable ? canAddCableToOKL(selectedOKL, selectedCable) : false,
        [selectedOKL, selectedCable, oklList]);

    const handleSaveConfig = () => {
        console.log('Сохраняем конфигурацию:', {
            suspension: getSelectedName(SUSPENSIONS, selectedSuspension),
            surface: getSelectedName(SURFACES, selectedSurface),
            fitting: getSelectedName(FITTINGS, selectedFitting),
            oklList,
        });
    };
    const getCapacityClass = (fillPercentage: number, cableCount: number) => {
        if (cableCount >= 8 || fillPercentage >= 1) return styles.full;
        if (fillPercentage >= 0.8) return styles.high;
        if (fillPercentage >= 0.6 || cableCount >= 6) return styles.medium;
        return styles.low;
    };

    return (
        <>
            <Header/>
            <div className={styles.container}>


                <div className={styles.dropdowns}>
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
                </div>
                <div className={styles.dropdowns}>
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
                </div>
                <div className={styles.dropdowns}>
                    {/*     <NumSelector title={"Время работы ОКЛ в минутах"} value={1} data={TIME_OF_WORK} onChange={()=>{}} />
*/}
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
                    <CapacityStatus capacityInfo={capacityInfo} />
                    {/*{capacityInfo && (
                        <div className={styles.capacityInfo}>
                             Строка с количеством кабелей
                            <div className={styles.capacityRow}>
                                <span>Кабелей: {capacityInfo.cableCount}/8</span>
                                <span className={
                                    capacityInfo.cableCount >= 8 ? styles.error :
                                        capacityInfo.cableCount >= 6 ? styles.warning : styles.success
                                }>
                {capacityInfo.cableCount >= 8 ? "✗ лимит" :
                    capacityInfo.cableCount >= 6 ? "⚠ почти заполнено" : "✓ можно добавить"}
            </span>
                            </div>

                             Горизонтальная шкала заполнения
                            <div className={styles.capacitySection}>
                                <div className={styles.capacityRow}>
                                    <span>Заполнение объема:</span>
                                    <span>{((capacityInfo.usedArea / capacityInfo.maxArea) * 100).toFixed(1)}%</span>
                                </div>

                                <div className={styles.capacityBar}>
                                    <div
                                        className={`${styles.capacityFill} ${
                                            capacityInfo.usedArea / capacityInfo.maxArea > 0.8 ? styles.danger :
                                                capacityInfo.usedArea / capacityInfo.maxArea > 0.6 ? styles.warning : ''
                                        }`}
                                        style={{
                                            width: `${Math.min((capacityInfo.usedArea / capacityInfo.maxArea) * 100, 100)}%`
                                        }}
                                    >
                                        <span className={styles.capacityText}>
                                            {capacityInfo.usedArea.toFixed(1)} мм²
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.capacityStats}>
                                    <span>0%</span>
                                    <span>Свободно: {capacityInfo.freeArea.toFixed(1)} мм²</span>
                                    <span>100%</span>
                                </div>
                            </div>

                            Детальная информация
                            <div className={styles.capacityDetails}>
                                <div className={styles.capacityRow}>
                                    <span>Объем ОКЛ:</span>
                                    <span className={styles.success}>{capacityInfo.maxArea.toFixed(1)} мм²</span>
                                </div>
                                <div className={styles.capacityRow}>
                                    <span>Занято:</span>
                                    <span>{capacityInfo.usedArea.toFixed(1)} мм²</span>
                                </div>
                                <div className={styles.capacityRow}>
                                    <span>Свободно:</span>
                                    <span className={
                                        capacityInfo.freeArea < capacityInfo.maxArea * 0.2 ? styles.error :
                                            capacityInfo.freeArea < capacityInfo.maxArea * 0.4 ? styles.warning : styles.success
                                    }>
                    {capacityInfo.freeArea.toFixed(1)} мм²
                </span>
                                </div>
                            </div>
                        </div>
                    )}*/}
                    {/*{capacityInfo && (
                        <div className={styles.capacityInfo}>
                            <div className={styles.capacityRow}>
                                <span>Заполненность:</span>
                                <span>{((capacityInfo.usedArea / capacityInfo.maxArea) * 100).toFixed(1)}%</span>
                            </div>
                             Общий статус
                            <div className={styles.capacityRow}>
                                <span>Статус:</span>
                                <span className={
                                    capacityInfo.cableCount >= 8 || capacityInfo.usedArea >= capacityInfo.maxArea ? styles.error :
                                        capacityInfo.cableCount >= 6 || capacityInfo.usedArea >= capacityInfo.maxArea * 0.8 ? styles.warning : styles.success
                                }>
                                    {capacityInfo.cableCount >= 8 || capacityInfo.usedArea >= capacityInfo.maxArea ? "✗ заполнено" :
                                        capacityInfo.cableCount >= 6 || capacityInfo.usedArea >= capacityInfo.maxArea * 0.8 ? "! почти заполнено" :
                                            "✓ добавьте кабель"}

                                </span>
                            </div>
                             Двойная шкала
                            <div className={styles.doubleBar}>
                                <div className={styles.barSection}>
                                    <div className={styles.barLabel}>Кабели в ОКЛ</div>
                                    <div className={styles.barContainer}>
                                        <div
                                            className={`${styles.barFill} ${styles.cableBar} ${
                                                capacityInfo.cableCount >= 8 ? styles.danger :
                                                    capacityInfo.cableCount >= 6 ? styles.warning : styles.success
                                            }`}
                                            style={{ width: `${(capacityInfo.cableCount / 8) * 100}%` }}
                                        >
                                            <span className={styles.barText}>{capacityInfo.cableCount}/8</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.barSection}>
                                    <div className={styles.barLabel}>Заполненность ОКЛ</div>
                                    <div className={styles.barContainer}>
                                        <div
                                            className={`${styles.barFill} ${styles.volumeBar} ${
                                                capacityInfo.usedArea >= capacityInfo.maxArea ? styles.danger :
                                                    capacityInfo.usedArea >= capacityInfo.maxArea * 0.8 ? styles.warning : styles.success
                                            }`}
                                            style={{ width: `${Math.min((capacityInfo.usedArea / capacityInfo.maxArea) * 100, 100)}%` }}
                                        >
                                            <span className={styles.barText}>{((capacityInfo.usedArea / capacityInfo.maxArea) * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    )}
                </div>*/}
                </div>
            </div>
            <OKLconfig
                oklList={oklList}
                onRemoveCable={handleRemoveCable}
                onDeleteOKL={handleDeleteOKL}
                onEditOKL={handleEditOKL}
                onAddCable={handleAddCable}
                onSave={handleSaveConfig}
                onCopyOKL={handleCopyOKL}

                getOKLCapacityInfo={getOKLCapacityInfo}
            />
        </>

    );
};



