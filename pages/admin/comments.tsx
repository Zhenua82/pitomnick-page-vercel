import AdminComments from "@/components/admin/AdminComments";
import { GetServerSideProps } from "next";
import Link from "next/link";

const AdminCommentsPage = () => {
  return (
    <main style={{ padding: "40px 16px" }}>
      <Link href="/admin" style={{textDecoration: 'none', fontSize: '36px'}}>
           ← Назад
      </Link>
      <h1 style={{ textAlign: "center" }}>Модерация комментариев</h1>
      <AdminComments />
    </main>
  );
};
// Защита страницы
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

export default AdminCommentsPage;
