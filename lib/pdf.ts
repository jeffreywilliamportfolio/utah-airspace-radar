import PDFDocument from "pdfkit";
import { DashboardData } from "@/lib/types";

export async function buildDashboardPdf(data: DashboardData): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.fontSize(20).text("Utah Airspace Monitor Snapshot");
    doc.moveDown(0.4);
    doc.fontSize(11).text(`Generated: ${new Date(data.generatedAt).toUTCString()}`);
    doc.moveDown();

    doc.fontSize(14).text("Top Stories");
    for (const story of data.stories.slice(0, 20)) {
      doc.moveDown(0.3);
      doc.fontSize(11).text(`• ${story.title}`);
      doc.fontSize(10).text(story.summary);
      doc.fontSize(9).fillColor("#2563eb").text(story.sourceUrl).fillColor("#000");
    }

    doc.addPage();
    doc.fontSize(14).text("SLC / Utah NOTAM Signals");
    for (const notam of data.notams.slice(0, 20)) {
      doc.moveDown(0.3);
      doc.fontSize(11).text(`• ${notam.title}`);
      doc.fontSize(10).text(notam.body);
      doc.fontSize(9).fillColor("#2563eb").text(notam.sourceUrl).fillColor("#000");
    }

    doc.addPage();
    doc.fontSize(14).text("Event Log");
    for (const event of data.eventLog.slice(0, 40)) {
      doc
        .moveDown(0.2)
        .fontSize(10)
        .text(`[${new Date(event.createdAt).toUTCString()}] ${event.type}: ${event.message}`);
    }

    doc.end();
  });
}
