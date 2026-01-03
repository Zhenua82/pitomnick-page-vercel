import { GetServerSideProps } from "next";
import Link from "next/link";

const AdminPage = () => {
  return (
    <>
    <h1 style={{ display: 'flex', justifyContent: 'center',marginTop: '30px' }}>Администрирование сайта:</h1>
    <main style={{ padding: "40px 16px", display: 'flex', justifyContent: 'space-around' }}>   
      <Link href="/admin/comments" style={{textDecoration: 'none', fontSize: '32px'}}>
           Модерация комментариев
      </Link>
      <Link href="/admin/plants" style={{textDecoration: 'none', fontSize: '32px'}}>
           Модерация товара (растений)
      </Link>
    </main>
    </>
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
