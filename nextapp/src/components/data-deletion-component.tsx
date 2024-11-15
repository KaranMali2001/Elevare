"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Trash2 } from "lucide-react";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";

export function DataDeletionComponent() {
  const [deleteOption, setDeleteOption] = useState("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = async () => {
    const res = await axios.post("/api/deleteData", {
      startDate: startDate,
      endDate: endDate,
    });

    setIsConfirmOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl bg-card mx-auto shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-primary">
            Delete Data
          </CardTitle>
          <CardDescription>Choose your deletion options</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <RadioGroup value={deleteOption} onValueChange={setDeleteOption}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="delete-all" />
                <Label htmlFor="delete-all">All Data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="delete-range" />
                <Label htmlFor="delete-range">Date Range</Label>
              </div>
            </RadioGroup>

            <div className="h-[100px] transition-all duration-300 ease-in-out">
              {deleteOption === "range" ? (
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
                  <p className="text-gray-500">All data will be deleted</p>
                </div>
              )}
            </div>

            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full transition-all duration-300 ease-in-out transform hover:scale-105"
                  disabled={
                    deleteOption === "range" && (!startDate || !endDate)
                  }
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    {deleteOption === "all"
                      ? "This action cannot be undone. This will permanently delete all your data."
                      : `This action cannot be undone. This will permanently delete your data from ${
                          startDate ? format(startDate, "PPP") : "start date"
                        } to ${endDate ? format(endDate, "PPP") : "end date"}.`}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsConfirmOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Yes, delete data
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
