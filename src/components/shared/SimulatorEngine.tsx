import React, { useState, useRef, useCallback, useEffect } from "react";

// =============================================================================
// Types
// =============================================================================

interface FileNode {
  type: "file" | "dir";
  content?: string;
  children?: Record<string, FileNode>;
  perms?: string;
  owner?: string;
  size?: number;
}

interface TerminalState {
  cwd: string;
  fs: Record<string, FileNode>;
  history: string[];
}

// =============================================================================
// Simulated Filesystem
// =============================================================================

function createInitialFS(): Record<string, FileNode> {
  return {
    "/": {
      type: "dir",
      children: {
        bin: { type: "dir", children: {} },
        boot: { type: "dir", children: {} },
        dev: { type: "dir", children: {} },
        etc: {
          type: "dir",
          children: {
            "hostname": { type: "file", content: "cloudnova-prod-01", perms: "-rw-r--r--", owner: "root", size: 18 },
            "nginx": { type: "dir", children: { "nginx.conf": { type: "file", content: "server {\n    listen 80;\n    server_name cloudnova.com;\n    root /var/www/html;\n}", perms: "-rw-r--r--", owner: "root", size: 89 } } },
            "ssh": { type: "dir", children: { "sshd_config": { type: "file", content: "Port 22\nPermitRootLogin no\nPasswordAuthentication yes", perms: "-rw-------", owner: "root", size: 64 } } },
          },
        },
        home: {
          type: "dir",
          children: {
            engineer: {
              type: "dir",
              children: {
                "welcome.txt": { type: "file", content: "مرحباً بك في CloudNova!\nأنت الآن مهندس السحابة الجديد في الفريق.", perms: "-rw-r--r--", owner: "engineer", size: 72 },
                "projects": { type: "dir", children: {} },
                "scripts": { type: "dir", children: { "health-check.sh": { type: "file", content: "#!/bin/bash\necho \"Checking services...\"\nsystemctl status nginx\ndf -h", perms: "-rwxr-xr-x", owner: "engineer", size: 73 } } },
              },
            },
          },
        },
        var: {
          type: "dir",
          children: {
            log: {
              type: "dir",
              children: {
                "nginx": { type: "dir", children: { "access.log": { type: "file", content: "192.168.1.10 - [15/Jul/2026:10:23:45] GET / HTTP/1.1 200\n192.168.1.11 - [15/Jul/2026:10:23:46] GET /api HTTP/1.1 500\n192.168.1.10 - [15/Jul/2026:10:23:47] GET / HTTP/1.1 200", perms: "-rw-r--r--", owner: "www-data", size: 160 }, "error.log": { type: "file", content: "2026/07/15 10:23:46 [error] 1234#0: *2 connect() failed (111: Connection refused) while connecting to upstream", perms: "-rw-r--r--", owner: "www-data", size: 130 } } },
                "syslog": { type: "file", content: "Jul 15 10:23:45 cloudnova-prod-01 systemd[1]: Started Nginx.\nJul 15 10:23:46 cloudnova-prod-01 kernel: Out of memory: Kill process 5678", perms: "-rw-r-----", owner: "syslog", size: 140 },
              },
            },
            www: { type: "dir", children: { html: { type: "dir", children: { "index.html": { type: "file", content: "<h1>CloudNova Platform</h1>", perms: "-rw-r--r--", owner: "www-data", size: 30 } } } } },
          },
        },
        tmp: { type: "dir", children: {} },
        usr: { type: "dir", children: { local: { type: "dir", children: { bin: { type: "dir", children: {} } } } } },
        opt: { type: "dir", children: {} },
      },
    },
  };
}

// =============================================================================
// Helpers
// =============================================================================

function resolvePath(cwd: string, path: string): string {
  if (path === "/") return "/";
  const parts = path.startsWith("/") ? path.split("/").filter(Boolean) : [...cwd.split("/").filter(Boolean), ...path.split("/").filter(Boolean)];
  const resolved: string[] = [];
  for (const p of parts) {
    if (p === "..") resolved.pop();
    else if (p !== ".") resolved.push(p);
  }
  return "/" + resolved.join("/");
}

function getNodeAt(fs: Record<string, FileNode>, path: string): FileNode | null {
  if (path === "/") return fs["/"];
  const parts = path.split("/").filter(Boolean);
  let node = fs["/"];
  for (const p of parts) {
    if (!node || node.type !== "dir" || !node.children || !node.children[p]) return null;
    node = node.children[p];
  }
  return node;
}

function getParentPath(path: string): string {
  if (path === "/") return "/";
  return "/" + path.split("/").filter(Boolean).slice(0, -1).join("/");
}

function fileName(path: string): string {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] || "/";
}

// =============================================================================
// Linux Terminal Simulator
// =============================================================================

