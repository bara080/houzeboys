import { getAllSubscribers } from "@/lib/stats";
import SubscriberTable from "@/components/admin/SubscriberTable";

export default async function SubscribersPage() {
  const subscribers = await getAllSubscribers();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Subscribers</h1>
        <p className="text-sm text-gray-500 mt-1">{subscribers.length} total</p>
      </div>
      <SubscriberTable subscribers={subscribers} />
    </div>
  );
}
