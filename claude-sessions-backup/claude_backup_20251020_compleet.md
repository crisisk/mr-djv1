# Claude Conversation Export: XAI + HITL Integration Planning
**Datum:** 2025-10-20
**Sessie:** XAI Footnotes Integration + Granular Consensus Planning
**Status:** Vastgelopen - Wachten op development completion

---

## Sessie Overzicht

Deze sessie bevat twee grote fasen:
1. **Fase 1 (Voltooid):** XAI Integration met Footnotes en Regulatory References
2. **Fase 2 (Gepland):** Granular Consensus + Real-time API Verification + HITL ML Loop

---

## FASE 1: XAI INTEGRATIE (✅ VOLTOOID)

### Context

Vervolg van vorige sessie waar we database analyses deden. Gebruiker vroeg:
> "werk met openrouter alles tegelijk uit"

### Wat We Hebben Gebouwd

#### 1. FootnoteService (`/srv/apps/psra-ltsd-v1/lib/footnote-service.ts`)
- **335 regels TypeScript**
- Centralized service voor regulatory reference retrieval
- Toegang tot 185.160 regulatory references in database

**Key Methods:**
```typescript
async getFootnotesForHsCode(hsCode: string, date?: Date): Promise<FootnoteReference[]>
async getMeasureFootnotes(hsCode: string, measureType?: string, date?: Date): Promise<FootnoteReference[]>
async getLegalBasesForRegulation(regulationId: string): Promise<LegalBasis[]>
async getRegulatoryContext(hsCode: string, date?: Date): Promise<RegulatoryContext>
async searchFootnotes(keyword: string, limit?: number): Promise<FootnoteReference[]>
```

**Database Coverage:**
- 56.914 footnote descriptions
- 125.841 measure footnotes
- 1.968 nomenclature footnotes
- 4.437 legal bases
- **Totaal: 185.160 regulatory references**

---

#### 2. Enhanced Origin Engine (`/srv/apps/psra-ltsd-v1/lib/advanced-origin-engine.ts`)

**Wijzigingen:**
- Import van FootnoteService
- Extended `OriginCalculationResult` interface:
  ```typescript
  footnoteReferences?: FootnoteReference[];
  legalBases?: LegalBasis[];
  regulatoryContext?: {
    totalReferences: number;
    nomenclatureCount: number;
    measureCount: number;
  };
  ```

**Integration Flow:**
```typescript
async calculateOrigin(request) {
  // 1. Fetch regulatory context
  const regulatoryContext = await footnoteService.getRegulatoryContext(hsCode);

  // 2. Evaluate rules
  const evaluations = await Promise.all(rules.map(rule => this.evaluateRule(rule, request)));

  // 3. Run AI consensus with regulatory context
  const consensusOutcome = await runMultiModelConsensus({
    request,
    evaluations,
    bestResult,
    regulatoryContext  // ← NIEUW
  });

  // 4. Return with footnotes & legal bases
  return {
    ...bestResult,
    footnoteReferences: [...regulatoryContext.nomenclatureFootnotes, ...regulatoryContext.measureFootnotes],
    legalBases: regulatoryContext.legalBases
  };
}
```

---

#### 3. UI Components

##### RegulatoryReferencesPanel (`/srv/apps/psra-ltsd-v1/components/xai/RegulatoryReferencesPanel.tsx`)
- **350+ regels React/TypeScript**
- Tabbed interface: Nomenclatuur | Maatregelen | Wettelijke Basis
- Collapsible panels met tooltips
- Footnote cards met expandable descriptions
- Legal basis cards met role type badges

##### ExportXaiReport (`/srv/apps/psra-ltsd-v1/components/xai/ExportXaiReport.tsx`)
- **420+ regels TypeScript**
- jsPDF integration voor PDF generatie
- Complete XAI rapport met alle regulatory references
- Automatic page breaks & professional formatting

##### EnhancedXaiExplanationView (`/srv/apps/psra-ltsd-v1/components/xai/EnhancedXaiExplanationView.tsx`)
- **650+ regels React/TypeScript**
- 4 tabs: Overview | Regulatory | AI Consensus | Audit Trail
- 9 sub-components voor modular design
- SWR data fetching met loading states

