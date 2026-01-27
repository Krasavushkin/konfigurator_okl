import React, {useState} from "react";
import {Dropdown} from "./Dropdown";
import {Input} from "./Input";
import {Button} from "./Button";
import {StatusHint} from "./services/StatusHint";
import {CapacityStatus} from "./CapacityStatus";
import styles from './styles/Konfigurator2.module.css';

type CableSelectorProps = {
    selectedOKL: string;

    handleSelectCableType: (id: string) => void;
    handleSelectCable: (id: string) => void;

    availableCableAppointments: { id: string; name: string }[];
    selectedCableType: string;
    filteredCables: { id: string; name: string }[];
    selectedCable: string;
    meterCable: number;
    setMeterCable: (value: number) => void;
    handleAddCableToOKL: () => void;
    canAddCable: boolean;
    capacityInfo?: any;
    capacityStatusData?: any;
    selectedOKLInfo?: any;
};

export const CableSelector: React.FC<CableSelectorProps> = ({
                                                                selectedOKL,

                                                                handleSelectCableType,
                                                                handleSelectCable,

                                                                availableCableAppointments,
                                                                selectedCableType,
                                                                filteredCables,
                                                                selectedCable,
                                                                meterCable,
                                                                setMeterCable,
                                                                handleAddCableToOKL,
                                                                canAddCable,
                                                                capacityInfo,
                                                                capacityStatusData,
                                                                selectedOKLInfo,
                                                            }) => {

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isCableLengthTouched, setIsCableLengthTouched] = useState(false);


    const toggleDropdown = (dropdownName: string) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };
    const handleAddCable = () => {
        handleAddCableToOKL();
        setIsCableLengthTouched(false);
    };
    const closeDropdown = () => setActiveDropdown(null);
    return (
        <div className={styles.dropdowns}>
            <h2>Подбор кабеля для ОКЛ</h2>
            {!selectedOKL && (
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
                onSelect={(id) => {
                    handleSelectCableType(id);
                        closeDropdown()
                }
            }
            />
            <Dropdown
                title="Марка кабеля"
                items={filteredCables}
                selectedId={selectedCable}
                isOpen={activeDropdown === 'cable'}
                onToggle={() => toggleDropdown('cable')}
                onSelect={(id) => {
                    handleSelectCable(id);
                    closeDropdown()
                }}
                searchable
                placeholder="Поиск кабеля..."
            />
            {selectedCable && (
                <>
                    <Input
                        title="Длина в метрах"
                        value={meterCable}
                        onChange={(e) => {
                            setMeterCable(Number(e))
                            setIsCableLengthTouched(true);
                        }}
                        placeholder="Введите длину кабеля"
                        autoFocus
                        min={1}
                    />

                    {!isCableLengthTouched && canAddCable &&(
                        <StatusHint type="info">
                            Укажите длину выбранного кабеля
                        </StatusHint>
                    )}
                </>
            )}
            <Button
                title="Добавить кабель в ОКЛ"
                onClick={handleAddCable}
                disabled={!canAddCable || meterCable < 1}
            />
            {!selectedCable && selectedOKL && (
                <StatusHint type="warning">
                    Выберите кабель, чтобы добавить в ОКЛ.
                </StatusHint>
            )}
            {capacityInfo && <CapacityStatus capacityStatusData={capacityStatusData} compact={false}
                                             selectedOKLInfo={selectedOKLInfo}/>}
        </div>
    );
}

