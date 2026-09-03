import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './Header';

export default function DashboardShell() {
  return (
    <div className="min-h-screen bg-background-50">
      <Sidebar />
      <DashboardHeader />
      <main className="lg:pl-64 pt-0 lg:pt-0">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}