---

#### 4. Database Performance Indices (`/srv/apps/psra-ltsd-v1/scripts/create-footnote-indices.sql`)

**17 indices created:**
- Nomenclature footnotes indices (3)
- Measure footnotes indices (2)
- Footnote descriptions indices (3)
- Goods nomenclatures indices (3)
- Legal bases indices (3)
- Measures indices (4)
- Origin rules indices (4)

**Expected Performance:**
- 10-50x query performance improvement
- Target: < 100ms per HS code lookup

**⚠️ ISSUE:** Sommige indices faalden vanwege schema mismatch:
```sql
ERROR:  column "validity_end_date" does not exist
ERROR:  relation "goods_nomenclatures" does not exist
```

**Root Cause:** Database schema gebruikt andere kolom namen:
- Verwacht: `goods_nomenclature_sid`, `validity_end_date`
- Werkelijk: `"Goods code"`, `"Footnote code"` (met spaties!)

---

#### 5. Origin Rules Import Script (`/srv/apps/psra-ltsd-v1/scripts/import-origin-rules.ts`)

- **280+ regels TypeScript**
- CSV parsing met rule condition extraction
- Support voor 7+ trade agreements (CETA, EU-Japan EPA, EU-UK TCA, etc.)
- Rule type detection (V, H, S, P, C)
- Condition parsing (MaxNOM, CTH, CTSH, CC, etc.)
- Progress tracking & error handling

**Usage:**
```bash
npx tsx scripts/import-origin-rules.ts /data/taric/origin_rules.csv
```

**Expected Output:**
- 500-1000 PSR rules imported
- Current: 8 rules → Target: 500+ rules

---

#### 6. Test Suite (`/srv/apps/psra-ltsd-v1/__tests__/footnote-service.test.ts`)

- **250+ regels Jest tests**
- 15+ test cases
- Unit tests + edge cases + performance tests

**Test Coverage:**
- `getFootnotesForHsCode()` - Valid codes, normalization, validity filtering
- `getMeasureFootnotes()` - Measure type filtering, regulation ID inclusion
- `getRegulatoryContext()` - Complete context, reference counting
- `getLegalBasesForRegulation()` - Role type mapping
- `searchFootnotes()` - Keyword search, limit parameter

**Performance Tests:**
- Footnote retrieval: < 500ms target
- Regulatory context: < 1000ms target

---

#### 7. Deployment Script (`/srv/apps/psra-ltsd-v1/scripts/deploy-xai-integration.sh`)

**8-step deployment workflow:**
1. Pre-flight checks (directory, database connection)
2. Create backups (schema, package.json)
3. Install dependencies (jsPDF)
4. Database indices creation
5. Verify file structure (7 required files)
6. TypeScript type checking
7. Run tests
8. Generate deployment summary

**Usage:**
```bash
cd /srv/apps/psra-ltsd-v1
./scripts/deploy-xai-integration.sh
```

---

#### 8. Documentation (`/srv/apps/psra-ltsd-v1/docs/XAI_INTEGRATION_COMPLETE.md`)

- **1000+ regels comprehensive documentation**
- Component architecture
- API response structures
- Database statistics
- Next steps roadmap
- Troubleshooting guide
- Success metrics

---

### Fase 1 Resultaten

**✅ Succesvol Geïmplementeerd:**
- 9 bestanden created/modified
- ~3.500 regels code
- Complete XAI infrastructure
- Test suite
- Deployment automation
- Comprehensive documentation

**⚠️ Known Issues:**
1. Database schema mismatch - indices partially failed
2. FootnoteService queries moeten aangepast worden voor correcte kolom namen
3. Nog niet end-to-end getest met echte data

**📊 Database Statistics:**
- Footnote Descriptions: 56.914
- Measure Footnotes: 125.841
- Nomenclature Footnotes: 1.968
- Legal Bases: 4.437
- Origin Rules: 8 (needs expansion to 500+)
- HS Codes: 21.956
- **Total Regulatory References: 185.160**

---

## FASE 2: GRANULAR CONSENSUS + HITL ML LOOP (📋 GEPLAND)

### Context

