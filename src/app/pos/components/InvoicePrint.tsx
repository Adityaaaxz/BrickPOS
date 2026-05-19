"use client";

import React, { forwardRef } from "react";
import { Blocks } from "lucide-react";

type CartItem = {
  product: {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
  };
  quantity: number;
};

type InvoicePrintProps = {
  cart: CartItem[];
  total: number;
  tax: number;
  grandTotal: number;
  transactionId: string;
};

const InvoicePrint = forwardRef<HTMLDivElement, InvoicePrintProps>(
  ({ cart, total, tax, grandTotal, transactionId }, ref) => {
    const date = new Date().toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div ref={ref} className="print-only-invoice p-8 bg-white text-black hidden w-full max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center border-b-2 border-black pb-4 mb-4">
          <div className="w-12 h-12 bg-lego-red rounded-xl flex items-center justify-center mb-2">
            <Blocks className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black uppercase">BrickVault POS</h1>
          <p className="text-sm font-bold text-gray-500">Official LEGO Store</p>
          <p className="text-xs text-gray-400 mt-1">Transaction: #{transactionId}</p>
          <p className="text-xs text-gray-400">{date}</p>
        </div>

        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b border-black font-bold text-left">
              <th className="py-2">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-2 font-semibold">
                  {item.product.name}
                  <div className="text-xs text-gray-500 uppercase">{item.product.category}</div>
                </td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">${item.product.price}</td>
                <td className="py-2 text-right">${(item.product.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col items-end text-sm mb-8 space-y-1">
          <div className="flex justify-between w-48">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-48">
            <span>Tax (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-48 font-black text-lg border-t-2 border-black pt-1 mt-1">
            <span>TOTAL:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center text-xs font-bold border-t-2 border-black pt-4">
          <p>Thank you for building with us!</p>
          <p className="text-gray-500">Please keep this receipt for your records.</p>
        </div>
      </div>
    );
  }
);

InvoicePrint.displayName = "InvoicePrint";

export default InvoicePrint;
