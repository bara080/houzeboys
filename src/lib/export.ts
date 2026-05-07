import type { Subscriber } from "@/lib/stats";

export function downloadCSV(subscribers: Subscriber[]) {
  const headers = ["Name", "Email", "Phone", "Joined"];
  const rows = subscribers.map((s) => [
    s.name,
    s.email,
    s.phone,
    new Date(s.created_at).toLocaleDateString("en-US"),
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `houzeboys-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadPDF(subscribers: Subscriber[], totalCount: number) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("Houzeboys — Subscriber Report", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US")}`, 14, 28);
  doc.text(`Total subscribers: ${totalCount}`, 14, 34);

  autoTable(doc, {
    startY: 42,
    head: [["Name", "Email", "Phone", "Joined"]],
    body: subscribers.map((s) => [
      s.name,
      s.email,
      s.phone,
      new Date(s.created_at).toLocaleDateString("en-US"),
    ]),
    headStyles: { fillColor: [0, 0, 0], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    styles: { fontSize: 9 },
  });

  doc.save(`houzeboys-subscribers-${new Date().toISOString().slice(0, 10)}.pdf`);
}
