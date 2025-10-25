import React, { useState } from 'react';
import {CapacityInfo, OKL, OKLCard} from './OKLCard';
import styles from '../styles/OKL.module.css';
import {Button} from "../Button";
import {ExportButtons} from "../services/ExportButtons";


interface ConfigurationSummaryProps {
    oklList: OKL[];
    onRemoveCable: (oklId: string, cableId: string) => void;
    onDeleteOKL: (oklId: string) => void;
    onEditOKL: (oklId: string) => void;
    onAddCable: (oklId: string) => void;
    onSave: () => void;
    onCopyOKL: (oklId: string) => void;


    getOKLCapacityInfo?: (oklId: string) => CapacityInfo | null; // Добавляем функцию
}

export const OKLconfig: React.FC<ConfigurationSummaryProps> = ({
                                                                   oklList,
                                                                   onRemoveCable,
                                                                   onDeleteOKL,
                                                                   onEditOKL,
                                                                   onAddCable,
                                                                   onCopyOKL,
                                                                   getOKLCapacityInfo
                                                               }) => {
    const [selectedOKL, setSelectedOKL] = useState<string>('');

    const handleSelectOKL = (oklId: string) => {
        setSelectedOKL(prev => prev === oklId ? '' : oklId);
        onAddCable(oklId)
    };

    return (
        <div className={styles.configContainer}>
            <div className={styles.oklGrid}>
                {oklList.map(okl => (
                    <OKLCard
                        key={okl.id}
                        okl={okl}
                        isSelected={selectedOKL === okl.id}
                        onSelect={handleSelectOKL}
                        onEdit={onEditOKL}
                        onDelete={onDeleteOKL}
                        onRemoveCable={onRemoveCable}
                        onAddCable={onAddCable}
                        onCopy={onCopyOKL}
                        capacityInfo={getOKLCapacityInfo ? getOKLCapacityInfo(okl.id) : null}
                    />
                ))}

            </div>
            <ExportButtons oklList={oklList} fileName="Конфигурация-ОКЛ" />
        </div>
    );
};