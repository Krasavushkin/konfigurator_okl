import React from 'react';
import {CableList} from './CableList';
import {OKLActions} from './OKLActions';
import styles from '../styles/OKLCard.module.css';
import {Link} from "./Link";
import {CapacityStatus, CapacityStatusData} from "../CapacityStatus";
import {useOKLLink} from "../../hooks/useOKLLink";
import {newOKLItem} from "../../data/data";




interface OKLCardProps {
    okl: newOKLItem;
    isSelected: boolean;
    onSelect: (oklId: string) => void;
    onDelete: (oklId: string) => void;
    onRemoveCable: (oklId: string, cableId: string) => void;
    onCopy: (oklId: string) => void;
    capacityStatusData?: CapacityStatusData | null;
    index: number;
}

export const OKLCard: React.FC<OKLCardProps> = ({
                                                    okl,
                                                    isSelected,
                                                    onSelect,
                                                    onDelete,
                                                    onRemoveCable,
                                                    onCopy,
                                                    capacityStatusData,
                                                    index,

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
