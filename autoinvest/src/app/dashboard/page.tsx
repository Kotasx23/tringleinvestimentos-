import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const auth = getAuth();
  if (!auth) {
    return (
      <div className="p-6">Não autenticado. <a className="underline" href="/login">Entrar</a></div>
    );
  }
  const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { email: true, name: true } });
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <form action="/api/auth/logout" method="post">
          <button className="border rounded px-3 py-1" formAction="/api/auth/logout">Sair</button>
        </form>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-600">Usuário</p>
        <p className="font-medium">{user?.name ?? user?.email}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card href="/strategies" title="Estratégias" desc="Crie e gerencie robôs" />
        <Card href="/portfolios" title="Portfólios" desc="Acompanhe saldo e posições" />
        <Card href="/backtests" title="Backtests" desc="Teste suas ideias" />
      </div>
    </div>
  );
}

function Card({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="block border rounded-lg p-4 hover:bg-gray-50">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-600">{desc}</div>
    </Link>
  );
}