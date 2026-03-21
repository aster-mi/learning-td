import { describe, it, expect, beforeEach } from "vitest";
import { loadSave, saveSave, exportSave, importSave, calcStars, calcCoins, getUpgradeCost, MAX_UPGRADE_LEVEL } from "../saveData";

// Mock localStorage
const storage: Record<string, string> = {};
beforeEach(() => {
  for (const key of Object.keys(storage)) delete storage[key];
  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem: (k: string) => storage[k] ?? null,
      setItem: (k: string, v: string) => { storage[k] = v; },
      removeItem: (k: string) => { delete storage[k]; },
    },
    writable: true,
  });
});

describe("calcStars", () => {
  it("returns 3 stars for high accuracy and HP", () => {
    expect(calcStars(0.9, 0.8)).toBe(3);
  });

  it("returns 2 stars for medium performance", () => {
    expect(calcStars(0.6, 0.4)).toBe(2);
  });

  it("returns 1 star for low performance", () => {
    expect(calcStars(0.2, 0.1)).toBe(1);
  });
});

describe("calcCoins", () => {
  it("returns positive coins for any valid input", () => {
    expect(calcCoins(1, 0.5, 5)).toBeGreaterThan(0);
  });

  it("more stars gives more coins", () => {
    const coins1 = calcCoins(1, 0.5, 5);
    const coins3 = calcCoins(3, 0.5, 5);
    expect(coins3).toBeGreaterThan(coins1);
  });
});

describe("getUpgradeCost", () => {
  it("returns a number for levels below max", () => {
    expect(getUpgradeCost(0)).toBeGreaterThan(0);
    expect(getUpgradeCost(1)).toBeGreaterThan(0);
  });

  it("returns null at max level", () => {
    expect(getUpgradeCost(MAX_UPGRADE_LEVEL)).toBeNull();
  });

  it("costs increase with level", () => {
    const c0 = getUpgradeCost(0)!;
    const c1 = getUpgradeCost(1)!;
    expect(c1).toBeGreaterThan(c0);
  });
});

describe("save/load cycle", () => {
  it("loads default save when nothing stored", () => {
    const save = loadSave();
    expect(save.coins).toBe(0);
    expect(save.unlockedUnits.length).toBeGreaterThan(0);
    expect(save.party.length).toBeGreaterThan(0);
  });

  it("persists and reloads data", () => {
    const save = loadSave();
    save.coins = 999;
    saveSave(save);
    const reloaded = loadSave();
    expect(reloaded.coins).toBe(999);
  });
});

describe("exportSave / importSave", () => {
  it("exports valid JSON", () => {
    const json = exportSave();
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it("importSave rejects invalid input", () => {
    expect(importSave("not json")).toBe(false);
    expect(importSave("{}")).toBe(false);
  });

  it("round-trips save data", () => {
    const save = loadSave();
    save.coins = 500;
    saveSave(save);
    const exported = exportSave();

    // Clear storage
    storage["learning_td_save"] = "";

    expect(importSave(exported)).toBe(true);
    const reloaded = loadSave();
    expect(reloaded.coins).toBe(500);
  });
});
