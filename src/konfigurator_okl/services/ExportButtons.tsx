import React from 'react';
import { Button } from "../Button";
import { newOKLItem } from "../../data/data";
import { ServiceExport } from "./ServiceExport";

interface ExportButtonsProps {
    oklList: newOKLItem[];
    fileName?: string;
    showExcel?: boolean;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
                                                                oklList,
                                                                fileName = 'OKL-Configuration',
                                                                showExcel = true
                                                            }) => {
    const exportService = new ServiceExport();

    const handleExport = async (
        exportFunction: (list: newOKLItem[], name: string) => Promise<void>,
        format: string
    ) => {
        if (oklList.length === 0) {
            alert('Нет данных для экспорта');
            return;
        }

        try {
            await exportFunction(oklList, fileName);
        } catch (error) {
            console.error(`Ошибка экспорта ${format}:`, error);
            alert(`Не удалось экспортировать ${format} файл`);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <Button
                title="Сохранить в PDF"
                onClick={() => handleExport(
                    exportService.exportToPDFService.bind(exportService),
                    'PDF'
                )}
                disabled={oklList.length === 0}
            />
            <Button
                    title="Сохранить в Excel"
                    onClick={() => handleExport(
                        exportService.exportToExcelService.bind(exportService),
                        'Excel'
                    )}
                    disabled={oklList.length === 0}
            />
        </div>
    );
};