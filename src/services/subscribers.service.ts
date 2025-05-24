import type { Subscription, User, Subscriber, SubscriptionPlan } from '@/types/subscriber';
import subscriptionsData from '@/mocks/subscriptions.json';
import usersData from '@/mocks/users.json';

export const getCombinedSubscribers = (): Subscriber[] => {
  const subscriptions: Subscription[] = subscriptionsData.map(sub => ({
    ...sub,
    package: sub.package as SubscriptionPlan
  }));
  const users: User[] = usersData;

  return subscriptions.map(sub => {
    const user = users.find(u => u.id === parseInt(sub.user_id));
    const expiresOn = new Date(sub.expires_on);
    const status = user?.active ? 'Active' : 'Expired';

    const revenue = calculateRevenue(sub.package);

    return {
      id: sub.id.toString(),
      name: user ? `${user.first_name} ${user.last_name}` : `User ${sub.user_id}`,
      email: user?.email || 'unknown@example.com',
      plan: sub.package,
      status,
      expiresOn,
      joinDate: user ? new Date(parseInt(user.join_date) * 1000) : new Date(),
      country: user?.country || 'Unknown',
      revenue
    };
  });
};

//here I set assumption plan price.
const calculateRevenue = (plan: SubscriptionPlan): number => {
  const planPrices: Record<SubscriptionPlan, number> = {
    'Plan 1': 9.99,
    'Plan 2': 19.99,
    'Plan3': 29.99,
    'Plan 6': 49.99,
    'Plan 12': 99.99,
    'Plan Unlimited': 199.99
  };
  return planPrices[plan] || 0;
};