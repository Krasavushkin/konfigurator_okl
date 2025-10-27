import React, {useState} from 'react';
import styles from '../styles/ExportButtons.module.css';

import {Button} from "../Button";
import {newOKLItem} from "../data";
import {ServiceExport} from "./ServiceExport";

interface ExportButtonsProps {
    oklList: newOKLItem[];
    fileName?: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
                                                                oklList,
                                                                fileName = 'OKL-Configuration'
                                                            }) => {

    const exportService = new ServiceExport();

    const handleExport = async (exportFunction: (list: newOKLItem[], name: string) => Promise<void>) => {
        if (oklList.length === 0) return;
        try {
            await exportFunction(oklList, fileName);
        } catch (error) {
            console.error('Ошибка экспорта:', error);
            alert('Не удалось экспортировать файл');
        }
    };
    return (
        <div className={styles.exportButtons}>
            <Button title={"Сохранить в PDF 📄"} onClick={() => handleExport(exportService.exportToPDFService.bind(exportService))} disabled={oklList.length === 0}/>

        </div>
    );
};