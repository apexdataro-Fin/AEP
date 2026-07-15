/**
 * ARES EDU PLATFORM — Platform Hooks
 * 
 * Custom React hooks for platform state management.
 * Uses localStorage for persistence (Phase 3). Future: Convex (Phase 4+).
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  UserPreferences,
  BookmarkItem,
  FavoriteItem,
  RecentlyVisitedItem,
  UserNote,
  UserHighlight,
  ReadingHistoryItem,
  ContinueLearningItem,
  LearningProgress,
  StreakData,
  Achievement,
  Badge,
  DailyMission,
  WeeklyMission,
  XPSystem,
  ReviewItem,
  SearchFilters,
  AITutorSession,
  LearningMode,
} from "@site/src/types/platform";

// ============================================================
// Generic localStorage hook
// ============================================================

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = typeof window !== "undefined" ? localStorage.getItem(`aep:${key}`) : null;
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem(`aep:${key}`, JSON.stringify(next));
          }
        } catch { /* quota exceeded */ }
        return next;
      });
    },
    [key]
  );

  return [stored, setValue];
}

// ============================================================
// Preferences
// ============================================================

export function usePreferences() {
  const defaults: UserPreferences = {
    theme: "system",
    language: "en",
    fontSize: "medium",
    readingWidth: "medium",
    reduceMotion: false,
    reduceAnimations: false,
    highContrast: false,
    dyslexiaFriendlyFont: false,
    learningMode: "self-paced",
    aiPreferences: { enabled: true, autoSuggest: true, difficultyAdaptation: true, model: "default", maxTokens: 2000 },
    notificationPreferences: { reviewReminders: true, streakAlerts: true, achievementAlerts: true, recommendationAlerts: true, dailyGoalReminders: true, weeklyReport: true, emailDigest: false, pushNotifications: false },
  };
  return useLocalStorage<UserPreferences>("preferences", defaults);
}

// ============================================================
// Bookmarks, Favorites, Recently Visited
// ============================================================

export function useBookmarks() {
  return useLocalStorage<BookmarkItem[]>("bookmarks", []);
}

export function useFavorites() {
  return useLocalStorage<FavoriteItem[]>("favorites", []);
}

export function useRecentlyVisited() {
  const [items, setItems] = useLocalStorage<RecentlyVisitedItem[]>("recently-visited", []);
  
  const addVisit = useCallback((visit: Omit<RecentlyVisitedItem, "visitedAt">) => {
    setItems((prev) => {
      const filtered = prev.filter((v) => v.href !== visit.href);
      return [{ ...visit, visitedAt: new Date().toISOString() }, ...filtered].slice(0, 20);
    });
  }, [setItems]);

  return { items, addVisit };
}

// ============================================================
// Notes & Highlights
// ============================================================

export function useNotes() {
  return useLocalStorage<UserNote[]>("notes", []);
}

export function useHighlights() {
  return useLocalStorage<UserHighlight[]>("highlights", []);
}

// ============================================================
// Reading History
// ============================================================

export function useReadingHistory() {
  return useLocalStorage<ReadingHistoryItem[]>("reading-history", []);
}

// ============================================================
// Continue Learning
// ============================================================

export function useContinueLearning() {
  return useLocalStorage<ContinueLearningItem[]>("continue-learning", []);
}

// ============================================================
// Learning Progress
// ============================================================

export function useLearningProgress() {
  const defaults: LearningProgress = {
    totalLessonsCompleted: 0,
    totalProjectsCompleted: 0,
    totalLabsCompleted: 0,
    totalTimeSpentMinutes: 0,
    completionRate: 0,
    averageScore: 0,
    currentLevel: 1,
    totalXP: 0,
  };
  return useLocalStorage<LearningProgress>("learning-progress", defaults);
}

// ============================================================
// Streak
// ============================================================

export function useStreak() {
  const [streak, setStreak] = useLocalStorage<StreakData>("streak", {
    current: 0, longest: 0, thisWeek: [0, 0, 0, 0, 0, 0, 0], lastActiveDate: "", atRisk: false,
  });

  const checkIn = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    setStreak((prev) => {
      if (prev.lastActiveDate === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const current = prev.lastActiveDate === yesterday ? prev.current + 1 : 1;
      return { ...prev, current, longest: Math.max(prev.longest, current), lastActiveDate: today, atRisk: current === 1 };
    });
  }, [setStreak]);

  return { streak, checkIn };
}

// ============================================================
// XP System
// ============================================================

export function useXP() {
  return useLocalStorage<XPSystem>("xp", {
    totalXP: 0, currentLevel: 1, levelTitle: "Novice Learner",
    xpToNextLevel: 100, xpForCurrentLevel: 0, achievements: [], badges: [], milestones: [],
  });
}

export function useAchievements() {
  return useLocalStorage<Achievement[]>("achievements", []);
}

export function useBadges() {
  return useLocalStorage<Badge[]>("badges", []);
}

// ============================================================
// Missions
// ============================================================

export function useDailyMissions() {
  return useLocalStorage<DailyMission[]>("daily-missions", []);
}

export function useWeeklyMissions() {
  return useLocalStorage<WeeklyMission[]>("weekly-missions", []);
}

// ============================================================
// Reviews (Spaced Repetition)
// ============================================================

export function useUpcomingReviews() {
  return useLocalStorage<ReviewItem[]>("upcoming-reviews", []);
}

// ============================================================
// Search
// ============================================================

export function useSearchHistory() {
  return useLocalStorage<string[]>("search-history", []);
}

export function useSearchFilters() {
  const defaults: SearchFilters = { query: "" };
  return useLocalStorage<SearchFilters>("search-filters", defaults);
}

// ============================================================
// AI Tutor
// ============================================================

export function useAITutorSessions() {
  return useLocalStorage<AITutorSession[]>("ai-tutor-sessions", []);
}

// ============================================================
// Learning Mode
// ============================================================

export function useLearningMode() {
  return useLocalStorage<LearningMode>("learning-mode", "reading");
}

// ============================================================
// Dashboard Data — derived hook combining all state
// ============================================================

export function useDashboard() {
  const [bookmarks] = useBookmarks();
  const [favorites] = useFavorites();
  const { items: recentlyVisited } = useRecentlyVisited();
  const [continueLearning] = useContinueLearning();
  const [progress] = useLearningProgress();
  const { streak } = useStreak();
  const [xp] = useXP();
  const [achievements] = useAchievements();
  const [badges] = useBadges();
  const [reviews] = useUpcomingReviews();
  const [dailyMissions] = useDailyMissions();
  const [weeklyMissions] = useWeeklyMissions();

  return useMemo(() => ({
    continueLearning: continueLearning.slice(0, 5),
    recentActivity: recentlyVisited.slice(0, 10),
    bookmarks: bookmarks.slice(0, 5),
    progress,
    streak,
    xp,
    achievements: achievements.filter((a) => a.earned),
    badges: badges.filter((b) => b.earned),
    recentItems: recentlyVisited.slice(0, 5),
    reviews: reviews.filter((r) => r.dueInDays <= 3),
    dailyMissions,
    weeklyMissions,
  }), [continueLearning, recentlyVisited, bookmarks, progress, streak, xp, achievements, badges, reviews, dailyMissions, weeklyMissions]);
}
