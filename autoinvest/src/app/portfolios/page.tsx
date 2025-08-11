import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function createPortfolio(formData: FormData) {
  "use server";
  const userId = String(formData.get("userId") || "");
  const name = String(formData.get("name") || "").trim();
  const baseCurrency = String(formData.get("baseCurrency") || "USD");
  if (!userId || !name) return;
  await prisma.portfolio.create({ data: { userId, name, baseCurrency } });
  revalidatePath("/portfolios");
}

export default async function PortfoliosPage() {
  const auth = getAuth();
  const userId = auth?.userId ?? "";
  const portfolios = await prisma.portfolio.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Portfólios</h1>
      <form action={createPortfolio} className="space-y-2 border rounded p-4">
        <input type="hidden" name="userId" value={userId} />
        <input name="name" className="w-full border rounded p-2" placeholder="Nome do portfólio" />
        <input name="baseCurrency" className="w-full border rounded p-2" placeholder="Moeda base (ex: USD)" defaultValue="USD" />
        <button className="border rounded px-3 py-1">Criar</button>
      </form>
      <ul className="divide-y border rounded">
        {portfolios.map((p) => (
          <li key={p.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-600">Saldo: {p.balance.toFixed(2)} {p.baseCurrency}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}