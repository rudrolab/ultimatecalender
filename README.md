# Ultimate Calendar ⏳

A cinematic, modern desktop time-visualization application built in **Python 3** using **Pygame**. Inspired by minimalist time trackers and motivational countdowns, Ultimate Calendar answers essential questions at a single glance:

* What year and date is it?
* How much of the current year has elapsed vs. remains?
* How many months, days, weeks, and weekends remain?
* What is the real-time countdown to the new year?
* What does the entire year look like visually as an interactive matrix of days?

---

## 🛠 Technology Stack

* **Language**: Python 3.10+ (tested on Python 3.14)
* **Rendering & Animation**: Pygame / Pygame-CE (`pygame-ce>=2.5.0`)
* **Standard Library Modules**: `datetime`, `calendar`, `math`, `typing`, `unittest`
* **Zero Bloat**: Minimal external dependencies; purely Python standard library for calculation logic.

---

## 📐 Project Architecture

```text
ultimatecalender/
│
├── main.py                     # Primary entry point
├── requirements.txt            # Python dependencies
├── README.md                   # Project documentation
├── .gitignore                  # Git ignore rules
│
├── src/
│   ├── core/                   # Pure calculation logic (no rendering)
│   │   ├── date_engine.py      # Year, month, day, progress, weekend calculations
│   │   ├── calendar_data.py    # Day matrix and state structures
│   │   └── countdown.py        # Real-time countdown tracking engine
│   │
│   ├── scenes/                 # Visual scene controllers
│   │   ├── base_scene.py       # Base scene interface & transitions
│   │   ├── year_overview.py    # Full calendar dot matrix scene
│   │   ├── progress_scene.py   # Large percentage completed scene
│   │   ├── days_scene.py       # Days remaining scene
│   │   ├── weeks_scene.py      # Weeks remaining scene
│   │   ├── weekends_scene.py   # Weekends remaining scene
│   │   └── final_scene.py      # Minimal motivational closing scene
│   │
│   ├── graphics/               # Visual effects & drawing utilities
│   │   ├── text.py             # Font cache & typography rendering
│   │   ├── dots.py             # Dot grid & day indicator drawing
│   │   ├── grid.py             # Perspective & structural grid lines
│   │   ├── glow.py             # Bloom and glow shaders/surfaces
│   │   └── transitions.py      # Easing, fading, and interpolation
│   │
│   ├── ui/                     # UI orchestration & HUD
│   │   └── renderer.py         # Window scaling and layout manager
│   │
│   └── config/                 # Configuration & constants
│       └── settings.py         # Dimensions (9:16 aspect ratio), colors, FPS
│
├── assets/
│   ├── fonts/                  # Custom fonts
│   └── textures/               # Graphical textures
│
└── tests/                      # Automated test suite
    ├── test_date_engine.py     # Leap year, boundaries, transitions tests
    └── test_countdown.py       # Countdown unit tests
```

---

## 📅 Date Calculation Rules & Definitions

1. **Dynamic Year Detection**:
   The current year is never hardcoded. All calculations adapt dynamically to leap years (Gregorian rules) and standard years.
2. **Days Elapsed & Remaining**:
   - Total days in year = 366 (leap year) or 365 (standard year).
   - Day of year = 1 to 365/366.
   - Days elapsed = count of completed or in-progress days according to exact time/day.
   - Days remaining = `Total days in year - current day of year`.
3. **Months Remaining**:
   Calculated as `12 - current_month` full months remaining after the current month, plus the remaining days of the current month.
4. **Weeks Remaining**:
   `days_remaining // 7` full weeks remaining, with `days_remaining % 7` partial days left.
5. **Weekends Remaining**:
   Calculated by iterating each remaining calendar day from tomorrow to December 31, counting occurrences of Saturday and Sunday, grouped as remaining weekend units.

---

## 🚀 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rudrolab/ultimatecalender.git
   cd ultimatecalender
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run automated tests**:
   ```bash
   python -m unittest discover tests
   ```

4. **Launch the application**:
   ```bash
   python main.py
   ```

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| `SPACE` | Pause / Resume animation autoplay |
| `LEFT ARROW` | Previous scene |
| `RIGHT ARROW` | Next scene |
| `R` | Restart current scene animation |
| `F11` | Toggle Fullscreen |
| `ESC` | Exit application |
