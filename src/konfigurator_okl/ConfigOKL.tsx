import React from 'react';
import { Button } from './Button';
import styles from './styles/OKL.module.css';

type Cable = {
    id: string;
    cableTypeId: string;
    name: string;
    length: number;
};

type OKLItem = {
    id: string;
    name: string;
    length: number;
    cables: Cable[];
};

type ConfigurationSummaryProps = {
    oklList: OKLItem[];
    fittingsName: string;
    suspensionName: string;
    surfaceName: string;
    onRemoveCable: (oklId: string, cableId: string) => void;
    onSave: () => void;
};

export const ConfigOKL: React.FC<ConfigurationSummaryProps> = ({
                                                                   oklList,
                                                                   fittingsName,
                                                                   suspensionName,
                                                                   surfaceName,
                                                                   onRemoveCable,
                                                                   onSave
                                                               }) => {
    // Функция для группировки одинаковых кабелей
    const groupCables = (cables: Cable[]) => {
        const groups: { [key: string]: { cable: Cable, count: number } } = {};

        cables.forEach(cable => {
            if (groups[cable.cableTypeId]) {
                groups[cable.cableTypeId].count += 1;
            } else {
                groups[cable.cableTypeId] = {
                    cable: cable,
                    count: 1
                };
            }
        });

        return Object.values(groups);
    };

    return (
        <div className={styles.configContainer}>
            <h2 className={styles.title}>Конфигурация ОКЛ</h2>

            <div className={styles.oklGrid}>
                {oklList.map(okl => {
                    const cableGroups = groupCables(okl.cables);
                    const displayedCables = okl.cables.slice(0, 8);

                    return (
                        <div key={okl.id} className={styles.oklCard}>
                            {/* Заголовок ОКЛ */}
                            <div className={styles.oklLength}>
                                <h3 className={styles.oklTitle}>
                                    СПЕЦКАБЛАЙН-{okl.name} - {okl.length} м
                                </h3>
                                {/*<span className={styles.oklLength}>
                                    {okl.length} м
                                </span>*/}
                            </div>

                            {/* Сводная информация по кабелям */}
                            <div className={styles.oklSummary}>
                                <h4>Состав кабелей:</h4>
                                <div className={styles.cableGroups}>
                                    {cableGroups.length > 0 ? (
                                        cableGroups.map((group, index) => (
                                            <span key={group.cable.cableTypeId} className={styles.cableGroup}>
                                                {index > 0 && " + "}
                                                {group.count > 1 ? `${group.count}× ` : ''}
                                                {group.cable.name} - {group.cable.length}м
                                            </span>
                                        ))
                                    ) : (
                                        <span className={styles.noCables}>Кабели не добавлены</span>
                                    )}
                                </div>
                            </div>

                            {/* Детальный список кабелей */}
                            <div className={styles.cableDetails}>
                                <h4>Перечень кабелей:</h4>
                                <div className={styles.cableList}>
                                    {displayedCables.map((cable, index) => (
                                        <div key={cable.id} className={styles.cableItem}>
                                            <span className={styles.cableNumber}>{index + 1}.</span>
                                            <span className={styles.cableInfo}>
                                                {cable.name} - {cable.length} м
                                            </span>
                                            <button
                                                className={styles.removeBtn}
                                                onClick={() => onRemoveCable(okl.id, cable.id)}
                                                title="Удалить кабель"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}

                                    {/* Сообщения */}
                                    {okl.cables.length === 0 && (
                                        <div className={styles.emptyMessage}>
                                            Нет добавленных кабелей
                                        </div>
                                    )}

                                    {okl.cables.length > 8 && (
                                        <div className={styles.limitMessage}>
                                            Показано 8 из {okl.cables.length} кабелей
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Статистика */}
                            <div className={styles.oklStats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Всего кабелей:</span>
                                    <span className={styles.statValue}>{okl.cables.length}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Марок кабелей:</span>
                                    <span className={styles.statValue}>{cableGroups.length}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Кнопка сохранения */}
            <div className={styles.actions}>
                <Button title="Сохранить конфигурацию" onClick={onSave} />
            </div>
        </div>
    );
};


{/* пока нет комплектующих, но блок можно легко добавить */}
{/*   {okl.cables.length > 0 && (
                <ol className={styles.cableList}>
                    {okl.cables.map(cable => (
                        <li key={cable.id} className={styles.cableItem}>
                            {cable.name} ({cable.length} м)
                            <button
                                className={styles.removeBtn}
                                onClick={() => onRemoveCable(okl.id, cable.id)}
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ol>
            )}*/}
{/* <div className={styles.partsBlock}>
        <h4>Комплектующие:</h4>
        <ul>
          <li>...</li>
        </ul>
      </div> */}