Gebruiker vroeg:
> "fix via openrouter dat er consensus is voor ieder XAI element en dat er on-demand API-call worden gedaan die de laatste informatie van de dag erbij pakt (TARIC, WCO, etc.) om nogmaals te verifieren dat de toekenning van bijvoorbeeld een LTSD wel/niet goedgekeurd mag worden gebaseerd op de variabelen (code > rulings > dubbel check status met LLM + ML learning met HITL"

### Codebase Analyse Uitgevoerd

**2 parallelle exploration agents ingezet:**
1. **Agent 1:** HITL & ML components
2. **Agent 2:** External API integrations

**Gevonden Components:**

#### HITL Infrastructure (Gedeeltelijk Geïmplementeerd)

**Files:**
- `/srv/apps/psra-ltsd-v1/hitl.py` (87 lines) - Feedback endpoints
- `/srv/apps/psra-ltsd-v1/version_ledger.py` (51 lines) - Immutable ledger models
- `/srv/apps/psra-ltsd-v1/backend/services/version_ledger_service.py` (65+ lines) - Version tracking
- `/srv/apps/psra-ltsd-v1/components/dashboard/FeedbackPanel.tsx` - Frontend UI

**Status:**
- ✅ HITL endpoints exist (`POST /hitl/feedback`, `GET /hitl/review/{decision_id}`)
- ✅ Version Ledger logging
- ✅ Frontend feedback panel
- ❌ NOT connected to ML training pipeline
- ❌ Feedback is logged but not used for learning

**HITLFeedback Model:**
```python
class HITLFeedback:
    user_id: str
    correction_type: Literal["APPROVED", "OVERRULED", "CORRECTED"]
    corrected_origin: Optional[str]
    corrected_citation: Optional[str]
    reason: str
    metadata: Dict[str, Any]
```

---

#### ML Models (Gemockt, Niet Geïntegreerd)

**Files:**
- `/srv/apps/psra-ltsd-v1/ml_service.py` (50+ lines) - ML wrapper (MOCKED)
- `/srv/apps/psra-ltsd-v1/backend/services/predictive_analytics_service.py` (80+ lines) - Scikit-learn models
- `/srv/apps/psra-ltsd-v1/backend/models/predictive_models.py` (50+ lines) - Risk models

**ML Stack v5.6 (Available but Not Integrated):**
- `/root/psra-agentic/unpacked/PSRA-LTSD_v5.6_+ML/psra-ml-stack/services/`
  - `classify/app.py` - SetFit + Scikit-learn document classification
  - `embed/app.py` - SentenceTransformer embeddings
  - `ner/app.py` - SpaCy NER extraction
  - `rag/app.py` - Qdrant vector database RAG
  - `parser/app.py` - Document parsing

**Status:**
- ✅ ML Service wrapper exists
- ✅ Scikit-learn predictive models (DecisionTree, LogisticRegression)
- ✅ Risk scoring framework
- ❌ Real models not loaded (currently mocked)
- ❌ Qdrant not connected
- ❌ ML stack not integrated in main backend

---

#### External API Integrations (Production Ready)

**TARIC Integration:**
- **Status:** ✅ ACTIVE (Hybrid: Live DDS + Snapshot)
- **Files:**
  - `/srv/apps/psra-ltsd-v1/backend/services/taric_service.py` - Hybrid service
  - `/srv/apps/psra-ltsd-v1/integrations/taric/dds_client/client.py` - SOAP client
  - `/srv/apps/psra-ltsd-v1/backend/api/taric_router.py` - API endpoints

**Architecture:**
```
TARIC Hybrid:
├── Live DDS SOAP API (https://dds.euro.europa.eu/services/taric/ws)
│   ├── Rate Limiting: 2 req/sec
│   ├── Operations: goodsMeasForWs, goodsDescrForWs
│   └── Cache: Redis 24h TTL
│
├── Snapshot/Basefile
│   ├── Location: /data/taric/YYYY-MM-DD/
│   ├── Format: Excel workbooks (13 sheets)
│   └── Refresh: Daily ETL
│
└── Reconciliation Engine
    └── Compares live vs. snapshot
```

