import UserDonationTable from "@/components/UserDonationTable";

export default function Profile() {
  return (
    <div className="px-4 mb-10 max-w-2xl mx-auto w-full lg:px-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Donations</h1>
      <UserDonationTable />
    </div>
  );
}
