export interface Profile {
    id: string;
    email: string | null;
    full_name: string | null;
    payment_details: string | null;
    instagram_handle: string | null;
    tiktok_handle: string | null;
    bank_name: string | null;
    account_number: string | null;
    routing_number: string | null;
    updated_at: string;
    // Application Fields
    application_status: 'pending' | 'approved' | 'rejected' | null;
    social_handle: string | null;
    brand_deals_count: string | null;
    biggest_deal_size: string | null;
    is_agency_represented: boolean | null;
    is_admin: boolean | null;
    revenue_goal: number | null;
}

export type DealStatus = 'lead' | 'working' | 'paid';

export interface Deal {
    id: string;
    user_id: string;
    brand_name: string;
    contact_email: string;
    price: number;
    status: DealStatus;
    platform: string;
    due_date: string | null;
    created_at: string;
    updated_at: string;
    deliverables?: Deliverable[];
}

export interface Deliverable {
    id: string;
    deal_id: string;
    label: string;
    proof_url: string | null;
    completed: boolean;
    created_at: string;
}

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'updated_at'>;
                Update: Partial<Omit<Profile, 'id'>>;
            };
            deals: {
                Row: Deal;
                Insert: Omit<Deal, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Deal, 'id' | 'user_id' | 'created_at'>>;
            };
        };
    };
}
