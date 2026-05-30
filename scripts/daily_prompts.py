
import urllib.request, json, time, random, sys
from datetime import datetime, timezone

# ── Config ──────────────────────────────────────────────────
NOTION_KEY_PATH = r"C:\Users\AkashPC\tmp\.ntoken"
DATA_SOURCE_ID = "dedc1d5a-fb12-4d3c-b625-e34c377fc783"
OPENROUTER_KEY_PATH = r"C:\Users\AkashPC\tmp\.okey"  # may not exist

# ── Notion helpers ──────────────────────────────────────────
def get_notion_headers():
    key = open(NOTION_KEY_PATH).read().strip()
    return {
        "Authorization": "Bearer " + key,
        "Notion-Version": "2025-09-03",
        "Content-Type": "application/json",
    }

def make_rich_text(text):
    if not text: return []
    return [{"type": "text", "text": {"content": text[:2000]}}]

def create_page(name, body, ai_tool, category, tags, slug):
    headers = get_notion_headers()
    payload = {
        "parent": {"data_source_id": DATA_SOURCE_ID},
        "properties": {
            "Name": {"title": make_rich_text(name)},
            "Body": {"rich_text": make_rich_text(body)},
            "AI Tool": {"select": {"name": ai_tool}},
            "Category": {"select": {"name": category}},
            "Tags": {"multi_select": [{"name": t} for t in tags[:10]]},
            "Slug": {"rich_text": make_rich_text(slug)},
            "CopyCount": {"number": 0},
        }
    }
    data = json.dumps(payload).encode()
    url = "https://api.notion.com/v1/pages"
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode()).get("id"), None
    except Exception as e:
        return None, str(e)

def get_existing_slugs():
    """Get all existing slugs to avoid duplicates."""
    headers = get_notion_headers()
    all_slugs = set()
    next_cursor = None
    while True:
        payload = {"page_size": 100}
        if next_cursor:
            payload["start_cursor"] = next_cursor
        url = "https://api.notion.com/v1/data_sources/" + DATA_SOURCE_ID + "/query"
        req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                result = json.loads(resp.read().decode())
        except:
            break
        for page in result.get("results", []):
            slug_prop = page.get("properties", {}).get("Slug", {}).get("rich_text", [])
            if slug_prop:
                all_slugs.add(slug_prop[0].get("plain_text", ""))
        next_cursor = result.get("next_cursor")
        if not next_cursor:
            break
    return all_slugs

# ── Prompt Templates by Category ───────────────────────────
# Each template is a function that returns (name, body, tool, category, tags)

def gen_writing():
    templates = [
        ("{topic} Blog Post Outline", "ChatGPT", "Writing"),
        ("{topic} SEO Content Brief", "ChatGPT", "Writing"),
        ("{topic} LinkedIn Carousel Script", "ChatGPT", "Writing"),
        ("{topic} Twitter/X Thread Writer", "ChatGPT", "Writing"),
        ("{topic} Cold Email Sequence", "ChatGPT", "Writing"),
        ("{topic} Landing Page Copy", "ChatGPT", "Writing"),
        ("{topic} Product Description", "ChatGPT", "Writing"),
        ("{topic} About Page Writer", "ChatGPT", "Writing"),
        ("{topic} YouTube Script Outline", "ChatGPT", "Writing"),
        ("{topic} Newsletter Edition", "ChatGPT", "Writing"),
        ("{topic} Press Release", "ChatGPT", "Writing"),
        ("{topic} Case Study Writer", "ChatGPT", "Writing"),
        ("{topic} Comparison Article (X vs Y)", "ChatGPT", "Writing"),
        ("{topic} Testimonial Request Email", "ChatGPT", "Writing"),
        ("{topic} FAQ Section Generator", "ChatGPT", "Writing"),
    ]
    topics = [
        "AI-powered project management", "remote team collaboration", "no-code app development",
        "personal finance for millennials", "sustainable living", "mental health at work",
        "developer productivity", "SaaS onboarding", "e-commerce conversion",
        "cybersecurity awareness", "data analytics for small business", "API integration",
        "content repurposing", "email marketing automation", "social media scheduling",
        "customer success playbooks", "B2B lead generation", "mobile app retention",
        "subscription box business", "online course creation", "podcast growth",
        "personal branding for engineers", "startup fundraising", "product hunt launch",
        "AI writing tools comparison", "workflow automation for solopreneurs",
        "developer documentation", "open source community building", "tech debt management",
    ]
    t = random.choice(templates)
    topic = random.choice(topics)
    name = t[0].format(topic=topic)
    slug = name.lower().replace(" ", "-").replace("/", "-").replace("&", "and").replace("'", "")
    tags = [topic.split()[-1], t[2].lower(), "generated"]
    body = generate_prompt_body(name, t[2], topic)
    return name, body, t[1], t[2], tags, slug

