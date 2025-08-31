import React from 'react';
import styles from './CapacityIndicator.module.css';

interface CapacityIndicatorProps {
    cableCount: number;
}

export const CapacityIndicator: React.FC<CapacityIndicatorProps> = ({ cableCount }) => {
    const isFull = cableCount >= 8;
    const percentage = (cableCount / 8) * 100;

    return (
        <div className={styles.capacityIndicator}>
            <div className={styles.capacityLabel}>
                Кабелей: {cableCount}/8
                {isFull && (
                    <span className={styles.fullBadge}>
                        ✓ Заполнено
                    </span>
                )}
            </div>
            <div className={styles.capacityBar}>
                <div
                    className={styles.capacityFill}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};