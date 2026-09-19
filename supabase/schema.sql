-- ==============================================================================
-- CREDENCE: Alternative Financial Evidence & Credit Intelligence Platform
-- Production PostgreSQL Schema for Supabase
-- ==============================================================================

-- 1. Profiles Table (Identified by authenticated Firebase UID)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    business_name TEXT,
    profile_type TEXT NOT NULL DEFAULT 'Informal Worker', -- 'Informal Worker', 'Micro-Enterprise', 'Gig Worker', 'Self-Employed'
    bureau_status TEXT NOT NULL DEFAULT 'Credit Invisible / Thin-File (CIBIL -1)',
    location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_firebase_uid ON profiles(firebase_uid);

-- 2. Financial Data Sources Table
CREATE TABLE IF NOT EXISTS financial_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid TEXT NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL, -- e.g. 'UPI QR Settlement Feed', 'APMC Mandi Auction Receipts', 'Electricity Utility Invoices'
    source_type TEXT NOT NULL, -- 'UPI', 'Bank', 'Mandi', 'Invoice', 'Utility'
    status TEXT NOT NULL DEFAULT 'Verified', -- 'Verified', 'Pending Review', 'Inactive'
    record_count INT NOT NULL DEFAULT 0,
    evidence_contribution NUMERIC(5,2) NOT NULL DEFAULT 0.0, -- percentage weight
    last_sync TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sources_firebase_uid ON financial_sources(firebase_uid);

-- 3. Granular Financial Records (Transaction & Evidence Ledger)
CREATE TABLE IF NOT EXISTS financial_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid TEXT NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    source_id UUID REFERENCES financial_sources(id) ON DELETE SET NULL,
    record_date DATE NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Retail UPI QR Inflow', 'Mandi Wholesale Procurement', 'Transport & Crate Fee', 'Bulk Commercial Delivery', 'Utility Payment'
    inflow NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    outflow NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    net_buffer NUMERIC(12,2) GENERATED ALWAYS AS (inflow - outflow) STORED,
    transaction_ref TEXT, -- e.g. UTR number, Mandi Lot ID
    receipt_hash TEXT, -- SHA-256 tamper-evident digital fingerprint
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_records_firebase_uid_date ON financial_records(firebase_uid, record_date DESC);
CREATE INDEX IF NOT EXISTS idx_records_category ON financial_records(category);

-- 4. Calculated Financial Profiles (Financial Identity)
CREATE TABLE IF NOT EXISTS financial_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid TEXT NOT NULL UNIQUE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    overall_score INT NOT NULL, -- 300 - 850
    score_grade TEXT NOT NULL, -- 'Prime Alternative (A)', 'Near Prime (B)', 'Emerging (C)', 'Insufficient Data'
    evidence_strength TEXT NOT NULL, -- 'STRONG', 'MODERATE', 'LIMITED', 'INSUFFICIENT'
    evidence_confidence NUMERIC(5,2) NOT NULL DEFAULT 0.0, -- percentage
    cash_flow_stability INT NOT NULL, -- 0 - 100
    payment_consistency INT NOT NULL, -- 0 - 100
    financial_continuity INT NOT NULL, -- 0 - 100
    obligation_behaviour INT NOT NULL, -- 0 - 100
    activity_strength INT NOT NULL, -- 0 - 100
    growth_momentum INT NOT NULL, -- 0 - 100
    dscr NUMERIC(5,2) NOT NULL DEFAULT 1.0, -- Debt Service Coverage Ratio
    liquid_reserve NUMERIC(12,2) NOT NULL DEFAULT 0.0,
    recommended_loan_limit NUMERIC(12,2) NOT NULL DEFAULT 0.0,
    daily_repayment_capacity NUMERIC(12,2) NOT NULL DEFAULT 0.0,
    observation_days INT NOT NULL DEFAULT 30,
    metrics_detail JSONB,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fin_profiles_firebase_uid ON financial_profiles(firebase_uid);

-- 5. Explainable Evidence Items (Why this result?)
CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid TEXT NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    signal_key TEXT NOT NULL, -- 'cash_flow_stability', 'payment_consistency', etc.
    title TEXT NOT NULL,
    observation TEXT NOT NULL,
    evidence_description TEXT NOT NULL,
    interpretation TEXT NOT NULL,
    source_record_refs JSONB DEFAULT '[]'::jsonb,
    strength TEXT NOT NULL DEFAULT 'STRONG', -- 'STRONG', 'MODERATE', 'LIMITED'
    confidence INT NOT NULL DEFAULT 90,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_firebase_uid ON evidence(firebase_uid, signal_key);

-- 6. Analysis History & Auditability
CREATE TABLE IF NOT EXISTS analysis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid TEXT NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    evidence_strength TEXT NOT NULL,
    methodology_version TEXT NOT NULL DEFAULT 'CREDENCE-v2.4-ExplainableEngine',
    input_records_count INT NOT NULL,
    summary_explanation TEXT NOT NULL,
    metrics_snapshot JSONB NOT NULL,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_history_firebase_uid ON analysis_history(firebase_uid, calculated_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures users can only access records tagged with their own firebase_uid
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;
