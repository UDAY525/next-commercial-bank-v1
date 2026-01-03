import UserDonationTable from "@/components/UserDonationTable";
import UserDonationPieChart from "@/components/graph-visuals/user-donation-piechart";
export default function Profile() {
  return (
    <div className="mb-10 mx-auto w-full">
      <div className="flex flex-col gap-y-4 justify-center items-center w-full">
        <UserDonationPieChart />
        <h1 className="text-2xl font-bold mb-6 text-center">Your Donations</h1>
        <UserDonationTable />
      </div>
    </div>
  );
}
