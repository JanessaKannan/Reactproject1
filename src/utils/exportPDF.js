import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportDashboardToPDF(element, fileName = 'analytics-report.pdf') {
  if (!element) throw new Error('No element provided to export.');

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let y = 0;
  let remaining = imgHeight;

  while (remaining > 0) {
    pdf.addImage(imgData, 'PNG', 0, y, imgWidth, imgHeight);
    remaining -= pageHeight;
    if (remaining > 0) {
      pdf.addPage();
      y -= pageHeight;
    }
  }

  pdf.save(fileName);
}

