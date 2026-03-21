import { describe, it, expect } from "vitest";
import { Unit, getUnitDef, UNIT_DEFS } from "../Unit";

describe("getUnitDef", () => {
  it("returns the correct def for a known unit", () => {
    const def = getUnitDef("basic");
    expect(def).toBeDefined();
    expect(def.type).toBe("basic");
    expect(def.hp).toBeGreaterThan(0);
    expect(def.atk).toBeGreaterThan(0);
  });

  it("falls back to basic for unknown unit ID", () => {
    const def = getUnitDef("nonexistent_unit_xyz");
    expect(def.type).toBe("basic");
  });

  it("has defs for all catalog entries", () => {
    expect(Object.keys(UNIT_DEFS).length).toBeGreaterThan(10);
  });
});

describe("Unit", () => {
  it("creates a unit with correct initial state", () => {
    const unit = new Unit("basic", 100);
    expect(unit.alive).toBe(true);
    expect(unit.x).toBe(100);
    expect(unit.hp).toBe(unit.maxHp);
    expect(unit.def.type).toBe("basic");
  });

  it("moves forward when no enemies in range", () => {
    const unit = new Unit("basic", 100);
    const startX = unit.x;
    unit.update(1000, [], 800);
    expect(unit.x).toBeGreaterThan(startX);
  });

  it("each unit has unique incrementing ID", () => {
    const u1 = new Unit("basic", 0);
    const u2 = new Unit("basic", 0);
    expect(u2.id).toBeGreaterThan(u1.id);
  });
});
