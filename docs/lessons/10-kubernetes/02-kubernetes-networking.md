---
sidebar_position: 2
title: "شبكات Kubernetes"
description: "Services، Ingress، Network Policies، CNI — كيف تتواصل الـ Pods في Kubernetes."
---

# شبكات Kubernetes

> **"الشبكات هي أصعب جزء في Kubernetes. افهمها ولن يخيفك شيء."**

## أنواع Services

| النوع            | متى تستخدم            | مثال           |
| ---------------- | --------------------- | -------------- |
| **ClusterIP**    | اتصال داخلي فقط       | API → Database |
| **NodePort**     | وصول خارجي للتطوير    | dev فقط        |
| **LoadBalancer** | وصول خارجي في السحابة | إنتاج          |
| **ExternalName** | توجيه لخدمة خارج K8s  | DNS خارجي      |

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-internal
spec:
  type: ClusterIP
  selector:
    app: cloudnova-api
  ports:
    - port: 8080
      targetPort: 8080
```

## Ingress — بوابة الدخول

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: cloudnova-ingress
spec:
  rules:
    - host: api.cloudnova.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 8080
```

## Network Policies — جدار ناري

```yaml
# اسمح فقط للـ API بالاتصال بقاعدة البيانات
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-policy
spec:
  podSelector:
    matchLabels:
      app: postgres
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: api
      ports:
        - protocol: TCP
          port: 5432
```

---

[← الدرس السابق](kubernetes-architecture) | [العودة للوحدة](index.md) | [🏠 الرئيسية](/)
