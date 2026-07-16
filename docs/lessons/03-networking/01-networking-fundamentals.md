---
sidebar_position: 1
title: "Networking Fundamentals"
description: "Understand TCP/IP, DNS, HTTP, subnets, and how data moves across the internet."
---

# Networking Fundamentals

Every cloud service is a network endpoint. Understand how data actually moves.

## What You Will Learn

- Explain the OSI model layers
- Understand TCP vs UDP
- Calculate subnets with CIDR
- Debug network issues

## The OSI Model

| Layer           | Protocol  | Cloud Example            |
| --------------- | --------- | ------------------------ |
| 7 — Application | HTTP, DNS | API Gateway, App Service |
| 4 — Transport   | TCP, UDP  | Load Balancer            |
| 3 — Network     | IP        | VNet, Subnet             |
| 2 — Data Link   | Ethernet  | NIC, MAC address         |

## TCP vs UDP

| TCP               | UDP                    |
| ----------------- | ---------------------- |
| Reliable, ordered | Fast, no guarantees    |
| Connection-based  | Connectionless         |
| Web, email, SSH   | Streaming, DNS, gaming |
| Slower            | Faster                 |

## CIDR Notation

```
10.0.0.0/24  →  256 addresses (10.0.0.0 - 10.0.0.255)
10.0.0.0/16  →  65,536 addresses
10.0.0.0/8   →  16.7 million addresses
```

| CIDR | Hosts | Use Case                     |
| ---- | ----- | ---------------------------- |
| /32  | 1     | Single IP                    |
| /28  | 14    | Small subnet (Azure Gateway) |
| /24  | 254   | Typical application subnet   |
| /16  | 65k   | Large VNet                   |

## Debugging Tools

```bash
ping google.com          # Is it reachable?
traceroute google.com    # What's the path?
nslookup example.com     # DNS resolution
curl -I https://api.com  # HTTP headers
netstat -tulpn           # What's listening?
```

## CloudNova Scenario

The API returns 502 Bad Gateway. Debug step by step:

1. `curl -I https://api.cloudnova.com` — 502 confirmed
2. `systemctl status backend` — backend is down!
3. `tail /var/log/backend/error.log` — "database connection refused"
4. `systemctl status postgresql` — database is running but on wrong port

**Root cause:** Backend config pointed to port 5432, database migrated to port 5433.

---

[← Back to Module](index.md) | [🏠 Home](/)
