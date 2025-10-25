// components/CapacityStatus.tsx
import React from 'react';
import styles from './CapacityStatus.module.css';

export interface CapacityInfo {
    cableCount: number;
    usedArea: number;
    maxArea: number;
    freeArea: number;
    isFull: boolean;
}

interface CapacityStatusProps {
    capacityInfo?: CapacityInfo | null;
    className?: string;
    compact?: boolean;
}

export const CapacityStatus: React.FC<CapacityStatusProps> = ({
                                                                  capacityInfo,
                                                                  className = '',
                                                                  compact = false
                                                              }) => {
    // 🔧 ЛОГИКА ВЫНЕСЕНА НЕПОСРЕДСТВЕННО В КОМПОНЕНТ
    const getStatus = (): 'add-cable' | 'almost-full' | 'full' => {
        if (!capacityInfo) return 'add-cable';

        const isFull = capacityInfo.cableCount >= 8 || capacityInfo.usedArea >= capacityInfo.maxArea;
        const isAlmostFull = capacityInfo.cableCount >= 6 || capacityInfo.usedArea >= capacityInfo.maxArea * 0.8;

        if (isFull) return 'full';
        if (isAlmostFull) return 'almost-full';
        return 'add-cable';
    };

    const getStatusText = (status: 'add-cable' | 'almost-full' | 'full'): string => {
        switch (status) {
            case 'full': return 'Заполнено';
            case 'almost-full': return 'Почти заполнено';
            default: return 'Добавьте кабель';
        }
    };

    if (!capacityInfo) {
        return (
            <div className={`${styles.capacityInfo} ${className}`}>
                <div className={styles.capacityRow}>
                    <span>Статус:</span>
                    <span className={styles.noData}>Нет данных</span>
                </div>
            </div>
        );
    }

    const status = getStatus();
    const statusText = getStatusText(status);
    const fillPercentage = (capacityInfo.usedArea / capacityInfo.maxArea) * 100;
    const cablePercentage = (capacityInfo.cableCount / 8) * 100;

    // 🔧 КОМПАКТНАЯ ВЕРСИЯ
    if (compact) {
        return (
            <div className={`${styles.capacityInfo} ${styles.compact} ${className}`}>
                <div className={styles.capacityRow}>
                    <span>Статус:</span>
                    <span className={
                        status === 'full' ? styles.error :
                            status === 'almost-full' ? styles.warning : styles.success
                    }>
                        {statusText}
                    </span>
                </div>
            </div>
        );
    }

    // 🔧 ПОЛНАЯ ВЕРСИЯ
    return (
        <div className={`${styles.capacityInfo} ${className}`}>
            <div className={styles.capacityRow}>
                <span>Заполненность:</span>
                <span>{fillPercentage.toFixed(1)}%</span>
            </div>

            {/* Общий статус */}
            <div className={styles.capacityRow}>
                <span>Статус:</span>
                <span className={
                    status === 'full' ? styles.error :
                        status === 'almost-full' ? styles.warning : styles.success
                }>
                    {status === 'full' ? "✗ заполнено" :
                        status === 'almost-full' ? "! почти заполнено" : "✓ добавьте кабель"}
                </span>
            </div>

            {/* Двойная шкала */}
            <div className={styles.doubleBar}>
                <div className={styles.barSection}>
                    <div className={styles.barLabel}>Кабели в ОКЛ</div>
                    <div className={styles.barContainer}>
                        <div
                            className={`${styles.barFill} ${styles.cableBar} ${
                                capacityInfo.cableCount >= 8 ? styles.danger :
                                    capacityInfo.cableCount >= 6 ? styles.warning : styles.success
                            }`}
                            style={{ width: `${cablePercentage}%` }}
                        >
                            <span className={styles.barText}>{capacityInfo.cableCount}/8</span>
                        </div>
                    </div>
                </div>

                <div className={styles.barSection}>
                    <div className={styles.barLabel}>Заполненность ОКЛ</div>
                    <div className={styles.barContainer}>
                        <div
                            className={`${styles.barFill} ${styles.volumeBar} ${
                                capacityInfo.usedArea >= capacityInfo.maxArea ? styles.danger :
                                    capacityInfo.usedArea >= capacityInfo.maxArea * 0.8 ? styles.warning : styles.success
                            }`}
                            style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                        >
                            <span className={styles.barText}>{fillPercentage.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};