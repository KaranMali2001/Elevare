"use client";

import payments from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import Script from "next/script";
import { useState } from "react";
declare global {
  interface Window {
    Razorpay: any;
  }
}
export function PricingModalWindow() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (amount: number) => {
    setIsProcessing(true);
    try {
      const res = await payments(amount);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "test",
        description: "test",

        handler: (res: any) => {},
        prefill: {
          name: "test",
          email: "test@gmail.com",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzpi = new window.Razorpay(options);
      rzpi.open();
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Dialog>
        <DialogTrigger asChild>
          <Button>View Pricing Plans</Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl">
          <div className="px-4 py-8 md:py-12">
            <h2 className="text-3xl font-bold text-center mb-12">
              Choose Your Plan
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="rounded-lg border bg-card p-6 space-y-4  hover:border-primary relative overflow-hidden group transform transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <h3 className="text-2xl font-semibold text-center">Free</h3>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">₹0</div>
                  <p className="text-sm text-muted-foreground">
                    Basic email management
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary transition-transform group-hover:rotate-6" />
                    <span>Up to 100 emails/day</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary transition-transform group-hover:rotate-6" />
                    <span>Basic AI categorization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary transition-transform group-hover:rotate-6" />
                    <span>1 GB storage</span>
                  </li>
                </ul>
                <Button
                  className="w-full transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground"
                  variant="outline"
                >
                  Get Started
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="rounded-lg border bg-card p-6 space-y-4  hover:border-primary relative overflow-hidden group transform transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <h3 className="text-2xl font-semibold text-center">Pro</h3>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">₹749</div>
                  <p className="text-sm text-muted-foreground">/month</p>
                  <p className="text-sm text-muted-foreground">
                    Advanced features for professionals
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary transition-transform group-hover:rotate-6" />
                    <span>Unlimited emails</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary transition-transform group-hover:rotate-6" />
                    <span>Advanced AI categorization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary transition-transform group-hover:rotate-6" />
                    <span>10 GB storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary transition-transform group-hover:rotate-6" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary transition-transform group-hover:rotate-6" />
                    <span>Custom AI training</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handlePayment(749)}
                  className="w-full bg-primary transition-all duration-300 ease-in-out hover:bg-primary/90"
                >
                  Subscribe Now
                </Button>
              </div>

              {/* Enterprise Plan */}
              <div className="rounded-lg border bg-card p-6 space-y-4 hover:border-primary relative overflow-hidden group transform transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <h3 className="text-2xl font-semibold text-center">
                  Enterprise
                </h3>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">₹2,249</div>
                  <p className="text-sm text-muted-foreground">/month</p>
                  <p className="text-sm text-muted-foreground">
                    Full-featured solution for teams
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary transition-transform group-hover:rotate-6" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary transition-transform group-hover:rotate-6" />
                    <span>Unlimited storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary transition-transform group-hover:rotate-6" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary transition-transform group-hover:rotate-6" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary transition-transform group-hover:rotate-6" />
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handlePayment(2249)}
                  className="w-full bg-primary transition-all duration-300 ease-in-out hover:bg-primary/90"
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
