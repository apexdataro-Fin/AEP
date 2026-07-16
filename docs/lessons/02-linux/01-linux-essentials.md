---
sidebar_position: 1
title: "Linux Essentials"
description: "Master the terminal, file system, permissions, and essential commands that power every cloud server."
---

# Linux Essentials

The cloud runs on Linux. Every server, container, and Kubernetes node. **Master it.**

## What You Will Learn

- Navigate the Linux file system with confidence
- Understand and set file permissions
- Manage processes and monitor resources
- Write simple bash scripts

## The Terminal — Your New Home

```bash
whoami          # Who are you?
pwd             # Where are you?
ls -la          # What's here?
cd /var/log     # Go somewhere
cat file.txt    # Read a file
tail -f app.log # Watch a log live
```

## Linux File System

```
/           # Root — everything starts here
├── /bin    # Essential binaries
├── /etc    # Configuration files
├── /home   # User directories
├── /var    # Logs, databases
├── /tmp    # Temporary files (cleared on reboot)
└── /usr    # User-installed software
```

## File Permissions

```
-rwxr-xr-x  1 user  group   4096 Jan 15 14:32 script.sh
│├─┤├─┤├─┤
│ │  │  └── Others: read + execute
│ │  └───── Group: read + execute
│ └──────── Owner: read + write + execute
└────────── Type: - file, d directory, l link
```

| Number  | Permission           |
| ------- | -------------------- |
| 7 (rwx) | Read, Write, Execute |
| 6 (rw-) | Read, Write          |
| 5 (r-x) | Read, Execute        |
| 4 (r--) | Read only            |

## Essential Commands

| Command                 | Purpose            |
| ----------------------- | ------------------ |
| `grep "error" app.log`  | Search for errors  |
| `find / -name "*.conf"` | Find config files  |
| `ps aux`                | List all processes |
| `top` / `htop`          | Resource monitor   |
| `df -h`                 | Check disk space   |
| `free -m`               | Check memory       |
| `chmod 755 script.sh`   | Make executable    |

## CloudNova Emergency Scenario

It's 3 AM. Production is down. What commands do you run?

1. `systemctl status nginx` — is the service running?
2. `tail -100 /var/log/nginx/error.log` — what broke?
3. `df -h` — is the disk full?
4. `free -m` — is memory exhausted?
5. `ps aux | grep nginx` — is the process alive?

---

[← Back to Module](index.md) | [🏠 Home](/)
