import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, RefreshCw, Shuffle, Lightbulb, Hash } from "lucide-react";
import { usePasswordGenerator, type PasswordMode } from "@/hooks/use-password-generator";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "强密码生成器 | 安全随机密码工具" },
      { name: "description", content: "强大、安全、卓越的随机密码生成器，支持随机密码、记忆短语和PIN码模式。" },
    ],
  }),
});

const MODES: { id: PasswordMode; label: string; icon: typeof Shuffle }[] = [
  { id: "random", label: "随机", icon: Shuffle },
  { id: "memorable", label: "容易记住", icon: Lightbulb },
  { id: "pin", label: "PIN", icon: Hash },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-[hsl(var(--brand-rgb))]" : "bg-slate-300"
      }`}
      style={{ backgroundColor: checked ? "#0070E0" : undefined }}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

type Burst = { id: number; emoji: string };

function Index() {
  const g = usePasswordGenerator();
  const [copied, setCopied] = useState(false);
  const [good, setGood] = useState<number>(() => Number(typeof localStorage !== "undefined" ? localStorage.getItem("fb_good") ?? 0 : 0));
  const [bad, setBad] = useState<number>(() => Number(typeof localStorage !== "undefined" ? localStorage.getItem("fb_bad") ?? 0 : 0));
  const [bursts, setBursts] = useState<Record<"good" | "bad", Burst[]>>({ good: [], bad: [] });

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("fb_good", String(good));
    localStorage.setItem("fb_bad", String(bad));
  }

  const triggerBurst = (kind: "good" | "bad", emoji: string) => {
    const id = Date.now() + Math.random();
    setBursts((b) => ({ ...b, [kind]: [...b[kind], { id, emoji }] }));
    setTimeout(() => {
      setBursts((b) => ({ ...b, [kind]: b[kind].filter((x) => x.id !== id) }));
    }, 900);
  };

  const handleGood = () => {
    setGood((n) => n + 1);
    triggerBurst("good", "👍");
  };
  const handleBad = () => {
    setBad((n) => n + 1);
    triggerBurst("bad", "😢");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(g.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const minLen = g.mode === "pin" ? 3 : 8;
  const maxLen = g.mode === "pin" ? 12 : 100;

  return (
    <main className="min-h-screen bg-[#0A2540] text-white">
      {/* Nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">免费随机码生成器</span>
        </div>
        <button className="rounded-full bg-[#0070E0] px-5 py-2.5 text-sm font-semibold hover:bg-[#005fc4] transition-colors">
          免费开始使用
        </button>
      </header>

      {/* Hero + Generator */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-8 flex gap-12">
            <button
              onClick={handleGood}
              className="relative flex h-24 w-32 flex-col items-center justify-center gap-1 rounded-xl bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition-all border border-emerald-500/30"
            >
              <span className="text-sm font-semibold">Good</span>
              <span className="text-xl font-bold tabular-nums">{good}</span>
              {bursts.good.map((b) => (
                <span
                  key={b.id}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl animate-[burst_0.9s_ease-out_forwards]"
                >
                  {b.emoji}
                </span>
              ))}
            </button>
            <button
              onClick={handleBad}
              className="relative flex h-24 w-32 flex-col items-center justify-center gap-1 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 active:scale-95 transition-all border border-rose-500/30"
            >
              <span className="text-sm font-semibold">Bad</span>
              <span className="text-xl font-bold tabular-nums">{bad}</span>
              {bursts.bad.map((b) => (
                <span
                  key={b.id}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl animate-[burst_0.9s_ease-out_forwards]"
                >
                  {b.emoji}
                </span>
              ))}
            </button>
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            无需注册，无需绑定手机，无需绑定账号，事了抚衣去，深藏功与名。杜绝隐私泄露。
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            版权所有@涛哥
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 text-slate-900 shadow-2xl">
          {/* Mode tabs */}
          <div>
            <label className="text-sm font-medium text-slate-700">选择密码类型</label>
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-slate-100 p-1">
              {MODES.map((m) => {
                const Icon = m.icon;
                const active = g.mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => g.setMode(m.id)}
                    className={`flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all ${
                      active ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={16} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customize */}
          <div className="mt-8">
            <label className="text-sm font-medium text-slate-700">自定义新密码</label>
            <div className="mt-4 h-px bg-slate-200" />

            {/* Length slider */}
            <div className="mt-5 flex items-center gap-4">
              <span className="text-sm text-slate-600 w-10">{g.mode === "memorable" ? "单词" : "字符"}</span>
              <input
                type="range"
                min={minLen}
                max={maxLen}
                value={g.length}
                onChange={(e) => g.setLength(Number(e.target.value))}
                className="flex-1 accent-[#0070E0]"
              />
              <div className="w-14 rounded-md border border-slate-200 px-2 py-1 text-center text-sm font-medium">
                {g.length}
              </div>
            </div>

            {/* Toggles */}
            {g.mode !== "pin" && (
              <div className="mt-6 flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-700">数字</span>
                  <Toggle checked={g.numbers} onChange={g.setNumbers} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-700">符号</span>
                  <Toggle checked={g.symbols} onChange={g.setSymbols} />
                </div>
              </div>
            )}
          </div>

          {/* Result */}
          <div className="mt-8">
            <label className="text-sm font-medium text-slate-700">生成密码</label>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
              <code className="flex-1 break-all font-mono text-lg tracking-wide text-slate-900">
                {g.password}
              </code>
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-md p-2 text-slate-500 hover:bg-slate-200 hover:text-[#0070E0] transition-colors"
                aria-label="复制密码"
              >
                {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
              </button>
            </div>
            {copied && <p className="mt-2 text-xs text-green-600">已复制到剪贴板</p>}
          </div>

          {/* Actions */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="rounded-lg bg-[#0070E0] py-3 text-sm font-semibold text-white hover:bg-[#005fc4] transition-colors"
            >
              复制密码
            </button>
            <button
              onClick={g.regenerate}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-[#0070E0] py-3 text-sm font-semibold text-[#0070E0] hover:bg-[#0070E0]/5 transition-colors"
            >
              <RefreshCw size={16} />
              刷新密码
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
