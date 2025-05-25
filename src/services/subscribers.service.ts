import subscriptionsData from '@/mocks/subscriptions.json';
import usersData from '@/mocks/users.json';
import type { Subscriber, Subscription, SubscriptionPlan, User } from '@/pages/subscribers-dashboard/subscriber.types';

export const getCombinedSubscribers = (): Subscriber[] => {
  const subscriptions: Subscription[] = subscriptionsData.map(sub => ({
    ...sub,
    package: sub.package as SubscriptionPlan
  }));
  const users: User[] = usersData;

  return subscriptions.map(sub => {
    console.log({ sub })
    const user = users.find(u => u.id === Number(sub.user_id));
    const expiresOn = new Date(sub.expires_on);
    const status = user?.active ? 'Active' : 'Expired';
    const joinDate = (() => {
      const ts = Number(user?.join_date);
      return isNaN(ts) ? new Date() : new Date(ts * 1000);
    })();


    return {
      id: sub.id.toString(),
      name: user ? `${user.first_name} ${user.last_name}` : `User ${sub.user_id}`,
      email: user?.email || 'unknown@example.com',
      plan: sub.package,
      status,
      expiresOn,
      joinDate,
      country: user?.country || 'Unknown'
    };
  });
};