def gen_development():
    templates = [
        ("{topic} Code Review Checklist", "Claude", "Development"),
        ("{topic} API Design Document", "Claude", "Development"),
        ("{topic} Database Schema", "Claude", "Development"),
        ("{topic} Docker Setup", "Claude", "Development"),
        ("{topic} CI/CD Pipeline", "Claude", "Development"),
        ("{topic} Error Handling Strategy", "Claude", "Development"),
        ("{topic} Authentication Flow", "Claude", "Development"),
        ("{topic} TypeScript Types Generator", "Claude", "Development"),
        ("{topic} React Component", "Claude", "Development"),
        ("{topic} Next.js API Route", "Claude", "Development"),
    ]
    topics = [
        "user registration system", "payment processing", "file upload service",
        "real-time chat", "search functionality", "notification system",
        "analytics dashboard", "admin panel", "multi-tenant architecture",
        "rate limiting", "caching layer", "background job queue",
        "webhook handler", "OAuth integration", "CSV import/export",
    ]
    t = random.choice(templates)
    topic = random.choice(topics)
    name = t[0].format(topic=topic)
    slug = name.lower().replace(" ", "-").replace("/", "-").replace("&", "and").replace("'", "")
    tags = [topic.split()[-1], t[2].lower(), "generated"]
    body = generate_prompt_body(name, t[2], topic)
    return name, body, t[1], t[2], tags, slug

def gen_marketing():
    templates = [
        ("{topic} Ad Copy Generator", "ChatGPT", "Marketing"),
        ("{topic} Email Nurture Sequence", "ChatGPT", "Marketing"),
        ("{topic} Social Media Calendar", "ChatGPT", "Marketing"),
        ("{topic} Pricing Page Copy", "ChatGPT", "Marketing"),
        ("{topic} Customer Onboarding Flow", "ChatGPT", "Marketing"),
        ("{topic} Churn Prevention Playbook", "ChatGPT", "Marketing"),
        ("{topic} Referral Program Design", "ChatGPT", "Marketing"),
        ("{topic} Competitive Battlecard", "ChatGPT", "Marketing"),
        ("{topic} Webinar Promotion Plan", "ChatGPT", "Marketing"),
        ("{topic} Review Generation Strategy", "ChatGPT", "Marketing"),
    ]
    topics = [
        "SaaS productivity tool", "AI writing assistant", "online course platform",
        "fitness app", "meal planning service", "project management software",
        "team communication tool", "email marketing platform", "CRM system",
        "e-commerce store", "coaching business", "agency services",
    ]
    t = random.choice(templates)
    topic = random.choice(topics)
    name = t[0].format(topic=topic)
    slug = name.lower().replace(" ", "-").replace("/", "-").replace("&", "and").replace("'", "")
    tags = [topic.split()[-1], t[2].lower(), "generated"]
    body = generate_prompt_body(name, t[2], topic)
    return name, body, t[1], t[2], tags, slug

