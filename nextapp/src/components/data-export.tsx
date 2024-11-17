"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import axios from "axios";
import { fi } from "date-fns/locale";

export function DataExportComponent() {
  const [exportOption, setExportOption] = useState("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileFromApi, setFileFromApi] = useState<any>();
  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);

    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(intervalId);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 200);

    const res = await axios.post(
      "/api/exportData",
      {
        startDate: startDate,
        endDate: endDate,
      },

      {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    clearInterval(intervalId);
    setProgress(100);
    setIsExporting(false);
  };

  const handleDownload = async () => {
    const blob = new Blob([fileFromApi.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "exported_data.pdf");
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setProgress(100);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl bg-card mx-auto shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-primary">
            Export Data
          </CardTitle>
          <CardDescription>Choose your export options</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <RadioGroup value={exportOption} onValueChange={setExportOption}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="range" />
                <Label htmlFor="range">Date Range</Label>
              </div>
            </RadioGroup>

            <div className="h-[100px] transition-all duration-300 ease-in-out">
              {exportOption === "range" ? (
                <div className="flex space-x-4 animate-fadeIn">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>End date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full animate-fadeIn">
                  <p className="text-gray-500">All data will be exported</p>
                </div>
              )}
            </div>

            <Button
              onClick={handleExport}
              disabled={
                isExporting ||
                (exportOption === "range" && (!startDate || !endDate))
              }
              className="w-full transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {isExporting ? "Exporting..." : "Export"}
            </Button>

            {isExporting && (
              <div className="space-y-2 animate-fadeIn">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center">{progress}% complete</p>
              </div>
            )}

            {progress === 100 && !isExporting && (
              <Button
                onClick={handleDownload}
                className="w-full mt-4 transition-all duration-300 ease-in-out transform hover:scale-105 animate-fadeIn"
              >
                Download File
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
