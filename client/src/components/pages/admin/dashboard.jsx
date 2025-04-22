import UserManagement from './UserManagement';

export default function Dashboard() {
  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        {/* Dashboard content would go here */}
        <UserManagement />
      </div>
    </main>
  );
}
