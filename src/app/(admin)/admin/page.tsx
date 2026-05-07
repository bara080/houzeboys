import StatCards from "@/components/admin/StatCards";
import SignupChart from "@/components/admin/SignupChart";
import VisitorChart from "@/components/admin/VisitorChart";
import SubscriberTable from "@/components/admin/SubscriberTable";
import { getDailySignups, getAllSubscribers } from "@/lib/stats";
import { getDailyVisitors } from "@/lib/analytics";

export default async function AdminPage() {
  const [signupData, visitorData, subscribers] = await Promise.all([
    getDailySignups(30),
    getDailyVisitors(30),
    getAllSubscribers(),
  ]);

  const recent = subscribers.slice(0, 5);

  return (
    <div className="space-y-6">
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SignupChart data={signupData} />
        <VisitorChart data={visitorData} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Recent Subscribers</p>
          <a href="/admin/subscribers" className="text-xs text-gray-500 hover:text-white transition-colors">
            View all →
          </a>
        </div>
        <SubscriberTable subscribers={recent} />
      </div>
    </div>
  );
}
