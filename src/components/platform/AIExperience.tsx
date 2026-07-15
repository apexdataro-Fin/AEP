/**
 * ARES EDU PLATFORM — AI Experience
 * Reusable AI interface components: AI Tutor chat, AI Explain,
 * AI Quiz, AI Flashcards, AI Study Planner, AI Reviewer.
 * Phase 3: UI only. Phase 4: Backend integration.
 */
import React, { useState, useRef, useEffect } from "react";
import type { AITutorMessage } from "@site/src/types/platform";

// ============================================================
// AI Tutor Chat
// ============================================================

interface AITutorProps {
  context?: { contentId?: string; topic?: string; domain?: string };
  messages?: AITutorMessage[];
  onSend?: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AITutor({ context, messages = [], onSend, isOpen, onClose }: AITutorProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend?.(input.trim());
      setInput("");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 500,
        width: 380,
        maxHeight: 560,
        background: "var(--aep-surface)",
        borderRadius: "var(--aep-radius-xl)",
        boxShadow: "var(--aep-shadow-xl)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid var(--aep-border)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "var(--aep-space)",
          background: "var(--aep-primary)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 700 }}>🤖 AI Tutor</span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1.1rem",
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: "auto", padding: "var(--aep-space)", maxHeight: 350 }}>
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "var(--aep-space-xl)",
              color: "var(--aep-text-muted)",
              fontSize: "0.875rem",
            }}
          >
            <p style={{ fontSize: "2rem", margin: 0 }}>🤖</p>
            <p>Ask me anything about {context?.topic || "your learning material"}!</p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.25rem",
                justifyContent: "center",
                marginTop: "0.5rem",
              }}
            >
              {["Explain this concept", "Quiz me", "Generate flashcards", "Career relevance"].map(
                (q) => (
                  <button
                    key={q}
                    onClick={() => {
                      onSend?.(q);
                    }}
                    className="aep-btn aep-btn--secondary aep-btn--sm"
                  >
                    {q}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "0.625rem 1rem",
                borderRadius:
                  m.role === "user"
                    ? "var(--aep-radius-lg) var(--aep-radius-lg) 0 var(--aep-radius-lg)"
                    : "var(--aep-radius-lg) var(--aep-radius-lg) var(--aep-radius-lg) 0",
                background: m.role === "user" ? "var(--aep-primary)" : "var(--aep-surface-alt)",
                color: m.role === "user" ? "#fff" : "var(--aep-text-primary)",
                fontSize: "0.875rem",
                lineHeight: 1.5,
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{ padding: "var(--aep-space-sm)", borderTop: "1px solid var(--aep-border)" }}
      >
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI Tutor..."
            style={{
              flex: 1,
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--aep-border)",
              borderRadius: "var(--aep-radius)",
              fontSize: "0.875rem",
              background: "var(--aep-surface-alt)",
              color: "var(--aep-text-primary)",
            }}
          />
          <button
            type="submit"
            className="aep-btn aep-btn--primary aep-btn--sm"
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================
// AI Action Buttons
// ============================================================

interface AIActionBarProps {
  onExplain?: () => void;
  onSummarize?: () => void;
  onQuiz?: () => void;
  onFlashcards?: () => void;
  onReview?: () => void;
}

export function AIActionBar({
  onExplain,
  onSummarize,
  onQuiz,
  onFlashcards,
  onReview,
}: AIActionBarProps) {
  return (
    <div
      style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", padding: "var(--aep-space) 0" }}
    >
      <button
        onClick={onExplain}
        className="aep-btn aep-btn--secondary aep-btn--sm"
        title="AI Explain"
      >
        🤖 Explain
      </button>
      <button
        onClick={onSummarize}
        className="aep-btn aep-btn--secondary aep-btn--sm"
        title="AI Summarize"
      >
        📝 Summarize
      </button>
      <button onClick={onQuiz} className="aep-btn aep-btn--secondary aep-btn--sm" title="AI Quiz">
        ❓ Quiz Me
      </button>
      <button
        onClick={onFlashcards}
        className="aep-btn aep-btn--secondary aep-btn--sm"
        title="AI Flashcards"
      >
        🃏 Flashcards
      </button>
      <button
        onClick={onReview}
        className="aep-btn aep-btn--secondary aep-btn--sm"
        title="AI Review"
      >
        🔍 Review
      </button>
    </div>
  );
}

// ============================================================
// AI Flashcard Deck
// ============================================================

interface Flashcard {
  front: string;
  back: string;
  hint?: string;
  difficulty?: string;
}

interface FlashcardDeckProps {
  cards: Flashcard[];
  title?: string;
}

export function FlashcardDeck({ cards, title }: FlashcardDeckProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) return null;
  const card = cards[index % cards.length];

  return (
    <div style={{ padding: "var(--aep-space)" }}>
      {title && <h3 style={{ marginBottom: "var(--aep-space)" }}>{title}</h3>}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          padding: "var(--aep-space-xl)",
          minHeight: 160,
          background: flipped ? "var(--aep-primary-bg)" : "var(--aep-surface-alt)",
          border: `1px solid ${flipped ? "var(--aep-primary)" : "var(--aep-border)"}`,
          borderRadius: "var(--aep-radius-lg)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transition: "all var(--aep-transition)",
          userSelect: "none",
        }}
      >
        <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>
          {flipped ? card.back : card.front}
        </div>
        {flipped && card.hint && (
          <div className="aep-text-sm aep-text-muted" style={{ marginTop: "0.5rem" }}>
            💡 {card.hint}
          </div>
        )}
        <div className="aep-text-xs aep-text-muted" style={{ marginTop: "0.5rem" }}>
          {flipped ? "Click to flip back" : "Click to reveal answer"}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          marginTop: "var(--aep-space)",
        }}
      >
        <button
          onClick={() => {
            setIndex((i) => Math.max(0, i - 1));
            setFlipped(false);
          }}
          className="aep-btn aep-btn--secondary aep-btn--sm"
          disabled={index === 0}
        >
          ← Previous
        </button>
        <span style={{ fontSize: "0.875rem", color: "var(--aep-text-muted)", alignSelf: "center" }}>
          {index + 1} / {cards.length}
        </span>
        <button
          onClick={() => {
            setIndex((i) => Math.min(cards.length - 1, i + 1));
            setFlipped(false);
          }}
          className="aep-btn aep-btn--secondary aep-btn--sm"
          disabled={index === cards.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
