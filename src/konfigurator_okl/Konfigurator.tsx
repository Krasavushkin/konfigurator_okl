import React, { useState, useMemo } from 'react';
import { CABLE_APPOINTMENT, CABLES, FITTINGS, OKL, SURFACES, SUSPENSIONS } from './data';
import styles from './styles/Konfigurator.module.css';
import { Dropdown } from './Dropdown';
import { Header } from './Header';
import { Input } from './Input';
import { Button } from './Button';
import {ConfigOKL} from "./ConfigOKL";

type CableItem = {
    id: string;
    name: string;
    length: number;
};

type OKLItem = {
    id: string;
    name: string;
    length: number;
    cables: CableItem[];
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

    const filteredCables = useMemo(
        () =>
            selectedCableType
                ? CABLES.filter((c) => c.cableTypeId === selectedCableType)
                : CABLES,
        [selectedCableType]
    );

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

    const handleAddOKL = () => {
        if (!selectedOKL) return;
        const name = getSelectedName(OKL, selectedOKL);
        const newOKL: OKLItem = {
            id: selectedOKL,
            name,
            length: meter,
            cables: [],
        };
        setOklList((prev) => [...prev, newOKL]);
    };

    const handleAddCableToOKL = () => {
        if (!selectedCable || !selectedOKL) return;
        setOklList((prev) =>
            prev.map((okl) =>
                okl.id === selectedOKL
                    ? {
                        ...okl,
                        cables: [
                            ...okl.cables,
                            { id: selectedCable, name: getSelectedName(CABLES, selectedCable), length: meterCable },
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
                    disabled={!selectedSurface || !selectedSuspension}
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
                    disabled={!selectedOKL || meter <= 0}
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
                        onToggle={() => selectedCableType && toggleDropdown('cable')}
                        onSelect={handleSelect('cable')}
                        disabled={!selectedCableType}
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
                        disabled={!selectedCable}
                    />
                </div>



            {selectedFitting && (
                <ConfigOKL
                    oklList={oklList}
                    fittingsName={getSelectedName(FITTINGS, selectedFitting)}
                    suspensionName={getSelectedName(SUSPENSIONS, selectedSuspension)}
                    surfaceName={getSelectedName(SURFACES, selectedSurface)}
                    onRemoveCable={handleRemoveCable}
                    onSave={handleSaveConfig}
                />
            )}
        </div>
    );
};



/*
import React, { useState, useMemo } from 'react';
import { CABLE_APPOINTMENT, CABLES, FITTINGS, OKL, SURFACES, SUSPENSIONS } from "./data";
import styles from "./styles/Konfigurator.module.css";
import { Dropdown } from "./Dropdown";
import { Header } from "./Header";
import { Input } from "./Input";
import { Button } from "./Button";
import {ConfigOKL} from "./ConfigOKL";

export const Konfigurator = () => {

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [selectedCableType, setSelectedCableType] = useState<string>('');
    const [selectedCable, setSelectedCable] = useState<string>('');
    const [selectedSuspension, setSelectedSuspension] = useState<string>('');
    const [selectedSurface, setSelectedSurface] = useState<string>('');
    const [selectedFitting, setSelectedFitting] = useState<string>('');
    const [selectedOKL, setSelectedOKL] = useState<string>('');
    const [meter, setMeter] = useState<number>(1);


    const filteredCables = useMemo(() => (
        selectedCableType
            ? CABLES.filter(c => c.cableTypeId === selectedCableType)
            : CABLES
    ), [selectedCableType]);

    const availableSurfaces = useMemo(() => (
        selectedSuspension
            ? SURFACES.filter(s =>
                SUSPENSIONS.find(sus => sus.id === selectedSuspension)?.compatibleSurfaces.includes(s.id))
            : SURFACES
    ), [selectedSuspension]);

    const availableFittings = useMemo(() => (
        selectedSuspension && selectedSurface
            ? FITTINGS.filter(f =>
                SUSPENSIONS.find(s => s.id === selectedSuspension)
                    ?.defaultFittings[selectedSurface]?.includes(f.id))
            : FITTINGS
    ), [selectedSuspension, selectedSurface]);

    const availableOKL = useMemo(() => (
        selectedSuspension && selectedSurface
            ? OKL.filter(o =>
                o.compatibleSuspensions.includes(selectedSuspension) &&
                o.compatibleSurfaces.includes(selectedSurface))
            : OKL
    ), [selectedSuspension, selectedSurface]);


    const toggleDropdown = (dropdownName: string) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };

    const handleSelect = (type: string, autoApply = true) => (id: string, name: string) => {
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
        if (autoApply) {
            setActiveDropdown(null);
        }
    };

    // Обработчики кнопок
    const handleAddCable = () => {
        console.log("Добавлен кабель:", selectedCable);
        // добавить конфигурацию
        setSelectedCable('');
    };

    const handleAddOKL = () => {
        console.log("Добавлен ОКЛ:", selectedOKL, "Длина:", meter);
        // Здесь можно добавить в массив конфигурации
        setSelectedOKL('');
        setMeter(1);
    };

    // Получение названия
    const getSelectedName = (items: { id: string, name: string }[], id: string) => {
        return items.find(item => item.id === id)?.name || 'Не выбрано';
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
                    onToggle={() => selectedCableType && toggleDropdown('cable')}
                    onSelect={handleSelect('cable', false)}
                    disabled={!selectedCableType}
                />
                <Button
                    title="+ Добавить кабель в ОКЛ"
                    onClick={handleAddCable}
                    disabled={!selectedCable}
                />
            </div>

            <div className={styles.dropdowns}>
                <Dropdown
                    title="Огнестойкая кабельная линия"
                    items={availableOKL}
                    selectedId={selectedOKL}
                    isOpen={activeDropdown === 'OKL'}
                    onToggle={() => toggleDropdown('OKL')}
                    onSelect={handleSelect('OKL', false)}
                    disabled={!selectedSurface || !selectedSuspension}
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
                    disabled={!selectedOKL || meter <= 0}
                />
            </div>

            {/!* Отображение результата *!/}
            <ConfigOKL oklList={} fittingsName={} surfaceName={}  />

        </div>
    );
};
*/



/*
import React, {useState, useMemo} from 'react';
import {CABLE_APPOINTMENT, CABLES, FITTINGS, OKL, SURFACES, SUSPENSIONS} from "./data";
import styles from "./Konfigurator.module.css";
import {Dropdown} from "./Dropdown";
import {Header} from "./Header";
import {Input} from "./Input";
import {Button} from "./Button";


export const Konfigurator = () => {
    // Состояния выбранных элементов
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [selectedCableType, setSelectedCableType] = useState<string>('');
    const [selectedCable, setSelectedCable] = useState<string>('');
    const [selectedSuspension, setSelectedSuspension] = useState<string>('');
    const [selectedSurface, setSelectedSurface] = useState<string>('');
    const [selectedFitting, setSelectedFitting] = useState<string>('');
    const [selectedOKL, setSelectedOKL] = useState<string>('');
    const [meter, setMeter] =useState<number>(1)
    // Фильтрация данных
    const filteredCables = useMemo(() => (
        selectedCableType
            ? CABLES.filter(c => c.cableTypeId === selectedCableType)
            : CABLES
    ), [selectedCableType]);


    const availableSurfaces = useMemo(() => (
        selectedSuspension
            ? SURFACES.filter(s =>
                SUSPENSIONS.find(sus => sus.id === selectedSuspension)?.compatibleSurfaces.includes(s.id))
            : SURFACES
    ), [selectedSuspension]);

    const availableFittings = useMemo(() => (
        selectedSuspension && selectedSurface
            ? FITTINGS.filter(f =>
                SUSPENSIONS.find(s => s.id === selectedSuspension)
                    ?.defaultFittings[selectedSurface]?.includes(f.id))
            : FITTINGS
    ), [selectedSuspension, selectedSurface]);

    const availableOKL = useMemo(() => (
        selectedSuspension && selectedSurface
            ? OKL.filter(o =>
                o.compatibleSuspensions.includes(selectedSuspension) &&
                o.compatibleSurfaces.includes(selectedSurface))
            : OKL
    ), [selectedSuspension, selectedSurface]);
    // Обработчики
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
                setSelectedSuspension('');
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
            case 'OKL':  // Добавлен новый case для OKL
                setSelectedOKL(id);
                break;
        }
        setActiveDropdown(null);
    };

    // Получение названия выбранного элемента
    const getSelectedName = (items: { id: string, name: string }[], id: string) => {
        return items.find(item => item.id === id)?.name || 'Не выбрано';
    };

    return (
        <div className={styles.container}>
            <Header />

            <div className={styles.experement}>
                <Dropdown
                    title="Тип кабеленесущего элемента"
                    items={SUSPENSIONS}
                    selectedId={selectedSuspension}
                    isOpen={activeDropdown === 'suspension'}
                    onToggle={() => toggleDropdown('suspension')}
                    onSelect={handleSelect('suspension')}
                    disabled={false}
                />
                <Dropdown
                    title="Поверхность монтажа"
                    items={availableSurfaces}
                    selectedId={selectedSurface}
                    isOpen={activeDropdown === 'surface'}
                    onToggle={() => selectedSuspension && toggleDropdown('surface')}
                    onSelect={handleSelect('surface')}
                    disabled={false}
                />

                <Dropdown
                    title="Тип крепежа"
                    items={availableFittings}
                    selectedId={selectedFitting}
                    isOpen={activeDropdown === 'fitting'}
                    onToggle={() => selectedSurface && toggleDropdown('fitting')}
                    onSelect={handleSelect('fitting')}
                    disabled={false}
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

                {/!* Выбор кабеля *!/}
                <Dropdown
                    title="Марка кабеля"
                    items={filteredCables}
                    selectedId={selectedCable}
                    isOpen={activeDropdown === 'cable'}
                    onToggle={() => selectedCableType && toggleDropdown('cable')}
                    onSelect={handleSelect('cable')}
                    disabled={false}
                />
                <Button title={"Добавить кабель в ОКЛ"} />


            </div>
            <div className={styles.okl}>
                <Dropdown
                    title="Огнестойкая кабельная линия"
                    items={availableOKL}
                    selectedId={selectedOKL}
                    isOpen={activeDropdown === 'OKL'}
                    onToggle={() => toggleDropdown('OKL')}
                    onSelect={handleSelect('OKL')}
                    disabled={false}
                />
               <Input title={"Длина в метрах"} value={meter} onChange={()=>{}} placeholder={"длина в метрах"} />
                <Button title={"Добавить ОКЛ"} />

            </div>
            {/!* Отображение результата *!/}
            {selectedFitting && (
                <div className={styles.result}>
                    <h3>Выбранная конфигурация:</h3>
                    <ul>
                        <li><strong>Кабель:</strong> {getSelectedName(CABLES, selectedCable)}</li>
                        <li><strong>Подвес:</strong> {getSelectedName(SUSPENSIONS, selectedSuspension)}</li>
                        <li><strong>Поверхность:</strong> {getSelectedName(SURFACES, selectedSurface)}</li>
                        <li><strong>Крепление:</strong> {getSelectedName(FITTINGS, selectedFitting)}</li>
                        <li><strong>ОКЛ:</strong> {getSelectedName(OKL, selectedOKL)}</li>
                    </ul>
                    <button className={styles.saveButton}>Сохранить конфигурацию</button>
                </div>
            )} 
        </div>
    );
};
*/
