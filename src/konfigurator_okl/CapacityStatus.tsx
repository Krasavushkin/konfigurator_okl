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
    availableCables?: any[];
}


export const CapacityStatus: React.FC<CapacityStatusProps> = ({
                                                                  capacityInfo,
                                                                  className = '',
                                                                  compact = false,
                                                                  availableCables = []
                                                              }) => {
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

    // 🔧 УЛУЧШЕННАЯ ФУНКЦИЯ С ТИПАМИ ПРИЧИН
    const getRealStatus = (): {
        status: 'add-cable' | 'almost-full' | 'full';
        reason?: string;
        reasonType?: 'volume' | 'cable-count' | 'no-space-for-cables';
    } => {
        if (capacityInfo.cableCount >= 8) {
            return {
                status: 'full',
                reason: 'Достигнут лимит кабелей',
                reasonType: 'cable-count'
            };
        }

        if (capacityInfo.usedArea >= capacityInfo.maxArea) {
            return {
                status: 'full',
                reason: 'Объем полностью заполнен',
                reasonType: 'volume'
            };
        }

        if (availableCables.length > 0) {
            const freeArea = capacityInfo.maxArea - capacityInfo.usedArea;
            const canAddAnyCable = availableCables.some(cable => {
                if (!cable.outerDiameter) return false;
                const cableArea = Math.PI * Math.pow(cable.outerDiameter / 2, 2);
                return cableArea <= freeArea;
            });

            if (!canAddAnyCable) {
                return {
                    status: 'full',
                    reason: 'В ОКЛ недостаточно места для любого доступного кабеля. Добавьте новую ОКЛ в конфигурацию или удалите кабель из выбранной.',
                    reasonType: 'no-space-for-cables'
                };
            }
        }

        const isAlmostFull = capacityInfo.cableCount >= 6 || capacityInfo.usedArea >= capacityInfo.maxArea * 0.8;
        return {
            status: isAlmostFull ? 'almost-full' : 'add-cable',
            reasonType: isAlmostFull ? 'volume' : undefined
        };
    };

    const realStatus = getRealStatus();

    const getStatusText = (): string => {
        switch (realStatus.status) {
            case 'full': return 'ОКЛ заполнена';
            case 'almost-full': return 'Почти заполнена';
            default: return 'Готова к заполнению';
        }
    };

    // 🔧 УМНАЯ ЛОГИКА ДЛЯ ОТОБРАЖЕНИЯ ПРОЦЕНТОВ
    const getDisplayPercentage = (): number => {
        if (realStatus.status === 'full') {
            // Показываем 100% только при проблемах с объемом
            if (realStatus.reasonType === 'volume' || realStatus.reasonType === 'no-space-for-cables') {
                return 100;
            }
            // При лимите кабелей показываем реальный процент объема
        }

        return Math.min((capacityInfo.usedArea / capacityInfo.maxArea) * 100, 100);
    };

    const displayPercentage = getDisplayPercentage();
    const statusText = getStatusText();

    // 🔧 КОМПАКТНАЯ ВЕРСИЯ
    if (compact) {
        return (
            <div className={`${styles.capacityInfo} ${styles.compact} ${className}`}>
                <div className={styles.capacityRow}>
                    <span>Статус:</span>
                    <span className={
                        realStatus.status === 'full' ? styles.error :
                            realStatus.status === 'almost-full' ? styles.warning : styles.success
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
            <h3>Выбранная ОКЛ</h3>
            <div className={styles.capacityRow}>
                <span>Статус:</span>
                <span className={
                    realStatus.status === 'full' ? styles.error :
                        realStatus.status === 'almost-full' ? styles.warning : styles.success
                }>
                    {statusText}
                </span>
            </div>
            <div className={styles.capacityRow}>
                <span>Заполненность:</span>
                <span>
                    {displayPercentage.toFixed(0)}%
                </span>
            </div>
            {realStatus.status === 'full' && realStatus.reason && (
                <div className={styles.fullReason}>
                    <span>{realStatus.reason}</span>
                </div>
            )}

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
                            style={{ width: `${(capacityInfo.cableCount / 8) * 100}%` }}
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
                                realStatus.status === 'full' ? styles.danger :
                                    realStatus.status === 'almost-full' ? styles.warning : styles.success
                            }`}
                            style={{ width: `${displayPercentage}%` }}
                        >
                            <span className={styles.barText}>{displayPercentage.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/*
export const CapacityStatus: React.FC<CapacityStatusProps> = ({
                                                                  capacityInfo,
                                                                  className = '',
                                                                  compact = false,
                                                                  availableCables = []
                                                              }) => {
    // 🔧 ЛОГИКА ВЫНЕСЕНА НЕПОСРЕДСТВЕННО В КОМПОНЕНТ
    const getRealStatus = (): { status: 'add-cable' | 'almost-full' | 'full'; reason?: string } => {
        if (!capacityInfo) return { status: 'add-cable' };

        // Если достигнут лимит кабелей - точно заполнено
        if (capacityInfo.cableCount >= 8) {
            return { status: 'full', reason: 'Достигнут лимит кабелей' };
        }

        // Если объем полностью заполнен - точно заполнено
        if (capacityInfo.usedArea >= capacityInfo.maxArea) {
            return { status: 'full', reason: 'Объем полностью заполнен' };
        }

        // 🔧 ПРОВЕРКА: можно ли добавить ХОТЯ БЫ ОДИН кабель из доступных
        if (availableCables.length > 0) {
            const freeArea = capacityInfo.maxArea - capacityInfo.usedArea;
            const canAddAnyCable = availableCables.some(cable => {
                if (!cable.outerDiameter) return false;
                const cableArea = Math.PI * Math.pow(cable.outerDiameter / 2, 2);
                return cableArea <= freeArea;
            });

            if (!canAddAnyCable) {
                return {
                    status: 'full',
                    reason: 'В ОКЛ недостаточно места для любого кабеля'
                };
            }
        }

        // Стандартная логика для почти заполненного состояния
        const isAlmostFull = capacityInfo.cableCount >= 6 || capacityInfo.usedArea >= capacityInfo.maxArea * 0.8;
        return { status: isAlmostFull ? 'almost-full' : 'add-cable' };
    };

    const realStatus = getRealStatus();

    const getStatusText = (): string => {
        switch (realStatus.status) {
            case 'full': return 'ОКЛ заполнена';
            case 'almost-full': return 'Почти заполнена';
            default: return 'Готова к заполнению';
        }
    };

    // 🔧 ЕСЛИ ОКЛ ЗАПОЛНЕНА - ПОКАЗЫВАЕМ 100% ЗАПОЛНЕННОСТЬ
    if (!capacityInfo) {
        return <div className={`${styles.capacityInfo} ${className}`}>Нет данных</div>;
    }
    const getDisplayPercentage = (): number => {
        if (realStatus.status === 'full') return 100;
        return Math.min((capacityInfo.usedArea / capacityInfo.maxArea) * 100, 100);
    };



    const displayPercentage = getDisplayPercentage();
    const statusText = getStatusText();
    const fillPercentage = (capacityInfo.usedArea / capacityInfo.maxArea) * 100;
    const cablePercentage = (capacityInfo.cableCount / 8) * 100;


    // 🔧 КОМПАКТНАЯ ВЕРСИЯ
    if (compact) {
        return (
            <div className={`${styles.capacityInfo} ${styles.compact} ${className}`}>
                <div className={styles.capacityRow}>
                    <span>Заполненность ОКЛ кабелем:</span>
                    <span className={
                        realStatus.status === 'full' ? styles.error :
                            realStatus.status === 'almost-full' ? styles.warning : styles.success
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
                <span>Выбранная ОКЛ:</span>
                <span className={
                    realStatus.status === 'full' ? styles.error :
                        realStatus.status === 'almost-full' ? styles.warning : styles.success
                }>
                    {statusText}
                </span>
            </div>
            <div className={styles.capacityRow}>
                <span>Заполненность:</span>
                <span>
                    {displayPercentage.toFixed(1)}%
                    {realStatus.status === 'full' && capacityInfo.usedArea < capacityInfo.maxArea}
                </span>
            </div>



            {/!* 🔧 ПОЯСНЕНИЕ ЕСЛИ ОКЛ ЗАПОЛНЕНА *!/}
            {realStatus.status === 'full' && realStatus.reason && (
                <div className={styles.fullReason}>
                    <span>{realStatus.reason}</span>
                </div>
            )}

            {/!* Двойная шкала *!/}
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
                                realStatus.status === 'full' ? styles.danger :
                                    realStatus.status === 'almost-full' ? styles.warning : styles.success
                            }`}
                            style={{
                                width: `${displayPercentage}%`
                            }}
                        >
                            <span className={styles.barText}>{displayPercentage.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};*/
