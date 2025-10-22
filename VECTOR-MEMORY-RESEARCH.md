# Vector Memory Research: Incremental Updates

**Date**: 2025-10-22
**Question**: Can we incrementally update OpenAI embeddings without full rebuilds?

## TL;DR

**YES** - Incremental updates are possible with proper architecture.

## How Vector Memory Works

### Current Implementation Pattern
1. **Embedding Generation**: Text → OpenAI API → 1536-dimensional vector
2. **Storage**: Vectors stored in vector database (Pinecone, Weaviate, etc.)
3. **Retrieval**: Query → similarity search → relevant documents

### Full Rebuild vs Incremental Update

#### Full Rebuild (Current Approach)
```bash
# Re-process ALL documents every time
for doc in all_documents:
    embedding = openai.embed(doc)
    vector_db.upsert(doc_id, embedding)
```

**Pros**:
- Simple to implement
- No complex tracking needed
- Guaranteed consistency

**Cons**:
- Slow for large datasets
- Expensive API costs
- Unnecessary re-processing

#### Incremental Update (Recommended)
```bash
# Only process NEW or CHANGED documents
for doc in changed_documents:
    embedding = openai.embed(doc)
    vector_db.upsert(doc_id, embedding)  # Upsert = update if exists, insert if new
```

**Pros**:
- Fast updates
- Lower API costs
- Scalable to large datasets

**Cons**:
- Need change tracking
- More complex implementation

## Implementation Strategies

### Strategy 1: Git-Based Change Tracking
```bash
# Get changed files since last embedding
git diff --name-only HEAD~1 HEAD

# Only embed changed files
for file in changed_files:
    embed_and_upsert(file)
```

### Strategy 2: Timestamp-Based Tracking
```javascript
// Track last embedding time
const lastEmbedTime = await db.get('last_embed_timestamp');

// Find files modified after last embed
const changedFiles = files.filter(f =>
    fs.statSync(f).mtime > lastEmbedTime
);

// Embed only changed files
```

### Strategy 3: Content Hash Tracking
```javascript
// Store content hashes with embeddings
const fileHash = crypto.createHash('sha256')
    .update(fileContent)
    .digest('hex');

// Only re-embed if hash changed
if (storedHash !== fileHash) {
    embedding = await openai.embed(fileContent);
    vectorDB.upsert(fileId, { embedding, hash: fileHash });
}
```

## Vector Database Support

### Pinecone
```javascript
// Upsert = incremental update
await index.upsert([
    { id: 'doc1', values: embedding1, metadata: {...} },
    { id: 'doc2', values: embedding2, metadata: {...} }
]);
```

### Weaviate
```javascript
// Update existing or create new
await client.data.updater()
    .withId(docId)
    .withVector(embedding)
    .do();
```

### ChromaDB (Local)
```python
# Upsert operation
collection.upsert(
    ids=['doc1'],
    embeddings=[embedding],
    documents=[text]
)
```

## Cost Analysis

### Full Rebuild Example
- 1,000 documents
- Average 500 tokens per document
- OpenAI embedding cost: $0.0001 per 1K tokens
- **Cost per rebuild**: (1000 × 500 / 1000) × $0.0001 = **$0.05**
- **Daily updates (10x/day)**: $0.50/day = **$15/month**

### Incremental Update Example
- Average 10 changed documents per update
- **Cost per update**: (10 × 500 / 1000) × $0.0001 = **$0.0005**
- **Daily updates (10x/day)**: $0.005/day = **$0.15/month**

**Savings**: 100x reduction in API costs

## Recommended Implementation for MR-DJ

### Architecture
```
Session Docs (Markdown)
    ↓
Git Commit (tracks changes)
    ↓
GitHub Action / Hook
    ↓
Change Detection Script
    ↓
OpenAI Embedding (changed files only)
    ↓
Vector DB Upsert
    ↓
Query Ready
```

### Implementation Script

