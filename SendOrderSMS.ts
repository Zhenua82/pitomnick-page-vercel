type OrderItem = {
  title: string;
  quantity: number;
  price: number;
  age: string;
};

type SendOrderSMSParams = {
  phone: string;
  items: OrderItem[];
  totalPrice: number;
};

const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN as string;
const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID as string;

export default async function sendOrderSMS({
  phone,
  items,
  totalPrice,
}: SendOrderSMSParams) {
  const itemsText = items
    .map(
      (item) =>
        `• ${item.title} — ${item.age} - ${item.quantity} шт. × ${item.price} ₽`
    )
    .join("\n");

  const message = `
📦 Новый заказ!

📞 Телефон:
${phone}

🛒 Товары:
${itemsText}

💰 Итого:
${totalPrice} ₽
  `;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    throw new Error("Ошибка отправки сообщения в Telegram");
  }
}
