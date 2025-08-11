import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type BacktestMetrics = { days: number; initialCash: number; finalValue: number; return: number; winRate: number };

function simulateBacktest(days: number, initialCash: number) {
  const prices: number[] = [];
  let price = 100;
  for (let i = 0; i < days; i++) {
    const drift = (Math.random() - 0.5) * 2;
    price = Math.max(1, price * (1 + drift * 0.01));
    prices.push(Number(price.toFixed(2)));
  }
  let cash = initialCash;
  let qty = 0;
  const trades: { day: number; side: "BUY" | "SELL"; price: number; qty: number }[] = [];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1] && cash > 0) {
      const invest = cash * 0.5;
      const buyQty = invest / prices[i];
      qty += buyQty;
      cash -= invest;
      trades.push({ day: i, side: "BUY", price: prices[i], qty: Number(buyQty.toFixed(6)) });
    } else if (prices[i] < prices[i - 1] && qty > 0) {
      const sellQty = qty * 0.5;
      qty -= sellQty;
      cash += sellQty * prices[i];
      trades.push({ day: i, side: "SELL", price: prices[i], qty: Number(sellQty.toFixed(6)) });
    }
  }
  const finalValue = cash + qty * prices[prices.length - 1];
  const ret = (finalValue - initialCash) / initialCash;
  const wins = trades.filter((t) => t.side === "SELL" && prices[t.day] > prices[t.day - 1]).length;
  const sells = trades.filter((t) => t.side === "SELL").length;
  const winRate = sells === 0 ? 0 : wins / sells;
  const metrics: BacktestMetrics = { days, initialCash, finalValue: Number(finalValue.toFixed(2)), return: Number(ret.toFixed(4)), winRate: Number(winRate.toFixed(4)) };
  return { trades, metrics };
}

async function runBacktest(formData: FormData) {
  "use server";
  const strategyId = String(formData.get("strategyId") || "");
  const days = Number(formData.get("days") || 100);
  const initialCash = Number(formData.get("initialCash") || 10000);
  if (!strategyId) return;
  const sim = simulateBacktest(days, initialCash);
  await prisma.backtest.create({
    data: {
      strategyId,
      from: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      to: new Date(),
      initialCash,
      finalCash: sim.metrics.finalValue,
      trades: sim.trades as unknown as object,
      metrics: sim.metrics as unknown as object,
    },
  });
  revalidatePath("/backtests");
}

export default async function BacktestsPage() {
  const auth = getAuth();
  const userId = auth?.userId ?? "";
  const strategies = await prisma.strategy.findMany({ where: { userId } });
  const backtests = await prisma.backtest.findMany({ where: { strategy: { userId } }, include: { strategy: true }, orderBy: { createdAt: "desc" } });
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Backtests</h1>
      <form action={runBacktest} className="space-y-2 border rounded p-4">
        <select name="strategyId" className="w-full border rounded p-2">
          <option value="">Selecione uma estratégia</option>
          {strategies.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input name="days" type="number" className="w-full border rounded p-2" defaultValue={120} placeholder="Dias" />
          <input name="initialCash" type="number" className="w-full border rounded p-2" defaultValue={10000} placeholder="Capital inicial" />
        </div>
        <button className="border rounded px-3 py-1">Executar</button>
      </form>
      <ul className="divide-y border rounded">
        {backtests.map((b) => {
          const m = b.metrics as unknown as BacktestMetrics;
          return (
            <li key={b.id} className="p-4">
              <div className="font-medium">{b.strategy.name}</div>
              <div className="text-sm text-gray-600">{new Date(b.from).toLocaleDateString()} → {new Date(b.to).toLocaleDateString()}</div>
              <div className="text-sm">Retorno: {(m.return * 100).toFixed(2)}% | WinRate: {(m.winRate * 100).toFixed(1)}%</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}