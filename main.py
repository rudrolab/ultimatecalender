"""Ultimate Calendar - Main Application Entry Point."""

import sys
import pygame
from datetime import datetime
from src.config.settings import (
    WINDOW_TITLE,
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT,
    FPS,
    COLOR_BACKGROUND,
    COLOR_TEXT_PRIMARY,
    COLOR_TEXT_SECONDARY,
    COLOR_TEXT_MUTED,
    COLOR_ACCENT_RED,
    COLOR_GRID_LINE,
    FONT_NAME_PRIMARY,
)


class UltimateCalendarApp:
    """Core Pygame application runner."""

    def __init__(self) -> None:
        pygame.init()
        pygame.font.init()
        pygame.display.set_caption(WINDOW_TITLE)

        self.width = DEFAULT_WIDTH
        self.height = DEFAULT_HEIGHT
        self.screen = pygame.display.set_mode(
            (self.width, self.height), pygame.RESIZABLE
        )
        self.clock = pygame.time.Clock()
        self.running = True
        self.fullscreen = False

        # Load system fonts
        self.font_title = pygame.font.SysFont(FONT_NAME_PRIMARY, 34, bold=True)
        self.font_subtitle = pygame.font.SysFont(FONT_NAME_PRIMARY, 16)
        self.font_mono = pygame.font.SysFont(FONT_NAME_PRIMARY, 13)

    def handle_events(self) -> None:
        """Handle window and keyboard events."""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False

            elif event.type == pygame.VIDEORESIZE:
                self.width, self.height = event.w, event.h
                self.screen = pygame.display.set_mode(
                    (self.width, self.height), pygame.RESIZABLE
                )

            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    self.running = False
                elif event.key == pygame.K_F11:
                    self.fullscreen = not self.fullscreen
                    flags = pygame.FULLSCREEN if self.fullscreen else pygame.RESIZABLE
                    self.screen = pygame.display.set_mode((self.width, self.height), flags)

    def render(self) -> None:
        """Render frame."""
        self.screen.fill(COLOR_BACKGROUND)

        # Draw subtle border / cinematic framing
        padding = 24
        pygame.draw.rect(
            self.screen,
            COLOR_GRID_LINE,
            (padding, padding, self.width - padding * 2, self.height - padding * 2),
            width=1,
            border_radius=4,
        )

        now = datetime.now()
        current_year = now.year
        date_str = now.strftime("%A, %B %d, %Y")
        time_str = now.strftime("%H:%M:%S")

        # Top tag
        tag_surface = self.font_mono.render("[ ULTIMATE CALENDAR v1.0 ]", True, COLOR_TEXT_MUTED)
        self.screen.blit(tag_surface, (padding + 16, padding + 16))

        # Year heading
        year_surface = self.font_title.render(f"{current_year}", True, COLOR_TEXT_PRIMARY)
        self.screen.blit(year_surface, (padding + 16, padding + 48))

        # Subtitle
        sub_surface = self.font_subtitle.render(
            "HOW MUCH OF THE YEAR IS LEFT?", True, COLOR_ACCENT_RED
        )
        self.screen.blit(sub_surface, (padding + 16, padding + 96))

        # Status & Time
        date_surface = self.font_subtitle.render(date_str, True, COLOR_TEXT_PRIMARY)
        time_surface = self.font_mono.render(f"SYSTEM TIME: {time_str}", True, COLOR_TEXT_SECONDARY)
        self.screen.blit(date_surface, (padding + 16, padding + 140))
        self.screen.blit(time_surface, (padding + 16, padding + 168))

        # Controls hint at bottom
        hint_str = "ESC: Exit  |  F11: Fullscreen  |  SPACE: Pause"
        hint_surface = self.font_mono.render(hint_str, True, COLOR_TEXT_MUTED)
        self.screen.blit(
            hint_surface,
            (padding + 16, self.height - padding - 28),
        )

        pygame.display.flip()

    def run(self) -> None:
        """Main application execution loop."""
        while self.running:
            self.handle_events()
            self.render()
            self.clock.tick(FPS)

        pygame.quit()
        sys.exit(0)


def main() -> None:
    app = UltimateCalendarApp()
    app.run()


if __name__ == "__main__":
    main()
