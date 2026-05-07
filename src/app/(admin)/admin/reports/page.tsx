"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { downloadCSV, downloadPDF } from "@/lib/export";
import type { Subscriber } from "@/lib/stats";

export default function ReportsPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then((r) => r.json())
      .then((data) => { setSubscribers(data); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-bold text-white">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Download subscriber data</p>
      </div>

      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-base">Subscriber Export</CardTitle>
          <CardDescription className="text-gray-500">
            {loading ? "Loading…" : `${subscribers.length} subscribers`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => downloadCSV(subscribers)}
            className="border-white/10 text-white hover:bg-white/10"
          >
            Download CSV
          </Button>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => downloadPDF(subscribers, subscribers.length)}
            className="border-white/10 text-white hover:bg-white/10"
          >
            Download PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
