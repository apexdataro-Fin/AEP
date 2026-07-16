---
sidebar_position: 1
title: "وكلاء الذكاء الاصطناعي"
description: "AI Agents: LangChain، AutoGen، function calling، والأدوات — بناء وكلاء مستقلين."
---

# وكلاء الذكاء الاصطناعي (AI Agents)

> "الـ Agent ليس مجرد chatbot. إنه كيان يفكر، يخطط، ينفذ، ويتعلم."

## 🎯 أهداف التعلم

- فهم معمارية AI Agents (التخطيط، الذاكرة، الأدوات)
- بناء Agents مع LangChain و Semantic Kernel
- إتقان Function Calling للأدوات
- تصميم Agent آمن وموثوق
- استخدام AutoGen للوكلاء المتعددين

---

## 📖 الطبقة الأساسية: معمارية الـ Agent

### تشريح الـ Agent

```
AI Agent:
┌─────────────────────────────────────────────┐
│               Planning                       │
│  (تحليل المهمة → تقسيم → خطة)               │
├─────────────────────────────────────────────┤
│               Memory                         │
│  ├── Short-term (المحادثة الحالية)           │
│  ├── Long-term (قاعدة معرفة / Vector DB)     │
│  └── Working (حالة المهمة الحالية)           │
├─────────────────────────────────────────────┤
│               Tools                          │
│  ├── Search (web, docs, databases)           │
│  ├── Code execution (Python, SQL)            │
│  ├── APIs (Azure, GitHub, Jira)              │
│  └── Custom tools                            │
├─────────────────────────────────────────────┤
│               Action                         │
│  (تنفيذ الأداة → تقييم النتيجة → تعديل)      │
└─────────────────────────────────────────────┘
```

### أنماط الـ Agents

| النمط              | الوصف                           | مثال            |
| ------------------ | ------------------------------- | --------------- |
| **ReAct**          | Reasoning + Acting — فكر ثم نفذ | البحث + التحليل |
| **Plan & Execute** | خطط كاملاً ثم نفذ               | مشروع معقد      |
| **Multi-Agent**    | عدة وكلاء يتعاونون              | فريق AI         |
| **Tool-Use**       | Agent يستخدم أدوات محددة        | CLI assistant   |

---

## 🧱 الطبقة المهنية: Function Calling

```python
from openai import AzureOpenAI
import json

client = AzureOpenAI(...)

# تعريف الأدوات
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_azure_vms",
            "description": "جلب قائمة الآلات الافتراضية في مجموعة موارد",
            "parameters": {
                "type": "object",
                "properties": {
                    "resource_group": {
                        "type": "string",
                        "description": "اسم مجموعة الموارد"
                    },
                    "status_filter": {
                        "type": "string",
                        "enum": ["running", "stopped", "all"],
                        "description": "تصفية حسب الحالة"
                    }
                },
                "required": ["resource_group"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "restart_vm",
            "description": "إعادة تشغيل Virtual Machine",
            "parameters": {
                "type": "object",
                "properties": {
                    "vm_name": {"type": "string"},
                    "resource_group": {"type": "string"}
                },
                "required": ["vm_name", "resource_group"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_cost_analysis",
            "description": "تحليل التكاليف الشهرية",
            "parameters": {
                "type": "object",
                "properties": {
                    "month": {"type": "string", "description": "YYYY-MM"}
                }
            }
        }
    }
]

# Agent loop
def agent_loop(user_query: str):
    messages = [{"role": "user", "content": user_query}]

    while True:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )

        msg = response.choices[0].message

        if msg.tool_calls:
            messages.append(msg)

            for tool_call in msg.tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)

                # تنفيذ الأداة
                if function_name == "get_azure_vms":
                    result = get_vms(**function_args)
                elif function_name == "restart_vm":
                    result = restart_vm_azure(**function_args)
                elif function_name == "get_cost_analysis":
                    result = analyze_costs(**function_args)

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(result)
                })

        else:
            # الـ Agent انتهى — إجابة نهائية
            return msg.content
```

