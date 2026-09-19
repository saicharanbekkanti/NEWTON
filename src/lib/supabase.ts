import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ylcqsftoljmasrtjcmeq.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QT3JDEeeGIzq7x-yQtVt6A_bGrD4Mgf';

// Initialize Supabase Client
export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

export const isSupabaseConfigured = (): boolean => {
    return Boolean(SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 20);
};

export interface StoredFinancialRecord {
    id: string;
    firebase_uid: string;
    record_date: string;
    description: string;
    category: string;
    inflow: number;
    outflow: number;
    net_buffer: number;
    transaction_ref: string;
    receipt_hash?: string;
    is_recurring?: boolean;
    created_at?: string;
}

export interface StoredSource {
    id: string;
    firebase_uid: string;
    source_name: string;
    source_type: string;
    status: string;
    record_count: number;
    evidence_contribution: number;
    last_sync: string;
}

export interface StoredAnalysisHistory {
    id: string;
    firebase_uid: string;
    overall_score: number;
    evidence_strength: string;
    methodology_version: string;
    input_records_count: number;
    summary_explanation: string;
    metrics_snapshot: any;
    calculated_at: string;
}

// Resilient Fallback Storage Helpers (Ensures 100% offline & demo reliability)
const getLocalKey = (table: string, uid: string) => `credence_${table}_${uid}`;

export const dbService = {
    // --- FINANCIAL RECORDS ---
    async getRecords(firebaseUid: string): Promise<StoredFinancialRecord[]> {
        if (isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase
                    .from('financial_records')
                    .select('*')
                    .eq('firebase_uid', firebaseUid)
                    .order('record_date', { ascending: false });
                if (!error && data) return data as StoredFinancialRecord[];
            } catch (err) {
                console.warn('Supabase fetch failed, checking local store:', err);
            }
        }
        // Fallback to local store
        const raw = localStorage.getItem(getLocalKey('records', firebaseUid));
        return raw ? JSON.parse(raw) : [];
    },

    async saveRecords(firebaseUid: string, records: Omit<StoredFinancialRecord, 'id'>[]): Promise<StoredFinancialRecord[]> {
        const timestamped = records.map(r => ({
            ...r,
            id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            firebase_uid: firebaseUid,
            created_at: new Date().toISOString()
        }));

        if (isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase
                    .from('financial_records')
                    .insert(timestamped)
                    .select();
                if (!error && data) return data as StoredFinancialRecord[];
            } catch (err) {
                console.warn('Supabase insert failed, saving to local store:', err);
            }
        }

        // Local fallback
        const existing = await this.getRecords(firebaseUid);
        const combined = [...timestamped, ...existing];
        localStorage.setItem(getLocalKey('records', firebaseUid), JSON.stringify(combined));
        return combined;
    },

    // --- FINANCIAL SOURCES ---
    async getSources(firebaseUid: string): Promise<StoredSource[]> {
        if (isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase
                    .from('financial_sources')
                    .select('*')
                    .eq('firebase_uid', firebaseUid);
                if (!error && data && data.length > 0) return data as StoredSource[];
            } catch {
                // fallback
            }
        }
        const raw = localStorage.getItem(getLocalKey('sources', firebaseUid));
        return raw ? JSON.parse(raw) : [];
    },

    async saveSource(firebaseUid: string, source: Omit<StoredSource, 'id'>): Promise<StoredSource> {
        const item: StoredSource = {
            ...source,
            id: `src_${Date.now()}`,
            firebase_uid: firebaseUid,
            last_sync: new Date().toISOString()
        };

        if (isSupabaseConfigured()) {
            try {
                const { data } = await supabase
                    .from('financial_sources')
                    .insert([item])
                    .select();
                if (data && data[0]) return data[0] as StoredSource;
            } catch {
                // fallback
            }
        }

        const existing = await this.getSources(firebaseUid);
        const updated = [item, ...existing.filter(s => s.source_name !== item.source_name)];
        localStorage.setItem(getLocalKey('sources', firebaseUid), JSON.stringify(updated));
        return item;
    },

    // --- ANALYSIS HISTORY ---
    async getHistory(firebaseUid: string): Promise<StoredAnalysisHistory[]> {
        if (isSupabaseConfigured()) {
            try {
                const { data } = await supabase
                    .from('analysis_history')
                    .select('*')
                    .eq('firebase_uid', firebaseUid)
                    .order('calculated_at', { ascending: false });
                if (data) return data as StoredAnalysisHistory[];
            } catch {
                // fallback
            }
        }
        const raw = localStorage.getItem(getLocalKey('history', firebaseUid));
        return raw ? JSON.parse(raw) : [];
    },

    async logAnalysis(firebaseUid: string, entry: Omit<StoredAnalysisHistory, 'id' | 'calculated_at'>): Promise<StoredAnalysisHistory> {
        const fullEntry: StoredAnalysisHistory = {
            ...entry,
            id: `hist_${Date.now()}`,
            firebase_uid: firebaseUid,
            calculated_at: new Date().toISOString()
        };

        if (isSupabaseConfigured()) {
            try {
                await supabase.from('analysis_history').insert([fullEntry]);
            } catch {
                // ignore
            }
        }

        const existing = await this.getHistory(firebaseUid);
        const updated = [fullEntry, ...existing.slice(0, 19)]; // keep latest 20
        localStorage.setItem(getLocalKey('history', firebaseUid), JSON.stringify(updated));
        return fullEntry;
    }
};
