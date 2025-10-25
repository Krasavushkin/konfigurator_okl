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

   /* const canAddCable = useMemo(() =>
            selectedOKL && selectedCable ? canAddCableToOKL(selectedOKL, selectedCable) : false,
        [selectedOKL, selectedCable, oklList]);*/
    const cableValidation = useMemo(() =>
            selectedOKL && selectedCable ? canAddCableToOKL(selectedOKL, selectedCable) : { canAdd: false },
        [selectedOKL, selectedCable, oklList]);

    const canAddCable = cableValidation.canAdd;



    const handleSaveConfig = () => {
        console.log('Сохраняем конфигурацию:', {
            suspension: getSelectedName(SUSPENSIONS, selectedSuspension),
            surface: getSelectedName(SURFACES, selectedSurface),
            fitting: getSelectedName(FITTINGS, selectedFitting),
            oklList,
        });
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
                    {selectedCable && !canAddCable && cableValidation.reason && (
                        <div className={styles.validationError}>
                            <div className={styles.errorIcon}>⚠</div>
                            <div className={styles.errorText}>
                                <strong>Нельзя добавить кабель:</strong>
                                <span>{cableValidation.reason}</span>
                            </div>
                        </div>
                    )}
                    {capacityInfo && <CapacityStatus capacityInfo={capacityInfo} availableCables={filteredCables}/>}
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



