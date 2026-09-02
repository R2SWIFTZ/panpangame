import { isAdminRequest } from "@/lib/auth";
import { readProducts } from "@/lib/store";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = { title: "หลังบ้าน — panpangame", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) return <AdminLogin />;
  const products = await readProducts();
  return <AdminDashboard initialProducts={products} />;
}
