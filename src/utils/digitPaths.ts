/**
 * Vector paths for digits 0-9 matching technical architectural typography.
 * ViewBox for each digit is 100 x 160.
 */

export interface DigitPathDefinition {
  paths: string[];
}

export const DIGIT_PATHS: Record<string, string[]> = {
  // Digit 0: Clean rounded capsule
  '0': [
    'M 50 18 C 72 18, 86 35, 86 65 L 86 95 C 86 125, 72 142, 50 142 C 28 142, 14 125, 14 95 L 14 65 C 14 35, 28 18, 50 18 Z'
  ],

  // Digit 1: Slanted top serif, vertical stem, bottom base bar (matching reference)
  '1': [
    'M 30 45 L 56 20 L 56 142',
    'M 24 142 L 88 142'
  ],

  // Digit 2: Top arc, diagonal down, bottom horizontal bar
  '2': [
    'M 20 48 C 20 22, 80 20, 80 50 C 80 75, 45 105, 20 142 L 84 142'
  ],

  // Digit 3: Dual rounded loops
  '3': [
    'M 20 25 L 80 25 L 48 75 C 75 75, 84 95, 84 115 C 84 135, 65 142, 48 142 C 28 142, 18 130, 18 115'
  ],

  // Digit 4: Slanted leg, horizontal crossbar, vertical stem
  '4': [
    'M 72 18 L 72 142',
    'M 72 105 L 14 105 L 68 18'
  ],

  // Digit 5: Top bar, stem down, rounded bottom loop
  '5': [
    'M 82 22 L 24 22 L 24 72 C 35 65, 55 65, 72 75 C 84 85, 84 115, 82 125 C 78 138, 58 142, 45 142 C 28 142, 18 130, 18 118'
  ],

  // Digit 6: Descending curve into closed bottom circle
  '6': [
    'M 76 28 C 45 28, 18 65, 18 100 C 18 130, 35 142, 52 142 C 75 142, 84 125, 84 102 C 84 80, 72 68, 50 68 C 30 68, 18 85, 18 100'
  ],

  // Digit 7: Top bar and diagonal stem
  '7': [
    'M 18 22 L 84 22 L 38 142'
  ],

  // Digit 8: Top loop and bottom loop
  '8': [
    'M 50 78 C 32 78, 22 65, 22 48 C 22 30, 35 18, 50 18 C 65 18, 78 30, 78 48 C 78 65, 68 78, 50 78 C 30 78, 16 92, 16 112 C 16 132, 30 142, 50 142 C 70 142, 84 132, 84 112 C 84 92, 70 78, 50 78 Z'
  ],

  // Digit 9: Top closed circle, right vertical stem, bottom horizontal base (matching reference!)
  '9': [
    'M 50 82 C 70 82, 84 68, 84 48 C 84 28, 70 18, 50 18 C 30 18, 16 28, 16 48 C 16 68, 30 82, 50 82 Z',
    'M 84 48 L 84 142 L 28 142'
  ]
};
