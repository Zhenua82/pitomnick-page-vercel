import AdminComments from "@/components/AdminComments";
import { GetServerSideProps } from "next";

const AdminPage = () => {
  return (
    <main style={{ padding: "40px 16px" }}>
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

export default AdminPage;
