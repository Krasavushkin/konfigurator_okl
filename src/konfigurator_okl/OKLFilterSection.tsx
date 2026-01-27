import {Dropdown} from "./Dropdown";
import styles from './styles/Konfigurator2.module.css';
import {SUSPENSIONS} from "../data/SUSPENSIONS";
import {StatusHint} from "./services/StatusHint";
import React, {useState} from "react";
import {Button} from "./Button";


type Item = { id: string; name: string };
type OKLFilterType = {
    selectedSuspension: string | null;
    selectedSurface: string | null;
    selectedFitting: string | null;
    selectedOKL: string | null;

    availableSurfaces: Item[];
    availableFittings: Item[];
    availableOKL: Item[];

    onSelectSuspension: (id: string) => void;
    onSelectSurface: (id: string) => void;
    onSelectFitting: (id: string) => void;
    resetFilters: () => void

}
export const OKLFilterSection: React.FC<OKLFilterType> = ({
                                     selectedSuspension,
                                     selectedSurface,
                                     selectedFitting,
                                     selectedOKL,

                                     availableSurfaces,
                                     availableFittings,
                                     availableOKL,

                                     onSelectSuspension,
                                     onSelectSurface,
                                     onSelectFitting,

                                     resetFilters
                                    }) => {

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleDropdown = (dropdownName: string) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };

    const closeDropdown = () => setActiveDropdown(null);
    return (
        <div className={styles.dropdowns}>
            <h2>Фильтры для подбора ОКЛ</h2>
            {!selectedOKL && (
                <StatusHint
                    type={selectedSuspension && selectedSurface && selectedFitting ? 'success' : 'info'}
                >
                    {selectedSuspension && selectedSurface && selectedFitting
                        ? `Все фильтры выбраны! Найдено ${availableOKL.length} ОКЛ. Теперь выберите ОКЛ в поле 'Огнестойкая кабельная линия'.`
                        : !selectedSuspension
                            ? `Выберите тип кабеленесущего элемента или выберите марку ОКЛ из списка "Огнестойкая кабельная линия"`
                            : !selectedSurface
                                ? `Выберите поверхность монтажа. Доступно ${availableOKL.length} ОКЛ.`
                                : `Выберите тип крепежа. Доступно ${availableOKL.length} ОКЛ.`
                    }
                </StatusHint>
            )}
            <Dropdown
                id="dropdown-suspension"
                title="Тип кабеленесущего элемента"
                items={SUSPENSIONS}
                selectedId={selectedSuspension}
                isOpen={activeDropdown === 'suspension'}
                onToggle={() => toggleDropdown('suspension')}
                onSelect={(id) => {
                    onSelectSuspension (id);
                    closeDropdown();
                }}
            />
            <Dropdown
                title="Поверхность монтажа"
                items={availableSurfaces}
                selectedId={selectedSurface}
                isOpen={activeDropdown === 'surface'}
                onToggle={() => selectedSuspension && toggleDropdown('surface')}
                onSelect={(id) => {
                    onSelectSurface (id);
                    closeDropdown();
                }}
                disabled={!selectedSuspension}

            />
            <Dropdown
                title="Тип крепежа"
                items={availableFittings}
                selectedId={selectedFitting}
                isOpen={activeDropdown === 'fitting'}
                onToggle={() => selectedSurface && toggleDropdown('fitting')}
                onSelect={(id) => {
                    onSelectFitting (id);
                    closeDropdown();
                }}
                disabled={!selectedSurface}
            />

            {(selectedSuspension || selectedSurface || selectedFitting) && (
                <Button
                    title="Сбросить фильтры"
                    onClick={resetFilters}
                />
            )}
        </div>
    );
};