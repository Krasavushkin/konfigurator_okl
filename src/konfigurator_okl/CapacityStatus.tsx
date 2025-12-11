import React from 'react';
import styles from './styles/CapacityStatus.module.css';

export type CapacityInfo = {
    cableCount: number;
    usedArea: number;
    maxArea: number;
    freeArea: number;
    isFull: boolean;
};

export interface CapacityStatusData {
    capacityInfo: CapacityInfo;
    hasOtherCables: boolean;
    filteredCablesCount: number;
    allCablesCount: number;
    availableFromFilteredCount: number;
    availableFromAllCount: number;
}

interface CapacityStatusProps {
    capacityStatusData?: CapacityStatusData | null;
    className?: string;
    compact?: boolean;

    selectedOKLInfo?: {
        name: string;
        index: number;
    };
}

// === СТАТУСЫ ===
type Status = 'add-cable' | 'almost-full' | 'full';
type StatusResult = {
    status: Status;
    reason?: string;
    showFilterHint?: boolean;
    availableCount?: number;
};

// === ПОМОЩНИКИ ===
const isCableLimitReached = (info: CapacityInfo) => info.cableCount >= 8;
const isVolumeFull = (info: CapacityInfo) => info.usedArea >= info.maxArea;
const isNoSpaceForAnyCable = (data: CapacityStatusData) => data.availableFromAllCount === 0;
const isNoSpaceForFiltered = (data: CapacityStatusData) =>
    data.availableFromFilteredCount === 0 && data.hasOtherCables;
const isFewFilteredCables = (data: CapacityStatusData) =>
    data.availableFromFilteredCount > 0 && data.availableFromFilteredCount <= 2;
const isAlmostFull = (info: CapacityInfo) =>
    info.cableCount >= 6 || info.usedArea >= info.maxArea * 0.8;

// === ПРАВИЛА (в порядке приоритета) ===
const statusRules: ((data: CapacityStatusData) => StatusResult | null)[] = [
    // 1. Лимит кабелей — full
    (data) =>
        isCableLimitReached(data.capacityInfo)
            ? { status: 'full', reason: 'В выбранной ОКЛ достигнут лимит кабелей (8), отсутствует возможность добавить новый кабель.' }
            : null,

    // 2. 100% по объёму — full
    (data) =>
        isVolumeFull(data.capacityInfo)
            ? { status: 'full', reason: 'Выбранная ОКЛ полностью заполнена, отсутствует возможность добавить новый кабель.' }
            : null,

    // 3. Нет места НИ ДЛЯ ОДНОГО кабеля (из всех) — full
    (data) =>
        isNoSpaceForAnyCable(data)
            ? { status: 'full', reason: 'Выбранная ОКЛ заполнена, отсутствует возможность добавить новый кабель любого типа.' }
            : null,

    // 4. Нет места в текущем фильтре, но есть другие → almost-full
    (data) =>
        isNoSpaceForFiltered(data)
            ? {
                status: 'almost-full',
                reason: `Нет места для кабелей выбранного типа (доступно других кабелей: ${data.availableFromAllCount} шт.). 
                Пожалуйста, выберите "Все кабели" в поле "Назначение кабеля" и посмотрите доступные для добавления кабели в поле "Марка кабеля"`,
                showFilterHint: true,
                availableCount: data.availableFromAllCount
            }
            : null,

    // 5. Нет кабелей в фильтре, но есть другие → add-cable
    (data) =>
        data.filteredCablesCount === 0 && data.hasOtherCables
            ? {
                status: 'add-cable',
                reason: `Нет кабелей выбранного типа (доступно ${data.availableFromAllCount} других кабелей)`,
                showFilterHint: true,
                availableCount: data.availableFromAllCount
            }
            : null,

    // 6. Мало кабелей в фильтре (1–2) → almost-full
    (data) =>
        isFewFilteredCables(data)
            ? {
                status: 'almost-full',
                reason: `ОКЛ почти заполнена — доступно для добавления этого типа кабелей: ${data.availableFromFilteredCount} шт. `,
                availableCount: data.availableFromFilteredCount
            }
            : null,

    // 7. Почти заполнена по объёму/количеству → almost-full
    (data) =>
        isAlmostFull(data.capacityInfo)
            ? {
                status: 'almost-full',
                reason: `ОКЛ почти заполнена${data.availableFromFilteredCount > 0 ? ` (доступно кабелей этого типа: ${data.availableFromFilteredCount} шт.)` : ''}`,
                availableCount: data.availableFromFilteredCount > 0 ? data.availableFromFilteredCount : undefined
            }
            : null,

    // 8. Можно добавлять → add-cable
    (data) => ({
        status: 'add-cable',
        availableCount: data.availableFromFilteredCount > 0 ? data.availableFromFilteredCount : undefined
    })

];

