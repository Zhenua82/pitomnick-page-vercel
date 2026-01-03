import { GetServerSideProps } from "next";
import AdminPlants from "@/components/admin/AdminPlants";
import Link from "next/link";

export default function AdminPlantsPage() {
  return (
    <main style={{ padding: 24 }}>
        <Link href="/admin" style={{textDecoration: 'none', fontSize: '36px'}}>
           ← Назад
      </Link>
      <h1>Управление растениями</h1>
      <AdminPlants />
    </main>
  );
}

// защита админки
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (req.cookies["admin-auth"] !== "true") {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
