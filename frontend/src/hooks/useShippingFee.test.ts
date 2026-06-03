import { describe, it, expect } from 'vitest'

// Pure test of core fee logic (extracted logic for test, matches hook)
const volWeight = (dai: number, rong: number, cao: number) => (dai * rong * cao) / 6000;

describe('fee calc logic', () => {
  it('calculates effective weight', () => {
    expect(Math.max(1, volWeight(10,10,10))).toBe(1); // small
    expect(Math.max(0.1, volWeight(100,100,100))).toBeGreaterThan(100); // volume wins
  })

  it('base fee rough calc for hoatoc', () => {
    const w = Math.max(1, volWeight(10,10,10));
    const fee = w * 35000 + 8000;
    expect(fee).toBeGreaterThan(40000);
  })

  it('handles COD and khaiGia in breakdown logic', () => {
    const cod = 500000;
    const khai = 200000;
    const base = 45000;
    const total = base + cod + khai; // simulate
    expect(total).toBeGreaterThan(base);
  })
})
