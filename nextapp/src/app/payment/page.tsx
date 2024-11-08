"use client";

import { PaymentPageComponent } from "@/components/payment-page";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}
export default function Page() {
  const amount = 100;

  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <PaymentPageComponent />
    </div>
  );
}
