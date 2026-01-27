import React from 'react';
import styles from '../styles/OKL.module.css';
import {Cable, NewCable} from "../../data/data";

interface CableListProps {
    cables: NewCable[];
    oklId: string;
    onRemoveCable: (oklId: string, cableId: string) => void;
}

export const CableList: React.FC<CableListProps> = ({
                                                        cables,
                                                        oklId,
                                                        onRemoveCable
                                                    }) => {
    if (cables.length === 0) {
        return (
            <div className={styles.emptyMessage}>
                Нет добавленных кабелей
            </div>
        );
    }

    return (
        <div className={styles.cableList}>
            {cables.slice(0, 8).map((cable, index) => (
                <div key={cable.id} className={styles.cableItem}>
                    <span className={styles.cableNumber}>{index + 1}.</span>
                    <span className={styles.cableInfo}>
                        {cable.name} - {cable.length} м
                    </span>
                    <button
                        className={styles.removeBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveCable(oklId, cable.id);
                        }}
                        title="Удалить кабель"
                    >
                        ✕
                    </button>
                </div>
            ))}

            {cables.length > 8 && (
                <div className={styles.limitMessage}>
                    Показано 8 из {cables.length} кабелей
                </div>
            )}
        </div>
    );
};