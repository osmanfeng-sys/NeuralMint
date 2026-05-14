import { useCallback, useEffect, useState } from "react";

export type PasswordMode = "random" | "memorable" | "pin";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?";

const WORDS = [
  "apple", "river", "stone", "cloud", "tiger", "amber", "forest", "shadow",
  "harbor", "meadow", "silver", "violet", "ocean", "marble", "ember", "willow",
  "thunder", "crystal", "garden", "mountain", "phoenix", "lantern", "saffron", "comet",
];

function pick<T>(arr: T[] | string): T | string {
  const i = Math.floor(Math.random() * arr.length);
  return (arr as any)[i];
}

function generateRandom(length: number, letters: boolean, numbers: boolean, symbols: boolean) {
  let pool = "";
  if (letters) pool += LOWER + UPPER;
  if (numbers) pool += DIGITS;
  if (symbols) pool += SYMBOLS;
  if (!pool) return "";
  let out = "";
  for (let i = 0; i < length; i++) out += pool[Math.floor(Math.random() * pool.length)];
  return out;
}

function generateMemorable(wordCount: number, numbers: boolean, symbols: boolean) {
  const sep = symbols ? (pick(SYMBOLS) as string) : "-";
  const parts: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    let w = pick(WORDS) as string;
    if (Math.random() > 0.5) w = w[0].toUpperCase() + w.slice(1);
    if (numbers) w += Math.floor(Math.random() * 100);
    parts.push(w);
  }
  return parts.join(sep);
}

function generatePin(length: number) {
  let out = "";
  for (let i = 0; i < length; i++) out += DIGITS[Math.floor(Math.random() * 10)];
  return out;
}

export function usePasswordGenerator() {
  const [mode, setMode] = useState<PasswordMode>("random");
  const [length, setLength] = useState(20);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [password, setPassword] = useState("");

  const regenerate = useCallback(() => {
    if (mode === "random") setPassword(generateRandom(length, numbers, symbols));
    else if (mode === "memorable") setPassword(generateMemorable(Math.max(3, Math.min(8, Math.round(length / 4))), numbers, symbols));
    else setPassword(generatePin(Math.min(12, Math.max(3, length))));
  }, [mode, length, numbers, symbols]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  // Clamp length per mode
  useEffect(() => {
    if (mode === "pin" && length > 12) setLength(6);
    if (mode === "random" && length < 8) setLength(20);
  }, [mode]);

  return {
    mode, setMode,
    length, setLength,
    numbers, setNumbers,
    symbols, setSymbols,
    password,
    regenerate,
  };
}
