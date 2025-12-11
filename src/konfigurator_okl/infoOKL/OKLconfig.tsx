import React, {useEffect, useState} from 'react';
import {OKLCard} from './OKLCard';
import styles from '../styles/OKL.module.css';
import {ExportButtons} from "../services/ExportButtons";
import {Button} from "../Button";
import {newOKLItem} from "../data";
import {useOKLData} from "../../hooks/useOKLData";
import {CapacityInfo} from "../CapacityStatus";


interface ConfigurationSummaryProps {
    oklList: newOKLItem[];
    onRemoveCable: (oklId: string, cableId: string) => void;
    onDeleteOKL: (oklId: string) => void;
    onEditOKL: (oklId: string) => void;
    onAddCable: (oklId: string) => void;
    onCopyOKL: (oklId: string) => void;
    getOKLCapacityInfo?: (oklId: string) => CapacityInfo | null;

    selectedOKL?: string;
    onSelectOKL?: (oklId: string) => void;
    onDeleteAllOKL: () => void;
    canAddAnyCableFromList: (oklId: string, cables: any[]) => boolean;
    getAvailableCablesCount: (oklId: string, cables: any[]) => number; // Добавляем новую функцию
}

export const OKLconfig: React.FC<ConfigurationSummaryProps> = ({
                                                                   oklList,
                                                                   onRemoveCable,
                                                                   onDeleteOKL,
                                                                   onEditOKL,
                                                                   onAddCable,
                                                                   onCopyOKL,
                                                                   getOKLCapacityInfo,
                                                                   selectedOKL: externalSelectedOKL,
                                                                   onSelectOKL,
                                                                   onDeleteAllOKL,
                                                                   canAddAnyCableFromList,
                                                                   getAvailableCablesCount
                                                               }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 4;

    const paginatedOKL = oklList.slice(
        (currentPage - 1) * cardsPerPage,
        currentPage * cardsPerPage
    );
    const totalPages = Math.ceil(oklList.length / cardsPerPage);

    const [internalSelectedOKL, setInternalSelectedOKL] = useState<string>('');

    useEffect(() => {
        if (externalSelectedOKL) {
            setInternalSelectedOKL(externalSelectedOKL);
        }
    }, [externalSelectedOKL]);
    useEffect(() => {
        if (oklList.length === 0) {
            setCurrentPage(1);
            return;
        }

        const maxPage = Math.ceil(oklList.length / cardsPerPage);
        if (currentPage > maxPage && maxPage >= 1) {
            setCurrentPage(maxPage);
        }
    }, [oklList.length, currentPage, cardsPerPage]);
    const handleSelectOKL = (oklId: string) => {
        const newSelected = internalSelectedOKL === oklId ? '' : oklId;
        setInternalSelectedOKL(newSelected);

        // УВЕДОМЛЯЕМ О ВЫБОРЕ
        if (onSelectOKL) {
            onSelectOKL(newSelected);
        }

        onAddCable(oklId);
    };
    const { getCompatibleCables } = useOKLData();

    return (
        <div className={styles.configContainer}>
            <div className={styles.oklGrid}>
                {paginatedOKL.map((okl, index) => {
                    const capacityInfo = getOKLCapacityInfo ? getOKLCapacityInfo(okl.id) : null;
                    const allCompatibleCables = getCompatibleCables(okl.type || '');
                    const globalIndex = (currentPage - 1) * cardsPerPage + index + 1;
                    const capacityStatusData = capacityInfo ? {
                        capacityInfo,
                        hasOtherCables: false, // В карточках не показываем подсказки о фильтрах
                        filteredCablesCount: allCompatibleCables.length,
                        allCablesCount: allCompatibleCables.length,
                        availableFromFilteredCount: getAvailableCablesCount(okl.id, allCompatibleCables),
                        availableFromAllCount: getAvailableCablesCount(okl.id, allCompatibleCables)
                    } : null;

                    return (
                        <OKLCard
                            key={okl.id}
                            index={globalIndex}
                            okl={okl}
                            isSelected={internalSelectedOKL === okl.id}
                            onSelect={handleSelectOKL}
                            onEdit={onEditOKL}
                            onDelete={onDeleteOKL}
                            onRemoveCable={onRemoveCable}
                            onAddCable={onAddCable}
                            onCopy={onCopyOKL}
                            capacityStatusData={capacityStatusData}
                        />
                    );
                })}
            </div>

            <div className={styles.pagination}>
                <button
                    className={styles.navBtn}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                >
                    ←
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        className={`${currentPage === page ? styles.active : ''}`}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className={styles.navBtn}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                >
                    →
                </button>
            </div>

            <div className={styles.actionButtons}>
                <ExportButtons oklList={oklList} fileName="Конфигурация-ОКЛ" />

                {oklList.length > 0 && (
                    <Button title={"Удалить все ОКЛ"} onClick={onDeleteAllOKL} />

                )}
            </div>
        </div>
    );
};