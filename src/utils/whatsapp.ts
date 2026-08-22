import { Order, ShopSettings } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const generateWhatsAppOrderMessage = (order: Order, shopSettings?: ShopSettings): string => {
  const shopName = shopSettings?.shopName || 'Sri Meenakshi Sivakasi Fireworks';

  const productList = order.items
    .map((item, index) => {
      const line1 = `${index + 1}. ${item.productName} × ${item.quantity}`;
      const line2 = `   ${formatCurrency(item.subtotal)}`;
      return `${line1}\n${line2}`;
    })
    .join('\n\n');

  const message = `🎆 NEW ORDER - ${shopName}

Order ID: ${order.orderNumber}

Customer:
${order.customer.fullName}

Mobile:
${order.customer.mobile}${order.customer.whatsapp && order.customer.whatsapp !== order.customer.mobile ? `\nWhatsApp: ${order.customer.whatsapp}` : ''}

Delivery Address:
${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}
${order.customer.notes ? `\nCustomer Notes:\n"${order.customer.notes}"` : ''}

Products:

${productList}

Estimated Total:
${formatCurrency(order.totalAmount)}
${order.totalSavings > 0 ? `(You saved ${formatCurrency(order.totalSavings)} on factory discount!)` : ''}

Payment: To be confirmed by shop

Please confirm my order and share bank/UPI details or delivery schedule.`;

  return message;
};

export const DEFAULT_WHATSAPP_NUMBER = '918122580372';
export const DEFAULT_PHONE_DISPLAY = '+91 81225 80372';

export const normalizeWhatsAppPhone = (phone?: string): string => {
  if (!phone) return DEFAULT_WHATSAPP_NUMBER;
  let clean = phone.replace(/[^0-9]/g, '');
  if (!clean) return DEFAULT_WHATSAPP_NUMBER;

  // If user entered 10 digits (e.g. 8122580372), prepend India country code 91
  if (clean.length === 10) {
    return `91${clean}`;
  }
  // If user entered 11 digits starting with 0 (e.g. 08122580372), replace leading 0 with 91
  if (clean.length === 11 && clean.startsWith('0')) {
    return `91${clean.slice(1)}`;
  }
  // If user entered with 91 (e.g. 918122580372), use it directly
  return clean;
};

export const getWhatsAppUrl = (phone: string, text: string): string => {
  const cleanPhone = normalizeWhatsAppPhone(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};

export const generateQuickEnquiryMessage = (productName?: string, shopName = 'Sri Meenakshi Sivakasi Fireworks'): string => {
  if (productName) {
    return `Hello ${shopName}, I would like to inquire about "${productName}". Please let me know current availability and festive discount!`;
  }
  return `Hello ${shopName}, I am interested in purchasing Sivakasi fireworks for the upcoming festival. Please share your complete price catalogue and delivery information.`;
};
