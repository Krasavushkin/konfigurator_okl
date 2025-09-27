import React from 'react';
import styles from '../styles/ExportButtons.module.css';
import {useExport} from "./useExport";
import {OKL} from "../infoOKL/OKLCard";

interface ExportButtonsProps {
    oklList: OKL[];
    fileName?: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
                                                                oklList,
                                                                fileName = 'OKL-Configuration'
                                                            }) => {
    const { isExporting, exportPDF, exportExcel, exportWord } = useExport();

    const handleExport = async (exportFunction: Function) => {
        await exportFunction(oklList, fileName);
    };

    return (
        <div className={styles.exportButtons}>
            <button
                className={styles.exportBtn}
                onClick={() => handleExport(exportPDF)}
                disabled={isExporting || oklList.length === 0}
                title="Сохранить в PDF"
            >
                {isExporting ? '⏳' : '📄'} Сохранить конфигурацию в PDF
            </button>

          {/*  <button
                className={styles.exportBtn}
                onClick={() => handleExport(exportExcel)}
                disabled={isExporting || oklList.length === 0}
                title="Сохранить в Excel"
            >
                {isExporting ? '⏳' : '📊'} Excel
            </button>

            <button
                className={styles.exportBtn}
                onClick={() => handleExport(exportWord)}
                disabled={isExporting || oklList.length === 0}
                title="Сохранить в Word"
            >
                {isExporting ? '⏳' : '📝'} Word
            </button>*/}
        </div>
    );
};