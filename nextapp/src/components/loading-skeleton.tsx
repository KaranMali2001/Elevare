"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col md:flex-row w-full gap-6 p-4">
      {/* Left side - Activity List */}
      <div className="w-full md:w-1/2 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button variant="ghost">Show Summary</Button>
        </div>

        {/* Activity items */}
        {[1, 2].map((item) => (
          <div key={item} className="border rounded-lg bg-white p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>

      {/* Right side - Email Generator */}
      <div className="w-full md:w-1/2 space-y-6 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Generate Email</h2>
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        {/* Form fields */}
        <div className="space-y-4 bg-white p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2 bg-white">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full" />
          </div>

          {/* Dropdowns */}
          {["Language", "Writing style", "Email tone", "Length"].map(
            (label) => (
              <div
                key={label}
                className="flex items-center justify-between bg-white"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>
            ),
          )}

          {/* Toggle */}
          <div className="flex items-center justify-between bg-white">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>

          {/* Prompt input */}
          <Skeleton className="h-20 w-full" />

          {/* Action buttons */}
          <div className="flex gap-4 bg-white">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
