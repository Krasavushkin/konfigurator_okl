import React, { useState, useMemo } from 'react';
import { CABLE_APPOINTMENT, CABLES, FITTINGS, OKL, SURFACES, SUSPENSIONS } from './data';
import styles from './styles/Konfigurator.module.css';
import { Dropdown } from './Dropdown';
import { Header } from './Header';
import { Input } from './Input';
import { Button } from './Button';
import {ConfigOKL} from "./ConfigOKL";
import {OKLconfig} from "./infoOKL/OKLconfig";

type Cable = {
    id: string;
    cableTypeId: string;
    name: string;
    length: number;
};

type OKLItem = {
    id: string;
    name: string;
    length: number;
    cables: Cable[];
};

export const Konfigurator = () => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const [selectedCableType, setSelectedCableType] = useState<string>('');
    const [selectedCable, setSelectedCable] = useState<string>('');
    const [selectedSuspension, setSelectedSuspension] = useState<string>('');
    const [selectedSurface, setSelectedSurface] = useState<string>('');
    const [selectedFitting, setSelectedFitting] = useState<string>('');
    const [selectedOKL, setSelectedOKL] = useState<string>('');
    const [meter, setMeter] = useState<number>(1);
    const [meterCable, setMeterCable] = useState <number>(1)

    const [oklList, setOklList] = useState<OKLItem[]>([]);
    const [isEditingOKL, setIsEditingOKL] = useState<string | null>(null);
    const [cablesCount, setCablesCount] = useState(0)
    const filteredCables = useMemo(
        () =>
            selectedCableType
                ? CABLES.filter((c) => c.cableTypeId === selectedCableType)
                : CABLES,
        [selectedCableType]
    );
    const getCableCountInSelectedOKL = useMemo(() => {
        if (!selectedOKL) return 0;
        const selectedOkl = oklList.find(okl => okl.id === selectedOKL);
        return selectedOkl ? selectedOkl.cables.length : 0;
    }, [selectedOKL, oklList]);

    // Проверяем, можно ли добавлять кабели (максимум 8)
    const canAddCable = getCableCountInSelectedOKL < 8;

    const availableSurfaces = useMemo(
        () =>
            selectedSuspension
                ? SURFACES.filter((s) =>
                    SUSPENSIONS.find((sus) => sus.id === selectedSuspension)?.compatibleSurfaces.includes(s.id)
                )
                : SURFACES,
        [selectedSuspension]
    );

    const availableFittings = useMemo(
        () =>
            selectedSuspension && selectedSurface
                ? FITTINGS.filter((f) =>
                    SUSPENSIONS.find((s) => s.id === selectedSuspension)?.defaultFittings[selectedSurface]?.includes(f.id)
                )
                : FITTINGS,
        [selectedSuspension, selectedSurface]
    );

    const availableOKL = useMemo(
        () =>
            selectedSuspension && selectedSurface
                ? OKL.filter(
                    (o) =>
                        o.compatibleSuspensions.includes(selectedSuspension) &&
                        o.compatibleSurfaces.includes(selectedSurface)
                )
                : OKL,
        [selectedSuspension, selectedSurface]
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


    const generateUniqueId = (): string => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };
    const handleAddOKL = () => {
        if (!selectedOKL) return;
        const name = getSelectedName(OKL, selectedOKL);
        const newOKL: OKLItem = {
            id: generateUniqueId(),
            name,
            length: meter,
            cables: [],
        };
        setOklList((prev) => [...prev, newOKL]);
        setSelectedOKL(newOKL.id);    };
    const handleAddCableToOKL = () => {
        if (!selectedCable || !selectedOKL) return;

        setOklList((prev) =>
            prev.map((okl) =>
                okl.id === selectedOKL
                    ? {
                        ...okl,
                        cables: [
                            ...okl.cables,
                            {
                                id: generateUniqueId(), // Уникальный ID для каждого кабеля
                                cableTypeId: selectedCable, // ID типа кабеля для группировки
                                name: getSelectedName(CABLES, selectedCable),
                                length: meterCable
                            },
                        ],
                    }
                    : okl
            )
        );

    };

    const handleRemoveCable = (oklId: string, cableId: string) => {
        setOklList((prev) =>
            prev.map((okl) =>
                okl.id === oklId
                    ? { ...okl, cables: okl.cables.filter((c) => c.id !== cableId) }
                    : okl
            )
        );
    };

    const handleDeleteOKL = (oklId: string) => {
        setOklList(prev => prev.filter(okl => okl.id !== oklId));
    };
    const handleEditOKL = (oklId: string) => {
        setIsEditingOKL(oklId);
        // Открыть модальное окно редактирования
    };
    const handleAddCable = (oklId: string) => {
        // Установить выбранную ОКЛ и открыть форму добавления кабеля
        setSelectedOKL(oklId);
    };


    const handleSaveConfig = () => {
        console.log('Сохраняем конфигурацию:', {
            suspension: getSelectedName(SUSPENSIONS, selectedSuspension),
            surface: getSelectedName(SURFACES, selectedSurface),
            fitting: getSelectedName(FITTINGS, selectedFitting),
            oklList,
        });
    };

    return (
        <div className={styles.container}>
            <Header />

                <div className={styles.dropdowns}>
                    <Dropdown
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
                    onChange={(e) => setMeter(Number(e))}
                    placeholder="длина в метрах"
                />
                <Button
                    title="+ Добавить ОКЛ"
                    onClick={handleAddOKL}
                    disabled={!selectedOKL || meter < 1}
                />
            </div>
                <div className={styles.dropdowns}>
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
                        disabled={!selectedCable || !canAddCable || meterCable<1}
                    />
                </div>

            <OKLconfig
                oklList={oklList}
                onRemoveCable={handleRemoveCable}
                onDeleteOKL={handleDeleteOKL}
                onEditOKL={handleEditOKL}
                onAddCable={handleAddCable}
                onSave={handleSaveConfig}
            />

            {/*{selectedFitting && (v
                <ConfigOKL
                    oklList={oklList}
                    fittingsName={getSelectedName(FITTINGS, selectedFitting)}
                    suspensionName={getSelectedName(SUSPENSIONS, selectedSuspension)}
                    surfaceName={getSelectedName(SURFACES, selectedSurface)}
                    onRemoveCable={handleRemoveCable}
                    onSave={handleSaveConfig}
                />
            )}*/}
        </div>
    );
};



