# Ultimate Calendar ⏳

A cinematic, modern web time-visualization application built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**. Inspired by minimalist time trackers and motivational countdowns, Ultimate Calendar answers essential questions at a single glance:

* What year and date is it?
* How much of the current year has elapsed vs. remains?
* How many months, days, weeks, and weekends remain?
* What is the real-time countdown to the new year?
* What does the entire year look like visually as an interactive matrix of days?
* What does remaining time look like in a 3D perspective flight?

---

## 🛠 Technology Stack

* **Framework**: React 19 + TypeScript
* **Styling**: Tailwind CSS + Custom Glow/Bloom Shaders
* **Icons**: Lucide Icons
* **Graphics**: HTML5 2D/3D Perspective Canvas Engine
* **Bundler & Server**: Vite
* **Testing**: Vitest test suite

---

## 📐 7 Cinematic Visual Scenes

1. **Scene 1 — Year Matrix (Overview)**:
   - Full 12-month dot matrix showing completed days, today's glowing pulsating red indicator, and future days.
   - Dynamic `{percent}% COMPLETE` and `{days} DAYS LEFT` readouts.
2. **Scene 2 — Annual Ratio (Progress)**:
   - Giant animated percentage counter with progress bar and exact day count elapsed.
3. **Scene 3 — Days Remaining (Daily Countdown)**:
   - Large typography of remaining days, current calendar date, and live countdown (Hours, Minutes, Seconds).
4. **Scene 4 — Weeks Remaining**:
   - Number of full weeks left in the year and annual 52/53-week visual blocks.
5. **Scene 5 — Weekends Remaining**:
   - Total number of Saturday & Sunday weekend pairs remaining in the year.
6. **Scene 6 — Perspective Grid (Temporal Horizon)**:
   - Infinite 3D canvas perspective flight through remaining days mapped toward the year-end horizon with smooth camera motion.
7. **Scene 7 — Start Today (Final Message)**:
   - High-impact motivational statement with live precision clock and replay loop.

---

## 📅 Date Calculation Rules & Accuracy

1. **Dynamic Year Detection**:
   The current year is never hardcoded. All calculations adapt dynamically to leap years (Gregorian rules) and standard years.
2. **Leap Year Support**:
   Correctly adheres to Gregorian rules: leap years if divisible by 4, not 100 unless divisible by 400 (e.g., 2024, 2028 are leap; 2100 is not; 2000 is leap).
3. **Days Elapsed & Remaining**:
   - Total days in year = 366 (leap year) or 365 (standard year).
   - Day of year = 1 to 365/366.
   - Days elapsed = count of completed days according to system clock.
   - Days remaining = `Total days in year - current day of year`.
4. **Months Remaining**:
   Calculated as `12 - current_month` full months remaining after the current month, plus the remaining days of the current month.
5. **Weeks Remaining**:
   `Math.floor(daysRemaining / 7)` full weeks remaining.
6. **Weekends Remaining**:
   Iterates each day from tomorrow to December 31, counting future Saturday and Sunday pairs.

---

## 🚀 How to Run and Check

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser to `http://localhost:3000` (or the URL displayed in the terminal).

### 3. Run Automated Tests
```bash
npm run test
```

### 4. Build for Production
```bash
npm run build
```
Creates production-optimized static assets in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🎮 Controls

| Key / Gesture | Action |
|---------------|--------|
| `SPACE` | Pause / Resume autoplay |
| `LEFT ARROW` | Previous scene |
| `RIGHT ARROW` | Next scene |
| `R` | Restart current scene animation / timer |
| `I` | Toggle detailed System Statistics Panel |
| `F11` | Toggle Fullscreen |
| `ESC` | Dismiss Info modal |
| **Touch Swipe Left/Right** | Navigate scenes on mobile devices |
| **Scene Dots & Buttons** | Clickable scene navigation in footer |
