import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Copy, Check, RefreshCw, Shuffle, Lightbulb, Hash, Sparkles, KeyRound } from "lucide-react";
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

const COMPANY_CHARS = "鑫盛源昌泰隆兴和顺达通宇辰晟瀚远博睿智云海星辰天弘伟立华夏龙凤金玉福祥瑞祥安信德裕丰润恒美佳乐康瑞翔翼诚信缘聚汇高科创新锐影领途";
const SUFFIX_PRESETS = ["科技有限公司", "信息技术有限公司", "网络科技有限公司", "贸易有限公司", "文化传媒有限公司"];

function randomCompanyName(prefix: string, suffix: string, midLen: number) {
  let mid = "";
  for (let i = 0; i < midLen; i++) {
    mid += COMPANY_CHARS.charAt(Math.floor(Math.random() * COMPANY_CHARS.length));
  }
  return `${prefix}${mid}${suffix}`;
}

function Index() {
  const g = usePasswordGenerator();
  const [copied, setCopied] = useState(false);
  const [good, setGood] = useState<number>(0);
  const [bad, setBad] = useState<number>(0);
  const [bursts, setBursts] = useState<Record<"good" | "bad", Burst[]>>({ good: [], bad: [] });

  // Company generator state
  const [prefix, setPrefix] = useState("北京");
  const [suffix, setSuffix] = useState("科技有限公司");
  const [midLen, setMidLen] = useState(2);
  const [count, setCount] = useState(10);
  const [companies, setCompanies] = useState<string[]>([]);
  const [companiesCopied, setCompaniesCopied] = useState(false);

  useEffect(() => {
    setGood(Number(localStorage.getItem("fb_good") ?? 0));
    setBad(Number(localStorage.getItem("fb_bad") ?? 0));
  }, []);

  useEffect(() => {
    localStorage.setItem("fb_good", String(good));
    localStorage.setItem("fb_bad", String(bad));
  }, [good, bad]);

  const marqueeText = "无需注册,无需绑定手机,无需绑定账号,事了抚衣去,深藏功与名。杜绝隐私泄露。";
  const marqueeColors = useMemo(
    () => ["#ff5e5e", "#ffb454", "#ffe156", "#7ddc6a", "#5ec8ff", "#a78bfa", "#ff7ac6", "#ffffff"],
    []
  );

  const triggerBurst = (kind: "good" | "bad", emoji: string) => {
    const id = Date.now() + Math.random();
    setBursts((b) => ({ ...b, [kind]: [...b[kind], { id, emoji }] }));
    setTimeout(() => {
      setBursts((b) => ({ ...b, [kind]: b[kind].filter((x) => x.id !== id) }));
    }, 900);
  };

  const handleGood = () => { setGood((n) => n + 1); triggerBurst("good", "👍"); };
  const handleBad = () => { setBad((n) => n + 1); triggerBurst("bad", "😢"); };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(g.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleGenerateCompanies = () => {
    const n = Math.max(1, Math.min(1000, count || 1));
    const list: string[] = [];
    for (let i = 0; i < n; i++) list.push(randomCompanyName(prefix, suffix, Math.max(1, midLen)));
    setCompanies(list);
  };

  const handleCopyCompanies = async () => {
    if (!companies.length) return;
    await navigator.clipboard.writeText(companies.join("\n"));
    setCompaniesCopied(true);
    setTimeout(() => setCompaniesCopied(false), 1500);
  };

  const minLen = g.mode === "pin" ? 3 : 8;
  const maxLen = g.mode === "pin" ? 12 : 100;

  return (
    <main className="min-h-screen bg-[#0A2540] text-white pb-32">
      {/* Nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">免费随机码生成器</span>
        </div>
        <button className="rounded-full bg-[#0070E0] px-5 py-2.5 text-sm font-semibold hover:bg-[#005fc4] transition-colors">
          免费开始使用
        </button>
      </header>

      {/* Marquee top-left */}
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="overflow-hidden whitespace-nowrap rounded-md bg-white/5 px-4 py-2 max-w-xl"
          style={{
            fontFamily: '"Source Han Sans SC", "Source Han Sans", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
            fontSize: "16px",
          }}
        >
          <span className="inline-block animate-[marquee_22s_linear_infinite]">
            {[0, 1].map((rep) => (
              <span key={rep} className="inline-block pr-16">
                {marqueeText.split("").map((ch, i) => (
                  <span key={`${rep}-${i}`} style={{ color: marqueeColors[(i + rep) % marqueeColors.length] }}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* Generators grid */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-2 lg:py-16">
        {/* Company name generator (left) */}
        <div className="rounded-2xl bg-white p-8 text-slate-900 shadow-2xl">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-[#0070E0]" />
            <h2 className="text-lg font-semibold">公司名称随机生成器</h2>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">前缀</label>
              <input
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="如:北京"
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0070E0]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">后缀</label>
              <input
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                list="suffix-presets"
                placeholder="如:科技有限公司"
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0070E0]"
              />
              <datalist id="suffix-presets">
                {SUFFIX_PRESETS.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <span className="text-sm text-slate-600 w-16">中间字数</span>
            <input
              type="range"
              min={1}
              max={6}
              value={midLen}
              onChange={(e) => setMidLen(Number(e.target.value))}
              className="flex-1 accent-[#0070E0]"
            />
            <input
              type="number"
              min={1}
              max={6}
              value={midLen}
              onChange={(e) => setMidLen(Number(e.target.value))}
              className="w-14 rounded-md border border-slate-200 px-2 py-1 text-center text-sm font-medium"
            />
          </div>

          <div className="mt-5">
            <span className="text-sm text-slate-600">生成数量</span>
            <div className="mt-2 flex items-center gap-2">
              {[10, 50, 100].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    count === n ? "bg-[#0070E0] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {n}
                </button>
              ))}
              <input
                type="number"
                min={1}
                max={1000}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="ml-2 w-20 rounded-md border border-slate-200 px-2 py-1.5 text-center text-sm"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={handleGenerateCompanies}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#0070E0] py-3 text-sm font-semibold text-white hover:bg-[#005fc4] transition-colors"
            >
              <Sparkles size={16} />
              生成
            </button>
            <button
              onClick={handleCopyCompanies}
              disabled={!companies.length}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-[#0070E0] py-3 text-sm font-semibold text-[#0070E0] hover:bg-[#0070E0]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {companiesCopied ? <Check size={16} /> : <Copy size={16} />}
              {companiesCopied ? "已复制" : "一键复制"}
            </button>
          </div>

          <div className="mt-5 max-h-80 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
            {companies.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">点击"生成"按钮开始</p>
            ) : (
              <ul className="space-y-1 text-sm text-slate-800">
                {companies.map((c, i) => (
                  <li key={i} className="rounded px-2 py-1 hover:bg-white">
                    <span className="text-slate-400 mr-2">{i + 1}.</span>{c}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Password Card (right) */}
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

      {/* Feedback bar - bottom left */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
        <div className="flex gap-3">
          <button
            onClick={handleGood}
            className="relative flex h-20 w-24 flex-col items-center justify-center gap-1 rounded-xl bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition-all border border-emerald-500/30 backdrop-blur"
          >
            <span className="text-sm font-semibold">Good</span>
            <span className="text-lg font-bold tabular-nums">{good}</span>
            {bursts.good.map((b) => (
              <span key={b.id} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl animate-[burst_0.9s_ease-out_forwards]">{b.emoji}</span>
            ))}
          </button>
          <button
            onClick={handleBad}
            className="relative flex h-20 w-24 flex-col items-center justify-center gap-1 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 active:scale-95 transition-all border border-rose-500/30 backdrop-blur"
          >
            <span className="text-sm font-semibold">Bad</span>
            <span className="text-lg font-bold tabular-nums">{bad}</span>
            {bursts.bad.map((b) => (
              <span key={b.id} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl animate-[burst_0.9s_ease-out_forwards]">{b.emoji}</span>
            ))}
          </button>
        </div>
        <p className="text-xs text-slate-400">版权所有@涛哥</p>
      </div>
    </main>
  );
}
