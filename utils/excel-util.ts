import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const FILE_PATH = path.join(process.cwd(), 'sanity_report.xlsx');

export class SanityReportHelper {
    private static getWorkbook(): XLSX.WorkBook {
        if (fs.existsSync(FILE_PATH)) {
            try {
                return XLSX.readFile(FILE_PATH);
            } catch (e) {
                console.error("Failed to read existing Excel file, creating new one:", e);
            }
        }
        return XLSX.utils.book_new();
    }

    private static saveWorkbook(wb: XLSX.WorkBook) {
        try {
            // Ensure target directory exists (just in case)
            const dir = path.dirname(FILE_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            XLSX.writeFile(wb, FILE_PATH);
        } catch (e) {
            console.error("Failed to write Excel file:", e);
        }
    }

    static setTotalProducts(category: string, count: number) {
        console.log(`[Sanity Report] Category: ${category}, Total Products: ${count}`);
        
        const wb = this.getWorkbook();
        
        // 1. Update Summary Sheet
        let summaryData: any[] = [];
        if (wb.SheetNames.includes('Summary')) {
            const sheet = wb.Sheets['Summary'];
            summaryData = XLSX.utils.sheet_to_json(sheet);
        }
        
        let row = summaryData.find(r => r.Category === category);
        if (row) {
            row['Total Products'] = count;
            row['Zero Price Products Count'] = 0;
            row['Missing Thumbnails Count'] = 0;
        } else {
            summaryData.push({
                Category: category,
                'Total Products': count,
                'Zero Price Products Count': 0,
                'Missing Thumbnails Count': 0
            });
        }
        
        const newSummarySheet = XLSX.utils.json_to_sheet(summaryData);
        if (wb.SheetNames.includes('Summary')) {
            wb.Sheets['Summary'] = newSummarySheet;
        } else {
            XLSX.utils.book_append_sheet(wb, newSummarySheet, 'Summary');
        }

        // 2. Clear Zero Price entries for this category
        if (wb.SheetNames.includes('Zero Price Products')) {
            const sheet = wb.Sheets['Zero Price Products'];
            let zeroData: any[] = XLSX.utils.sheet_to_json(sheet);
            zeroData = zeroData.filter(r => r.Category !== category);
            const newZeroSheet = XLSX.utils.json_to_sheet(zeroData);
            wb.Sheets['Zero Price Products'] = newZeroSheet;
        }

        // 3. Clear Missing Thumbnail entries for this category
        if (wb.SheetNames.includes('Missing Thumbnails')) {
            const sheet = wb.Sheets['Missing Thumbnails'];
            let thumbData: any[] = XLSX.utils.sheet_to_json(sheet);
            thumbData = thumbData.filter(r => r.Category !== category);
            const newThumbSheet = XLSX.utils.json_to_sheet(thumbData);
            wb.Sheets['Missing Thumbnails'] = newThumbSheet;
        }

        this.saveWorkbook(wb);
    }

    static addZeroPriceProduct(category: string, productName: string) {
        console.log(`[Sanity Report] Category: ${category}, Zero/Null Price Product: ${productName}`);
        
        const wb = this.getWorkbook();

        // 1. Append to Zero Price details sheet
        let zeroData: any[] = [];
        if (wb.SheetNames.includes('Zero Price Products')) {
            const sheet = wb.Sheets['Zero Price Products'];
            zeroData = XLSX.utils.sheet_to_json(sheet);
        }

        const exists = zeroData.some(r => r.Category === category && r['Product Name'] === productName);
        if (!exists) {
            zeroData.push({
                Category: category,
                'Product Name': productName
            });
            const newZeroSheet = XLSX.utils.json_to_sheet(zeroData);
            if (wb.SheetNames.includes('Zero Price Products')) {
                wb.Sheets['Zero Price Products'] = newZeroSheet;
            } else {
                XLSX.utils.book_append_sheet(wb, newZeroSheet, 'Zero Price Products');
            }

            // 2. Increment count in Summary Sheet
            let summaryData: any[] = [];
            if (wb.SheetNames.includes('Summary')) {
                const sheet = wb.Sheets['Summary'];
                summaryData = XLSX.utils.sheet_to_json(sheet);
            }

            let row = summaryData.find(r => r.Category === category);
            if (row) {
                row['Zero Price Products Count'] = (row['Zero Price Products Count'] || 0) + 1;
            } else {
                summaryData.push({
                    Category: category,
                    'Total Products': 0,
                    'Zero Price Products Count': 1,
                    'Missing Thumbnails Count': 0
                });
            }

            const newSummarySheet = XLSX.utils.json_to_sheet(summaryData);
            wb.Sheets['Summary'] = newSummarySheet;
        }

        this.saveWorkbook(wb);
    }

    static addMissingThumbnail(category: string, productName: string) {
        console.log(`[Sanity Report] Category: ${category}, Missing Thumbnail: ${productName}`);
        
        const wb = this.getWorkbook();

        // 1. Append to Missing Thumbnails details sheet
        let thumbData: any[] = [];
        if (wb.SheetNames.includes('Missing Thumbnails')) {
            const sheet = wb.Sheets['Missing Thumbnails'];
            thumbData = XLSX.utils.sheet_to_json(sheet);
        }

        const exists = thumbData.some(r => r.Category === category && r['Product Name'] === productName);
        if (!exists) {
            thumbData.push({
                Category: category,
                'Product Name': productName
            });
            const newThumbSheet = XLSX.utils.json_to_sheet(thumbData);
            if (wb.SheetNames.includes('Missing Thumbnails')) {
                wb.Sheets['Missing Thumbnails'] = newThumbSheet;
            } else {
                XLSX.utils.book_append_sheet(wb, newThumbSheet, 'Missing Thumbnails');
            }

            // 2. Increment count in Summary Sheet
            let summaryData: any[] = [];
            if (wb.SheetNames.includes('Summary')) {
                const sheet = wb.Sheets['Summary'];
                summaryData = XLSX.utils.sheet_to_json(sheet);
            }

            let row = summaryData.find(r => r.Category === category);
            if (row) {
                row['Missing Thumbnails Count'] = (row['Missing Thumbnails Count'] || 0) + 1;
            } else {
                summaryData.push({
                    Category: category,
                    'Total Products': 0,
                    'Zero Price Products Count': 0,
                    'Missing Thumbnails Count': 1
                });
            }

            const newSummarySheet = XLSX.utils.json_to_sheet(summaryData);
            wb.Sheets['Summary'] = newSummarySheet;
        }

        this.saveWorkbook(wb);
    }
}
