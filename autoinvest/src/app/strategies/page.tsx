import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function createStrategy(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const userId = String(formData.get("userId") || "");
  if (!name || !userId) return;
  await prisma.strategy.create({
    data: {
      name,
      description,
      userId,
      parameters: {},
    },
  });
  revalidatePath("/strategies");
}

export default async function StrategiesPage() {
  const auth = getAuth();
  const userId = auth?.userId ?? "";
  const strategies = await prisma.strategy.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Estratégias</h1>
      <form action={createStrategy} className="space-y-2 border rounded p-4">
        <input type="hidden" name="userId" value={userId} />
        <input name="name" className="w-full border rounded p-2" placeholder="Nome" />
        <textarea name="description" className="w-full border rounded p-2" placeholder="Descrição"></textarea>
        <button className="border rounded px-3 py-1">Criar</button>
      </form>
      <ul className="divide-y border rounded">
        {strategies.map((s) => (
          <li key={s.id} className="p-4">
            <div className="font-medium">{s.name}</div>
            <div className="text-sm text-gray-600">{s.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}