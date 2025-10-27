import { useState } from 'react';
import { exportService } from '../services/exportService';
import {OKL} from "../infoOKL/OKLCard";
import {newOKLItem} from "../data";


export const useExport = () => {
    const [isExporting, setIsExporting] = useState(false);

    const exportPDF = async (oklList: newOKLItem[], fileName?: string) => {
        if (oklList.length === 0) {
            alert('Нет данных для экспорта');
            return;
        }

        setIsExporting(true);
        try {
            await exportService.exportToPDF(oklList, fileName);
        } catch (error) {
            console.error('Ошибка экспорта PDF:', error);
            alert('Не удалось экспортировать в PDF');
        } finally {
            setIsExporting(false);
        }
    };

    const exportExcel = (oklList: OKL[], fileName?: string) => {
        if (oklList.length === 0) {
            alert('Нет данных для экспорта');
            return;
        }

        setIsExporting(true);
        try {
            exportService.exportToExcel(oklList, fileName);
        } catch (error) {
            console.error('Ошибка экспорта Excel:', error);
            alert('Не удалось экспортировать в Excel');
        } finally {
            setIsExporting(false);
        }
    };

    const exportWord = async (oklList: OKL[], fileName?: string) => {
        if (oklList.length === 0) {
            alert('Нет данных для экспорта');
            return;
        }

        setIsExporting(true);
        try {
            await exportService.exportToWord(oklList, fileName);
        } catch (error) {
            console.error('Ошибка экспорта Word:', error);
            alert('Не удалось экспортировать в Word');
        } finally {
            setIsExporting(false);
        }
    };

    return {
        isExporting,
        exportPDF,
        exportExcel,
        exportWord
    };
};