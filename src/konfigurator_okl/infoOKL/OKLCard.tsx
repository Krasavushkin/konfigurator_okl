import React from 'react';
import { CableList } from './CableList';
import { CapacityIndicator } from './CapacityIndicator';
import { OKLActions } from './OKLActions';
import styles from './OKLCard.module.css';
import {OKL} from "../data";
import {Button} from "../Button";

export type OKL = {
    id: string;
    name: string;
    length: number;
    cables: Cable[];
};

export type Cable = {
    id: string;
    cableTypeId: string;
    name: string;
    length: number;
};

interface OKLCardProps {
    okl: OKL;
    isSelected: boolean;
    onSelect: (oklId: string) => void;
    onEdit: (oklId: string) => void;
    onDelete: (oklId: string) => void;
    onRemoveCable: (oklId: string, cableId: string) => void;
    onAddCable: (oklId: string) => void;
}

export const OKLCard: React.FC<OKLCardProps> = ({
                                                    okl,
                                                    isSelected,
                                                    onSelect,
                                                    onEdit,
                                                    onDelete,
                                                    onRemoveCable,
                                                    onAddCable
                                                }) => {
    const handleCardClick = () => {
        onSelect(okl.id);
    };

    const handleAddCableClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddCable(okl.id);
    };

    return (
        <div
            className={`${styles.oklCard} ${isSelected ? styles.selected : ''}`}
            onClick={handleCardClick}>
            <h3>Наименование ОКЛ:</h3>

            {/* Заголовок и действия */}
            <div className={styles.cardHeader}>
                <div className={styles.oklLength}>
                    <h3 className={styles.oklTitle}>
                        СПЕЦКАБЛАЙН-{okl.name} - {okl.length} м
                    </h3>
                </div>

                <OKLActions
                    oklId={okl.id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isSelected={isSelected}
                />
            </div>

            {/* Индикатор заполнения */}
            <CapacityIndicator cableCount={okl.cables.length} />

            {/* Список кабелей */}
            <CableList
                cables={okl.cables}
                oklId={okl.id}
                onRemoveCable={onRemoveCable}
            />
            {/* Кнопка добавления кабеля */}
            {okl.cables.length < 8 && (
               <button
                    className={styles.addCableBtn}
                    onClick={handleAddCableClick}
                    title="Добавить кабель"
                > Нажмите на кнопку для добавления кабеля в ОКЛ
                </button>


            )}
            <div className={styles.description}>
                <h3 >Описание:</h3>
                <span>
                    СПЕЦКАБЛАЙН-{okl.name}-{okl.length} м </span>
                ({okl.cables.map((cable, index) => (
                <span key={cable.id} className={styles.cableItem}>
                             {index > 0 && " + "}
                    {cable.name} - {cable.length}м
                            </span> ))})
                <div className={styles.details}>
                    <a href={'https://spetskabel.ru/products/lines/gf-gl/'}>Подробнее</a>
                </div>

            </div>
        </div>
    );
};