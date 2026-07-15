import React, { useState, useCallback } from 'react';

// =============================================================================
// Utility Types
// =============================================================================

type QuizOption = { text: string; correct: boolean };
type QuizQuestion = { question: string; options: string[]; correct: number; explanation?: string };

// =============================================================================
// Info — General information callout
// =============================================================================
export function Info({ children }: { children: React.ReactNode }) {
  return (
    <div className="interactive-block info-block" role="note">
      <span className="block-icon">ℹ️</span>
      <div className="block-content">{children}</div>
    </div>
  );
}

// =============================================================================
// Warning — Caution or important notice
// =============================================================================
export function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="interactive-block warning-block" role="alert">
      <span className="block-icon">⚠️</span>
      <div className="block-content">{children}</div>
    </div>
  );
}

// =============================================================================
// Tip — Helpful tip or shortcut
// =============================================================================
export function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="interactive-block tip-block" role="note">
      <span className="block-icon">💡</span>
      <div className="block-content">{children}</div>
    </div>
  );
}

// =============================================================================
// BestPractice — Recommended approach
// =============================================================================
export function BestPractice({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="interactive-block best-practice-block" role="note">
      <span className="block-icon">✅</span>
      <div className="block-content">
        {title && <strong className="block-title">{title}</strong>}
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// Definition — Term definition
// =============================================================================
export function Definition({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="interactive-block definition-block">
      <span className="block-icon">📖</span>
      <div className="block-content">
        <strong className="definition-term">{term}:</strong> {children}
      </div>
    </div>
  );
}

// =============================================================================
// Example — Real-world or concrete example
// =============================================================================
export function Example({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="interactive-block example-block">
      <span className="block-icon">📋</span>
      <div className="block-content">
        {title && <strong className="block-title">{title}</strong>}
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// Analogy — Simple real-world analogy
// =============================================================================
export function Analogy({ children }: { children: React.ReactNode }) {
  return (
    <div className="interactive-block analogy-block">
      <span className="block-icon">🔄</span>
      <div className="block-content">{children}</div>
    </div>
  );
}

// =============================================================================
// CommonMistake — Common error with correction
// =============================================================================
export function CommonMistake({ mistake, correction }: { mistake: string; correction: string }) {
  return (
    <div className="interactive-block common-mistake-block">
      <span className="block-icon">❌</span>
      <div className="block-content">
        <p><strong>Common Mistake:</strong> {mistake}</p>
        <p><strong>✅ Correct Approach:</strong> {correction}</p>
      </div>
    </div>
  );
}

// =============================================================================
// Debugging — Debugging scenario with diagnosis and solution
// =============================================================================
export function Debugging({ scenario, symptoms, diagnosis, solution }: {
  scenario: string;
  symptoms: string[];
  diagnosis: string;
  solution: string;
}) {
  return (
    <div className="interactive-block debugging-block">
      <span className="block-icon">🐛</span>
      <div className="block-content">
        <p><strong>Scenario:</strong> {scenario}</p>
        <p><strong>Symptoms:</strong></p>
        <ul>{symptoms.map((s, i) => <li key={i}>{s}</li>)}</ul>
        <p><strong>Diagnosis:</strong> {diagnosis}</p>
        <p><strong>✅ Solution:</strong> {solution}</p>
      </div>
    </div>
  );
}

// =============================================================================
// Exercise — Hands-on exercise with instructions
// =============================================================================
export function Exercise({ title, instructions }: { title: string; instructions: string }) {
  return (
    <div className="interactive-block exercise-block">
      <span className="block-icon">🖐️</span>
      <div className="block-content">
        <strong className="block-title">{title}</strong>
        <pre className="exercise-instructions">{instructions}</pre>
      </div>
    </div>
  );
}

// =============================================================================
// Challenge — Harder challenge
// =============================================================================
export function Challenge({ title, description, timeEstimate }: {
  title: string;
  description: string;
  timeEstimate?: string;
}) {
  return (
    <div className="interactive-block challenge-block">
      <span className="block-icon">🏆</span>
      <div className="block-content">
        <strong className="block-title">{title}</strong>
        {timeEstimate && <span className="challenge-time">⏱️ {timeEstimate}</span>}
        <p>{description}</p>
      </div>
    </div>
  );
}

// =============================================================================
// Quiz — Multiple choice quiz with reveal
// =============================================================================
export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<Record<number, number>>({});

  const toggleReveal = useCallback((idx: number) => {
    setRevealed(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }, []);

  return (
    <div className="interactive-block quiz-block">
      <span className="block-icon">📝</span>
      <div className="block-content">
        <strong className="block-title">Check Your Understanding</strong>
        {questions.map((q, qi) => (
          <div key={qi} className="quiz-question">
            <p><strong>{qi + 1}. {q.question}</strong></p>
            <ol type="A">
              {q.options.map((opt, oi) => (
                <li
                  key={oi}
                  className={`quiz-option ${selected[qi] === oi ? 'selected' : ''} ${revealed.has(qi) && oi === q.correct ? 'correct' : ''}`}
                  onClick={() => !revealed.has(qi) && setSelected(s => ({ ...s, [qi]: oi }))}
                >
                  {opt}
                </li>
              ))}
            </ol>
            <button className="quiz-reveal-btn" onClick={() => toggleReveal(qi)}>
              {revealed.has(qi) ? 'Hide Answer' : 'Show Answer'}
            </button>
            {revealed.has(qi) && (
              <div className="quiz-answer">
                <strong>✅ Correct: {String.fromCharCode(65 + q.correct)} — {q.options[q.correct]}</strong>
                {q.explanation && <p>{q.explanation}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// CodeBlock — Syntax-highlighted code (placeholder for Prism/Shiki)
// =============================================================================
export function CodeBlock({ language, children }: { language?: string; children: string }) {
  return (
    <div className="interactive-block code-block-wrapper">
      {language && <span className="code-lang-tag">{language}</span>}
      <pre className="code-block"><code className={language ? `language-${language}` : ''}>{children}</code></pre>
    </div>
  );
}

// =============================================================================
// TerminalBlock — Terminal-style command block
// =============================================================================
export function TerminalBlock({ children }: { children: string }) {
  const lines = children.trim().split('\n');
  return (
    <div className="interactive-block terminal-block">
      <div className="terminal-header">
        <span className="terminal-dot red" />
        <span className="terminal-dot yellow" />
        <span className="terminal-dot green" />
        <span className="terminal-title">Terminal</span>
      </div>
      <pre className="terminal-content">
        {lines.map((line, i) => (
          <div key={i} className="terminal-line">
            {line.startsWith('$ ') || line.startsWith('# ') ? (
              <>
                <span className="terminal-prompt">{line.substring(0, 2)}</span>
                <span>{line.substring(2)}</span>
              </>
            ) : (
              <span className="terminal-output">{line}</span>
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}

// =============================================================================
// Flashcard — Front/back flip card
// =============================================================================
export function Flashcard({ front, back, hint }: { front: string; back: string; hint?: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`interactive-block flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <span className="flashcard-label">Q:</span> {front}
          {hint && <span className="flashcard-hint">💡 Hint: {hint}</span>}
        </div>
        <div className="flashcard-back">
          <span className="flashcard-label">A:</span> {back}
        </div>
      </div>
      <span className="flashcard-flip-hint">Click to flip</span>
    </div>
  );
}

// =============================================================================
// ProductionNote — Production-specific note
// =============================================================================
export function ProductionNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="interactive-block production-note-block" role="note">
      <span className="block-icon">🏭</span>
      <div className="block-content">
        <strong className="block-title">Production Note</strong>
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// ArchitectureNote — Architecture-specific note
// =============================================================================
export function ArchitectureNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="interactive-block architecture-note-block" role="note">
      <span className="block-icon">🏗️</span>
      <div className="block-content">
        <strong className="block-title">Architecture Note</strong>
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// SecurityNote — Security-specific note
// =============================================================================
export function SecurityNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="interactive-block security-note-block" role="note">
      <span className="block-icon">🔒</span>
      <div className="block-content">
        <strong className="block-title">Security Note</strong>
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// CostNote — Cost-specific note
// =============================================================================
export function CostNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="interactive-block cost-note-block" role="note">
      <span className="block-icon">💰</span>
      <div className="block-content">
        <strong className="block-title">Cost Note</strong>
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// InterviewQuestion — Interview preparation
// =============================================================================
export function InterviewQuestion({ question, expectedTopics, difficulty, careerLevel }: {
  question: string;
  expectedTopics: string[];
  difficulty: string;
  careerLevel: string;
}) {
  return (
    <div className="interactive-block interview-block">
      <span className="block-icon">🎤</span>
      <div className="block-content">
        <strong className="block-title">Interview Question</strong>
        <span className="interview-meta">{difficulty} · {careerLevel}</span>
        <p className="interview-question"><strong>Q:</strong> {question}</p>
        <p><strong>Expected Topics:</strong> {expectedTopics.join(', ')}</p>
      </div>
    </div>
  );
}

// =============================================================================
// CheatSheet — Quick reference
// =============================================================================
export function CheatSheet({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="interactive-block cheatsheet-block">
      <span className="block-icon">📄</span>
      <div className="block-content">
        <strong className="block-title">{title}</strong>
        <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </div>
    </div>
  );
}

// =============================================================================
// DecisionPoint — Architecture decision helper
// =============================================================================
export function DecisionPoint({ options, criteria, recommendation }: {
  options: string[];
  criteria: string[];
  recommendation: string;
}) {
  return (
    <div className="interactive-block decision-block">
      <span className="block-icon">🤔</span>
      <div className="block-content">
        <strong className="block-title">Architecture Decision</strong>
        <p><strong>Options:</strong> {options.join(' vs ')}</p>
        <p><strong>Criteria:</strong> {criteria.join(', ')}</p>
        <p><strong>✅ Recommendation:</strong> {recommendation}</p>
      </div>
    </div>
  );
}

// =============================================================================
// Simulator — Placeholder for future simulators
// =============================================================================
export function Simulator({ name, description }: { name: string; description: string }) {
  return (
    <div className="interactive-block simulator-block">
      <span className="block-icon">🕹️</span>
      <div className="block-content">
        <strong className="block-title">{name}</strong>
        <p>{description}</p>
        <span className="simulator-coming-soon">Coming in a future update</span>
      </div>
    </div>
  );
}

// =============================================================================
// AI Components — Provider-agnostic AI integration placeholders
// =============================================================================
export function AIExplanation({ topic, level }: { topic: string; level?: string }) {
  return (
    <div className="interactive-block ai-block">
      <span className="block-icon">🤖</span>
      <div className="block-content">
        <strong className="block-title">AI-Powered Explanation</strong>
        <p>Use an AI assistant to get a {level || 'custom'} explanation of: <strong>{topic}</strong></p>
        <p className="ai-block-hint">Copy the prompt from the <a href="/cloud-engineering/ai/prompt-library">AI Prompt Library</a>.</p>
      </div>
    </div>
  );
}

export function AIQuiz({ topic, count, difficulty }: { topic: string; count?: number; difficulty?: string }) {
  return (
    <div className="interactive-block ai-block">
      <span className="block-icon">🤖</span>
      <div className="block-content">
        <strong className="block-title">AI-Generated Quiz</strong>
        <p>Generate {count || 5} {difficulty || 'adaptive'} quiz questions on: <strong>{topic}</strong></p>
        <p className="ai-block-hint">Use the Quiz Master prompt from the <a href="/cloud-engineering/ai/prompt-library">AI Prompt Library</a>.</p>
      </div>
    </div>
  );
}

export function AIFlashcards({ topic, count }: { topic: string; count?: number }) {
  return (
    <div className="interactive-block ai-block">
      <span className="block-icon">🤖</span>
      <div className="block-content">
        <strong className="block-title">AI-Generated Flashcards</strong>
        <p>Generate {count || 10} flashcards on: <strong>{topic}</strong></p>
        <p className="ai-block-hint">Use the Flashcard Generator prompt from the <a href="/cloud-engineering/ai/prompt-library">AI Prompt Library</a>.</p>
      </div>
    </div>
  );
}
