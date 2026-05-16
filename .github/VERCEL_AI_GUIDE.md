# Adding AI Features with Vercel AI SDK

Quick guide to enhance your PDF annotation viewer with AI capabilities.

---

## 🎯 AI Features You Can Add

### 1. **AI-Powered Semantic Search** 🔍
Search annotations by meaning, not just keywords:

```typescript
// User searches: "mortality rate"
// AI finds: "death toll", "fatality percentage", "survival rate"
```

### 2. **Automatic Data Validation** ✅
AI checks if extracted values make sense:

```typescript
// Annotation says: extracted_value = "134 patients"
// AI validates: ✅ "134 is reasonable for patient count"

// Annotation says: extracted_value = "999999"
// AI validates: ❌ "Suspiciously high, check extraction"
```

### 3. **Smart Field Suggestions** 💡
AI suggests which schema field to use:

```typescript
// Extracted text: "Mean age was 62.5 years (SD 11.2)"
// AI suggests: patient_demographics_age_mean
// Confidence: 0.95
```

### 4. **Intelligent Summarization** 📝
Summarize multiple annotations:

```typescript
// Summarize all outcome_mortality annotations across studies
// AI output: "Mortality ranged from 12-34% across 5 studies (n=412)"
```

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Deploy to Vercel

```bash
# Option A: Via Dashboard (Easiest)
1. Visit https://vercel.com
2. Click "Import Project"
3. Select react-extractor repo
4. Click "Deploy"
# ✅ Done in 30 seconds!

# Option B: Via CLI
npm i -g vercel
vercel
```

### Step 2: Install AI SDK

```bash
npm install ai @ai-sdk/openai
```

### Step 3: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:
```
OPENAI_API_KEY=sk-...your-key-here
```

Get API key: https://platform.openai.com/api-keys

---

## 💡 Example 1: AI-Powered Search

### Create API Route

Create `src/api/search.js`:

```javascript
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export const config = {
  runtime: 'edge', // Run on Vercel Edge (fast!)
}

export default async function handler(req) {
  const { query, annotations } = await req.json()

  // Use AI to find relevant annotations
  const result = await generateText({
    model: openai('gpt-4-turbo'),
    prompt: `
      User query: "${query}"

      Find the most relevant annotations from this list:
      ${JSON.stringify(annotations, null, 2)}

      Return only the IDs of relevant annotations, ranked by relevance.
    `,
  })

  return new Response(JSON.stringify({
    relevantIds: result.text.split(',').map(id => id.trim())
  }))
}
```

### Use in React Component

```javascript
// Add to your AnnotationTable component
import { useState } from 'react'

function AISearch({ annotations, onResults }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const searchWithAI = async () => {
    setLoading(true)

    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, annotations })
    })

    const { relevantIds } = await response.json()
    const results = annotations.filter(a => relevantIds.includes(a.id))

    onResults(results)
    setLoading(false)
  }

  return (
    <div className="ai-search">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search with AI... (e.g., 'mortality outcomes')"
      />
      <button onClick={searchWithAI} disabled={loading}>
        {loading ? '🤖 Searching...' : '🔍 AI Search'}
      </button>
    </div>
  )
}
```

---

## 💡 Example 2: Auto-Validate Extractions

### Create Validation API

Create `src/api/validate.js`:

```javascript
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  const { annotation } = await req.json()

  const result = await generateText({
    model: openai('gpt-4-turbo'),
    prompt: `
      Validate this medical literature data extraction:

      Field: ${annotation.schema_field}
      Extracted Value: ${annotation.extracted_value}
      Context: ${annotation.extracted_text}

      Is this extraction correct? Respond with:
      1. "VALID" or "INVALID"
      2. Confidence score (0-1)
      3. Brief explanation

      Format: VALID|0.95|The value matches the context
    `,
  })

  const [status, confidence, explanation] = result.text.split('|')

  return new Response(JSON.stringify({
    valid: status === 'VALID',
    confidence: parseFloat(confidence),
    explanation: explanation.trim()
  }))
}
```

### Use in Component

```javascript
function AnnotationValidator({ annotation }) {
  const [validation, setValidation] = useState(null)

  const validate = async () => {
    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ annotation })
    })

    const result = await response.json()
    setValidation(result)
  }

  return (
    <div>
      <button onClick={validate}>🤖 AI Validate</button>

      {validation && (
        <div className={validation.valid ? 'valid' : 'invalid'}>
          {validation.valid ? '✅' : '❌'}
          Confidence: {Math.round(validation.confidence * 100)}%
          <p>{validation.explanation}</p>
        </div>
      )}
    </div>
  )
}
```

---

## 💡 Example 3: Smart Field Suggestions

### Create Suggestion API

```javascript
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export default async function handler(req) {
  const { extractedText, schemaFields } = await req.json()

  const result = await generateText({
    model: openai('gpt-4-turbo'),
    prompt: `
      Extracted text: "${extractedText}"

      Available schema fields:
      ${schemaFields.join('\n')}

      Which field best matches this extracted text?
      Respond with: field_name|confidence|reason
    `,
  })

  const [field, confidence, reason] = result.text.split('|')

  return new Response(JSON.stringify({
    suggestedField: field.trim(),
    confidence: parseFloat(confidence),
    reason: reason.trim()
  }))
}
```

