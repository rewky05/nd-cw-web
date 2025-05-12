// sales.ts
import { ref, get, child } from "firebase/database";
import { database } from "../../../lib/firebase";
import { format, subMonths, parse } from "date-fns";

export interface Transaction {
  amountDue: number;
  status: string;
  services: Record<string, { price: number; name: string }>;
  addOns?: Record<string, { price: number }>;
}

// 1) Fetch all completed transactions in a given month
export async function fetchCompletedTransactionsByMonth(month: Date): Promise<Transaction[]> {
  const branchRoot = ref(database, "Reservations/ReservationsByBranch");
  const branchSnap = await get(branchRoot);
  if (!branchSnap.exists()) return [];

  const transactions: Transaction[] = [];
  const year = month.getFullYear();
  const monthIdx = month.getMonth(); // 0–11

  for (const [branchId, branchNode] of Object.entries(branchSnap.val() as any)) {
    const datesNode = branchNode as Record<string, any>;
    for (const dateKey of Object.keys(datesNode)) {
      // parse "MM-dd-yyyy"
      const parsed = parse(dateKey, "MM-dd-yyyy", new Date());
      if (parsed.getFullYear() !== year || parsed.getMonth() !== monthIdx) continue;

      const txRoot = child(branchRoot, `${branchId}/${dateKey}`);
      const txSnap = await get(txRoot);
      if (!txSnap.exists()) continue;

      for (const tx of Object.values(txSnap.val() as Record<string, any>)) {
        if (tx.status === "completed") {
          transactions.push({
            amountDue: tx.amountDue,
            status: tx.status,
            services: tx.services || {},
            addOns: tx.addOns || {},
          });
        }
      }
    }
  }

  return transactions;
}

// 2) Booking fees = ₱20 per transaction
export function calculateBookingFees(transactions: Transaction[]): number {
  return transactions.length * 20;
}

// 3) Service payments = sum(amountDue − ₱20)
export function calculateServicePayments(transactions: Transaction[]): number {
  return transactions.reduce((sum, tx) => sum + (tx.amountDue - 20), 0);
}

// 4) Percent change helper: ((current − previous) / previous) × 100
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

// 5) % breakdown of Body Wash, Value Wash, Add-Ons (by revenue)
export function calculateCategoryPercentages(transactions: Transaction[]) {
  let bodyWashRev = 0;
  let valueWashRev = 0;
  let addOnsRev = 0;
  let totalRev = 0;

  for (const tx of transactions) {
    totalRev += tx.amountDue;
    // services
    for (const svc of Object.values(tx.services)) {
      if (/body wash/i.test(svc.name)) bodyWashRev += svc.price;
      else if (/value wash/i.test(svc.name)) valueWashRev += svc.price;
    }
    // add-ons
    if (tx.addOns) {
      for (const ao of Object.values(tx.addOns)) {
        addOnsRev += ao.price;
      }
    }
  }

  return {
    bodyWash: totalRev ? (bodyWashRev / totalRev) * 100 : 0,
    valueWash: totalRev ? (valueWashRev / totalRev) * 100 : 0,
    addOns:    totalRev ? (addOnsRev    / totalRev) * 100 : 0,
  };
}

// --- Example orchestration: get current vs previous month stats ---
export async function getMonthlySalesComparison() {
  const now = new Date();
  const lastMonth = subMonths(now, 1);

  const [thisMonthTx, prevMonthTx] = await Promise.all([
    fetchCompletedTransactionsByMonth(now),
    fetchCompletedTransactionsByMonth(lastMonth),
  ]);

  const thisBooking = calculateBookingFees(thisMonthTx);
  const prevBooking = calculateBookingFees(prevMonthTx);

  const thisService = calculateServicePayments(thisMonthTx);
  const prevService = calculateServicePayments(prevMonthTx);

  const bookingPctChange = calculatePercentageChange(thisBooking, prevBooking);
  const servicePctChange = calculatePercentageChange(thisService, prevService);

  const categoryPct = calculateCategoryPercentages(thisMonthTx);

  return {
    bookingFees: thisBooking,
    servicePayments: thisService,
    bookingPctChange,
    servicePctChange,
    categoryPct,  // { bodyWash, valueWash, addOns }
  };
}