def gen_ai_automation():
    templates = [
        ("{topic} AI Agent Design", "Claude", "AI & Automation"),
        ("{topic} RAG Pipeline Builder", "Claude", "AI & Automation"),
        ("{topic} Prompt Chain Workflow", "Claude", "AI & Automation"),
        ("{topic} Auto-Responder System", "Claude", "AI & Automation"),
        ("{topic} Data Extraction Pipeline", "Claude", "AI & Automation"),
        ("{topic} Content Moderation System", "Claude", "AI & Automation"),
        ("{topic} Smart Notification Engine", "Claude", "AI & Automation"),
    ]
    topics = [
        "customer support", "content generation", "code review",
        "data analysis", "research summarization", "email triage",
        "meeting note extraction", "document processing",
    ]
    t = random.choice(templates)
    topic = random.choice(topics)
    name = t[0].format(topic=topic)
    slug = name.lower().replace(" ", "-").replace("/", "-").replace("&", "and").replace("'", "")
    tags = [topic.split()[-1], "ai", "automation", "generated"]
    body = generate_prompt_body(name, t[2], topic)
    return name, body, t[1], t[2], tags, slug

def gen_video_film():
    templates = [
        ("{topic} YouTube Script", "ChatGPT", "Video & Film"),
        ("{topic} TikTok/Reels Script", "ChatGPT", "Video & Film"),
        ("{topic} Explainer Video Script", "ChatGPT", "Video & Film"),
        ("{topic} Course Lesson Script", "ChatGPT", "Video & Film"),
        ("{topic} Podcast Episode Outline", "ChatGPT", "Video & Film"),
        ("{topic} Product Demo Video Script", "ChatGPT", "Video & Film"),
        ("{topic} Brand Video Treatment", "ChatGPT", "Video & Film"),
    ]
    topics = [
        "AI productivity hacks", "remote work tips", "coding tutorial",
        "startup journey", "personal finance", "health optimization",
        "creativity techniques", "leadership skills", "communication mastery",
    ]
    t = random.choice(templates)
    topic = random.choice(topics)
    name = t[0].format(topic=topic)
    slug = name.lower().replace(" ", "-").replace("/", "-").replace("&", "and").replace("'", "")
    tags = [topic.split()[-1], "video", "content", "generated"]
    body = generate_prompt_body(name, t[2], topic)
    return name, body, t[1], t[2], tags, slug

def gen_business_finance():
    templates = [
        ("{topic} Business Model Canvas", "ChatGPT", "Business & Finance"),
        ("{topic} Revenue Forecast Model", "ChatGPT", "Business & Finance"),
        ("{topic} Investor Pitch Section", "ChatGPT", "Business & Finance"),
        ("{topic} SOP Documentation", "ChatGPT", "Business & Finance"),
        ("{topic} Vendor Eval Scorecard", "ChatGPT", "Business & Finance"),
        ("{topic} Project Proposal Template", "ChatGPT", "Business & Finance"),
        ("{topic} KPI Dashboard Design", "ChatGPT", "Business & Finance"),
    ]
    topics = [
        "SaaS startup", "consulting agency", "e-commerce brand",
        "mobile app", "online education", "creator economy",
        "local service business", "B2B software",
    ]
    t = random.choice(templates)
    topic = random.choice(topics)
    name = t[0].format(topic=topic)
    slug = name.lower().replace(" ", "-").replace("/", "-").replace("&", "and").replace("'", "")
    tags = [topic.split()[-1], "business", "generated"]
    body = generate_prompt_body(name, t[2], topic)
    return name, body, t[1], t[2], tags, slug

def gen_education():
    templates = [
        ("{topic} Course Module Outline", "ChatGPT", "Education & Learning"),
        ("{topic} Quiz Generator", "ChatGPT", "Education & Learning"),
        ("{topic} Study Guide Builder", "ChatGPT", "Education & Learning"),
        ("{topic} Lesson Activity Design", "ChatGPT", "Education & Learning"),
        ("{topic} Assessment Rubric", "ChatGPT", "Education & Learning"),
        ("{topic} Tutorial Script", "ChatGPT", "Education & Learning"),
        ("{topic} Workshop Plan", "ChatGPT", "Education & Learning"),
    ]
    topics = [
        "Python programming", "data science", "machine learning",
        "web development", "UI/UX design", "digital marketing",
        "project management", "public speaking", "financial literacy",
    ]
    t = random.choice(templates)
    topic = random.choice(topics)
    name = t[0].format(topic=topic)
    slug = name.lower().replace(" ", "-").replace("/", "-").replace("&", "and").replace("'", "")
    tags = [topic.split()[-1], "education", "learning", "generated"]
    body = generate_prompt_body(name, t[2], topic)
    return name, body, t[1], t[2], tags, slug

