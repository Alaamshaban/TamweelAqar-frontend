
export interface Offer {
    active: boolean;
    id: number;
    founder: Founder;
    minimum_down_payment: string;
    required_salary: string;
    admin_fees: string;
    max_period: string;
    early_payment_fees: string;
    monthly_payment: string;
    views: number;
}

export interface Offers {
    eligible: Offer[],
    not_eligible: Offer[]
}

export interface Founder {
    founder_name: string,
    founder_logo: string,
    phone_number: string;
    email: string;
    website: string;
}