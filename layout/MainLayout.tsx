import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import TopBar from "../components/TopBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Global Header */}
      <Header />

      {/* Global TopBar */}
      <TopBar />

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