def gen_sales():
    templates = [
        ("{topic} Discovery Call Framework", "ChatGPT", "Sales & CRM"),
        ("{topic} Objection Handling Guide", "ChatGPT", "Sales & CRM"),
        ("{topic} Proposal Follow-Up Sequence", "ChatGPT", "Sales & CRM"),
        ("{topic} Demo Script", "ChatGPT", "Sales & CRM"),
        ("{topic} Account Expansion Play", "ChatGPT", "Sales & CRM"),
        ("{topic} LinkedIn Outreach Sequence", "ChatGPT", "Sales & CRM"),
        ("{topic} Win-Back Campaign", "ChatGPT", "Sales & CRM"),
    ]
    topics = [
        "SaaS product", "agency service", "consulting offer",
        "online course", "coaching program", "software license",
        "enterprise solution", "subscription service",
    ]
    t = random.choice(templates)
    topic = random.choice(topics)
    name = t[0].format(topic=topic)
    slug = name.lower().replace(" ", "-").replace("/", "-").replace("&", "and").replace("'", "")
    tags = [topic.split()[-1], "sales", "generated"]
    body = generate_prompt_body(name, t[2], topic)
    return name, body, t[1], t[2], tags, slug

def gen_design():
    templates = [
        ("{topic} UI Component Spec", "ChatGPT", "Design"),
        ("{topic} Design System Tokens", "ChatGPT", "Design"),
        ("{topic} User Flow Diagram", "ChatGPT", "Design"),
        ("{topic} Brand Identity Guide", "ChatGPT", "Design"),
        ("{topic} Accessibility Audit", "ChatGPT", "Design"),
        ("{topic} Design QA Checklist", "ChatGPT", "Design"),
        ("{topic} Mobile Screen Descriptions", "ChatGPT", "Design"),
    ]
    topics = [
        "SaaS dashboard", "e-commerce checkout", "onboarding flow",
        "settings page", "search experience", "notification center",
        "user profile", "payment form", "landing page",
    ]
    t = random.choice(templates)
    topic = random.choice(topics)
    name = t[0].format(topic=topic)
    slug = name.lower().replace(" ", "-").replace("/", "-").replace("&", "and").replace("'", "")
    tags = [topic.split()[-1], "design", "ux", "generated"]
    body = generate_prompt_body(name, t[2], topic)
    return name, body, t[1], t[2], tags, slug

def gen_productivity():
    templates = [
        ("{topic} Workflow Automation", "ChatGPT", "Productivity"),
        ("{topic} Template Generator", "ChatGPT", "Productivity"),
        ("{topic} Standard Operating Procedure", "ChatGPT", "Productivity"),
        ("{topic} Checklist Builder", "ChatGPT", "Productivity"),
        ("{topic} Decision Framework", "ChatGPT", "Productivity"),
        ("{topic} Meeting Notes Template", "ChatGPT", "Productivity"),
        ("{topic} Project Kickoff Document", "ChatGPT", "Productivity"),
    ]
    topics = [
        "client onboarding", "content creation", "product launch",
        "team offboarding", "bug triage", "sprint planning",
        "hiring process", "invoice management", "content repurposing",
    ]
    t = random.choice(templates)
    topic = random.choice(topics)
    name = t[0].format(topic=topic)
    slug = name.lower().replace(" ", "-").replace("/", "-").replace("&", "and").replace("'", "")
    tags = [topic.split()[-1], "productivity", "generated"]
    body = generate_prompt_body(name, t[2], topic)
    return name, body, t[1], t[2], tags, slug

