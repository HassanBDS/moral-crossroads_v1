export interface GameScenario {
  id: number;
  level: number;
  title: string;
  description: string;
  type: string;
  characterCount: {
    main: number;
    branch: number;
  };
  specialFeatures?: string[];
}

export const getCharacterLayout = (type: string, count: number) => {
  const layouts: Record<string, Array<{ x: number; y: number; sleeping?: boolean }>> = {
    sleeping_5: [
      { x: 550, y: 170, sleeping: true },
      { x: 580, y: 180, sleeping: true },
      { x: 610, y: 175, sleeping: true },
      { x: 570, y: 210, sleeping: true },
      { x: 600, y: 210, sleeping: true }
    ],
    awake_1: [
      { x: 650, y: 30, sleeping: false }
    ],
    basic_5: [
      { x: 550, y: 180 },
      { x: 580, y: 180 },
      { x: 610, y: 180 },
      { x: 640, y: 180 },
      { x: 670, y: 180 }
    ],
    basic_4: [
      { x: 560, y: 180 },
      { x: 590, y: 180 },
      { x: 620, y: 180 },
      { x: 650, y: 180 }
    ],
    basic_3: [
      { x: 570, y: 180 },
      { x: 600, y: 180 },
      { x: 630, y: 180 }
    ],
    basic_2: [
      { x: 580, y: 180 },
      { x: 610, y: 180 }
    ],
    basic_1: [
      { x: 590, y: 180 }
    ],
    branch_1: [
      { x: 650, y: 30 }
    ]
  };

  return layouts[`${type}_${count}`] || layouts.basic_5;
};