// === ОСНОВНОЙ КОМПОНЕНТ ===
export const CapacityStatus: React.FC<CapacityStatusProps> = ({
                                                                  capacityStatusData,
                                                                  className = '',
                                                                  compact = false,
                                                                  selectedOKLInfo
                                                              }) => {
    if (!capacityStatusData) {
        return (
            <div className={`${styles.capacityInfo} ${className}`}>
                <div className={styles.capacityRow}>
                    <span>Статус:</span>
                    <span className={styles.noData}>Нет данных</span>
                </div>
            </div>
        );
    }

    const { capacityInfo } = capacityStatusData;
    // === Определяем статус по правилам ===
    const realStatus = statusRules
        .map(rule => rule(capacityStatusData))
        .find(result => result !== null) as StatusResult; // ← безопасно

    const statusText = {
        'full': 'ОКЛ заполнена',
        'almost-full': 'Почти заполнена',
        'add-cable': 'Готова к заполнению'
    }[realStatus.status];

    const statusClass =
        realStatus.status === 'full' ? styles.full :
            realStatus.status === 'almost-full' ? styles.warning :
                styles.ok; // 'add-cable'

    const displayPercentage = Math.min(
        (capacityInfo.usedArea / capacityInfo.maxArea) * 100,
        100
    );

    // === КОМПАКТНАЯ ВЕРСИЯ ===
    if (compact) {
        return (
            <div className={`
        ${styles.capacityInfo} 
        ${compact ? styles.compact : ''} 
        ${className} 
        ${statusClass}
    `}>
                <div className={styles.capacityRow}>
                    <span>Статус:</span>
                    <span className={
                        realStatus.status === 'full' ? styles.error :
                            realStatus.status === 'almost-full' ? styles.warning :
                                styles.success
                    }>
                        {statusText}
                    </span>
                </div>
            </div>
        );
    }

    // === ПОЛНАЯ ВЕРСИЯ ===
    return (
        <div className={`
        ${styles.capacityInfo} 
        ${compact ? styles.compact : ''} 
        ${className} 
        ${statusClass}
    `}>
            <h3 className={styles.fixedTitle}>
                {selectedOKLInfo && selectedOKLInfo.index > 0
                    ? <>Выбрана ОКЛ: <span className={styles.highlightNumber}> №{selectedOKLInfo.index} {selectedOKLInfo.name}</span> </>
                    : selectedOKLInfo?.name || 'ОКЛ не выбрана'
                }
            </h3>

            <div className={styles.capacityRow}>
                <span>Статус:</span>
                <span className={
                    realStatus.status === 'full' ? styles.error :
                        realStatus.status === 'almost-full' ? styles.warning :
                            styles.success
                }>
                    {statusText}
                </span>
            </div>

            <div className={styles.capacityRow}>
                <span>Заполненность:</span>
                <span>{displayPercentage.toFixed(0)}%</span>
            </div>


            <div className={styles.capacityRow}>
                <span>Доступно кабелей для добавления: </span>
                <span> {realStatus.availableCount} шт.</span>
            </div>
            {/* Причина + подсказка */}
            {realStatus.reason && (
                <div className={`
                    ${styles.fullReason}
                    ${realStatus.status === 'full' ? styles.error :
                    realStatus.status === 'almost-full' ? styles.warning :
                        styles.info}
                `}>
                    <span>{realStatus.reason} </span>

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
                                    capacityInfo.cableCount >= 6 ? styles.warning :
                                        styles.success
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
                                    realStatus.status === 'almost-full' ? styles.warning :
                                        styles.success
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