export function LinuxTerminalSimulator() {
  const [state, setState] = useState<TerminalState>({ cwd: "/home/engineer", fs: createInitialFS(), history: [] });
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([
    "╔══════════════════════════════════════════════════╗",
    "║     🐧  CloudNova Linux Terminal Simulator      ║",
    "║                                                  ║",
    "║  جرب الأوامر: ls, cd, cat, pwd, whoami, echo,   ║",
    "║  mkdir, touch, rm, cp, mv, chmod, find, grep,   ║",
    "║  df, free, ps, top, systemctl, docker, kubectl  ║",
    "║  اكتب 'help' للمساعدة | 'clear' لمسح الشاشة     ║",
    "╚══════════════════════════════════════════════════╝",
    "",
    `engineer@cloudnova:~$ `,
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [output]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const appendOutput = useCallback((lines: string[]) => {
    setOutput(prev => [...prev, ...lines]);
  }, []);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) {
      appendOutput([`engineer@cloudnova:~${state.cwd === "/" ? "" : state.cwd.replace("/home/engineer", "~")}$ `]);
      return;
    }

    appendOutput([`engineer@cloudnova:~${state.cwd === "/" ? "" : state.cwd.replace("/home/engineer", "~")}$ ${trimmed}`]);

    // Parse command and args
    const parts = trimmed.split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
      case "help": {
        appendOutput([
          "📚 الأوامر المتاحة:",
          "  ls [path]         - عرض محتويات المجلد",
          "  cd <path>         - تغيير المجلد الحالي",
          "  pwd               - عرض المسار الحالي",
          "  cat <file>        - عرض محتوى ملف",
          "  echo <text>       - طباعة نص",
          "  whoami            - عرض المستخدم الحالي",
          "  date              - عرض التاريخ والوقت",
          "  uname [-a]        - معلومات النظام",
          "  mkdir <dir>       - إنشاء مجلد",
          "  touch <file>      - إنشاء ملف",
          "  rm <file>         - حذف ملف",
          "  cp <src> <dst>    - نسخ ملف",
          "  mv <src> <dst>    - نقل/إعادة تسمية",
          "  chmod <mode> <f>  - تغيير الصلاحيات",
          "  find <path> -name - بحث عن ملفات",
          "  grep <pattern> <f>- بحث داخل ملف",
          "  df -h             - مساحة القرص",
          "  free -h           - الذاكرة المتاحة",
          "  ps aux            - العمليات الجارية",
          "  systemctl status  - حالة خدمة",
          "  docker ps         - حاويات Docker",
          "  kubectl get pods  - Pods في Kubernetes",
          "  curl <url>        - طلب HTTP",
          "  clear             - مسح الشاشة",
        ]);
        break;
      }
      case "clear": {
        setOutput([]);
        return;
      }
      case "whoami": {
        appendOutput(["engineer"]);
        break;
      }
      case "date": {
        appendOutput([new Date().toString()]);
        break;
      }
      case "uname": {
        if (args.includes("-a")) appendOutput(["Linux cloudnova-prod-01 5.15.0-1023-azure #29~20.04.1-Ubuntu SMP x86_64 GNU/Linux"]);
        else appendOutput(["Linux"]);
        break;
      }
      case "pwd": {
        appendOutput([state.cwd]);
        break;
      }
      case "ls": {
        const targetPath = args.length > 0 && !args[0].startsWith("-") ? resolvePath(state.cwd, args[0]) : state.cwd;
        const showAll = args.includes("-la") || args.includes("-al") || args.includes("-a") || args.includes("-l");
        const node = getNodeAt(state.fs, targetPath);
        if (!node || node.type !== "dir") {
          appendOutput([`ls: cannot access '${args[0] || targetPath}': No such file or directory`]);
          break;
        }
        const children = node.children || {};
        const names = Object.keys(children);
        if (names.length === 0) {
          appendOutput([""]);
          break;
        }
        if (showAll) {
          appendOutput(["total " + (names.length * 4)]);
          names.sort().forEach(name => {
            const child = children[name];
            const perms = child.perms || (child.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--");
            const owner = child.owner || "engineer";
            const size = child.size || (child.type === "dir" ? 4096 : 0);
            const color = child.type === "dir" ? "\x1b[34m" : "\x1b[0m";
            appendOutput([`${perms} 1 ${owner} ${owner} ${String(size).padStart(5)} Jul 15 10:23 ${color}${name}\x1b[0m`]);
          });
        } else {
          const colored = names.sort().map(name => children[name].type === "dir" ? `\x1b[34m${name}/\x1b[0m` : name);
          appendOutput([colored.join("  ")]);
        }
        break;
      }
      case "cd": {
        if (args.length === 0 || args[0] === "~") {
          setState(s => ({ ...s, cwd: "/home/engineer" }));
          break;
        }
        const target = resolvePath(state.cwd, args[0]);
        const node = getNodeAt(state.fs, target);
        if (!node || node.type !== "dir") {
          appendOutput([`cd: ${args[0]}: No such file or directory`]);
          break;
        }
        setState(s => ({ ...s, cwd: target }));
        break;
      }
      case "cat": {
        if (args.length === 0) {
          appendOutput(["Usage: cat <file>"]);
          break;
        }
        const target = resolvePath(state.cwd, args[0]);
        const node = getNodeAt(state.fs, target);
        if (!node || node.type !== "file") {
          appendOutput([`cat: ${args[0]}: No such file or directory`]);
          break;
        }
        appendOutput((node.content || "").split("\n"));
        break;
      }
      case "echo": {
        appendOutput([args.join(" ")]);
        break;
      }
      case "mkdir": {
        if (args.length === 0) { appendOutput(["mkdir: missing operand"]); break; }
        const target = resolvePath(state.cwd, args[0]);
        const parentPath = getParentPath(target);
        const name = fileName(target);
        const parent = getNodeAt(state.fs, parentPath);
        if (!parent || parent.type !== "dir") { appendOutput([`mkdir: cannot create directory '${args[0]}': No such file or directory`]); break; }
        setState(s => {
          const newFS = JSON.parse(JSON.stringify(s.fs));
          const p = getNodeAt(newFS, parentPath)!;
          p.children = p.children || {};
          p.children[name] = { type: "dir", children: {} };
          return { ...s, fs: newFS };
        });
        appendOutput([""]);
        break;
      }
      case "touch": {
        if (args.length === 0) { appendOutput(["touch: missing file operand"]); break; }
        const target = resolvePath(state.cwd, args[0]);
        const parentPath = getParentPath(target);
        const name = fileName(target);
        const parent = getNodeAt(state.fs, parentPath);
        if (!parent || parent.type !== "dir") { appendOutput([`touch: cannot touch '${args[0]}': No such file or directory`]); break; }
        setState(s => {
          const newFS = JSON.parse(JSON.stringify(s.fs));
          const p = getNodeAt(newFS, parentPath)!;
          p.children = p.children || {};
          if (!p.children[name]) p.children[name] = { type: "file", content: "", perms: "-rw-r--r--", owner: "engineer", size: 0 };
          return { ...s, fs: newFS };
        });
        appendOutput([""]);
        break;
      }
      case "rm": {
        if (args.length === 0) { appendOutput(["rm: missing operand"]); break; }
        const recursive = args.includes("-r") || args.includes("-rf");
        const fileArg = args.filter(a => !a.startsWith("-"))[0];
        if (!fileArg) { appendOutput(["rm: missing operand"]); break; }
        const target = resolvePath(state.cwd, fileArg);
        const parentPath = getParentPath(target);
        const name = fileName(target);
        const node = getNodeAt(state.fs, target);
        if (!node) { appendOutput([`rm: cannot remove '${fileArg}': No such file or directory`]); break; }
        if (node.type === "dir" && !recursive) { appendOutput([`rm: cannot remove '${fileArg}': Is a directory`]); break; }
        setState(s => {
          const newFS = JSON.parse(JSON.stringify(s.fs));
          const p = getNodeAt(newFS, parentPath)!;
          delete p.children![name];
          return { ...s, fs: newFS };
        });
        appendOutput([""]);
        break;
      }
      case "cp": {
        if (args.length < 2) { appendOutput(["cp: missing file operand"]); break; }
        const src = resolvePath(state.cwd, args[0]);
        const dst = resolvePath(state.cwd, args[1]);
        const srcNode = getNodeAt(state.fs, src);
        if (!srcNode || srcNode.type !== "file") { appendOutput([`cp: cannot stat '${args[0]}': No such file or directory`]); break; }
        const dstParent = getParentPath(dst);
        const dstName = fileName(dst);
        setState(s => {
          const newFS = JSON.parse(JSON.stringify(s.fs));
          const dp = getNodeAt(newFS, dstParent)!;
          dp.children = dp.children || {};
          dp.children[dstName] = JSON.parse(JSON.stringify(srcNode));
          return { ...s, fs: newFS };
        });
        appendOutput([""]);
        break;
      }
      case "mv": {
        if (args.length < 2) { appendOutput(["mv: missing file operand"]); break; }
        const src = resolvePath(state.cwd, args[0]);
        const dst = resolvePath(state.cwd, args[1]);
        const srcNode = getNodeAt(state.fs, src);
        if (!srcNode) { appendOutput([`mv: cannot stat '${args[0]}': No such file or directory`]); break; }
        const srcParent = getParentPath(src);
        const srcName = fileName(src);
        const dstParent = getParentPath(dst);
        const dstName = fileName(dst);
        setState(s => {
          const newFS = JSON.parse(JSON.stringify(s.fs));
          const sp = getNodeAt(newFS, srcParent)!;
          delete sp.children![srcName];
          const dp = getNodeAt(newFS, dstParent)!;
          dp.children = dp.children || {};
          dp.children[dstName] = srcNode;
          return { ...s, fs: newFS };
        });
        appendOutput([""]);
        break;
      }
      case "chmod": {
        if (args.length < 2) { appendOutput(["chmod: missing operand"]); break; }
        appendOutput(["chmod: simulated — permissions updated ✓"]);
        break;
      }
      case "find": {
        const searchPath = args[0] && !args[0].startsWith("-") ? resolvePath(state.cwd, args[0]) : state.cwd;
        const nameIdx = args.indexOf("-name");
        const pattern = nameIdx >= 0 ? args[nameIdx + 1]?.replace(/['"]/g, "") : "*";
        const results: string[] = [];
        function search(node: FileNode, path: string) {
          if (!node || node.type !== "dir" || !node.children) return;
          for (const [name, child] of Object.entries(node.children)) {
            const fullPath = path === "/" ? `/${name}` : `${path}/${name}`;
            if (pattern === "*" || name.includes(pattern.replace(/\*/g, ""))) results.push(fullPath);
            if (child.type === "dir") search(child, fullPath);
          }
        }
        const startNode = getNodeAt(state.fs, searchPath);
        if (startNode) search(startNode, searchPath === "/" ? "/" : searchPath);
        appendOutput(results.length > 0 ? results : ["No matches found"]);
        break;
      }
      case "grep": {
        if (args.length < 2) { appendOutput(["Usage: grep <pattern> <file>"]); break; }
        const pattern = args[0];
        const filePath = resolvePath(state.cwd, args[1]);
        const node = getNodeAt(state.fs, filePath);
        if (!node || node.type !== "file") { appendOutput([`grep: ${args[1]}: No such file or directory`]); break; }
        const lines = (node.content || "").split("\n").filter(l => l.includes(pattern));
        appendOutput(lines.length > 0 ? lines : [""]);
        break;
      }
      case "df": {
        if (args.includes("-h")) {
          appendOutput([
            "Filesystem      Size  Used Avail Use% Mounted on",
            "/dev/sda1        50G   32G   16G  67% /",
            "/dev/sdb1       200G  145G   46G  76% /data",
            "tmpfs           7.8G  1.2G  6.6G  16% /dev/shm",
          ]);
        } else {
          appendOutput(["Filesystem     1K-blocks    Used Available Use% Mounted on", "/dev/sda1       52428800 33554432 18874368  67% /"]);
        }
        break;
      }
      case "free": {
        if (args.includes("-h")) {
          appendOutput([
            "              total        used        free      shared  buff/cache   available",
            "Mem:           15Gi       4.2Gi       8.1Gi       256Mi       3.1Gi        10Gi",
            "Swap:         2.0Gi       128Mi       1.9Gi",
          ]);
        } else {
          appendOutput(["              total        used        free      shared  buff/cache   available", "Mem:       16384000    4456448    8519680      262144    3407872    10678272"]);
        }
        break;
      }
      case "ps": {
        if (args.includes("aux") || args.includes("-ef")) {
          appendOutput([
            "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND",
            "root         1  0.0  0.1 169428 11684 ?        Ss   Jul14   0:03 /sbin/init",
            "root       456  0.0  0.2  98764 21876 ?        Ss   Jul14   0:00 /usr/sbin/sshd",
            "nginx     1234  0.0  1.2 487652 126548 ?       S    Jul14   0:45 nginx: worker process",
            "engineer  5678  0.1  2.4 892456 251200 ?       Sl   Jul14   1:23 /usr/bin/python3 app.py",
            "engineer  8901  0.0  0.1  12356  8900 pts/0    R+   10:23   0:00 ps aux",
          ]);
        } else {
          appendOutput(["  PID TTY          TIME CMD", " 8901 pts/0    00:00:00 ps"]);
        }
        break;
      }
      case "systemctl": {
        if (args[0] === "status" && args[1]) {
          if (args[1] === "nginx") {
            appendOutput([
              "● nginx.service - A high performance web server",
              "   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)",
              "   Active: active (running) since Mon 2026-07-14 08:00:00 UTC; 1 day 2h ago",
              " Main PID: 1234 (nginx)",
              "    Tasks: 5 (limit: 4915)",
              "   Memory: 126.5M",
              "   CGroup: /system.slice/nginx.service",
              "           ├─1234 nginx: master process",
              "           └─1235 nginx: worker process",
            ]);
          } else if (args[1] === "docker") {
            appendOutput(["● docker.service - Docker Application Container Engine", "   Active: active (running) since Mon 2026-07-14 08:00:00 UTC"]);
          } else {
            appendOutput([`Unit ${args[1]}.service could not be found.`]);
          }
        } else {
          appendOutput(["Usage: systemctl status <service>"]);
        }
        break;
      }
      case "docker": {
        if (args[0] === "ps") {
          appendOutput([
            "CONTAINER ID   IMAGE                    STATUS          PORTS                    NAMES",
            "a1b2c3d4e5f6   cloudnova/api:v2.1       Up 3 hours      0.0.0.0:8080->8080/tcp   api-prod-01",
            "b2c3d4e5f6a1   cloudnova/api:v2.1       Up 3 hours      0.0.0.0:8081->8080/tcp   api-prod-02",
            "c3d4e5f6a1b2   cloudnova/worker:v2.1    Up 3 hours                               worker-prod-01",
            "d4e5f6a1b2c3   redis:7-alpine            Up 2 weeks      6379/tcp                 redis-cache",
            "e5f6a1b2c3d4   postgres:15-alpine        Up 2 weeks      5432/tcp                 postgres-db",
          ]);
        } else if (args[0] === "images") {
          appendOutput([
            "REPOSITORY              TAG       IMAGE ID       CREATED        SIZE",
            "cloudnova/api          v2.1      abc123def456   2 days ago     245MB",
            "cloudnova/worker       v2.1      def456abc123   2 days ago     312MB",
            "redis                  7-alpine  ghi789jkl012   2 weeks ago    32MB",
            "postgres               15-alpine jkl012ghi789   2 weeks ago    241MB",
          ]);
        } else {
          appendOutput(["Usage: docker ps | docker images"]);
        }
        break;
      }
      case "kubectl": {
        if (args[0] === "get") {
          if (args[1] === "pods" || args[1] === "pod") {
            appendOutput([
              "NAME                            READY   STATUS    RESTARTS   AGE",
              "api-deployment-7d8f6-abcde     1/1     Running   0          3h",
              "api-deployment-7d8f6-fghij     1/1     Running   0          3h",
              "api-deployment-7d8f6-klmno     1/1     Running   0          3h",
              "worker-deployment-3e4f5-pqrst  1/1     Running   2          1d",
              "redis-statefulset-0            1/1     Running   0          14d",
              "postgres-statefulset-0         1/1     Running   0          14d",
            ]);
          } else if (args[1] === "services" || args[1] === "svc") {
            appendOutput([
              "NAME           TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE",
              "api-service    LoadBalancer   10.0.100.50    20.76.45.123    80:30080/TCP   14d",
              "redis-svc      ClusterIP      10.0.100.51    <none>          6379/TCP       14d",
              "postgres-svc   ClusterIP      10.0.100.52    <none>          5432/TCP       14d",
            ]);
          } else if (args[1] === "deployments" || args[1] === "deploy") {
            appendOutput([
              "NAME               READY   UP-TO-DATE   AVAILABLE   AGE",
              "api-deployment     3/3     3            3           14d",
              "worker-deployment  1/1     1            1           14d",
            ]);
          } else {
            appendOutput(["Usage: kubectl get pods|services|deployments"]);
          }
        } else if (args[0] === "describe" && args[1] === "pod") {
          appendOutput([
            `Name:             ${args[2] || "api-deployment-7d8f6-abcde"}`,
            "Namespace:        production",
            "Status:           Running",
            "IP:               10.244.1.5",
            "Containers:       api (cloudnova/api:v2.1)",
            "Conditions:       Initialized=True, Ready=True, ContainersReady=True",
          ]);
        } else {
          appendOutput(["Usage: kubectl get pods|services|deployments"]);
        }
        break;
      }
      case "curl": {
        if (args.length === 0) { appendOutput(["curl: try 'curl --help' for more information"]); break; }
        const url = args[args.length - 1];
        if (url.includes("localhost") || url.includes("cloudnova.com")) {
          appendOutput(["HTTP/1.1 200 OK", "Server: nginx/1.24.0", "Content-Type: text/html", "", "<h1>CloudNova Platform</h1>"]);
        } else {
          appendOutput(["HTTP/1.1 200 OK", "Content-Type: application/json", "", '{"status":"ok"}']);
        }
        break;
      }
      case "top": case "htop": {
        appendOutput([
          "top - 10:23:45 up 1 day,  2:23,  1 user,  load average: 0.15, 0.22, 0.18",
          "Tasks: 142 total,   1 running, 141 sleeping,   0 stopped,   0 zombie",
          "%Cpu(s):  2.3 us,  1.1 sy,  0.0 ni, 96.2 id,  0.3 wa,  0.0 hi,  0.1 si,  0.0 st",
          "MiB Mem :  16000 total,   8200 free,   4400 used,   3400 buff/cache",
          "",
          "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND",
          " 5678 engineer  20   0  892456 251200  12340 S   1.3   2.4   1:23.45 python3",
          " 1234 nginx     20   0  487652 126548   8900 S   0.3   1.2   0:45.12 nginx",
          "    1 root      20   0  169428  11684   7900 S   0.0   0.1   0:03.45 systemd",
        ]);
        break;
      }
      default: {
        appendOutput([`bash: ${command}: command not found`]);
      }
    }
    appendOutput([`engineer@cloudnova:~${state.cwd === "/" ? "" : state.cwd.replace("/home/engineer", "~")}$ `]);
  }, [state.cwd, state.fs, appendOutput]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    }
  };

  return (
    <div style={{ borderRadius: "0.75rem", overflow: "hidden", border: "1px solid var(--aep-border)", background: "#1a1410", marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0.5rem 0.75rem", background: "#2e241e" }}>
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#b06b6b" }} />
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#c69c3e" }} />
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#5a8f6e" }} />
        <span style={{ fontSize: "0.75rem", color: "#9e8e7f", marginLeft: "auto" }}>CloudNova Terminal</span>
      </div>
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        style={{ padding: "0.75rem", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: "0.85rem", color: "#e2d8cf", lineHeight: 1.6, height: "380px", overflowY: "auto", cursor: "text" }}
      >
        {output.map((line, i) => (
          <div key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{line}</div>
        ))}
        <div style={{ display: "flex" }}>
          <span style={{ whiteSpace: "pre" }}>
            engineer@cloudnova:~{state.cwd === "/" ? "" : state.cwd.replace("/home/engineer", "~")}${" "}
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "#e2d8cf",
              fontFamily: "inherit",
              fontSize: "inherit",
              outline: "none",
              caretColor: "#5a8f6e",
            }}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Docker Command Practice Simulator
// =============================================================================

interface DockerChallenge {
  id: number;
  title: string;
  description: string;
  goal: string;
  expectedCommand: string;
  hint: string;
  successMessage: string;
  output: string;
}

const dockerChallenges: DockerChallenge[] = [
  {
    id: 1,
    title: "سحب صورة Docker",
    description: "تحتاج إلى صورة nginx الرسمية لتشغيل خادم الويب الجديد.",
    goal: "اسحب صورة nginx من Docker Hub",
    expectedCommand: "docker pull nginx",
    hint: "استخدم docker pull <image-name>",
    successMessage: "✅ ممتاز! تم سحب صورة nginx بنجاح. الآن أصبحت متوفرة محلياً.",
    output: "Using default tag: latest\nlatest: Pulling from library/nginx\na1b2c3d4e5f6: Pull complete\nf6e5d4c3b2a1: Pull complete\nDigest: sha256:abc123...\nStatus: Downloaded newer image for nginx:latest",
  },
  {
    id: 2,
    title: "تشغيل حاوية",
    description: "الآن شغّل nginx على المنفذ 8080.",
    goal: "شغّل حاوية nginx واربطها بالمنفذ 8080",
    expectedCommand: "docker run -d -p 8080:80 nginx",
    hint: "استخدم docker run -d -p <host-port>:<container-port> nginx",
    successMessage: "✅ رائع! nginx يعمل الآن على http://localhost:8080",
    output: "f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7",
  },
  {
    id: 3,
    title: "فحص الحاويات",
    description: "تأكد أن الحاوية تعمل.",
    goal: "اعرض الحاويات النشطة",
    expectedCommand: "docker ps",
    hint: "docker ps يعرض الحاويات النشطة",
    successMessage: "✅ نعم! نرى حاوية nginx تعمل.",
    output: "CONTAINER ID   IMAGE     STATUS         PORTS                  NAMES\nf7a8b9c0d1e2   nginx     Up 2 minutes   0.0.0.0:8080->80/tcp   web-server",
  },
  {
    id: 4,
    title: "بناء صورة مخصصة",
    description: "لديك Dockerfile في المجلد الحالي. ابنِ صورة جديدة باسم cloudnova-app.",
    goal: "ابنِ صورة Docker من Dockerfile",
    expectedCommand: "docker build -t cloudnova-app .",
    hint: "استخدم docker build -t <name> .",
    successMessage: "🎉 تم بناء الصورة بنجاح! الآن يمكنك تشغيلها.",
    output: "Sending build context to Docker daemon  45.6kB\nStep 1/5 : FROM node:18-alpine\nStep 2/5 : WORKDIR /app\nStep 3/5 : COPY package*.json ./\nStep 4/5 : RUN npm ci --production\nStep 5/5 : CMD [\"node\", \"server.js\"]\nSuccessfully built a1b2c3d4e5f6\nSuccessfully tagged cloudnova-app:latest",
  },
  {
    id: 5,
    title: "فحص سجلات الحاوية",
    description: "الحاوية web-server تعمل لكن هناك خطأ. اقرأ سجلاتها.",
    goal: "اعرض سجلات حاوية nginx",
    expectedCommand: "docker logs web-server",
    hint: "استخدم docker logs <container-name>",
    successMessage: "✅ وجدت المشكلة! السجلات تظهر خطأ في المنفذ.",
    output: "2026/07/15 10:23:45 [notice] 1#1: nginx/1.25.0\n2026/07/15 10:23:45 [error] 1#1: connect() failed (111: Connection refused) while connecting to upstream\n2026/07/15 10:24:00 [notice] 1#1: signal process started",
  },
];

export function DockerPracticeSimulator() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [outputLines, setOutputLines] = useState<string[]>([]);

  const challenge = dockerChallenges[currentChallenge];

  const handleSubmit = () => {
    const trimmed = input.trim();
    setOutputLines([]);

    if (trimmed === challenge.expectedCommand) {
      setCompleted(prev => new Set([...prev, currentChallenge]));
      setFeedback(challenge.successMessage);
      setOutputLines(challenge.output.split("\n"));
      setShowHint(false);
      setTimeout(() => {
        if (currentChallenge < dockerChallenges.length - 1) {
          setCurrentChallenge(prev => prev + 1);
          setInput("");
          setFeedback("");
          setOutputLines([]);
        }
      }, 2000);
    } else if (trimmed.includes("docker")) {
      setFeedback("❌ ليس تماماً. تأكد من الأمر الصحيح.");
      setShowHint(true);
      setOutputLines(["command not found or invalid syntax"]);
    } else {
      setFeedback("❌ هذا ليس أمر docker صحيح.");
    }
  };

  const resetAll = () => {
    setCurrentChallenge(0);
    setInput("");
    setFeedback("");
    setCompleted(new Set());
    setShowHint(false);
    setOutputLines([]);
  };

  if (currentChallenge >= dockerChallenges.length) {
    return (
      <div style={{ borderRadius: "0.75rem", overflow: "hidden", border: "1px solid var(--aep-border)", background: "var(--aep-surface-raised)", padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
        <h3 style={{ color: "var(--aep-text-primary)", marginBottom: "0.5rem" }}>أكملت جميع تحديات Docker!</h3>
        <p style={{ color: "var(--aep-text-secondary)", marginBottom: "1.5rem" }}>أنت الآن تتقن أساسيات Docker. جرب محاكي Linux Terminal للمزيد.</p>
        <button onClick={resetAll} className="aep-btn aep-btn--primary">إعادة المحاكي</button>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: "0.75rem", overflow: "hidden", border: "1px solid var(--aep-border)", background: "var(--aep-surface-raised)" }}>
      <div style={{ padding: "1.25rem", borderBottom: "1px solid var(--aep-border-light)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "1.5rem" }}>🐳</span>
          <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--aep-text-primary)" }}>
            تحدي {challenge.id}/{dockerChallenges.length}: {challenge.title}
          </h3>
        </div>
        <p style={{ margin: 0, color: "var(--aep-text-secondary)", fontSize: "0.9rem" }}>{challenge.description}</p>
        <p style={{ margin: "0.5rem 0 0", color: "var(--aep-primary)", fontSize: "0.9rem", fontWeight: 600 }}>🎯 {challenge.goal}</p>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          {dockerChallenges.map((_, i) => (
            <div key={i} style={{ height: "6px", flex: 1, borderRadius: "3px", background: completed.has(i) ? "var(--aep-accent)" : currentChallenge === i ? "var(--aep-primary)" : "var(--aep-border)" }} />
          ))}
        </div>
      </div>
      <div style={{ padding: "1.25rem" }}>
        {showHint && (
          <div style={{ padding: "0.5rem 0.75rem", background: "rgba(198, 156, 62, 0.1)", borderRadius: "0.5rem", marginBottom: "0.75rem", fontSize: "0.85rem", color: "var(--aep-warning)" }}>
            💡 {challenge.hint}
          </div>
        )}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="$ اكتب أمر docker هنا..."
            style={{
              flex: 1,
              padding: "0.625rem 0.75rem",
              background: "#1a1410",
              border: "1px solid var(--aep-border)",
              borderRadius: "0.5rem",
              color: "#e2d8cf",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem",
              outline: "none",
            }}
            spellCheck={false}
          />
          <button onClick={handleSubmit} className="aep-btn aep-btn--primary">تشغيل</button>
        </div>
        {feedback && (
          <div style={{ padding: "0.75rem", background: feedback.startsWith("✅") ? "rgba(90, 143, 110, 0.1)" : "rgba(176, 107, 107, 0.1)", borderRadius: "0.5rem", marginBottom: "0.75rem", fontSize: "0.9rem", color: "var(--aep-text-primary)" }}>
            {feedback}
          </div>
        )}
        {outputLines.length > 0 && (
          <div style={{ background: "#1a1410", borderRadius: "0.5rem", padding: "0.75rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#9e8e7f", lineHeight: 1.6 }}>
            {outputLines.map((line, i) => (
              <div key={i} style={{ whiteSpace: "pre-wrap" }}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Kubernetes Troubleshooting Scenario
// =============================================================================

interface K8sScenario {
  id: number;
  title: string;
  story: string;
  symptoms: string[];
  question: string;
  options: { text: string; correct: boolean; feedback: string }[];
  commands: string;
}

const k8sScenarios: K8sScenario[] = [
  {
    id: 1,
    title: "CrashLoopBackOff",
    story: "نشرت الإصدار الجديد من الـ API. بعد دقائق، لاحظت أن 503 Errors بدأت تظهر للمستخدمين.",
    symptoms: ["kubectl get pods يظهر: api-deployment-v3-xxx 0/1 CrashLoopBackOff", "الحاوية تبدأ ثم تموت فوراً", "Exit Code: 1"],
    question: "ما هو أول أمر يجب أن تنفذه للتشخيص؟",
    options: [
      { text: "kubectl delete pod api-deployment-v3-xxx", correct: false, feedback: "❌ حذف الـ Pod لن يحل المشكلة — الـ Deployment سيعيد إنشائه." },
      { text: "kubectl logs api-deployment-v3-xxx --previous", correct: true, feedback: "✅ صحيح! سجلات الحاوية السابقة ستظهر سبب الانهيار." },
      { text: "kubectl scale deployment api-deployment --replicas=0", correct: false, feedback: "❌ هذا سيوقف الخدمة بالكامل. ليس خطوة أولى جيدة." },
      { text: "kubectl rollout undo deployment/api-deployment", correct: false, feedback: "⚠️ هذا حل آمن لكن الأفضل أن تفهم السبب أولاً." },
    ],
    commands: "kubectl logs api-deployment-v3-xxx --previous\n# Error: Cannot find module '@/config/database'\n# at Object.<anonymous> (/app/server.js:5:22)",
  },
  {
    id: 2,
    title: "ImagePullBackOff",
    story: "حاولت نشر تطبيق جديد على الكلستر، لكن الـ Pod يرفض البدء.",
    symptoms: ["kubectl get pods يظهر: new-app-xxx 0/1 ImagePullBackOff", "Status: Waiting", "Reason: ErrImagePull"],
    question: "ما السبب الأكثر احتمالاً؟",
    options: [
      { text: "الـ Node ليس لديها موارد كافية", correct: false, feedback: "❌ Resource shortage يسبب Pending وليس ImagePullBackOff." },
      { text: "اسم الصورة أو الـ tag غير صحيح", correct: true, feedback: "✅ صحيح! ImagePullBackOff يعني أن Kubernetes لا يستطيع سحب الصورة." },
      { text: "الـ Service غير معرّفة", correct: false, feedback: "❌ Service لا تؤثر على Pull." },
      { text: "الـ ConfigMap غير موجود", correct: false, feedback: "❌ ConfigMap تسبب CreateContainerConfigError." },
    ],
    commands: "kubectl describe pod new-app-xxx\n# Failed to pull image \"cloudnova/new-app:v999\"\n# Error: manifest for cloudnova/new-app:v999 not found: manifest unknown",
  },
  {
    id: 3,
    title: "Pending Pods",
    story: "طلبت 10 نسخ من الـ worker لكن 7 فقط بدأت. الـ 3 الباقية عالقة في Pending.",
    symptoms: ["3 Pods في حالة Pending", "kubectl describe يظهر: 0/5 nodes are available: 5 Insufficient memory", "الـ Nodes ممتلئة"],
    question: "ما الحل الأفضل؟",
    options: [
      { text: "حذف كل الـ Pods وإعادة إنشائها", correct: false, feedback: "❌ لا يحل المشكلة — ستعود نفس الحالة." },
      { text: "تقليل requests.memory في الـ Deployment", correct: true, feedback: "✅ تقليل الذاكرة المطلوبة أو إضافة Nodes جديدة." },
      { text: "تغيير الـ container image", correct: false, feedback: "❌ الصورة لا علاقة لها." },
      { text: "حذف النود بالكامل", correct: false, feedback: "❌ هذا يزيد المشكلة سوءاً." },
    ],
    commands: "kubectl top nodes\n# NAME           CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%\n# node-01        3500m        87%    14200Mi          92%\n# node-02        3800m        95%    15100Mi          97%",
  },
  {
    id: 4,
    title: "Service لا يعمل",
    story: "نشرت Deployment جديد مع Service من نوع LoadBalancer. لكن curl يفشل.",
    symptoms: ["curl http://EXTERNAL-IP يعيد Connection Refused", "kubectl get svc يظهر EXTERNAL-IP لكن لا استجابة", "الـ Pods تعمل بشكل طبيعي"],
    question: "أين المشكلة غالباً؟",
    options: [
      { text: "الـ Pods معطلة", correct: false, feedback: "❌ الـ Pods تعمل (Running)." },
      { text: "الـ selector في Service لا يتطابق مع labels الـ Pods", correct: true, feedback: "✅ أشهر خطأ! تأكد أن selector يطابق labels الـ Pods." },
      { text: "الـ Cluster DNS معطل", correct: false, feedback: "❌ لا يؤثر على External IP." },
      { text: "الـ kubelet معطل", correct: false, feedback: "❌ لو كان kubelet معطلاً لن تعمل الـ Pods." },
    ],
    commands: "kubectl get pods --show-labels\n# NAME                    LABELS\n# api-deployment-xxx      app=api,version=v2\n\n# في الـ Service:\n# selector:\n#   app: web-api   ← لا يتطابق!",
  },
  {
    id: 5,
    title: "تسرب موارد",
    story: "بعد 3 أيام من النشر، لاحظت أن التطبيق أصبح بطيئاً جداً. الـ CPU usage ارتفع من 15% إلى 95%.",
    symptoms: ["CPU usage: 95%", "Response time: 5s (كان 200ms)", "OOMKilled تظهر في بعض الـ Pods"],
    question: "ما التشخيص الأكثر احتمالاً؟",
    options: [
      { text: "هجوم DDoS", correct: false, feedback: "⚠️ محتمل لكنه ليس السبب الأول." },
      { text: "Memory leak في الكود", correct: true, feedback: "✅ الزيادة التدريجية + OOMKilled = memory leak. افحص الـ heap dump." },
      { text: "الـ Node بحاجة لإعادة تشغيل", correct: false, feedback: "❌ إعادة التشغيل مؤقت. المشكلة في الكود." },
      { text: "الـ network latency", correct: false, feedback: "❌ لا يفسر CPU spike." },
    ],
    commands: "kubectl top pod --containers\n# POD                    CONTAINER   CPU    MEMORY\n# api-xxx                api         950m   458Mi\n# api-xxx                sidecar     20m    45Mi\n# worker-xxx             worker      120m   2890Mi  ← ضخم!",
  },
];

export function KubernetesScenarioSimulator() {
  const [current, setCurrent] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState<Set<number>>(new Set());

  const scenario = k8sScenarios[current];

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);
    if (scenario.options[idx].correct) setScore(s => s + 1);
    setCompletedScenarios(prev => new Set([...prev, current]));
  };

  const nextScenario = () => {
    if (current < k8sScenarios.length - 1) {
      setCurrent(prev => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  };

  const resetAll = () => {
    setCurrent(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setCompletedScenarios(new Set());
  };

  if (current >= k8sScenarios.length) {
    return (
      <div style={{ borderRadius: "0.75rem", overflow: "hidden", border: "1px solid var(--aep-border)", background: "var(--aep-surface-raised)", padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎖️</div>
        <h3 style={{ color: "var(--aep-text-primary)", marginBottom: "0.5rem" }}>انتهت جميع السيناريوهات!</h3>
        <p style={{ color: "var(--aep-text-secondary)", fontSize: "1.1rem" }}>النتيجة: {score}/{k8sScenarios.length}</p>
        <p style={{ color: "var(--aep-text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          {score === k8sScenarios.length ? "🎯 محترف! أنت جاهز لأي حادثة K8s." : score >= 3 ? "👍 جيد! تدرب أكثر على السيناريوهات." : "📚 تحتاج مراجعة. عد للدروس!"}
        </p>
        <button onClick={resetAll} className="aep-btn aep-btn--primary">إعادة المحاكي</button>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: "0.75rem", overflow: "hidden", border: "1px solid var(--aep-border)", background: "var(--aep-surface-raised)" }}>
      <div style={{ padding: "0.75rem 1.25rem", background: "var(--aep-surface-alt)", borderBottom: "1px solid var(--aep-border-light)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.25rem" }}>☸️</span>
          <span style={{ fontWeight: 700, color: "var(--aep-text-primary)", fontSize: "0.9rem" }}>Kubernetes Incident Simulator</span>
        </div>
        <span style={{ fontSize: "0.8rem", color: "var(--aep-text-muted)" }}>Score: {score}/{k8sScenarios.length}</span>
      </div>
      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          {k8sScenarios.map((_, i) => (
            <div key={i} style={{ height: "6px", flex: 1, borderRadius: "3px", background: completedScenarios.has(i) ? "var(--aep-accent)" : current === i ? "var(--aep-primary)" : "var(--aep-border)" }} />
          ))}
        </div>
        <div style={{ padding: "0.5rem 0.75rem", background: "rgba(176, 107, 107, 0.08)", borderRadius: "0.5rem", marginBottom: "1rem", borderLeft: "3px solid var(--aep-danger)" }}>
          <span style={{ fontWeight: 700, color: "var(--aep-danger)", fontSize: "0.8rem" }}>🚨 INCIDENT #{scenario.id}</span>
          <h4 style={{ margin: "0.25rem 0", color: "var(--aep-text-primary)", fontSize: "1rem" }}>{scenario.title}</h4>
          <p style={{ margin: 0, color: "var(--aep-text-secondary)", fontSize: "0.85rem" }}>{scenario.story}</p>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <strong style={{ fontSize: "0.85rem", color: "var(--aep-text-primary)" }}>الأعراض:</strong>
          <ul style={{ margin: "0.25rem 0", paddingLeft: "1.25rem", fontSize: "0.8rem", color: "var(--aep-text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
            {scenario.symptoms.map((s, i) => <li key={i} style={{ marginBottom: "0.125rem" }}>{s}</li>)}
          </ul>
        </div>
        <p style={{ fontWeight: 600, color: "var(--aep-text-primary)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>{scenario.question}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {scenario.options.map((opt, i) => {
            let bg = "var(--aep-surface-alt)";
            let border = "1px solid var(--aep-border)";
            if (answered && i === selectedOption) {
              bg = opt.correct ? "rgba(90, 143, 110, 0.1)" : "rgba(176, 107, 107, 0.1)";
              border = opt.correct ? "1px solid var(--aep-accent)" : "1px solid var(--aep-danger)";
            } else if (answered && opt.correct) {
              bg = "rgba(90, 143, 110, 0.08)";
              border = "1px solid var(--aep-accent)";
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.625rem 0.75rem",
                  background: bg,
                  border,
                  borderRadius: "0.5rem",
                  cursor: answered ? "default" : "pointer",
                  fontSize: "0.85rem",
                  color: "var(--aep-text-primary)",
                  transition: "all 0.2s",
                }}
              >
                {String.fromCharCode(65 + i)}. {opt.text}
              </button>
            );
          })}
        </div>
        {answered && (
          <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#1a1410", borderRadius: "0.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#9e8e7f", marginBottom: "0.25rem" }}>💻 Terminal Output:</div>
            <pre style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#e2d8cf", whiteSpace: "pre-wrap" }}>{scenario.commands}</pre>
          </div>
        )}
        {answered && (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "rgba(74, 122, 158, 0.06)", borderRadius: "0.5rem", fontSize: "0.85rem", color: "var(--aep-text-primary)" }}>
            {scenario.options[selectedOption!].feedback}
          </div>
        )}
        {answered && current < k8sScenarios.length - 1 && (
          <button onClick={nextScenario} className="aep-btn aep-btn--primary" style={{ marginTop: "0.75rem", width: "100%" }}>
            السيناريو التالي →
          </button>
        )}
        {answered && current === k8sScenarios.length - 1 && (
          <button onClick={() => setCurrent(prev => prev + 1)} className="aep-btn aep-btn--primary" style={{ marginTop: "0.75rem", width: "100%" }}>
            عرض النتيجة النهائية 🏆
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Combined Simulator Page Component
// =============================================================================

export function SimulatorTabs() {
  const [activeTab, setActiveTab] = useState<"linux" | "docker" | "k8s">("linux");

  const tabs = [
    { id: "linux" as const, icon: "💻", label: "Linux Terminal" },
    { id: "docker" as const, icon: "🐳", label: "Docker Practice" },
    { id: "k8s" as const, icon: "☸️", label: "K8s Incidents" },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="aep-btn"
            style={{
              background: activeTab === tab.id ? "var(--aep-primary)" : "var(--aep-surface-alt)",
              color: activeTab === tab.id ? "#fff" : "var(--aep-text-secondary)",
              border: activeTab === tab.id ? "none" : "1px solid var(--aep-border)",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "linux" && <LinuxTerminalSimulator />}
      {activeTab === "docker" && <DockerPracticeSimulator />}
      {activeTab === "k8s" && <KubernetesScenarioSimulator />}
    </div>
  );
}
