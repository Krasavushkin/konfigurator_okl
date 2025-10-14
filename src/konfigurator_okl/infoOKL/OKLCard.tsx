import React from 'react';
import {CableList} from './CableList';
import {CapacityIndicator} from './CapacityIndicator';
import {OKLActions} from './OKLActions';
import styles from './OKLCard.module.css';
import {OKL} from "../data";
import {Link} from "./Link";

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
    description?: string
};

interface OKLCardProps {
    okl: OKL;
    isSelected: boolean;
    onSelect: (oklId: string) => void;
    onEdit: (oklId: string) => void;
    onDelete: (oklId: string) => void;
    onRemoveCable: (oklId: string, cableId: string) => void;
    onAddCable: (oklId: string) => void;
    onCopy: (oklId: string) => void;
}

export const OKLCard: React.FC<OKLCardProps> = ({
                                                    okl,
                                                    isSelected,
                                                    onSelect,
                                                    onEdit,
                                                    onDelete,
                                                    onRemoveCable,
                                                    onCopy
                                                }) => {
    const handleCardClick = () => {
        onSelect(okl.id);
    };

    return (
        <div
            className={`${styles.oklCard} ${isSelected ? styles.selected : ''}`}
            onClick={handleCardClick}
        >
          {/*   Индикатор выбора
            {isSelected && (
                <div className={styles.selectionIndicator}>
                    <span>✓</span>
                    Выбрано для добавления кабелей
                </div>
            )}
*/}
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
                    onCopy={onCopy}
                />
            </div>

            {/* Остальной код без изменений */}
            <CapacityIndicator cableCount={okl.cables.length}/>

            <CableList
                cables={okl.cables}
                oklId={okl.id}
                onRemoveCable={onRemoveCable}
            />

            <div className={styles.description}>
                <h3>Описание:</h3>
                <span>
                    СПЕЦКАБЛАЙН-{okl.name}-{okl.length} м
                </span>
                ({okl.cables.map((cable, index) => (
                <span key={cable.id} className={styles.cableItem}>
                        {index > 0 && " + "}
                    {cable.name} - {cable.length}м
                    </span>
            ))})

                <Link
                    href={"https://spetskabel.ru/products/lines/gf-gl/"}
                    className={styles.details}
                    title={"Информация об ОКЛ"}
                >
                    Подробнее
                </Link>
            </div>
        </div>
    );
};

{/* Кнопка добавления кабеля */}
{/*  {okl.cables.length < 8 && (
               <button
                    className={styles.addCableBtn}
                    onClick={handleAddCableClick}
                    title="Добавить кабель"
                > Нажмите на кнопку для добавления кабеля в ОКЛ
                </button>


            )}*/}

/*  const handleAddCableClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddCable(okl.id);
    };*/