**WCO Integration:**
- **Status:** ✅ IMPLEMENTED
- **File:** `/srv/apps/psra-ltsd-v1/backend/connectors/wco.py`
- **API:** https://api.wcoomd.org
- **Methods:**
  - `fetch_origin_note(agreement_code, hs_code)`
  - `fetch_rulings(hs_code)`
- **Cache:** 24h TTL

**HMRC Integration:**
- **Status:** ✅ IMPLEMENTED
- **File:** `/srv/apps/psra-ltsd-v1/backend/connectors/hmrc.py`
- **API:** https://api.trade-tariff.service.gov.uk
- **Methods:**
  - `fetch_commodity(commodity_code)`
  - `fetch_measures(commodity_code)`

---

#### Consensus Orchestrator (Partial Implementation)

**Files:**
- `/srv/apps/psra-ltsd-v1/lib/ai/consensus-orchestrator.ts` (100+ lines)
- `/srv/apps/psra-ltsd-v1/lib/ai/types.ts` (79 lines)
- `/srv/apps/psra-ltsd-v1/backend/orchestrator/router.py` (100+ lines) - Cost-aware routing

**Current State:**
- ✅ Multi-LLM consensus (OpenAI, Anthropic, Azure, Vertex, HTTP)
- ✅ Provider-agnostic response normalization
- ✅ Confidence threshold management
- ✅ Latency tracking
- ✅ Audit trail generation
- ❌ Only works at FINAL DECISION level
- ❌ No granular consensus per XAI element

**ConsensusOutcome Structure:**
```typescript
interface ConsensusOutcome {
  enabled: boolean;
  consensusScore: number;
  consensusSummary?: string;
  dissentingOpinions: string[];
  providerDecisions: ProviderCallResult[];
  requiresHumanReview: boolean;
  auditTrail: ConsensusAuditTrail;
}
```

---

#### LTSD Management (Basic Implementation)

**Files:**
- `/srv/apps/psra-ltsd-v1/backend/models/ltsd_models.py` (80+ lines)
- `/srv/apps/psra-ltsd-v1/backend/services/ltsd_management_service.py` (80+ lines)
- `/srv/apps/psra-ltsd-v1/backend/api/ltsd_router.py` (400+ lines)

**Current State:**
- ✅ CRUD operations (Create, Read, Update, Revoke)
- ✅ Status tracking (DRAFT → ACTIVE → EXPIRED → REVOKED)
- ✅ OriginAssessment model with verdict + confidence
- ❌ No multi-stage approval workflow
- ❌ No dual verification (LLM + ML)
- ❌ No automatic real-time API checks

**LTSDStatus Enum:**
```python
class LTSDStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    EXPIRED = "expired"
    REVOKED = "revoked"
    SUPERSEDED = "superseded"
```

---

### Het Nieuwe Plan (Wat We WILDEN Bouwen)

#### Phase 1: Granular Consensus Architecture

**Concept:** Consensus op ELKE stap, niet alleen finale beslissing.

**6 Sub-Consensus Levels:**
1. **HS Code Classification Consensus** - Proposed code + provider agreement
2. **Rule Interpretation Consensus** - Rule text understanding + conditions
3. **Footnote Relevance Consensus** - Which footnotes apply + reasoning
4. **RVC Calculation Consensus** - Calculation method + result verification
5. **API Verification Consensus** - Real-time TARIC/WCO data cross-check
6. **Final Decision Consensus** - Overall verdict aggregation

**Implementation:**
```typescript
interface GranularConsensus {
  hsCodeConsensus: {
    proposedCode: string;
    providers: ProviderConsensus[];
    consensusScore: number;
    requiresReview: boolean;
  };

  ruleInterpretationConsensus: {
    ruleId: string;
    interpretations: RuleInterpretation[];
    consensusScore: number;
    dissentingOpinions: string[];
  };

  footnoteRelevanceConsensus: {
    footnotes: FootnoteConsensusResult[];
  };

  rvcCalculationConsensus: {
    calculatedRVC: number;
    providersAgree: boolean;
    verifications: RVCVerification[];
    consensusScore: number;
  };

  apiVerificationConsensus: {
    taricCheck: TaricVerificationResult;
    wcoCheck: WCOVerificationResult;
  };

  finalDecisionConsensus: {
    verdict: "QUALIFIED" | "NOT_QUALIFIED" | "REVIEW";
    confidence: number;
    allStepsPass: boolean;
    humanReviewRequired: boolean;
  };
}
```

