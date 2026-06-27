"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { EvolucaoFinanceira, AtendimentoPorEspecialidade } from "@/types";

interface FinanceAreaChartProps {
  data: EvolucaoFinanceira[];
}

interface EspecialidadesPieChartProps {
  data: AtendimentoPorEspecialidade[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg shadow-lg border text-xs"
        style={{
          background: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
          color: "hsl(var(--foreground))",
        }}
      >
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {typeof p.value === "number" && p.value > 1000
              ? `R$ ${p.value.toLocaleString("pt-BR")}`
              : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function FinanceAreaChart({ data }: FinanceAreaChartProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="xl:col-span-2 rounded-2xl border p-5"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
            Evolução Financeira
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
            Receitas vs. Despesas — 2026
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-full bg-primary"></div>
            <span style={{ color: "hsl(var(--muted-foreground))" }}>Receita</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-full bg-secondary"></div>
            <span style={{ color: "hsl(var(--muted-foreground))" }}>Despesa</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="receitaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8E7BBE" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8E7BBE" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="despesaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E98BAE" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#E98BAE" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="receita"
            name="Receita"
            stroke="#8E7BBE"
            strokeWidth={2}
            fill="url(#receitaGradient)"
          />
          <Area
            type="monotone"
            dataKey="despesa"
            name="Despesa"
            stroke="#E98BAE"
            strokeWidth={2}
            fill="url(#despesaGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function EspecialidadesPieChart({ data }: EspecialidadesPieChartProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl border p-5"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      <h2 className="font-semibold text-sm mb-1" style={{ color: "hsl(var(--foreground))" }}>
        Por Especialidade
      </h2>
      <p className="text-xs mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
        Atendimentos no mês
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: any) => [`${v}%`, ""]}
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "11px",
              color: "hsl(var(--foreground))",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[hsl(var(--muted-foreground))]" style={{ fontSize: "11px" }}>
                {item.name}
              </span>
            </div>
            <span className="font-bold text-[hsl(var(--foreground))]" style={{ fontSize: "11px" }}>
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
