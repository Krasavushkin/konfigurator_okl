  import * as XLSX from 'xlsx';
import {Cable, OKL} from "../infoOKL/OKLCard";
import html2pdf from 'html2pdf.js'



export class ExportService {
    // PDF экспорт
    async exportToPDF(oklList: OKL[], fileName: string = 'OKL-Configuration'): Promise<void> {
        const element = document.createElement('div');
        element.innerHTML = this.generateHTMLContent(oklList);
        document.body.appendChild(element);

        const options = {
            margin: 10,
            filename: `${fileName}-${this.getFormattedDate()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            await html2pdf().from(element).set(options).save();
        } finally {
            document.body.removeChild(element);
        }
    }

    private generateHTMLContent(oklList: OKL[]): string {
        return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="text-align: center;">Конфигурация Огнестойких Кабельных Линий</h1>
            <p style="text-align: center;">Дата: ${new Date().toLocaleDateString('ru-RU')}</p>
            
            ${oklList.map(okl => `
                <div style="margin: 20px 0; padding: 15px; border: 1px solid #ccc;">
                    <h2>СПЕЦКАБЛАЙН-${okl.name}</h2>
                    <p><strong>Длина:</strong> ${okl.length} м</p>
                    <p><strong>Кабелей:</strong> ${okl.cables
            .map((cable, index) =>
                `${index > 0 ? ' + ' : ''}${cable.name} - ${cable.length}м`
            )
            .join('')}</p>
                </div>
            `).join('')}
        </div>
    `;
    }

    // Excel экспорт
    exportToExcel(oklList: OKL[], fileName: string = 'OKL-Configuration'): void {
        const workbook = XLSX.utils.book_new();

        // Основные данные ОКЛ
        const oklData = oklList.map(okl => ({
            'Наименование ОКЛ': `СПЕЦКАБЛАЙН-${okl.name}`,
            'Длина (м)': okl.length,
            'Количество кабелей': okl.cables.length,
            'Общая длина кабелей': this.calculateTotalCableLength(okl.cables),
            'Состав кабелей': okl.cables
                .map((cable, index) =>
                    `${index > 0 ? ' + ' : ''}${cable.name} - ${cable.length}м`
                )
                .join('')
        }));

        const oklWorksheet = XLSX.utils.json_to_sheet(oklData);
        XLSX.utils.book_append_sheet(workbook, oklWorksheet, 'ОКЛ');

        // Детали кабелей
        const cableData = oklList.flatMap(okl =>
            okl.cables.map((cable, index) => ({
                'ОКЛ': `СПЕЦКАБЛАЙН-${okl.name}`,
                '№': index + 1,
                'Марка кабеля': cable.name,
                'Длина (м)': cable.length,
                'Тип кабеля': cable.cableTypeId
            }))
        );

        if (cableData.length > 0) {
            const cableWorksheet = XLSX.utils.json_to_sheet(cableData);
            XLSX.utils.book_append_sheet(workbook, cableWorksheet, 'Кабели');
        }

        XLSX.writeFile(workbook, `${fileName}-${this.getFormattedDate()}.xlsx`);
    }

    // Word экспорт
    async exportToWord(oklList: OKL[], fileName: string = 'OKL-Configuration'): Promise<void> {
        try {
            // Создаем HTML контент
            let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Конфигурация ОКЛ</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    h1 { color: #2c3e50; text-align: center; }
                    h2 { color: #34495e; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th { background-color: #34495e; color: white; padding: 10px; text-align: left; }
                    td { padding: 8px; border-bottom: 1px solid #ecf0f1; }
                </style>
            </head>
            <body>
                <h1>Конфигурация Огнестойких Кабельных Линий</h1>
                <p><strong>Дата генерации:</strong> ${new Date().toLocaleDateString('ru-RU')}</p>
        `;

            for (const okl of oklList) {
                htmlContent += `
                <h2>ОКЛ: СПЕЦКАБЛАЙН-${okl.name}</h2>
                <p><strong>Длина:</strong> ${okl.length} м</p>
                <p><strong>Количество кабелей:</strong> ${okl.cables.length}</p>
            `;

                if (okl.cables.length > 0) {
                    htmlContent += `
                    <table>
                        <tr>
                            <th>№</th>
                            <th>Марка кабеля</th>
                            <th>Длина (м)</th>
                            <th>Тип</th>
                        </tr>
                `;

                    okl.cables.forEach((cable, index) => {
                        htmlContent += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${cable.name}</td>
                            <td>${cable.length}</td>
                            <td>${cable.cableTypeId}</td>
                        </tr>
                    `;
                    });

                    htmlContent += '</table>';
                } else {
                    htmlContent += '<p>Нет добавленных кабелей</p>';
                }
            }

            htmlContent += '</body></html>';

            // Сохраняем как HTML файл (можно открыть в Word)
            const blob = new Blob([htmlContent], {
                type: 'text/html;charset=utf-8'
            });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${fileName}-${this.getFormattedDate()}.html`;
            link.click();
            URL.revokeObjectURL(link.href);

        } catch (error) {
            console.error('Ошибка экспорта Word:', error);
            // Fallback к текстовому формату
            this.exportToText(oklList, fileName);
        }
    }

// Резервный текстовый экспорт
    private exportToText(oklList: OKL[], fileName: string): void {
        let content = 'Конфигурация Огнестойких Кабельных Линий\n\n';
        content += `Дата: ${new Date().toLocaleDateString('ru-RU')}\n\n`;

        oklList.forEach(okl => {
            content += `ОКЛ: ${okl.name}\n`;
            content += `Длина: ${okl.length} м\n`;
            content += `Кабели: ${okl.cables.length} шт.\n\n`;

            okl.cables.forEach((cable, index) => {
                content += `${index + 1}. ${cable.name} - ${cable.length} м\n`;
            });

            content += '\n' + '-'.repeat(40) + '\n\n';
        });

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}-${this.getFormattedDate()}.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

// Резервный текстовый экспорт

    // Вспомогательные методы
    private generatePDFContent(oklList: OKL[]): string {
        return `
      <div style="font-family: Arial, sans-serif;">
        <h1 style="text-align: center; color: #2c3e50;">Конфигурация ОКЛ</h1>
        <p style="text-align: center; color: #7f8c8d;">Дата генерации: ${new Date().toLocaleDateString('ru-RU')}</p>
        
        ${oklList.map(okl => `
          <div style="margin: 20px 0; padding: 15px; border: 1px solid #bdc3c7; border-radius: 5px;">
            <h2 style="color: #34495e;">СПЕЦКАБЛАЙН-${okl.name}</h2>
            <p><strong>Длина:</strong> ${okl.length} м</p>
            <p><strong>Количество кабелей:</strong> ${okl.cables.length}</p>
            
            ${okl.cables.length > 0 ? `
              <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                <tr style="background-color: #34495e; color: white;">
                  <th style="padding: 8px; text-align: left;">№</th>
                  <th style="padding: 8px; text-align: left;">Марка кабеля</th>
                  <th style="padding: 8px; text-align: left;">Длина (м)</th>
                  <th style="padding: 8px; text-align: left;">Тип</th>
                </tr>
                ${okl.cables.map((cable, index) => `
                  <tr style="border-bottom: 1px solid #ecf0f1;">
                    <td style="padding: 8px;">${index + 1}</td>
                    <td style="padding: 8px;">${cable.name}</td>
                    <td style="padding: 8px;">${cable.length}</td>
                    <td style="padding: 8px;">${cable.cableTypeId}</td>
                  </tr>
                `).join('')}
              </table>
            ` : '<p>Нет добавленных кабелей</p>'}
          </div>
        `).join('')}
      </div>
    `;
    }

    private calculateTotalCableLength(cables: Cable[]): number {
        return cables.reduce((total, cable) => total + cable.length, 0);
    }

    private getFormattedDate(): string {
        return new Date().toISOString().split('T')[0];
    }
}

export const exportService = new ExportService();