---

## 💡 Example 4: Semantic Search with Embeddings

For more advanced semantic search:

### Install Vector Database

```bash
# Use Vercel Postgres with pgvector
npm install @vercel/postgres
```

### Create Embeddings API

```javascript
import { openai } from '@ai-sdk/openai'
import { embed } from 'ai'
import { sql } from '@vercel/postgres'

export default async function handler(req) {
  const { query } = await req.json()

  // Generate embedding for search query
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: query,
  })

  // Search database for similar annotations
  const results = await sql`
    SELECT
      id,
      extracted_text,
      1 - (embedding <=> ${embedding}) AS similarity
    FROM annotations
    WHERE 1 - (embedding <=> ${embedding}) > 0.7
    ORDER BY similarity DESC
    LIMIT 10
  `

  return new Response(JSON.stringify(results.rows))
}
```

---

## 📊 Cost Estimate

### OpenAI API Costs (as of 2025)

**GPT-4 Turbo**:
- Input: $10 / 1M tokens (~$0.01 per search)
- Output: $30 / 1M tokens

**GPT-3.5 Turbo** (cheaper alternative):
- Input: $0.50 / 1M tokens (~$0.0005 per search)
- Output: $1.50 / 1M tokens

**Embeddings**:
- $0.13 / 1M tokens

### Example Usage Costs

**100 users/day × 10 searches each = 1,000 searches/day**

Using GPT-3.5 Turbo:
- ~$0.50/day = **$15/month**

Using GPT-4 Turbo:
- ~$10/day = **$300/month**

**Recommendation**: Start with GPT-3.5, upgrade to GPT-4 if needed

---

## 🎨 UI Examples

### Add AI Badge to Annotations

```javascript
function AnnotationRow({ annotation }) {
  const [aiScore, setAiScore] = useState(null)

  useEffect(() => {
    // Auto-validate on load
    validateAnnotation(annotation).then(setAiScore)
  }, [annotation])

  return (
    <tr>
      <td>{annotation.id}</td>
      <td>
        {annotation.extracted_value}
        {aiScore && (
          <span className={`ai-badge ${aiScore.valid ? 'valid' : 'invalid'}`}>
            AI: {Math.round(aiScore.confidence * 100)}%
          </span>
        )}
      </td>
    </tr>
  )
}
```

### Add AI Search Bar

```javascript
function SearchBar({ annotations, onFilter }) {
  return (
    <div className="search-container">
      {/* Regular search */}
      <input
        type="text"
        placeholder="Search annotations..."
      />

      {/* AI-powered search */}
      <button className="ai-search-btn">
        🤖 AI Search
      </button>
    </div>
  )
}
```

---

## 🔐 Security Best Practices

### 1. Protect API Keys
```javascript
// ✅ Correct: Use environment variables
const apiKey = process.env.OPENAI_API_KEY

// ❌ Wrong: Never hardcode
const apiKey = 'sk-...'
```

### 2. Rate Limiting
```javascript
import { ratelimit } from '@/lib/ratelimit'

export default async function handler(req) {
  const identifier = req.headers.get('x-forwarded-for')
  const { success } = await ratelimit.limit(identifier)

  if (!success) {
    return new Response('Too many requests', { status: 429 })
  }

  // Process request...
}
```

### 3. Input Validation
```javascript
export default async function handler(req) {
  const { query } = await req.json()

  // Validate input
  if (!query || query.length > 500) {
    return new Response('Invalid query', { status: 400 })
  }

  // Process...
}
```

---

## 📈 Performance Tips

### 1. Use Edge Runtime
```javascript
export const config = {
  runtime: 'edge', // ⚡ Runs on global edge network
}
```

### 2. Streaming Responses
```javascript
import { streamText } from 'ai'

export default async function handler(req) {
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    prompt: 'Analyze annotations...',
  })

  return result.toAIStreamResponse()
}
```

### 3. Cache Results
```javascript
import { unstable_cache } from 'next/cache'

const getCachedValidation = unstable_cache(
  async (annotationId) => validateAnnotation(annotationId),
  ['validation'],
  { revalidate: 3600 } // Cache for 1 hour
)
```

---

## 🚀 Deployment Checklist

- [ ] Deploy to Vercel
- [ ] Add OPENAI_API_KEY environment variable
- [ ] Install AI SDK: `npm install ai @ai-sdk/openai`
- [ ] Create API routes in `src/api/`
- [ ] Test AI features locally: `vercel dev`
- [ ] Deploy: `vercel --prod`
- [ ] Monitor usage in OpenAI dashboard
- [ ] Set up rate limiting
- [ ] Add error handling

---

## 📚 Resources

- **Vercel AI SDK**: https://sdk.vercel.ai
- **OpenAI API**: https://platform.openai.com/docs
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **AI SDK Examples**: https://github.com/vercel/ai

---

## 🎯 Next Steps

1. **Now**: Deploy to Vercel (if you want AI features)
2. **Week 1**: Add AI-powered search
3. **Week 2**: Add auto-validation
4. **Week 3**: Add embeddings for semantic search

Or stick with **GitHub Pages** if you don't need AI yet!

---

**Questions?** The AI features are optional - your app works perfectly without them!

**Last Updated**: 2025-10-30