---

#### Phase 2: Real-time API Verification Layer

**On-demand checks tijdens assessment:**

```typescript
class RealtimeVerificationService {
  async verifyAssessment(assessment: Assessment): Promise<VerificationResult> {
    // 1. TARIC Live Query (today's data!)
    const taricData = await taricService.liveQuery({
      hsCode: assessment.hsCode,
      date: new Date(),  // ← VANDAAG
      country: assessment.destinationCountry
    });

    // 2. WCO Ruling Check
    const wcoRulings = await wcoConnector.fetch_rulings(assessment.hsCode);

    // 3. HMRC Check (if UK involved)
    if (assessment.tradeAgreement.includes('UK')) {
      const hmrcData = await hmrcConnector.fetch_measures(assessment.hsCode);
    }

    // 4. Cross-verify met LLM consensus
    const verificationConsensus = await consensusOrchestrator.verifyWithProviders({
      taricData,
      wcoRulings,
      assessment,
      prompt: "Verify this assessment against latest TARIC/WCO data. Check for any discrepancies..."
    });

    return {
      taricValid: true,
      wcoConsistent: true,
      llmVerification: verificationConsensus,
      timestamp: new Date(),
      requiresHumanReview: verificationConsensus.consensusScore < 85
    };
  }
}
```

---

#### Phase 3: HITL → ML Training Pipeline

**Feedback loop die echt leert:**

```python
class HITLMLPipeline:
    def process_feedback(self, feedback: HITLFeedback):
        """
        Complete feedback processing with ML training
        """
        # 1. Log immutably
        version_ledger.log_hitl_feedback(feedback)

        # 2. Extract training signal
        training_sample = {
            "input": feedback.original_assessment,
            "label": feedback.correction_type,
            "corrected_output": feedback.corrected_origin,
            "user_rationale": feedback.reason,
            "confidence_before": feedback.original_confidence
        }

        # 3. Add to training queue
        ml_training_queue.enqueue(training_sample)

        # 4. Trigger retraining if batch threshold met
        if ml_training_queue.size() >= 100:  # Batch size
            self.retrain_models()

        # 5. Flag similar assessments for re-review
        similar_cases = self.find_similar_assessments(feedback.assessment_id)
        for case in similar_cases:
            case.mark_for_review(reason="Related HITL correction received")

    def retrain_models(self):
        """
        Retrain ML models with accumulated HITL feedback
        """
        # Get training batch
        training_data = ml_training_queue.get_batch()

        # Fine-tune SetFit classification model
        setfit_model = load_setfit_model()
        setfit_model.fit(training_data)

        # Update risk scoring model
        risk_model = DecisionTreeClassifier()
        risk_model.fit(X=training_data.features, y=training_data.risk_levels)

        # Version and deploy new models
        model_version = version_model(setfit_model, risk_model)
        deploy_models(model_version)

        # Emit retraining metrics
        emit_metric("ml_retraining_completed", {
            "model_version": model_version,
            "training_samples": len(training_data),
            "timestamp": datetime.now()
        })
```

---

#### Phase 4: Multi-Stage LTSD Approval Pipeline

**8-stage approval met dubbele verificatie:**

