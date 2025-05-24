export type SubscriptionPlan = 'Plan 1' | 'Plan 2' | 'Plan3' | 'Plan 6' | 'Plan 12' | 'Plan Unlimited';

export interface Subscription {
  id: number;
  user_id: string;
  package: SubscriptionPlan;
  expires_on: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  active: string;
  country: string;
  join_date: string;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  plan: SubscriptionPlan;
  status: 'Active' | 'Expired';
  expiresOn: Date;
  joinDate: Date;
  country: string;
}

export type SortField = 'name' | 'email' | 'plan' | 'status' | 'expiresOn' | 'joinDate' | 'revenue';
export type SortDirection = 'asc' | 'desc';