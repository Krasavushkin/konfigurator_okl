import React, {useState} from "react";
import { Dropdown } from "./Dropdown";
import { Input } from "./Input";
import { Button } from "./Button";
import { StatusHint } from "./services/StatusHint";
import {CounterBadge} from "./services/CounterBadge";
import styles from './styles/Konfigurator2.module.css';


type OKLSelectorProps = {
    selectedOKL: string;
    availableOKL: { id: string; name: string }[];
    handleSelect: (id: string) => void;
    meter: number;
    setMeterOKL: (value: number) => void;
    handleAddOKL: () => void;
    isOKLAlreadyAdded: boolean;
    oklListLength: number;
    justAdded: boolean;
};

export const OKLSelector: React.FC<OKLSelectorProps> = ({
                                                            selectedOKL,
                                                            availableOKL,

                                                            handleSelect,
                                                            meter,
                                                            setMeterOKL,
                                                            handleAddOKL,
                                                            isOKLAlreadyAdded,
                                                            oklListLength,
                                                            justAdded,
                                                        }) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleDropdown = (dropdownName: string) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };
    const closeDropdown = () => setActiveDropdown(null);

    return (
        <div className={styles.dropdowns}>
            <h2>Выбор марки ОКЛ</h2>
            <Dropdown
                title="Огнестойкая кабельная линия"
                items={availableOKL}
                selectedId={selectedOKL}
                isOpen={activeDropdown === 'OKL'}
                onToggle={() => toggleDropdown('OKL')}
                onSelect={(id) => {
                    handleSelect(id);
                    closeDropdown()}
            }
                searchable
                placeholder="Поиск ОКЛ..."
            />
            {selectedOKL && (
                <>
                    <Input
                        title="Длина в метрах"
                        value={meter}
                        onChange={(e) => setMeterOKL(Number(e))}
                        placeholder="Введите длину"
                        autoFocus
                    />

                    {!isOKLAlreadyAdded && (
                        <StatusHint type="info">
                            Укажите длину выбранной ОКЛ
                        </StatusHint>
                    )}
                </>
            )}


            {isOKLAlreadyAdded && oklListLength > 0 && (
                <StatusHint type="info">
                    Вы добавили ОКЛ в спецификацию! Теперь в неё можно добавить кабели.
                    Или можно добавить новую ОКЛ, а кабели подобрать позже.
                    Перед добавлением новой ОКЛ обратите внимание на фильтры,
                    их можно сбросить при необходимости.
                </StatusHint>
            )}
            <Button
                title="Добавить ОКЛ"
                onClick={handleAddOKL}
                disabled={!selectedOKL || meter < 1 || isOKLAlreadyAdded}
            />
            <CounterBadge label="Добавлено ОКЛ" value={oklListLength} highlight={justAdded} />
        </div>
    );

}
