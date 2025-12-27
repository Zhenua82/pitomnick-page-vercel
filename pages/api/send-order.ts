import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import type { CartItem } from "@/store/cartSlice";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    // console.log("ENV PASS:", process.env.YANDEX_SMTP_PASSWORD);
    // console.log("ENV PASS:", process.env.NODE_ENV);
    // if (process.env.NODE_ENV === 'production') {
    //   return res.status(403).json({
    //     error: 'Отправка заказа недоступна в production'
    //   });
    // }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не разрешён" });
  }

  try {
    const { phone, items, totalPrice } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Введите телефон" });
    }

    // Формируем текст письма
    const itemsText = items
      .map(
        (item: CartItem) =>
          `${item.title} — ${item.age} - ${item.quantity} шт. × ${item.price} руб. = ${
            item.quantity * item.price
          } руб.`
      )
      .join("\n");

    const messageText = `
Новый заказ с сайта:

Товары:
${itemsText}

ИТОГО: ${totalPrice} руб.

Телефон клиента: ${phone}
    `;

    // SMTP Яндекс
    const transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true,
      auth: {
        user: "zzhmenka@yandex.ru",
        pass: process.env.YANDEX_SMTP_PASSWORD as string, // пароль приложения Яндекс
      },
    });

    await transporter.sendMail({
      from: "zzhmenka@yandex.ru",
      to: "zzhmenka@yandex.ru",
      subject: "Новый заказ с сайта",
      text: messageText,
    });

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("Mail error:", e);
    return res.status(500).json({ error: "Ошибка на сервере" });
  }
}
