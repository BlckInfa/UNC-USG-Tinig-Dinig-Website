const { Issuance, Report } = require("../models");

/**
 * Export Service - Business Logic Layer
 * Handles report data generation and export to various formats (PDF, CSV, Excel).
 *
 * Dependencies:
 *   - pdfkit (PDF generation)
 *   - exceljs (Excel generation)
 *
 * CSV is generated natively without external dependencies.
 */
class ExportService {
    /**
     * Generate report data based on filters
     * @param {Object} filters - Report filters (date range, status, department, priority, category)
     * @returns {Array} - Array of issuance data for export
     */
    async generateReportData(filters = {}) {
        const query = { isDeleted: { $ne: true } };

        if (filters.status) query.status = filters.status;
        if (filters.priority) query.priority = filters.priority;
        if (filters.department) query.department = filters.department;
        if (filters.category) query.category = filters.category;
        if (filters.type) query.type = filters.type;

        // Date range on createdAt
        if (filters.startDate || filters.endDate) {
            query.createdAt = {};
            if (filters.startDate) {
                query.createdAt.$gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                query.createdAt.$lte = new Date(filters.endDate);
            }
        }

        const issuances = await Issuance.find(query)
            .populate("createdBy", "name email")
            .populate("lastModifiedBy", "name email")
            .sort({ createdAt: -1 })
            .lean();

        return issuances;
    }

    /**
     * Export data as CSV string
     * @param {Array} data - Issuance data array
     * @returns {{ content: string, contentType: string, filename: string }}
     */
    exportToCSV(data) {
        const headers = [
            "ID",
            "Title",
            "Type",
            "Status",
            "Priority",
            "Category",
            "Department",
            "Created By",
            "Created At",
            "Updated At",
            "Description",
        ];

        const rows = data.map((item) => [
            item._id.toString(),
            this._escapeCSV(item.title),
            item.type,
            item.status,
            item.priority,
            item.category || "",
            item.department || "",
            item.createdBy?.name || "",
            item.createdAt ? new Date(item.createdAt).toISOString() : "",
            item.updatedAt ? new Date(item.updatedAt).toISOString() : "",
            this._escapeCSV(item.description || ""),
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.join(",")),
        ].join("\n");

        return {
            content: csvContent,
            contentType: "text/csv",
            filename: `issuances-report-${Date.now()}.csv`,
        };
    }