def gen_creative():
    templates = [
        ("{topic} Story Prompt Generator", "ChatGPT", "Creative"),
        ("{topic} Creative Brief", "ChatGPT", "Creative"),
        ("{topic} Worldbuilding Document", "ChatGPT", "Creative"),
        ("{topic} Character Profile Builder", "ChatGPT", "Creative"),
        ("{topic} Plot Twist Generator", "ChatGPT", "Creative"),
        ("{topic} Art Direction Brief", "ChatGPT", "Creative"),
        ("{topic} Creative Workshop Plan", "ChatGPT", "Creative"),
    ]
    topics = [
        "sci-fantasy world", "modern superhero", "cozy mystery",
        "political thriller", "romantic comedy", "historical fiction",
        "post-apocalyptic survival", "magical realism", "space opera",
    ]
    t = random.choice(templates)
    topic = random.choice(topics)
    name = t[0].format(topic=topic)
    slug = name.lower().replace(" ", "-").replace("/", "-").replace("&", "and").replace("'", "")
    tags = [topic.split()[-1], "creative", "generated"]
    body = generate_prompt_body(name, t[2], topic)
    return name, body, t[1], t[2], tags, slug

def generate_prompt_body(name, category, topic):
    """Generate a detailed, high-quality prompt body."""
    templates = {
        "Writing": "Create a comprehensive prompt for {topic}. Include: 1) Clear objective and target audience, 2) Step-by-step instructions, 3) Output format specification, 4) Tone and style guidelines, 5) Variable placeholders in [BRACKETS], 6) Example input/output pair, 7) Word count targets. Make it copy-paste ready for {topic}. Topic: {topic} Category: {cat}",
        "Development": "Generate a production-ready prompt for {topic}. Include: 1) Technical requirements, 2) Code structure and patterns, 3) Error handling strategy, 4) Security considerations, 5) Testing approach, 6) Performance optimization notes, 7) Documentation requirements. Frameworks/libraries should be specified. Environment: production-ready. Topic: {topic} Category: {cat}",
        "Marketing": "Build a conversion-optimized prompt for {topic}. Include: 1) Target audience persona, 2) Key messaging framework, 3) CTA variations (5+), 4) Objection handling, 5) A/B test suggestions, 6) Channel-specific adaptations, 7) KPIs to measure. Framework: [PAS/AIDA/FAB]. Include hooks, social proof integration, and urgency techniques. Topic: {topic} Category: {cat}",
        "AI & Automation": "Design an advanced AI workflow prompt for {topic}. Include: 1) Agent architecture definition, 2) Tool specifications and schemas, 3) Error handling and fallback logic, 4) Memory/context management, 5) Cost optimization strategies, 6) Safety guardrails, 7) Evaluation metrics. Make it production-ready with specific model recommendations. Topic: {topic} Category: {cat}",
        "Video & Film": "Create a detailed video content prompt for {topic}. Include: 1) Hook/opening strategy, 2) Script structure with timestamps, 3) Visual direction notes, 4) Music/sound design suggestions, 5) CTA strategy, 6) Platform-specific optimizations, 7) Repurposing plan for other formats. Length: specify target duration. Topic: {topic} Category: {cat}",
        "Business & Finance": "Generate a professional business document prompt for {topic}. Include: 1) Executive summary structure, 2) Data requirements, 3) Analysis framework, 4) Risk assessment, 5) Financial projections format, 6) Stakeholder-specific sections, 7) Action items and next steps. Tone: professional, data-driven, actionable. Topic: {topic} Category: {cat}",
        "Education & Learning": "Build an effective learning prompt for {topic}. Include: 1) Learning objectives (Bloom\'s taxonomy), 2) Prerequisite knowledge check, 3) Scaffolded content delivery, 4) Interactive elements and exercises, 5) Assessment criteria, 6) Differentiation strategies, 7) Real-world application examples. Pedagogy: evidence-based learning science. Topic: {topic} Category: {cat}",
        "Sales & CRM": "Create a sales enablement prompt for {topic}. Include: 1) Target buyer persona, 2) Discovery question framework, 3) Value proposition positioning, 4) Objection handling scripts, 5) Next-step strategies, 6) CRM data capture fields, 7) Follow-up cadence. Methodology: [MEDDIC/BANT/Challenger]. Tone: consultative. Topic: {topic} Category: {cat}",
        "Design": "Generate a comprehensive design prompt for {topic}. Include: 1) User persona and context, 2) Design constraints and requirements, 3) Component specifications, 4) Interaction patterns, 5) Accessibility requirements (WCAG), 6) Responsive behavior, 7) Handoff specifications. Include design tokens where applicable. Topic: {topic} Category: {cat}",
        "Productivity": "Build an efficiency-focused prompt for {topic}. Include: 1) Current state analysis framework, 2) Desired outcome specification, 3) Step-by-step process design, 4) Automation opportunities, 5) Tool recommendations, 6) Time savings estimation, 7) Maintenance plan. Philosophy: [GTD/Time Blocking/Lean]. Topic: {topic} Category: {cat}",
        "Creative": "Create an imaginative creative prompt for {topic}. Include: 1) Creative constraints (useful limitations), 2) Inspiration/reference points, 3) Brainstorming framework, 4) Unexpected angles to explore, 5) World rules/logic, 6) Character/element archetypes, 7) Output format examples. Balance creativity with structure. Topic: {topic} Category: {cat}",
    }
    cat = category
    template = templates.get(category, templates["Writing"])
    return template.format(topic=topic, cat=cat)

