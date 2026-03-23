import type { Level } from "./questionMeta";

export interface QuestionSubStats {
  total: number;
  minLevel: Level;
  maxLevel: Level;
  byLevel: Partial<Record<Level, number>>;
}

export const QUESTION_STATS_BY_SUB: Record<string, QuestionSubStats> = {
  "世界地理": {
    "total": 30,
    "minLevel": 3,
    "maxLevel": 9,
    "byLevel": {
      "3": 3,
      "4": 2,
      "5": 5,
      "6": 5,
      "7": 5,
      "8": 6,
      "9": 4
    }
  },
  "Java Bronze": {
    "total": 260,
    "minLevel": 7,
    "maxLevel": 8,
    "byLevel": {
      "7": 248,
      "8": 12
    }
  },
  "Java Gold": {
    "total": 200,
    "minLevel": 9,
    "maxLevel": 10,
    "byLevel": {
      "9": 195,
      "10": 5
    }
  },
  "Java Silver": {
    "total": 300,
    "minLevel": 8,
    "maxLevel": 9,
    "byLevel": {
      "8": 293,
      "9": 7
    }
  },
  "Web基礎": {
    "total": 25,
    "minLevel": 7,
    "maxLevel": 8,
    "byLevel": {
      "7": 19,
      "8": 6
    }
  },
  "かんたんなぞなぞ": {
    "total": 149,
    "minLevel": 1,
    "maxLevel": 4,
    "byLevel": {
      "1": 46,
      "2": 44,
      "3": 32,
      "4": 27
    }
  },
  "スポーツ・芸能": {
    "total": 130,
    "minLevel": 1,
    "maxLevel": 10,
    "byLevel": {
      "1": 2,
      "2": 3,
      "3": 7,
      "4": 12,
      "5": 14,
      "6": 14,
      "7": 24,
      "8": 21,
      "9": 18,
      "10": 15
    }
  },
  "むずかしいなぞなぞ": {
    "total": 51,
    "minLevel": 5,
    "maxLevel": 10,
    "byLevel": {
      "5": 12,
      "6": 12,
      "7": 10,
      "8": 7,
      "9": 5,
      "10": 5
    }
  },
  "英単語": {
    "total": 124,
    "minLevel": 1,
    "maxLevel": 9,
    "byLevel": {
      "1": 46,
      "2": 26,
      "3": 14,
      "4": 19,
      "7": 8,
      "8": 9,
      "9": 2
    }
  },
  "英文法": {
    "total": 76,
    "minLevel": 4,
    "maxLevel": 8,
    "byLevel": {
      "4": 1,
      "5": 32,
      "6": 26,
      "7": 12,
      "8": 5
    }
  },
  "TOEIC頻出語": {
    "total": 30,
    "minLevel": 6,
    "maxLevel": 9,
    "byLevel": {
      "6": 8,
      "7": 10,
      "8": 8,
      "9": 4
    }
  },
  "漢字・読み": {
    "total": 185,
    "minLevel": 1,
    "maxLevel": 8,
    "byLevel": {
      "1": 39,
      "2": 36,
      "3": 25,
      "4": 23,
      "5": 20,
      "6": 20,
      "7": 7,
      "8": 15
    }
  },
  "四則計算": {
    "total": 295,
    "minLevel": 1,
    "maxLevel": 8,
    "byLevel": {
      "1": 42,
      "2": 55,
      "3": 47,
      "4": 49,
      "5": 40,
      "6": 45,
      "7": 14,
      "8": 3
    }
  },
  "自然・科学トリビア": {
    "total": 132,
    "minLevel": 1,
    "maxLevel": 10,
    "byLevel": {
      "1": 4,
      "2": 2,
      "3": 8,
      "4": 11,
      "5": 15,
      "6": 14,
      "7": 23,
      "8": 22,
      "9": 17,
      "10": 16
    }
  },
  "熟語・慣用句": {
    "total": 63,
    "minLevel": 3,
    "maxLevel": 8,
    "byLevel": {
      "3": 13,
      "4": 7,
      "5": 10,
      "6": 11,
      "7": 17,
      "8": 5
    }
  },
  "図形・面積": {
    "total": 130,
    "minLevel": 1,
    "maxLevel": 8,
    "byLevel": {
      "1": 13,
      "2": 13,
      "3": 20,
      "4": 24,
      "5": 26,
      "6": 15,
      "7": 14,
      "8": 5
    }
  },
  "生活・常識": {
    "total": 212,
    "minLevel": 1,
    "maxLevel": 10,
    "byLevel": {
      "1": 9,
      "2": 11,
      "3": 11,
      "4": 21,
      "5": 19,
      "6": 17,
      "7": 40,
      "8": 33,
      "9": 27,
      "10": 24
    }
  },
  "生物・地学": {
    "total": 217,
    "minLevel": 1,
    "maxLevel": 8,
    "byLevel": {
      "1": 27,
      "2": 33,
      "3": 32,
      "4": 35,
      "5": 35,
      "6": 35,
      "7": 15,
      "8": 5
    }
  },
  "地理": {
    "total": 121,
    "minLevel": 1,
    "maxLevel": 8,
    "byLevel": {
      "1": 17,
      "2": 23,
      "3": 26,
      "4": 21,
      "5": 15,
      "7": 13,
      "8": 6
    }
  },
  "物理・化学": {
    "total": 112,
    "minLevel": 1,
    "maxLevel": 8,
    "byLevel": {
      "1": 15,
      "2": 13,
      "3": 22,
      "4": 19,
      "6": 21,
      "7": 16,
      "8": 6
    }
  },
  "歴史": {
    "total": 70,
    "minLevel": 4,
    "maxLevel": 8,
    "byLevel": {
      "4": 1,
      "5": 21,
      "6": 26,
      "7": 15,
      "8": 7
    }
  }
};
