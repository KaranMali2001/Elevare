"use server";
import Razorpay from "razorpay";
const razorPay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function payments(amount: number) {
  try {
    const order = await razorPay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt for payment",
      notes: {
        key1: "idl",
        key2: "idk2",
      },
    });
  } catch (error: any) {}
}