# ── Generators list ─────────────────────────────────────────
ALL_GENERATORS = [
    gen_writing, gen_writing, gen_writing,  # weighted: writing is most popular
    gen_development, gen_development,
    gen_marketing, gen_marketing,
    gen_ai_automation,
    gen_video_film, gen_video_film,
    gen_business_finance,
    gen_education,
    gen_sales, gen_sales,
    gen_design,
    gen_productivity,
    gen_creative, gen_creative,
]

# ── Main ────────────────────────────────────────────────────
def main():
    count = 25  # prompts per day
    if len(sys.argv) > 1:
        count = int(sys.argv[1])
    
    print("=" * 60)
    print("DAILY PROMPT GENERATOR — " + datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"))
    print("Target: " + str(count) + " prompts")
    print("=" * 60)
    
    # Get existing slugs to avoid duplicates
    print("\nFetching existing slugs...")
    existing = get_existing_slugs()
    print("Found " + str(len(existing)) + " existing prompts")
    
    # Generate prompts
    prompts = []
    used_slugs = set()
    attempts = 0
    max_attempts = count * 5  # allow retries for duplicates
    
    while len(prompts) < count and attempts < max_attempts:
        attempts += 1
        gen = random.choice(ALL_GENERATORS)
        name, body, tool, category, tags, slug = gen()
        
        if slug in existing or slug in used_slugs:
            continue
        
        # Enhance the body with more detail
        body = generate_prompt_body(name, category, name.split(" — ")[0] if " — " in name else name)
        
        prompts.append((name, body, tool, category, tags, slug))
        used_slugs.add(slug)
    
    print("\nGenerated " + str(len(prompts)) + " unique prompts")
    print("Inserting into Notion...\n")
    
    success = 0
    failed = 0
    errors = []
    
    for i, (name, body, tool, category, tags, slug) in enumerate(prompts):
        page_id, err = create_page(name, body, tool, category, tags, slug)
        if page_id:
            success += 1
            print("[" + str(i+1) + "/" + str(len(prompts)) + "] OK: " + name[:60])
        else:
            failed += 1
            errors.append(name + ": " + str(err)[:80])
            print("[" + str(i+1) + "/" + str(len(prompts)) + "] FAIL: " + name[:50] + " - " + str(err)[:60])
        time.sleep(0.35)  # rate limit: ~3 req/sec
    
    print("\n" + "=" * 60)
    print("DONE! " + str(success) + " inserted, " + str(failed) + " failed")
    if errors:
        print("\nErrors:")
        for e in errors:
            print("  " + e)
    print("=" * 60)

if __name__ == "__main__":
    main()
