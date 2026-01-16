"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Props = {
  classId: string;
  onSuccess: () => void;
};

type LogEntry = {
  type: "SUCCESS" | "ERROR" | "INFO";
  message: string;
  row?: number;
};

export default function BulkUploadProductDialog({ classId, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState<{
    added: number;
    failed: number;
  } | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const resetState = () => {
    setFile(null);
    setLogs([]);
    setProgress(0);
    setSummary(null);
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSummary(null);
      setLogs([]);
      setProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    if (!classId) {
      toast({
        title: "Error",
        description: "Missing Class ID. Please refresh page.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setLogs([]);
    setSummary(null);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("classId", classId);

    try {
      const response = await fetch("/api/admin/products/bulk", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || "Upload failed");
      }

      if (!response.body) throw new Error("No response stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let totalRows = 0;
      let processedRows = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const data = JSON.parse(line);

            if (data.type === "START") {
              totalRows = data.total;
              setLogs((prev) => [
                ...prev,
                {
                  type: "INFO",
                  message: `Starting upload of ${data.total} products...`,
                },
              ]);
            } else if (data.type === "PROGRESS") {
              processedRows++;
              if (totalRows > 0) {
                setProgress(Math.round((processedRows / totalRows) * 100));
              }

              if (data.status === "SUCCESS") {
                setLogs((prev) => [
                  ...prev,
                  {
                    type: "SUCCESS",
                    message: `Row ${data.row}: ${data.name} added.`,
                    row: data.row,
                  },
                ]);
              } else {
                setLogs((prev) => [
                  ...prev,
                  {
                    type: "ERROR",
                    message: `Row ${data.row}: ${data.message}`,
                    row: data.row,
                  },
                ]);
              }
            } else if (data.type === "COMPLETE") {
              setSummary({ added: data.added, failed: data.failed });
              setUploading(false);
              onSuccess();
              if (data.failed === 0) {
                toast({
                  title: "Upload Complete",
                  description: `Successfully added ${data.added} products.`,
                });
              } else {
                toast({
                  title: "Upload Finished",
                  description: `${data.added} added, ${data.failed} failed. Check logs.`,
                  variant: "destructive",
                });
              }
            }
          } catch (e) {
            console.error("Error parsing stream line", e);
          }
        }
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setLogs((prev) => [
        ...prev,
        {
          type: "ERROR",
          message: error.message || "Upload failed. Server connection error.",
        },
      ]);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!uploading) {
          setOpen(val);
          if (!val) setTimeout(resetState, 300);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload CSV</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn("sm:max-w-[600px]", uploading && "[&>button]:hidden")}
      >
        <DialogHeader>
          <DialogTitle>Bulk Upload Products</DialogTitle>
          <DialogDescription>
            Upload a CSV file to add multiple products to this class at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* File Input Phase */}
          {!uploading && !summary && (
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="csv">CSV File</Label>
              <div className="flex gap-2">
                <Input
                  id="csv"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Headers required: name, description, price, category, brand,
                stock (optional), minQuantity.
              </p>
              <p className="text-xs text-muted-foreground">
                Valid Categories: TEXTBOOK, NOTEBOOK, STATIONARY, OTHER
              </p>
            </div>
          )}

          {/* Progress Phase */}
          {(uploading || summary) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Logs Phase */}
          {(uploading || logs.length > 0) && (
            <div className="rounded-md border bg-muted/50 p-4 h-[250px] overflow-y-auto font-mono text-xs">
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-2",
                      log.type === "SUCCESS"
                        ? "text-green-600"
                        : log.type === "ERROR"
                        ? "text-red-600"
                        : "text-blue-600"
                    )}
                  >
                    {log.type === "SUCCESS" && (
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    )}
                    {log.type === "ERROR" && (
                      <XCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    )}
                    {log.type === "INFO" && (
                      <Loader2 className="h-3.5 w-3.5 mt-0.5 shrink-0 animate-spin" />
                    )}
                    <span>{log.message}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          )}

          {/* Summary Phase */}
          {summary && (
            <div
              className={cn(
                "rounded-lg p-4 border flex items-center justify-between",
                summary.failed === 0
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-orange-50 border-orange-200 text-orange-800"
              )}
            >
              <div className="flex items-center gap-3">
                {summary.failed === 0 ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <div>
                  <p className="font-semibold">Process Completed</p>
                  <p className="text-sm">
                    Added: {summary.added} | Failed: {summary.failed}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={resetState}
                className="bg-white/50 hover:bg-white/80 border-black/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Upload Another
              </Button>
            </div>
          )}
        </div>

        {!uploading && !summary && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Start Upload
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
