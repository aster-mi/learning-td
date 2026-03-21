import { describe, it, expect } from "vitest";
import { Enemy, ENEMY_DEFS } from "../Enemy";

describe("ENEMY_DEFS", () => {
  it("has all expected enemy types", () => {
    const types = ["weak", "fast", "tank", "speedy", "assassin", "brute", "warlock", "boss"];
    for (const t of types) {
      expect(ENEMY_DEFS[t as keyof typeof ENEMY_DEFS]).toBeDefined();
    }
  });

  it("boss has highest HP among all enemy types", () => {
    const bossHp = ENEMY_DEFS.boss.hp;
    for (const def of Object.values(ENEMY_DEFS)) {
      expect(bossHp).toBeGreaterThanOrEqual(def.hp);
    }
  });
});

describe("Enemy", () => {
  it("creates with correct initial state", () => {
    const enemy = new Enemy("weak", 700);
    expect(enemy.alive).toBe(true);
    expect(enemy.x).toBe(700);
    expect(enemy.hp).toBe(enemy.maxHp);
  });

  it("scales HP and ATK based on difficulty", () => {
    const normal = new Enemy("weak", 700, 1.0);
    const hard = new Enemy("weak", 700, 2.0);
    expect(hard.hp).toBe(normal.hp * 2);
    expect(hard.def.atk).toBe(normal.def.atk * 2);
  });

  it("moves left when no units in range", () => {
    const enemy = new Enemy("weak", 700);
    const startX = enemy.x;
    enemy.update(1000, [], 60);
    expect(enemy.x).toBeLessThan(startX);
  });

  it("minimum HP and ATK is 1 even at very low scale", () => {
    const enemy = new Enemy("weak", 700, 0.001);
    expect(enemy.hp).toBeGreaterThanOrEqual(1);
    expect(enemy.def.atk).toBeGreaterThanOrEqual(1);
  });
});
