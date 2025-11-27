import { StatisticsData } from './api';

export const mockStatisticsData: StatisticsData = {
  "total": {
    "all_users": 35,
    "all_male": 17,
    "all_female": 18
  },
  "directions": {
    "rfutbol": {
      "name": "Robo Futbol",
      "total": 9,
      "male": 5,
      "female": 4
    },
    "rsumo": {
      "name": "Robo sumo",
      "total": 2,
      "male": 1,
      "female": 1
    },
    "fixtirolar": {
      "name": "Foydali Ixtirolar",
      "total": 7,
      "male": 3,
      "female": 4
    },
    "ai": {
      "name": "Ai",
      "total": 17,
      "male": 8,
      "female": 9
    },
    "contest": {
      "name": "Contest",
      "total": 0,
      "male": 0,
      "female": 0
    }
  }
};

// Yoki dinamik mock data yaratish
export const generateMockData = (): StatisticsData => {
  const getRandomCount = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

  const totalUsers = getRandomCount(30, 50);
  const maleCount = getRandomCount(10, totalUsers - 10);
  const femaleCount = totalUsers - maleCount;

  return {
    "total": {
      "all_users": totalUsers,
      "all_male": maleCount,
      "all_female": femaleCount
    },
    "directions": {
      "rfutbol": {
        "name": "Robo Futbol",
        "total": getRandomCount(5, 12),
        "male": getRandomCount(2, 8),
        "female": getRandomCount(2, 8)
      },
      "rsumo": {
        "name": "Robo sumo",
        "total": getRandomCount(1, 5),
        "male": getRandomCount(0, 3),
        "female": getRandomCount(0, 3)
      },
      "fixtirolar": {
        "name": "Foydali Ixtirolar",
        "total": getRandomCount(3, 10),
        "male": getRandomCount(1, 6),
        "female": getRandomCount(1, 6)
      },
      "ai": {
        "name": "Ai",
        "total": getRandomCount(10, 20),
        "male": getRandomCount(5, 12),
        "female": getRandomCount(5, 12)
      },
      "contest": {
        "name": "Contest",
        "total": getRandomCount(0, 5),
        "male": getRandomCount(0, 3),
        "female": getRandomCount(0, 3)
      }
    }
  };
};