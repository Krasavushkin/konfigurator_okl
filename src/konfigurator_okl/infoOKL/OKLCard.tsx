import React from 'react';
import {CableList} from './CableList';
import {OKLActions} from './OKLActions';
import styles from './OKLCard.module.css';
import {Link} from "./Link";
import {CapacityStatus, CapacityStatusData} from "../CapacityStatus";
import {useOKLLink} from "../../hooks/useOKLLink";
import {newOKLItem} from "../data";

export type OKL = {
    id: string;
    name: string;
    length: number;
    cables: Cable[];
    sectionOKL?: number;
    type?: string;
};


export type Cable = {
    id: string;
    cableTypeId: string;
    name: string;
    length: number;
    description?: string
};
export type NewCable = {
    id: string;
    name: string;
    cableTypeId: string;
    cores: number;
    outerDiameter: number;
    TU: string
    length: number;
};

interface OKLCardProps {
    okl: newOKLItem;
    isSelected: boolean;
    onSelect: (oklId: string) => void;
    onEdit: (oklId: string) => void;
    onDelete: (oklId: string) => void;
    onRemoveCable: (oklId: string, cableId: string) => void;
    onAddCable: (oklId: string) => void;
    onCopy: (oklId: string) => void;
    capacityStatusData?: CapacityStatusData | null;
    index: number;
}

export const OKLCard: React.FC<OKLCardProps> = ({
                                                    okl,
                                                    isSelected,
                                                    onSelect,
                                                    onEdit,
                                                    onDelete,
                                                    onRemoveCable,
                                                    onCopy,
                                                    capacityStatusData,
                                                    index,
                                                    onAddCable
                                                }) => {
    const handleCardClick = () => {
        onSelect(okl.id);
    };

    const oklLink = useOKLLink(okl.type);

    return (
        <div
            className={`${styles.oklCard} ${isSelected ? styles.selected : ''}`}
            onClick={handleCardClick}
        >
            <div className={styles.cardNumber}>
            № {index}</div>

            <h3>Наименование ОКЛ:</h3>

            <div className={styles.cardHeader}>
                <h3 className={styles.oklTitle}>
                    СПЕЦКАБЛАЙН-{okl.name} - {okl.length} м
                </h3>

                <OKLActions
                    oklId={okl.id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isSelected={isSelected}
                    onCopy={onCopy}
                />
            </div>

            {/* Статус — только в CapacityStatus */}
            <CapacityStatus
                capacityStatusData={capacityStatusData}
                compact={true}
            />

            <CableList
                cables={okl.cables}
                oklId={okl.id}
                onRemoveCable={onRemoveCable}
            />

            <div className={styles.description}>
                <h3>Описание:</h3>
                <p className={styles.descriptionText}>
                    СПЕЦКАБЛАЙН-{okl.name}-{okl.length} м
                    {okl.cables.length > 0 && (
                        <>
                            {' ('}
                            {okl.cables.map((cable, index) => (
                                <span key={cable.id}>
                        {index > 0 && " + "}
                                    {cable.name} - {cable.length}м
                    </span>
                            ))}
                            {')'}
                        </>
                    )}
                    {oklLink.link && (
                        <>
                            {' '}
                            <Link
                                href={oklLink.link}
                                className={styles.inlineLink}
                                title="Информация об ОКЛ"
                            >
                                Подробнее
                            </Link>
                        </>
                    )}
                </p>
            </div>

        </div>
    );
};
