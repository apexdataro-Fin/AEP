import React, { useState, useCallback } from "react";

// =============================================================================
// Types
// =============================================================================

interface LabStep {
  id: number;
  title: string;
  instruction: string;
  command?: string;
  expectedOutput?: string;
  validation?: (input: string) => boolean;
  hint?: string;
  explanation?: string;
}

interface LabDefinition {
  id: string;
  title: string;
  description: string;
  type: "Guided" | "Challenge" | "Hands-on" | "Project";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  icon: string;
  steps: LabStep[];
}

// =============================================================================
// Lab Definitions
// =============================================================================

const labs: LabDefinition[] = [
  {
    id: "L01",
    title: "استكشاف نظام ملفات Linux",
    description: "تعلم التنقل في نظام ملفات Linux، قراءة الملفات، وفهم هيكل المجلدات.",
    type: "Guided",
    difficulty: "Beginner",
    duration: "30 min",
    icon: "📁",
    steps: [
      { id: 1, title: "أين أنت؟", instruction: "اكتب أمر pwd لتعرف مجلدك الحالي.", command: "pwd", hint: "pwd = Print Working Directory", explanation: "pwd يخبرك أين أنت في نظام الملفات. في البداية ستكون في /home/engineer." },
      { id: 2, title: "ماذا حولك؟", instruction: "استخدم ls -la لعرض كل الملفات والمجلدات في موقعك الحالي.", command: "ls -la", hint: "ls -la يعرض كل الملفات مع تفاصيلها", explanation: "ls = list. -l يعرض تفاصيل (صلاحيات، حجم، تاريخ). -a يعرض الملفات المخفية أيضاً." },
      { id: 3, title: "انتقل للمجلد الجذر", instruction: "انتقل إلى / (المجلد الجذر) باستخدام cd.", command: "cd /", hint: "cd / = change directory to root", explanation: "/ هو أعلى نقطة في شجرة الملفات. كل شيء تحته." },
      { id: 4, title: "استكشف /var/log", instruction: "انتقل إلى /var/log وشاهد السجلات.", command: "cd /var/log", hint: "المسار المطلق: /var/log", explanation: "/var/log يحتوي على كل سجلات النظام. أهم مجلد للمهندس!" },
      { id: 5, title: "اقرأ ملف سجل", instruction: "استخدم cat لقراءة ملف syslog.", command: "cat syslog", hint: "cat <filename>", explanation: "cat يعرض محتوى الملف. في الإنتاج، استخدم tail -f للمراقبة المباشرة." },
    ],
  },
  {
    id: "L02",
    title: "تشخيص مشكلة Nginx",
    description: "استخدم أدوات Linux لتشخيص وإصلاح مشكلة في خادم Nginx.",
    type: "Challenge",
    difficulty: "Intermediate",
    duration: "45 min",
    icon: "🔍",
    steps: [
      { id: 1, title: "تحقق من العملية", instruction: "استخدم ps aux للبحث عن عملية nginx.", command: "ps aux | grep nginx", hint: "ps aux يعرض كل العمليات", explanation: "إذا لم تجد nginx في القائمة، فهذا يعني أن الخدمة متوقفة." },
      { id: 2, title: "تحقق من حالة الخدمة", instruction: "استخدم systemctl status nginx.", command: "systemctl status nginx", hint: "systemctl status <service-name>", explanation: "إذا كانت الخدمة inactive، تحتاج لتشغيلها." },
      { id: 3, title: "اقرأ سجلات الخطأ", instruction: "اقرأ /var/log/nginx/error.log.", command: "cat /var/log/nginx/error.log", hint: "المسار: /var/log/nginx/error.log", explanation: "سجلات الخطأ تخبرك لماذا فشل nginx في البدء. غالباً مشكلة منفذ أو صلاحيات." },
      { id: 4, title: "تحقق من المنفذ", instruction: "استخدم ss لمعرفة من يستخدم المنفذ 80.", command: "ss -tlnp | grep :80", hint: "ss -tlnp | grep :<port>", explanation: "إذا كانت عملية أخرى تستخدم المنفذ 80، فلن يستطيع nginx البدء." },
      { id: 5, title: "أعد تشغيل الخدمة", instruction: "شغّل nginx بعد حل المشكلة.", command: "systemctl start nginx", hint: "systemctl start nginx", explanation: "بعد تشغيل الخدمة، تأكد منها بـ systemctl status و curl localhost." },
    ],
  },
  {
    id: "L03",
    title: "بناء ونشر حاوية Docker",
    description: "ابنِ صورة Docker مخصصة، شغّلها، واربطها بالشبكة.",
    type: "Hands-on",
    difficulty: "Intermediate",
    duration: "60 min",
    icon: "🐳",
    steps: [
      { id: 1, title: "اكتب Dockerfile", instruction: "أنشئ Dockerfile بسيط لـ Node.js. ابدأ بـ FROM node:18-alpine.", command: "FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --production\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]", hint: "ابدأ بـ FROM، ثم WORKDIR، COPY، RUN، EXPOSE، CMD", explanation: "كل سطر في Dockerfile هو طبقة. رتب الطبقات من الأقل تغييراً إلى الأكثر تغييراً للاستفادة من الكاش." },
      { id: 2, title: "ابنِ الصورة", instruction: "استخدم docker build لبناء الصورة واعطها اسم my-app.", command: "docker build -t my-app .", hint: "docker build -t <name> <path>", explanation: "-t يعطي الصورة اسماً (tag). النقطة تعني السياق الحالي." },
      { id: 3, title: "شغّل الحاوية", instruction: "شغّل الصورة واربط المنفذ 3000 بالمضيف على 8080.", command: "docker run -d -p 8080:3000 --name my-container my-app", hint: "docker run -d -p <host>:<container> --name <name> <image>", explanation: "-d يجعلها في الخلفية. -p يربط المنافذ." },
      { id: 4, title: "تحقق من الحاوية", instruction: "استخدم docker ps و docker logs للتأكد.", command: "docker logs my-container", hint: "docker logs <container-name>", explanation: "السجلات تؤكد أن التطبيق بدأ. جرب curl http://localhost:8080." },
      { id: 5, title: "نظف الموارد", instruction: "أوقف الحاوية واحذفها.", command: "docker stop my-container && docker rm my-container", hint: "docker stop <name> && docker rm <name>", explanation: "دائماً نظف الحاويات غير المستخدمة. docker system prune مفيد للتنظيف الشامل." },
    ],
  },
  {
    id: "L04",
    title: "نشر تطبيق على Kubernetes",
    description: "أنشئ Deployment و Service لتطبيق ويب على Kubernetes.",
    type: "Hands-on",
    difficulty: "Advanced",
    duration: "90 min",
    icon: "☸️",
    steps: [
      { id: 1, title: "أنشئ Deployment", instruction: "اكتب Deployment YAML بـ 3 replicas لصورة nginx.", command: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-deployment\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n        - name: nginx\n          image: nginx:alpine\n          ports:\n            - containerPort: 80", hint: "Deployment يحتاج: apiVersion، kind، metadata، spec مع replicas و selector و template", explanation: "Deployment يدير Pods نيابة عنك. إذا مات Pod، ينشئ واحداً جديداً تلقائياً." },
      { id: 2, title: "طبق الـ Deployment", instruction: "استخدم kubectl apply لنشر الـ Deployment.", command: "kubectl apply -f deployment.yaml", hint: "kubectl apply -f <filename>", explanation: "apply ينشئ أو يحدث المورد. declarative approach." },
      { id: 3, title: "أنشئ Service", instruction: "اكتب Service YAML من نوع LoadBalancer.", command: "apiVersion: v1\nkind: Service\nmetadata:\n  name: web-service\nspec:\n  type: LoadBalancer\n  selector:\n    app: web\n  ports:\n    - port: 80\n      targetPort: 80", hint: "Service من نوع LoadBalancer يعطيك IP خارجي.", explanation: "Service تجمع Pods تحت IP واحد. selector يجب أن يطابق labels." },
      { id: 4, title: "تحقق من النشر", instruction: "استخدم kubectl get all للتحقق.", command: "kubectl get pods,svc,deploy", hint: "kubectl get pods,svc,deploy", explanation: "تأكد أن 3 Pods في Running وأن Service لديها EXTERNAL-IP." },
      { id: 5, title: "اختبر Scaling", instruction: "زد عدد النسخ إلى 5.", command: "kubectl scale deployment web-deployment --replicas=5", hint: "kubectl scale deployment <name> --replicas=<n>", explanation: "Scale up/down فوري. Kubernetes يوزع Pods على الـ Nodes المتاحة." },
    ],
  },
];

// =============================================================================
// Lab Step Component
// =============================================================================

function LabStepView({
  step,
  stepIndex,
  totalSteps,
  isCompleted,
  isActive,
  onComplete,
}: {
  step: LabStep;
  stepIndex: number;
  totalSteps: number;
  isCompleted: boolean;
  isActive: boolean;
  onComplete: () => void;
}) {
  const [userInput, setUserInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    const trimmed = userInput.trim().toLowerCase();
    if (!trimmed) return;

    if (step.command) {
      const expected = step.command.toLowerCase();
      // Check if the input contains the key parts of the expected command
      const keyParts = expected.split(/\s+/).filter(p => p.length > 2 && !p.startsWith("-"));
      const allMatch = keyParts.every(part => trimmed.includes(part));
      if (allMatch || trimmed === expected) {
        setFeedback("✅ صحيح! أحسنت.");
        setTimeout(() => { onComplete(); setFeedback(""); }, 1500);
      } else {
        setFeedback("❌ ليس تماماً. حاول مرة أخرى.");
        setShowHint(true);
      }
    } else {
      setFeedback("✅ تم!");
      setTimeout(() => { onComplete(); setFeedback(""); }, 1500);
    }
  };

  return (
    <div style={{
      padding: "1.25rem",
      marginBottom: "0.75rem",
      borderRadius: "0.75rem",
      border: `1px solid ${isCompleted ? "var(--aep-accent)" : isActive ? "var(--aep-primary)" : "var(--aep-border)"}`,
      background: isActive ? "var(--aep-surface-raised)" : isCompleted ? "rgba(90, 143, 110, 0.04)" : "var(--aep-surface-alt)",
      opacity: isActive || isCompleted ? 1 : 0.6,
      transition: "all 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <span style={{
          width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          background: isCompleted ? "var(--aep-accent)" : isActive ? "var(--aep-primary)" : "var(--aep-surface-hover)",
          color: isCompleted || isActive ? "#fff" : "var(--aep-text-muted)", fontWeight: 700, fontSize: "0.85rem",
        }}>
          {isCompleted ? "✓" : step.id}
        </span>
        <div>
          <strong style={{ color: "var(--aep-text-primary)", fontSize: "0.95rem" }}>{step.title}</strong>
          <div style={{ fontSize: "0.75rem", color: "var(--aep-text-muted)" }}>خطوة {step.id} من {totalSteps}</div>
        </div>
      </div>
      {isActive && (
        <>
          <p style={{ color: "var(--aep-text-secondary)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>{step.instruction}</p>
          {showHint && (
            <div style={{ padding: "0.5rem 0.75rem", background: "rgba(198, 156, 62, 0.1)", borderRadius: "0.5rem", marginBottom: "0.75rem", fontSize: "0.8rem", color: "var(--aep-warning)" }}>
              💡 {step.hint}
            </div>
          )}
          {step.command ? (
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="$ اكتب الأمر..."
                style={{
                  flex: 1, padding: "0.5rem 0.75rem", background: "#1a1410", border: "1px solid var(--aep-border)",
                  borderRadius: "0.5rem", color: "#e2d8cf", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", outline: "none",
                }}
                spellCheck={false}
              />
              <button onClick={handleSubmit} className="aep-btn aep-btn--primary aep-btn--sm">تشغيل</button>
            </div>
          ) : (
            <button onClick={handleSubmit} className="aep-btn aep-btn--primary aep-btn--sm" style={{ marginBottom: "0.5rem" }}>✔️ تم</button>
          )}
          {feedback && (
            <div style={{ fontSize: "0.85rem", color: feedback.startsWith("✅") ? "var(--aep-accent)" : "var(--aep-danger)", marginBottom: "0.5rem" }}>
              {feedback}
            </div>
          )}
          {showExplanation && step.explanation && (
            <div style={{ padding: "0.5rem 0.75rem", background: "rgba(74, 122, 158, 0.06)", borderRadius: "0.5rem", fontSize: "0.8rem", color: "var(--aep-text-secondary)" }}>
              📖 {step.explanation}
            </div>
          )}
          {!showExplanation && (
            <button onClick={() => setShowExplanation(true)} style={{ fontSize: "0.75rem", color: "var(--aep-primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              اقرأ الشرح ←
            </button>
          )}
        </>
      )}
      {isCompleted && step.explanation && (
        <p style={{ fontSize: "0.8rem", color: "var(--aep-text-muted)", margin: 0 }}>📖 {step.explanation}</p>
      )}
    </div>
  );
}

// =============================================================================
// Main Interactive Lab Component
// =============================================================================

export function InteractiveLab({ labId }: { labId?: string }) {
  const [selectedLabIdx, setSelectedLabIdx] = useState(() => {
    if (labId) {
      const idx = labs.findIndex(l => l.id === labId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [labStarted, setLabStarted] = useState(false);
  const [labFinished, setLabFinished] = useState(false);

  const lab = labs[selectedLabIdx];

  const handleStepComplete = useCallback(() => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(activeStepIdx);
      return next;
    });
    if (activeStepIdx < lab.steps.length - 1) {
      setActiveStepIdx(prev => prev + 1);
    } else {
      setLabFinished(true);
    }
  }, [activeStepIdx, lab.steps.length]);

  const startLab = () => {
    setLabStarted(true);
    setActiveStepIdx(0);
    setCompletedSteps(new Set());
    setLabFinished(false);
  };

  const selectLab = (idx: number) => {
    setSelectedLabIdx(idx);
    setLabStarted(false);
    setCompletedSteps(new Set());
    setActiveStepIdx(0);
    setLabFinished(false);
  };

  if (!labStarted) {
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {labs.map((l, i) => (
            <div key={l.id} className="aep-card" style={{ cursor: "pointer", borderLeft: `3px solid ${i === selectedLabIdx ? "var(--aep-primary)" : "var(--aep-border)"}` }} onClick={() => selectLab(i)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{l.icon}</span>
                <span className="aep-badge" style={{ background: l.type === "Guided" ? "rgba(74,122,158,0.1)" : l.type === "Challenge" ? "rgba(198,156,62,0.1)" : "rgba(90,143,110,0.1)", color: l.type === "Guided" ? "var(--aep-info)" : l.type === "Challenge" ? "var(--aep-warning)" : "var(--aep-accent)" }}>{l.type}</span>
              </div>
              <h4 style={{ margin: "0 0 0.25rem", color: "var(--aep-text-primary)", fontSize: "1rem" }}>{l.title}</h4>
              <p style={{ margin: "0 0 0.75rem", color: "var(--aep-text-secondary)", fontSize: "0.85rem" }}>{l.description}</p>
              <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "var(--aep-text-muted)" }}>
                <span>⏱ {l.duration}</span>
                <span>📊 {l.difficulty}</span>
                <span>📝 {l.steps.length} خطوات</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button onClick={startLab} className="aep-btn aep-btn--primary aep-btn--lg">
            🚀 ابدأ {lab.title}
          </button>
        </div>
      </div>
    );
  }

  if (labFinished) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", background: "var(--aep-surface-raised)", borderRadius: "0.75rem", border: "1px solid var(--aep-border)" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
        <h3 style={{ color: "var(--aep-text-primary)", marginBottom: "0.5rem" }}>أكملت المختبر!</h3>
        <p style={{ color: "var(--aep-text-secondary)", marginBottom: "1.5rem" }}>
          {lab.title} — {lab.steps.length}/{lab.steps.length} خطوات مكتملة
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => { setLabStarted(false); }} className="aep-btn aep-btn--secondary">العودة للقائمة</button>
          <button onClick={startLab} className="aep-btn aep-btn--primary">إعادة المختبر</button>
        </div>
      </div>
    );
  }

  const progress = Math.round((completedSteps.size / lab.steps.length) * 100);

  return (
    <div style={{ borderRadius: "0.75rem", overflow: "hidden", border: "1px solid var(--aep-border)", background: "var(--aep-surface-raised)" }}>
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--aep-border-light)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.25rem" }}>{lab.icon}</span>
            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--aep-text-primary)" }}>{lab.title}</h3>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--aep-text-muted)", marginTop: "0.25rem" }}>
            {lab.type} · {lab.difficulty} · {lab.duration}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--aep-primary)" }}>{progress}%</div>
          <div style={{ fontSize: "0.7rem", color: "var(--aep-text-muted)" }}>اكتمال</div>
        </div>
      </div>
      <div style={{ padding: "0.75rem 1.25rem" }}>
        <div className="aep-progress" style={{ marginBottom: "1rem" }}>
          <div className={`aep-progress-bar ${progress === 100 ? "aep-progress-bar--success" : ""}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div style={{ padding: "0 1.25rem 1.25rem" }}>
        {lab.steps.map((step, i) => (
          <LabStepView
            key={step.id}
            step={step}
            stepIndex={i}
            totalSteps={lab.steps.length}
            isCompleted={completedSteps.has(i)}
            isActive={i === activeStepIdx}
            onComplete={handleStepComplete}
          />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Lab List with Interactive Launcher
// =============================================================================

export function LabSelector() {
  const [selectedLab, setSelectedLab] = useState<string | null>(null);

  if (selectedLab) {
    return (
      <div>
        <button
          onClick={() => setSelectedLab(null)}
          className="aep-btn aep-btn--ghost aep-btn--sm"
          style={{ marginBottom: "1rem" }}
        >
          ← العودة لقائمة المختبرات
        </button>
        <InteractiveLab labId={selectedLab} />
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
      {labs.map(lab => (
        <div
          key={lab.id}
          className="aep-card aep-card--lab"
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedLab(lab.id)}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "2rem" }}>{lab.icon}</span>
            <span className="aep-badge" style={{
              background: lab.type === "Guided" ? "rgba(74,122,158,0.1)" : lab.type === "Challenge" ? "rgba(198,156,62,0.1)" : "rgba(90,143,110,0.1)",
              color: lab.type === "Guided" ? "var(--aep-info)" : lab.type === "Challenge" ? "var(--aep-warning)" : "var(--aep-accent)",
            }}>
              {lab.type}
            </span>
          </div>
          <h4 style={{ margin: "0 0 0.25rem", color: "var(--aep-text-primary)", fontSize: "1.05rem" }}>{lab.title}</h4>
          <p style={{ margin: "0 0 0.75rem", color: "var(--aep-text-secondary)", fontSize: "0.85rem", lineHeight: 1.5 }}>{lab.description}</p>
          <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--aep-text-muted)", marginBottom: "1rem" }}>
            <span>⏱ {lab.duration}</span>
            <span>📊 {lab.difficulty}</span>
            <span>📝 {lab.steps.length} خطوات</span>
          </div>
          <button className="aep-btn aep-btn--primary aep-btn--sm" style={{ width: "100%" }}>
            🚀 بدء المختبر
          </button>
        </div>
      ))}
    </div>
  );
}
