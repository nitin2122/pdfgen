import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export const exportToImage = async (elementId, filename) => {
  const element = document.getElementById(elementId);
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });
  
  canvas.toBlob((blob) => {
    saveAs(blob, `${filename}.png`);
  });
};

export const exportToDocx = async (invoice, subtotal, taxAmount, total) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: "INVOICE",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Invoice #: ${invoice.details.number}`, bold: true }),
            new TextRun({ text: `\nDate: ${invoice.details.date}`, break: 1 }),
          ],
        }),
        new Paragraph({ text: "" }), // Spacer
        
        new Paragraph({
          children: [
            new TextRun({ text: "From:", bold: true }),
            new TextRun({ text: `\n${invoice.business.name}`, break: 1 }),
            new TextRun({ text: `\n${invoice.business.address}`, break: 1 }),
          ],
        }),
        new Paragraph({ text: "" }),
        
        new Paragraph({
          children: [
            new TextRun({ text: "Bill To:", bold: true }),
            new TextRun({ text: `\n${invoice.client.name}`, break: 1 }),
            new TextRun({ text: `\n${invoice.client.address}`, break: 1 }),
          ],
        }),
        new Paragraph({ text: "" }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "Description", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "Qty", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "Price", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "Total", bold: true })] }),
              ],
            }),
            ...invoice.items.map(item => new TableRow({
              children: [
                new TableCell({ children: [new Paragraph(item.description)] }),
                new TableCell({ children: [new Paragraph(item.quantity.toString())] }),
                new TableCell({ children: [new Paragraph(`$${item.price.toFixed(2)}`)] }),
                new TableCell({ children: [new Paragraph(`$${(item.quantity * item.price).toFixed(2)}`)] }),
              ],
            })),
          ],
        }),
        
        new Paragraph({ text: "" }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: `Subtotal: $${subtotal.toFixed(2)}` }),
            new TextRun({ text: `\nTax (${invoice.taxRate}%): $${taxAmount.toFixed(2)}`, break: 1 }),
            new TextRun({ text: `\nTotal: $${total.toFixed(2)}`, break: 1, bold: true, size: 28 }),
          ],
        }),
        
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [
            new TextRun({ text: "Notes:", bold: true }),
            new TextRun({ text: `\n${invoice.notes}`, break: 1 }),
          ],
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `invoice_${invoice.details.number}.docx`);
};
