export interface Profile {
    id: string;
    full_name: string | null;
    payment_details: string | null;
    updated_at: string;
}

export type DealStatus = 'lead' | 'working' | 'paid';

export interface Deal {
    id: string;
    user_id: string;
    brand_name: string;
    contact_email: string;
    price: number;
    status: DealStatus;
    due_date: string | null;
    created_at: string;
    updated_at: string;
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
