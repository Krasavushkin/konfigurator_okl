import {pdf, Document, Page, Text, View, StyleSheet, Font} from '@react-pdf/renderer';
import {OKL_LINKS} from "../data";
import ExcelJS from 'exceljs';
// === Регистрация шрифта (для кириллицы) ===
Font.register({
    family: 'Noto Sans',
    src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Regular.ttf',


});

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Noto Sans',
        fontSize: 10,
        color: '#222',
    },
    title: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#8B0000',
        fontWeight: 'bold',
    },
    block: {
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    blockTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#800000',
        marginBottom: 8,
    },
    text: {
        fontSize: 10,
        marginBottom: 4,
    },
    smallText: {
        fontSize: 9,
        color: '#555',
    },
    link: {
        fontSize: 9,
        color: '#0066cc',
        textDecoration: 'underline',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 9,
        color: '#555',
    },
    descBlock: {
        marginVertical: 15,
        padding: 12,
        borderLeft: '4px solid #8B0000',
        backgroundColor: '#fdf6f6',
        borderRadius: 4,
    },
});

interface newOKLItem {
    id: string;
    type: string;
    name: string;
    length: number;
    cables: Array<{
        id: string;
        name: string;
        length: number;
    }>;
    TU?: string;
}

export class ServiceExport {
    private calculateTotalCableLength(cables: Array<{ length: number }>): number {
        return cables.reduce((sum, c) => sum + c.length, 0);
    }

    private generateFileName(oklList: newOKLItem[]): string {
        const now = new Date();
        const date = now.toISOString().slice(0, 10); // 2025-10-27
        const time = now.toTimeString().slice(0, 5).replace(':', '-'); // 14-30
        const count = oklList.length;
        const totalLength = oklList.reduce((s, o) => s + o.length, 0);
        return `Конфигурация_ОКЛ_${count}шт_${totalLength}м_${date}_${time}`;
    }