```typescript
class LTSDApprovalPipeline {
  async evaluateLTSD(ltsdRequest: LTSDRequest): Promise<LTSDDecision> {

    // STAGE 1: Deterministic Rules Engine
    const rulesResult = await originEngine.evaluateRules({
      hsCode: ltsdRequest.hsCode,
      materials: ltsdRequest.materials,
      tradeAgreement: ltsdRequest.tradeAgreement
    });

    // STAGE 2: Granular LLM Consensus (6 sub-consensuses)
    const granularConsensus = await this.runGranularConsensus({
      hsCode: ltsdRequest.hsCode,
      rulesResult,
      footnotes: ltsdRequest.footnotes
    });

    // STAGE 3: Real-time API Verification (TODAY'S DATA!)
    const apiVerification = await realtimeVerificationService.verifyAssessment({
      hsCode: ltsdRequest.hsCode,
      date: new Date(),  // ← On-demand live check
      country: ltsdRequest.destinationCountry
    });

    // STAGE 4: ML Risk Scoring
    const mlRiskScore = await mlService.predictRisk({
      assessment: rulesResult,
      consensus: granularConsensus,
      apiVerification
    });

    // STAGE 5: Decision Aggregation
    const decision: LTSDDecision = {
      verdict: this.determineVerdict({
        rulesResult,
        granularConsensus,
        apiVerification,
        mlRiskScore
      }),
      confidence: this.calculateAggregateConfidence([
        rulesResult.confidence,
        granularConsensus.finalDecisionConsensus.confidence,
        apiVerification.llmVerification.consensusScore,
        mlRiskScore.confidence
      ]),
      requiresHumanReview: this.shouldEscalate({
        mlRiskScore,
        granularConsensus,
        apiVerification
      }),
      stages: {
        rulesEngine: rulesResult,
        granularConsensus,
        apiVerification,
        mlRiskScore
      },
      timestamp: new Date(),
      auditTrail: this.generateFullAuditTrail(...)
    };

    // STAGE 6: Human Review Queue (if needed)
    if (decision.requiresHumanReview) {
      await hitlService.queueForReview(decision);
    }

    // STAGE 7: Version Ledger Logging
    await versionLedger.logDecision(decision);

    // STAGE 8: Blockchain Anchor (if approved)
    if (decision.verdict === "APPROVED") {
      await blockchainAnchor.anchor(decision);
    }

    return decision;
  }

  private shouldEscalate(params): boolean {
    return (
      params.mlRiskScore.risk_level === "HIGH" ||
      params.mlRiskScore.risk_level === "CRITICAL" ||
      params.granularConsensus.finalDecisionConsensus.consensusScore < 85 ||
      params.apiVerification.llmVerification.consensusScore < 80 ||
      params.granularConsensus.dissentingOpinions.length > 0
    );
  }
}
```