---

## 🏗️ الطبقة الإنتاجية: Agent مع LangChain

```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools import tool
from langchain_openai import AzureChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder

# تعريف الأدوات
@tool
def get_resource_groups() -> str:
    """جلب كل Resource Groups في الاشتراك"""
    # ... Azure SDK logic
    return json.dumps(["prod-weu-rg", "dev-weu-rg", "staging-weu-rg"])

@tool
def get_vms_in_rg(resource_group: str) -> str:
    """جلب VMs في Resource Group معينة"""
    return json.dumps([
        {"name": "web-01", "size": "D4s_v3", "state": "running"},
        {"name": "worker-01", "size": "D8s_v3", "state": "running"}
    ])

@tool
def check_vm_metrics(vm_name: str, resource_group: str) -> str:
    """فحص metrics لـ VM (CPU, memory)"""
    return json.dumps({"cpu_percent": 78.5, "memory_percent": 62.1})

# إنشاء Agent
llm = AzureChatOpenAI(
    azure_deployment="gpt-4",
    temperature=0
)

tools = [get_resource_groups, get_vms_in_rg, check_vm_metrics]

prompt = ChatPromptTemplate.from_messages([
    ("system", """أنت Azure Infrastructure Agent.
    أنت تساعد في إدارة البنية التحتية لـ CloudNova على Azure.
    استخدم الأدوات المتاحة للإجابة عن الأسئلة.
    كن دقيقاً ومحدداً في إجاباتك."""),
    ("user", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad")
])

agent = create_openai_functions_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# استخدام الـ Agent
result = executor.invoke({
    "input": "ما هي VMs التي تعمل حالياً في بيئة الإنتاج؟"
})
print(result["output"])
```

---

## 🎨 الطبقة المعمارية: AutoGen — وكلاء متعددون

```python
import autogen

# تكوين الـ LLM
config_list = [{
    "model": "gpt-4",
    "api_type": "azure",
    "api_key": os.environ["AZURE_OPENAI_KEY"],
    "base_url": os.environ["AZURE_OPENAI_ENDPOINT"],
    "api_version": "2024-02-01"
}]

# تعريف الوكلاء
planner = autogen.AssistantAgent(
    name="Planner",
    system_message="""أنت مخطط الحلول. مهمتك:
    1. تحليل طلب المستخدم
    2. تقسيم المهمة إلى خطوات
    3. توزيع المهام على الوكلاء المتخصصين""",
    llm_config={"config_list": config_list}
)

azure_expert = autogen.AssistantAgent(
    name="AzureExpert",
    system_message="""أنت خبير Azure. مهمتك:
    1. تصميم حلول Azure
    2. كتابة أوامر CLI
    3. اقتراح best practices""",
    llm_config={"config_list": config_list}
)

security_reviewer = autogen.AssistantAgent(
    name="SecurityReviewer",
    system_message="""أنت مراجع أمني. مهمتك:
    1. مراجعة الحلول من منظور أمني
    2. اقتراح تحسينات أمنية
    3. التحقق من الامتثال للمعايير""",
    llm_config={"config_list": config_list}
)

user_proxy = autogen.UserProxyAgent(
    name="User",
    human_input_mode="NEVER",
    code_execution_config={"work_dir": "workspace"}
)

# إنشاء مجموعة الوكلاء
groupchat = autogen.GroupChat(
    agents=[planner, azure_expert, security_reviewer, user_proxy],
    messages=[],
    max_round=15
)

manager = autogen.GroupChatManager(
    groupchat=groupchat,
    llm_config={"config_list": config_list}
)

# تشغيل
user_proxy.initiate_chat(
    manager,
    message="صمم لي بنية تحتية آمنة لتطبيق ويب مع قاعدة بيانات"
)
```

### سيناريو: AI Team يحل مشكلة