    async exportToPDFService(oklList: newOKLItem[], fileName: string = 'OKL-Configuration'): Promise<void> {
        const uniqueOklTypes = Array.from(new Set(oklList.map(okl => okl.type)));

        // === PDF-документ в JSX ===
        const PDFDocument = () => (
            <Document>
                <Page size="A4" style={styles.page}>
                    <Text style={styles.title}>Конфигурация ОКЛ</Text>


                    {/* === Список ОКЛ === */}
                    {oklList.map((okl, index) => {
                        const cablesText = okl.cables
                            .map(c => `${c.name} - ${c.length} м`)
                            .join(' + ');

                        return (
                            <View key={okl.id} style={styles.block}>
                                <Text style={styles.blockTitle}>
                                    ОКЛ №{index + 1}: СПЕЦКАБЛАЙН-{okl.name}-{okl.length}м ({cablesText})
                                </Text>
                                <Text style={styles.text}><Text style={{fontWeight: 'bold'}}>ТУ
                                    ОКЛ:</Text> {okl.TU || '—'}</Text>
                                <Text style={styles.text}><Text style={{fontWeight: 'bold'}}>Длина
                                    ОКЛ:</Text> {okl.length} м</Text>
                                <Text style={styles.text}><Text
                                    style={{fontWeight: 'bold'}}>Кабелей:</Text> {okl.cables.length}</Text>
                                <Text style={styles.text}>
                                    <Text style={{fontWeight: 'bold'}}>Общая длина
                                        кабелей:</Text> {this.calculateTotalCableLength(okl.cables)} м
                                </Text>
                            </View>
                        );
                    })}
                    {/* === Описания типов ОКЛ (один раз) === */}
                    {uniqueOklTypes.map(type => {
                        const linkData = OKL_LINKS.find(l => l.oklType === type);
                        if (!linkData) return null;
                        return (
                            <View key={type} style={styles.descBlock}>
                                <Text style={{fontSize: 10, marginTop: 6, lineHeight: 1.4}}>
                                    {linkData.description}
                                </Text>
                                <Text style={styles.link}>
                                    {linkData.link}
                                </Text>
                            </View>
                        );
                    })}

                    <Text style={styles.footer}>
                        © ООО НПП "Спецкабель", {new Date().getFullYear()}
                    </Text>
                </Page>
            </Document>
        );

        try {
            const blob = await pdf(<PDFDocument/>).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.generateFileName(oklList)}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Ошибка экспорта PDF:', error);
            alert('Не удалось создать PDF. Проверьте консоль.');
        }
    }
    async exportToExcelService(oklList: newOKLItem[]): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'ООО НПП "Спецкабель"';
        workbook.created = new Date();

        // Основной лист
        const worksheet = workbook.addWorksheet('Конфигурация ОКЛ');

        // Заголовок
        const titleRow = worksheet.getRow(1);
        titleRow.getCell(1).value = 'КОНФИГУРАЦИЯ ОГНЕСТОЙКИХ КАБЕЛЬНЫХ ЛИНИЙ';
        titleRow.getCell(1).font = { size: 16, bold: true, color: { argb: 'FF8B0000' } };
        titleRow.getCell(1).alignment = { horizontal: 'center' };
        worksheet.mergeCells('A1:F1');

        // Дата создания
        worksheet.getRow(3).getCell(1).value = `Дата создания: ${new Date().toLocaleDateString('ru-RU')}`;
        worksheet.getRow(3).getCell(1).font = { italic: true };

        // Заголовки таблицы
        const headers = ['№', 'Наименование ОКЛ', 'Длина ОКЛ, м', 'Кабели', 'Общая длина кабелей, м', 'ТУ ОКЛ'];
        const headerRow = worksheet.getRow(5);
        headers.forEach((header, index) => {
            const cell = headerRow.getCell(index + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FF800000' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF2F2F2' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Данные ОКЛ
        let currentRow = 6;
        oklList.forEach((okl, index) => {
            const row = worksheet.getRow(currentRow);
            const cablesList = okl.cables
                .map(c => `${c.name} (${c.length} м)`)
                .join('\n');
            const cablesText = okl.cables
                .map(c => `${c.name} - ${c.length} м`)
                .join(' + ');
            const totalCableLength = this.calculateTotalCableLength(okl.cables);

            row.getCell(1).value = index + 1; // №
            row.getCell(2).value = `СПЕЦКАБЛАЙН-${okl.name} - ${okl.length} м (${cablesText})`;
            row.getCell(3).value = okl.length;
            row.getCell(4).value = cablesList;
            row.getCell(5).value = totalCableLength;
            row.getCell(6).value = okl.TU || '—';

            // Настройка переноса текста для колонки с кабелями
            row.getCell(1).alignment = { vertical: 'top' };
            row.getCell(2).alignment = { wrapText: true, vertical: 'top' };
            row.getCell(3).alignment = { vertical: 'top' };
            row.getCell(4).alignment = { wrapText: true, vertical: 'top' };
            row.getCell(5).alignment = { vertical: 'top' };
            row.getCell(6).alignment = { vertical: 'top' };

            // Границы ячеек
            for (let i = 1; i <= 6; i++) {
                row.getCell(i).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }

            currentRow++;
        });

        // Автоподбор ширины колонок
        worksheet.columns = [
            { width: 15 },   // №
            { width: 60 },  // Марка ОКЛ
            { width: 15 },  // Длина
            { width: 50 },  // Кабели
            { width: 25 },  // Общая длина кабелей
            { width: 40 },  // ТУ
        ];

        // Добавляем описания
        currentRow += 2;
        worksheet.getRow(currentRow).getCell(1).value = 'Описания типов ОКЛ:';
        worksheet.getRow(currentRow).getCell(1).font = { bold: true };
        currentRow++;

        const uniqueOklTypes = Array.from(new Set(oklList.map(okl => okl.type)));
        uniqueOklTypes.forEach(type => {
            const linkData = OKL_LINKS.find(l => l.oklType === type);
            if (linkData) {
                worksheet.getRow(currentRow).getCell(1).value = `Описание:`;
                worksheet.getRow(currentRow).getCell(1).font = { bold: true };

                worksheet.getRow(currentRow).getCell(2).value = linkData.description;
                worksheet.getRow(currentRow).getCell(2).alignment = { wrapText: true, vertical: 'top' };
                worksheet.mergeCells(`B${currentRow}:F${currentRow}`);
                currentRow++;

                worksheet.getRow(currentRow).getCell(1).value = 'Ссылка:';
                worksheet.getRow(currentRow).getCell(2).value = linkData.link;
                worksheet.getRow(currentRow).getCell(2).font = {
                    color: { argb: 'FF0000FF' },
                    underline: true
                };
                worksheet.mergeCells(`B${currentRow}:F${currentRow}`);
                currentRow += 2;
            }
        });

        // Подвал
        currentRow += 2;
        const footerRow = worksheet.getRow(currentRow);
        footerRow.getCell(1).value = `© ООО НПП "Спецкабель", ${new Date().getFullYear()}`;
        footerRow.getCell(1).font = { italic: true, color: { argb: 'FF555555' } };
        worksheet.mergeCells(`A${currentRow}:F${currentRow}`);

        // Сохранение файла
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.generateFileName(oklList)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

}