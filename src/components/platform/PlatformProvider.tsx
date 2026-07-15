/**
 * ARES EDU PLATFORM — Platform Provider
 * React context providing all platform state to the component tree.
 */
import React, { createContext, useContext, type ReactNode } from "react";
import {
  usePreferences,
  useBookmarks,
  useFavorites,
  useRecentlyVisited,
  useNotes,
  useHighlights,
  useReadingHistory,
  useContinueLearning,
  useLearningProgress,
  useStreak,
  useXP,
  useAchievements,
  useBadges,
  useDailyMissions,
  useWeeklyMissions,
  useUpcomingReviews,
  useSearchHistory,
  useAITutorSessions,
  useLearningMode,
} from "@site/src/hooks/usePlatform";
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
  AITutorSession,
  LearningMode,
} from "@site/src/types/platform";

interface PlatformContextValue {
  preferences: UserPreferences;
  setPreferences: (p: UserPreferences | ((prev: UserPreferences) => UserPreferences)) => void;
  bookmarks: BookmarkItem[];
  setBookmarks: (b: BookmarkItem[] | ((prev: BookmarkItem[]) => BookmarkItem[])) => void;
  favorites: FavoriteItem[];
  setFavorites: (f: FavoriteItem[] | ((prev: FavoriteItem[]) => FavoriteItem[])) => void;
  recentlyVisited: RecentlyVisitedItem[];
  addRecentVisit: (v: Omit<RecentlyVisitedItem, "visitedAt">) => void;
  notes: UserNote[];
  setNotes: (n: UserNote[] | ((prev: UserNote[]) => UserNote[])) => void;
  highlights: UserHighlight[];
  setHighlights: (h: UserHighlight[] | ((prev: UserHighlight[]) => UserHighlight[])) => void;
  readingHistory: ReadingHistoryItem[];
  setReadingHistory: (
    h: ReadingHistoryItem[] | ((prev: ReadingHistoryItem[]) => ReadingHistoryItem[]),
  ) => void;
  continueLearning: ContinueLearningItem[];
  setContinueLearning: (
    c: ContinueLearningItem[] | ((prev: ContinueLearningItem[]) => ContinueLearningItem[]),
  ) => void;
  learningProgress: LearningProgress;
  setLearningProgress: (
    p: LearningProgress | ((prev: LearningProgress) => LearningProgress),
  ) => void;
  streak: StreakData;
  checkIn: () => void;
  xp: XPSystem;
  setXP: (x: XPSystem | ((prev: XPSystem) => XPSystem)) => void;
  achievements: Achievement[];
  setAchievements: (a: Achievement[] | ((prev: Achievement[]) => Achievement[])) => void;
  badges: Badge[];
  setBadges: (b: Badge[] | ((prev: Badge[]) => Badge[])) => void;
  dailyMissions: DailyMission[];
  setDailyMissions: (m: DailyMission[] | ((prev: DailyMission[]) => DailyMission[])) => void;
  weeklyMissions: WeeklyMission[];
  setWeeklyMissions: (m: WeeklyMission[] | ((prev: WeeklyMission[]) => WeeklyMission[])) => void;
  reviews: ReviewItem[];
  setReviews: (r: ReviewItem[] | ((prev: ReviewItem[]) => ReviewItem[])) => void;
  searchHistory: string[];
  setSearchHistory: (h: string[] | ((prev: string[]) => string[])) => void;
  aiSessions: AITutorSession[];
  setAISessions: (s: AITutorSession[] | ((prev: AITutorSession[]) => AITutorSession[])) => void;
  learningMode: LearningMode;
  setLearningMode: (m: LearningMode | ((prev: LearningMode) => LearningMode)) => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export function usePlatform(): PlatformContextValue {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
}

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = usePreferences();
  const [bookmarks, setBookmarks] = useBookmarks();
  const [favorites, setFavorites] = useFavorites();
  const { items: recentlyVisited, addVisit: addRecentVisit } = useRecentlyVisited();
  const [notes, setNotes] = useNotes();
  const [highlights, setHighlights] = useHighlights();
  const [readingHistory, setReadingHistory] = useReadingHistory();
  const [continueLearning, setContinueLearning] = useContinueLearning();
  const [learningProgress, setLearningProgress] = useLearningProgress();
  const { streak, checkIn } = useStreak();
  const [xp, setXP] = useXP();
  const [achievements, setAchievements] = useAchievements();
  const [badges, setBadges] = useBadges();
  const [dailyMissions, setDailyMissions] = useDailyMissions();
  const [weeklyMissions, setWeeklyMissions] = useWeeklyMissions();
  const [reviews, setReviews] = useUpcomingReviews();
  const [searchHistory, setSearchHistory] = useSearchHistory();
  const [aiSessions, setAISessions] = useAITutorSessions();
  const [learningMode, setLearningMode] = useLearningMode();

  return (
    <PlatformContext.Provider
      value={{
        preferences,
        setPreferences,
        bookmarks,
        setBookmarks,
        favorites,
        setFavorites,
        recentlyVisited,
        addRecentVisit,
        notes,
        setNotes,
        highlights,
        setHighlights,
        readingHistory,
        setReadingHistory,
        continueLearning,
        setContinueLearning,
        learningProgress,
        setLearningProgress,
        streak,
        checkIn,
        xp,
        setXP,
        achievements,
        setAchievements,
        badges,
        setBadges,
        dailyMissions,
        setDailyMissions,
        weeklyMissions,
        setWeeklyMissions,
        reviews,
        setReviews,
        searchHistory,
        setSearchHistory,
        aiSessions,
        setAISessions,
        learningMode,
        setLearningMode,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}