    /**
     * Export data as Excel buffer
     * @param {Array} data - Issuance data array
     * @returns {{ content: Buffer, contentType: string, filename: string }}
     */
    async exportToExcel(data) {
        let ExcelJS;
        try {
            ExcelJS = require("exceljs");
        } catch {
            const error = new Error(
                "Excel export requires the 'exceljs' package. Install it with: npm install exceljs",
            );
            error.statusCode = 501;
            throw error;
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = "USG Admin System";
        workbook.created = new Date();

        const sheet = workbook.addWorksheet("Issuances Report");

        // Define columns
        sheet.columns = [
            { header: "ID", key: "id", width: 25 },
            { header: "Title", key: "title", width: 40 },
            { header: "Type", key: "type", width: 15 },
            { header: "Status", key: "status", width: 15 },
            { header: "Priority", key: "priority", width: 12 },
            { header: "Category", key: "category", width: 20 },
            { header: "Department", key: "department", width: 20 },
            { header: "Created By", key: "createdBy", width: 25 },
            { header: "Created At", key: "createdAt", width: 22 },
            { header: "Updated At", key: "updatedAt", width: 22 },
            { header: "Description", key: "description", width: 50 },
        ];

        // Style header row
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF4472C4" },
        };
        sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

        // Add data rows
        data.forEach((item) => {
            sheet.addRow({
                id: item._id.toString(),
                title: item.title,
                type: item.type,
                status: item.status,
                priority: item.priority,
                category: item.category || "",
                department: item.department || "",
                createdBy: item.createdBy?.name || "",
                createdAt:
                    item.createdAt ?
                        new Date(item.createdAt).toISOString()
                    :   "",
                updatedAt:
                    item.updatedAt ?
                        new Date(item.updatedAt).toISOString()
                    :   "",
                description: item.description || "",
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();

        return {
            content: buffer,
            contentType:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename: `issuances-report-${Date.now()}.xlsx`,
        };
    }

    /**
     * Export data as PDF buffer
     * @param {Array} data - Issuance data array
     * @param {Object} options - PDF options (title, filters description)
     * @returns {{ content: Buffer, contentType: string, filename: string }}
     */
    async exportToPDF(data, options = {}) {
        let PDFDocument;
        try {
            PDFDocument = require("pdfkit");
        } catch {
            const error = new Error(
                "PDF export requires the 'pdfkit' package. Install it with: npm install pdfkit",
            );
            error.statusCode = 501;
            throw error;
        }

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50, size: "A4" });
            const chunks = [];

            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => {
                const buffer = Buffer.concat(chunks);
                resolve({
                    content: buffer,
                    contentType: "application/pdf",
                    filename: `issuances-report-${Date.now()}.pdf`,
                });
            });
            doc.on("error", reject);

            // Title
            doc.fontSize(18)
                .font("Helvetica-Bold")
                .text(options.title || "Issuances Report", { align: "center" });
            doc.moveDown();

            // Generation info
            doc.fontSize(10)
                .font("Helvetica")
                .text(`Generated: ${new Date().toISOString()}`, {
                    align: "right",
                });
            doc.text(`Total Records: ${data.length}`, { align: "right" });
            doc.moveDown();

            // Summary stats
            if (data.length > 0) {
                const statusCounts = {};
                const priorityCounts = {};
                data.forEach((item) => {
                    statusCounts[item.status] =
                        (statusCounts[item.status] || 0) + 1;
                    priorityCounts[item.priority] =
                        (priorityCounts[item.priority] || 0) + 1;
                });

                doc.fontSize(12).font("Helvetica-Bold").text("Summary");
                doc.moveDown(0.5);

                doc.fontSize(10).font("Helvetica");
                Object.entries(statusCounts).forEach(([status, count]) => {
                    doc.text(`  ${status}: ${count}`);
                });
                doc.moveDown(0.5);
                Object.entries(priorityCounts).forEach(([priority, count]) => {
                    doc.text(`  ${priority} Priority: ${count}`);
                });
                doc.moveDown();
            }

            // Table header line
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown(0.5);

            // Issuance details
            data.forEach((item, index) => {
                // Check for page break
                if (doc.y > 700) {
                    doc.addPage();
                }

                doc.fontSize(11)
                    .font("Helvetica-Bold")
                    .text(`${index + 1}. ${item.title}`);
                doc.fontSize(9).font("Helvetica");
                doc.text(
                    `Type: ${item.type} | Status: ${item.status} | Priority: ${item.priority}`,
                );
                doc.text(
                    `Department: ${item.department || "N/A"} | Category: ${item.category || "N/A"}`,
                );
                doc.text(
                    `Created: ${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"} | By: ${item.createdBy?.name || "N/A"}`,
                );

                if (item.description) {
                    const desc =
                        item.description.length > 200 ?
                            item.description.substring(0, 200) + "..."
                        :   item.description;
                    doc.text(`Description: ${desc}`);
                }

                doc.moveDown(0.5);
                doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
                doc.moveDown(0.5);
            });

            doc.end();
        });
    }

    /**
     * Export data to the specified format
     * @param {Array} data - Issuance data array
     * @param {string} format - Export format (csv, excel, pdf, json)
     * @param {Object} options - Additional export options
     */
    async exportToFormat(data, format, options = {}) {
        switch (format) {
            case "csv":
                return this.exportToCSV(data);
            case "excel":
                return this.exportToExcel(data);
            case "pdf":
                return this.exportToPDF(data, options);
            case "json":
                return {
                    content: JSON.stringify(data, null, 2),
                    contentType: "application/json",
                    filename: `issuances-report-${Date.now()}.json`,
                };
            default: {
                const error = new Error(
                    `Unsupported export format: ${format}. Supported: csv, excel, pdf, json`,
                );
                error.statusCode = 400;
                throw error;
            }
        }
    }

    /**
     * Escape CSV value
     * @private
     */
    _escapeCSV(value) {
        if (!value) return "";
        const str = String(value);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }
}

module.exports = new ExportService();