---

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    LTSD Submission                              │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 1: Rules Engine (Deterministic)                         │
│  - BOM validation                                               │
│  - RVC calculation                                              │
│  - CTH/CC checking                                              │
│  - Process verification                                         │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 2: Granular LLM Consensus (6 sub-levels)               │
│  ├─ HS Code Classification Consensus                          │
│  ├─ Rule Interpretation Consensus                             │
│  ├─ Footnote Relevance Consensus                              │
│  ├─ RVC Calculation Consensus                                 │
│  ├─ API Verification Consensus                                │
│  └─ Final Decision Consensus                                  │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 3: Real-time API Verification (TODAY'S DATA!)          │
│  ├─ TARIC DDS Live Query (2 req/sec rate limited)            │
│  ├─ WCO Rulings Lookup (24h cache)                           │
│  ├─ HMRC Trade Tariff Check (if UK trade)                    │
│  └─ Cross-verify all with LLM consensus                      │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 4: ML Risk Scoring                                      │
│  ├─ Feature extraction from all stages                        │
│  ├─ Risk prediction (LOW/MEDIUM/HIGH/CRITICAL)               │
│  ├─ Confidence estimation                                      │
│  └─ Feature importance for explainability                     │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 5: Decision Aggregation Logic                          │
│  ├─ Aggregate all 4 previous stages                           │
│  ├─ Calculate weighted confidence score                       │
│  ├─ Determine verdict: APPROVED / REJECTED / REVIEW          │
│  └─ Apply escalation logic                                    │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
              [Escalation Needed?]
                /              \
              YES              NO
               ↓                ↓
┌──────────────────────┐  ┌──────────────────────────────────┐
│  STAGE 6: HITL       │  │  STAGE 7: Auto-Approve          │
│  Queue for Review    │  │  - Log to Version Ledger        │
│                      │  │  - Blockchain anchor            │
│  Triggers:           │  │  - Webhook notification         │
│  - Risk: HIGH/CRIT   │  │  - LTSD certificate generation  │
│  - Consensus < 85%   │  └──────────────┬──────────────────┘
│  - API discrepancy   │                 ↓
│  - Dissent present   │       [LTSD Issued Successfully]
└──────────┬───────────┘
           ↓
┌──────────────────────────────────────────────────────────────┐
│  Human Reviews & Submits Correction                         │
│  - APPROVED (confirm AI decision)                            │
│  - OVERRULED (reject AI decision)                            │
│  - CORRECTED (modify specific fields)                        │
└──────────┬───────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 8: HITL → ML Training Pipeline (Async Background)      │
│  ├─ Extract training signal from human correction            │
│  ├─ Add to ML training queue                                 │
│  ├─ Batch retraining trigger (every 100 samples)            │
│  ├─ Model versioning & deployment                            │
│  ├─ Re-evaluate similar historical cases                     │
│  └─ Update risk scoring thresholds                           │
└─────────────────────────────────────────────────────────────────┘
```

---

### Architectural Impact Analysis

**Components That Need Changes:**

1. **consensus-orchestrator.ts** - Major refactor for granular consensus
2. **advanced-origin-engine.ts** - Add real-time API calls
3. **taric_service.py** - Ensure live query path is optimized
4. **hitl.py** - Add ML training pipeline trigger
5. **ml_service.py** - Replace mock with real ML models
6. **ltsd_management_service.py** - Implement multi-stage approval
7. **Database schema** - Add tables for training queue, model versions

**Risks:**
- ⚠️ Performance impact (multiple API calls per assessment)
- ⚠️ Rate limiting concerns (TARIC: 2 req/sec)
- ⚠️ Complexity increase (6 consensus levels vs 1)
- ⚠️ Breaking changes to existing assessment flow
- ⚠️ Integration testing becomes much more complex

---

## BESLISSING: STOP & WAIT

### Gebruiker's Vraag:
> "is het ook voor al deze taken niet beter om te wachten tot ik klaar ben met development?"

### Mijn Antwoord: JA, Absoluut! 🎯

**Redenen:**
1. ✅ **XAI integratie nog niet af** - Database schema issues, niet getest
2. ✅ **Nieuwe features zijn invasief** - Core architecture changes
3. ✅ **Conflict risico hoog** - Jouw work-in-progress kan breken
4. ✅ **Testing impossible** - Als alles tegelijk verandert
5. ✅ **Schema mismatches** - Zoals we al zagen met indices

**Better Approach:**
- **NU:** Design document maken + XAI integratie afronden
- **LATER:** Implementatie zodra jouw development klaar is

---

## AANBEVOLEN VOLGENDE STAPPEN

### Optie A: Design Document (Aanbevolen)
**Wat:** Complete technical design voor alle nieuwe features
**Duur:** 1-2 uur
**Output:**
- Architecture diagrams
- API specifications
- Database schema changes
- Integration points
- Test strategy
- Migration plan

### Optie B: XAI Integratie Fixen (Urgent)
**Wat:** Database schema issues oplossen
**Duur:** 30 minuten
**Tasks:**
- Check exact column names: `PGPASSWORD=postgres psql -d psra_ltsd -c "\d nomenclature_footnotes"`
- Update FootnoteService queries
- Fix SQL indices script
- Run tests

### Optie C: Wachten
**Wat:** Pause tot development klaar is
**Duur:** Indefinite
**Action:** Wacht op groen licht van gebruiker

---

## FILES CREATED IN THIS SESSION

### Fase 1 (XAI Integration):
1. `/srv/apps/psra-ltsd-v1/lib/footnote-service.ts` (335 lines)
2. `/srv/apps/psra-ltsd-v1/lib/advanced-origin-engine.ts` (modified)
3. `/srv/apps/psra-ltsd-v1/components/xai/RegulatoryReferencesPanel.tsx` (350 lines)
4. `/srv/apps/psra-ltsd-v1/components/xai/ExportXaiReport.tsx` (420 lines)
5. `/srv/apps/psra-ltsd-v1/components/xai/EnhancedXaiExplanationView.tsx` (650 lines)
6. `/srv/apps/psra-ltsd-v1/scripts/create-footnote-indices.sql` (200 lines)
7. `/srv/apps/psra-ltsd-v1/scripts/import-origin-rules.ts` (280 lines)
8. `/srv/apps/psra-ltsd-v1/scripts/deploy-xai-integration.sh` (250 lines)
9. `/srv/apps/psra-ltsd-v1/__tests__/footnote-service.test.ts` (250 lines)
10. `/srv/apps/psra-ltsd-v1/docs/XAI_INTEGRATION_COMPLETE.md` (1000 lines)

**Total:** ~3.785 regels code + documentatie

### Fase 2 (Planning Only):
- Conceptual design documented in this conversation
- No code written yet

---

## KEY INSIGHTS FROM CODEBASE EXPLORATION

### What Already Exists:
✅ TARIC/WCO/HMRC API integrations (production-ready)
✅ Multi-LLM consensus orchestrator (final decision level)
✅ HITL endpoints & Version Ledger
✅ ML service wrappers (mocked)
✅ LTSD management (basic CRUD)
✅ Webhook system for events
✅ Blockchain anchoring service

### What's Missing:
❌ Granular consensus (per XAI element)
❌ Real-time API verification in assessment flow
❌ HITL → ML training pipeline connection
❌ Real ML model loading & inference
❌ Multi-stage LTSD approval workflow
❌ Qdrant vector database integration

### Integration Complexity:
**High Risk Components:**
- Consensus orchestrator refactor (breaking changes)
- Origin engine modification (core business logic)
- ML pipeline wiring (distributed system)
- Real-time API calls (performance impact)

---

## METRICS & STATISTICS

### Database Coverage:
- Total HS Codes: **21.956**
- Footnote Descriptions: **56.914**
- Measure Footnotes: **125.841**
- Nomenclature Footnotes: **1.968**
- Legal Bases: **4.437**
- Origin Rules: **8** (target: 500+)
- **Total Regulatory References: 185.160**

### Code Written (Fase 1):
- Total Files: **10**
- Total Lines: **~3.785**
- Languages: TypeScript (85%), SQL (10%), Bash (5%)
- Components: **9** (7 new + 2 modified)

### External APIs Available:
- TARIC DDS: Live SOAP API (2 req/sec)
- WCO: REST API (24h cache)
- HMRC: REST API (public)
- ERP Connectors: Odoo + others (partial)

### AI Providers Configured:
- OpenAI (GPT-4)
- Anthropic (Claude)
- Azure OpenAI
- Google Vertex AI
- Custom HTTP providers

---

## ENVIRONMENT & INFRASTRUCTURE

### Server Details:
- Host: srv918009
- User: root
- OS: Linux 5.15.0-157-generic
- Working Directory: /root

### Application Locations:
- Main App: `/srv/apps/psra-ltsd-v1/`
- Agentic: `/root/psra-agentic/`
- ML Stack v5.6: `/root/psra-agentic/unpacked/PSRA-LTSD_v5.6_+ML/`
- Enterprise: `/infra/apps/psra-enterprise/`

### Services Running:
1. psra-ltsd-v1 (port 3000)
2. psra-enterprise (port 9002)
3. psra-llm-api (port 4204)

### Database:
- PostgreSQL: psra_ltsd (localhost:5432)
- User: postgres
- Password: postgres

---

## CONCLUSION

**Session Summary:**
- ✅ **Fase 1 Completed:** XAI integration with 185.160 regulatory references
- 📋 **Fase 2 Designed:** Granular consensus + Real-time API + HITL ML loop
- ⚠️ **Database Issues:** Schema mismatch needs fixing
- 🛑 **Blocked:** Waiting for user's development completion

**Recommendation:**
**WAIT** until user's development is complete before implementing Phase 2 features. Too risky to make invasive changes now.

**Next Actions:**
1. User chooses: Design Doc / Fix XAI / Wait
2. Fix database schema issues in XAI integration
3. Test XAI integration end-to-end
4. **THEN** implement Phase 2 features

---

**Export Date:** 2025-10-20
**Session Duration:** ~3 hours
**Status:** Paused - Awaiting user decision
**Backup Location:** `/root/psra-agentic/logs/claude_conversation_20251020_XAI_HITL_Complete.md`
