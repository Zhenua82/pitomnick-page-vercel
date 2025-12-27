// handler.ts
import emailjs from "emailjs-com";
import type { CartItem } from "@/store/cartSlice";

type SendOrderArgs = {
  phone: string;
  items: CartItem[];
  totalPrice: number;
};

export default function sendOrderEmail({
  phone,
  items,
  totalPrice,
}: SendOrderArgs) {
  const itemsText = items
    .map(
      (item) =>
        `${item.title} — ${item.age} — ${item.quantity} шт. × ${item.price} руб. = ${
          item.quantity * item.price
        } руб.`
    )
    .join("\n");

  const message = `
Новый заказ:

${itemsText}

Телефон: ${phone}
`;

  return emailjs.send(
    "service_jlm6w7f",
    "template_ddrlpjq",
    {
      message,
      phone,
      totalPrice,
    },
    "CG3fsUNnH-k49lpDK"
  );
}

