"""Configuration settings and constants for Ultimate Calendar."""

# Window and Display Settings
WINDOW_TITLE = "Ultimate Calendar"
DEFAULT_WIDTH = 540
DEFAULT_HEIGHT = 960  # 9:16 vertical presentation ratio
ASPECT_RATIO = 9 / 16
FPS = 60

# Typography Settings
FONT_NAME_PRIMARY = "consolas,couriernew,monospace"
FONT_SIZE_TITLE = 36
FONT_SIZE_SUBTITLE = 20
FONT_SIZE_BODY = 14
FONT_SIZE_LARGE_NUMBER = 72

# Color Palette (Dark cinematic aesthetic with subtle red accent)
COLOR_BACKGROUND = (10, 11, 14)       # Deep charcoal black
COLOR_PANEL_BG = (18, 20, 26)         # Elevated dark panel
COLOR_TEXT_PRIMARY = (245, 245, 250)  # Clean crisp white
COLOR_TEXT_SECONDARY = (140, 145, 160)# Muted cool gray
COLOR_TEXT_MUTED = (75, 80, 95)       # Low contrast technical label
COLOR_ACCENT_RED = (255, 60, 75)      # Subtle vibrant red accent
COLOR_ACCENT_RED_GLOW = (255, 60, 75, 45) # Soft red bloom

# Dot matrix colors
COLOR_DOT_COMPLETED = (190, 195, 210) # Past days: visible cool light gray
COLOR_DOT_CURRENT = (255, 60, 75)     # Today: glowing red
COLOR_DOT_FUTURE = (32, 35, 45)       # Future days: subtle dark dot
COLOR_GRID_LINE = (28, 30, 40)        # Cinematic grid lines
