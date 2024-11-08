"use client";

import payments from "@/actions/payments";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Mail } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Basic email management",
    features: [
      "Up to 100 emails/day",
      "Basic AI categorization",
      "1 GB storage",
    ],
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "Advanced features for professionals",
    features: [
      "Unlimited emails",
      "Advanced AI categorization",
      "10 GB storage",
      "Priority support",
      "Custom AI training",
    ],
  },
  {
    name: "Enterprise",
    price: "$29.99",
    description: "Full-featured solution for teams",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "Team collaboration",
      "API access",
      "Dedicated account manager",
    ],
  },
];

export function PaymentPageComponent() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const amount = 100;
  const handlePayment = async () => {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-[#a78bfa] mr-2" />
            <span className="text-2xl font-bold text-gray-800">EmailAI</span>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Choose Your Plan
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`w-full bg-white transition-all duration-300 ease-in-out cursor-pointer ${
                selectedPlan === index
                  ? "ring-2 ring-[#a78bfa] transform scale-105"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedPlan(index)}
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-center">
                  <span className="text-4xl font-bold text-[#a78bfa]">
                    {plan.price}
                  </span>
                  {index !== 0 && (
                    <span className="text-sm text-gray-500">/month</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 mb-6">
                  {plan.description}
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <Check className="h-5 w-5 text-[#a78bfa] mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handlePayment}
                  className={`w-full py-6 text-lg font-semibold ${
                    index === 0
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      : "bg-[#a78bfa] text-white hover:bg-[#9061f9]"
                  } transition-colors`}
                >
                  {index === 0 ? "Get Started" : "Subscribe Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} EmailAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
