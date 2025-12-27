import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const ErrorPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    // Очистка таймера при разгрузке компонента
    return () => clearTimeout(timer);
  }, [router]);

  return (<>
  <Head>
        <title>Страница 404 Питомника хвойных растений в Анапе</title>
        <meta
          name="description" content="Описание страницы 404 Питомника хвойных растений в Анапе"
        />
  </Head>
  <h1 style={{color: 'red', textAlign: 'center', marginTop: '10%', marginBottom: '3%'}}>Страница 404</h1> 
  <h2 style={{color: 'blue', textAlign: 'center'}}>Такого адреса на сайте питомника хвойных растений Анапы - не существует, через 5 секунд Вы будете автоматически перенаправлены 
    на главную страницу этого сайта</h2>
    </>)
};

export default ErrorPage;