```javascript
#!/usr/bin/env node
/**
 * Incremental Vector Memory Update Script
 * Only embeds changed files since last commit
 */

const { execSync } = require('child_process');
const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function incrementalUpdate() {
    // 1. Get changed files from last commit
    const changedFiles = execSync('git diff --name-only HEAD~1 HEAD')
        .toString()
        .split('\n')
        .filter(f => f.endsWith('.md'));

    console.log(`Found ${changedFiles.length} changed markdown files`);

    // 2. Embed only changed files
    for (const file of changedFiles) {
        const content = fs.readFileSync(file, 'utf-8');

        // Create embedding
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: content
        });

        const embedding = response.data[0].embedding;

        // 3. Upsert to vector DB (Pinecone/Weaviate/ChromaDB)
        await vectorDB.upsert({
            id: file,
            vector: embedding,
            metadata: {
                filename: file,
                timestamp: new Date(),
                git_commit: execSync('git rev-parse HEAD').toString().trim()
            }
        });

        console.log(`✅ Embedded: ${file}`);
    }

    console.log(`\n✅ Incremental update complete: ${changedFiles.length} files processed`);
}

incrementalUpdate();
```

### GitHub Action Integration

```yaml
# .github/workflows/vector-memory-update.yml
name: Update Vector Memory
on:
  push:
    branches: [master]
    paths:
      - '**.md'  # Only trigger on markdown changes

jobs:
  update-embeddings:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 2  # Need previous commit for diff

      - name: Install dependencies
        run: npm install openai

      - name: Update vector embeddings
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          PINECONE_API_KEY: ${{ secrets.PINECONE_API_KEY }}
        run: node scripts/incremental-embed.js
```

## Best Practices

### 1. Use Document IDs Consistently
```javascript
// Use file path as stable ID
const docId = 'docs/SESSION-RESUME.md';
```

### 2. Store Metadata
```javascript
metadata: {
    filename: 'SESSION-RESUME.md',
    last_modified: '2025-10-22T14:30:00Z',
    git_commit: 'a1b2c3d',
    word_count: 2500
}
```

### 3. Handle Deletions
```javascript
// Remove embeddings for deleted files
const deletedFiles = execSync('git diff --diff-filter=D --name-only HEAD~1')
    .toString()
    .split('\n');

for (const file of deletedFiles) {
    await vectorDB.delete(file);
}
```

### 4. Batch Updates for Efficiency
```javascript
// Batch embed multiple docs in one API call
const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: [doc1, doc2, doc3]  // Batch up to 2048 docs
});
```

## Answer to Your Question

### Can we incrementally add to vector memory?

**YES**, absolutely! Here's how:

1. **Current Approach** (if doing full rebuilds):
   - ❌ Slow
   - ❌ Expensive
   - ❌ Doesn't scale

2. **Recommended Approach**:
   - ✅ Use `git diff` to find changed files
   - ✅ Only embed changed/new files
   - ✅ Use vector DB `upsert()` operation
   - ✅ 100x faster and cheaper
   - ✅ Scales to millions of documents

3. **Implementation Options**:
   - **Option A**: Git commit hook (local)
   - **Option B**: GitHub Action (automated)
   - **Option C**: Manual script on demand

### What We Should Do for MR-DJ

**Recommendation**: Implement **Option C** (manual script) first, then move to **Option B** (GitHub Action) for full automation.

```bash
# Usage after any session
git add .
git commit -m "Session updates"
node scripts/incremental-embed.js  # Only embeds changed files
git push
```

This gives us:
- ✅ Fast updates (seconds, not minutes)
- ✅ Low cost ($0.15/month vs $15/month)
- ✅ Easy session recovery with "vind vector memory"
- ✅ No need to rebuild everything

## Next Steps

1. **Create incremental embed script** (`scripts/incremental-embed.js`)
2. **Choose vector DB** (recommend Pinecone for cloud or ChromaDB for local)
3. **Set up automatic updates** via GitHub Action
4. **Test with current session docs**

---

**Conclusion**: Incremental vector memory updates are not only possible but **highly recommended** for production use. The approach is well-established and used by companies with millions of documents.