```
المستخدم: "التكاليف ارتفعت 200%، أحتاج تحليلاً فورياً"

Planner: سأوزع المهمة:
  ├── AzureExpert: فحص الموارد
  ├── SecurityReviewer: هل هناك اختراق؟
  └── أنا: تجميع التقرير

AzureExpert: وجدت 3 VMs GPU غير مستخدمة منذ أسبوعين
SecurityReviewer: لا يوجد اختراق، لكن الـ VMs مكشوفة للإنترنت
Planner: التوصية النهائية:
  1. إيقاف VMs GPU فوراً (توفير $13,500/شهر)
  2. إضافة NSG rules
  3. تفعيل budget alerts
```

---

## 🏥 سيناريو CloudNova: DevOps Agent

```python
class CloudNovaDevOpsAgent:
    """Agent يرد على حوادث الإنتاج"""

    def respond_to_incident(self, alert: dict):
        alert_type = alert["type"]
        severity = alert["severity"]

        if alert_type == "HighCPU":
            return self.handle_high_cpu(alert)
        elif alert_type == "HighErrorRate":
            return self.handle_high_errors(alert)
        elif alert_type == "DiskSpace":
            return self.handle_disk_space(alert)

    def handle_high_cpu(self, alert: dict):
        """معالجة ارتفاع CPU"""

        # 1. تشخيص
        metrics = get_cpu_metrics(alert["resource"])
        if metrics["avg"] > 90:
            diagnosis = "CPU مرتفع جداً"

            # 2. إجراءات
            actions = [
                "Scale up replica count",
                "Check for infinite loops",
                "Review recent deployments"
            ]

            # 3. تنفيذ
            if confirm_auto_remediation(alert):
                scale_replicas(alert["resource"], "+2")

            return {
                "diagnosis": diagnosis,
                "actions_taken": ["scaled_replicas"],
                "recommendation": "مراجعة الكود للـ CPU optimization"
            }
```

---

## ⚡ الإنتاج وما بعده

### Agent Safety

| المبدأ                | التنفيذ                       |
| --------------------- | ----------------------------- |
| **Human-in-the-loop** | تأكيد الإجراءات الخطيرة       |
| **Sandbox**           | تنفيذ الكود في بيئة معزولة    |
| **Rate limiting**     | تحديد عدد العمليات في الدقيقة |
| **Audit logging**     | تسجيل كل قرار وكل إجراء       |
| **Cost guardrails**   | سقف للتكاليف اليومية          |

---

## 🧠 التذكّر النشط

1. ما الفرق بين chatbot و AI Agent؟
2. كيف يعمل ReAct pattern؟
3. لماذا human-in-the-loop مهم في Agents الإنتاجية؟
4. متى تستخدم Multi-Agent بدلاً من Single-Agent؟
5. كيف تؤمّن Agent يتعامل مع Infrastructure؟

## 📝 بطاقات تعليمية

- **Agent**: كيان AI يخطط وينفذ ويستخدم أدوات
- **Tool**: وظيفة يمكن للـ Agent استدعاؤها
- **Multi-Agent**: عدة وكلاء يتعاونون لحل مشكلة
- **ReAct**: Reasoning + Acting — نمط تفكير وتنفيذ
- **Guardrails**: قيود أمان على سلوك الـ Agent

## 🎤 أسئلة المقابلة

1. **"متى تستخدم Agent ومتى تستخدم RAG بسيط؟"**
   - Agent: مهام متعددة الخطوات، تحتاج أدوات
   - RAG: أسئلة وأجوبة، استرجاع معلومات

2. **"كيف تختبر Agent؟"**
   - Unit tests لكل tool على حدة
   - Eval dataset لسيناريوهات متنوعة
   - Human evaluation للجودة
   - Monitoring في الإنتاج

3. **"ما هي حدود الـ Agents حالياً؟"**
   - التكلفة (استدعاءات متعددة لـ LLM)
   - latency (عدة round-trips)
   - الموثوقية (قد يتخذ قرارات خاطئة)

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
