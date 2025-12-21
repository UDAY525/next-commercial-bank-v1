import UserDonationTable from "@/components/UserDonationTable";
import UserDonationPieChart from "@/components/graph-visuals/user-donation-piechart";
export default function Profile() {
  return (
    <div className="px-4 mb-10 max-w-2xl mx-auto w-full lg:px-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Donations</h1>

      <div className="flex flex-col gap-y-4 justify-center items-center w-full">
        <UserDonationPieChart />
        <UserDonationTable />
      </div>
    </div>
  );
}
