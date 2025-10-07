// import { SubscriberArgs, SubscriberConfig } from "@shopenup/framework"
// // import { Modules } from "@shopenup/framework/utils"

// export default async function orderPlacedEmailHandler({
//   event: { data },
//   container,
// }: SubscriberArgs<{ id: string }>) {

// //   const notificationModuleService = container.resolve(Modules.NOTIFICATION)
//   const query = container.resolve("query")
//   const notificationModuleService = container.resolve("notification")
//   const currencyModuleService = container.resolve("currency")


//   // Retrieve order details
//   const { data: [order] } = await query.graph({
//     entity: "order",
//     fields: [
//       "id",
//       "display_id",
//       "created_at",
//       "currency_code",
//       "total",
//       "original_total",
//       "original_subtotal",
//       "original_item_subtotal",
//       "email",
//       "items.*",
//       "items.variant.*",
//       "items.variant.product.*",
//       "shipping_address.*",
//       "billing_address.*",
//       "shipping_methods.*",
//       "tax_total",
//       "subtotal",
//       "discount_total",
//       // add any other fields you need for the email template...
//     ],
//     filters: { id: data.id },
//   })
  
//   const currency = await currencyModuleService.retrieveCurrency(order.currency_code)



//   await notificationModuleService.createNotifications({
//     to: order.email || "",
//     template: "order-placed", // Back to original template name
//     channel: "email",
//     data: {
//         order_id: order.id,
//             first_name: order.shipping_address.first_name,
//             last_name: order.shipping_address.last_name,
//             address_1: order.shipping_address.address_1,
//             address_2: order.shipping_address.address_2,
//             phone: order.shipping_address.phone,
//             billing_first_name: order.billing_address.first_name,
//             billing_last_name: order.billing_address.last_name,
//             billing_address_1: order.billing_address.address_1,
//             billing_address_2: order.billing_address.address_2,
//             billing_phone: order.billing_address.phone,
//             currency_symbol: currency.symbol_native,
//             subtotal: order.original_item_subtotal,
//             discount_total: order.discount_total,
//             shipping_method: order.shipping_methods[0].name,
//             shipping_amount: order.shipping_methods[0].amount,
//             tax_total: order.tax_total,
//             total: order.total,
//     }
//   })
// }           

// export const config: SubscriberConfig = {
//   event: "order.placed",        
// }


import { SubscriberArgs, SubscriberConfig } from "@shopenup/framework"

export default async function orderPlacedEmailHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query")
  const notificationModuleService = container.resolve("notification")
  const currencyModuleService = container.resolve("currency")

  // Retrieve order details
  const { data: [order] } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "created_at",
      "currency_code",
      "total",
      "original_total",
      "original_subtotal",
      "original_item_subtotal",
      "email",
      "items.*",
      "items.variant.*",
      "items.variant.product.*",
      "shipping_address.*",
      "billing_address.*",
      "shipping_methods.*",
      "tax_total",
      "subtotal",
      "discount_total",
    ],
    filters: { id: data.id },
  })

  const currency = await currencyModuleService.retrieveCurrency(order.currency_code)

    // Map items into structured format
  const items = order.items.map(item => ({
    name: item.title || item.variant?.product?.title,
    quantity: item.quantity,
    unit_price: item.unit_price, // price per unit
    line_total: item.subtotal, // total for that line
  }))
  console.log("items",items)

  await notificationModuleService.createNotifications({
    to: order.email || "",
    template: "order-placed", // Must match your template filename (without extension)
    channel: "email",
    data: {
      subject: "Order Confirmation",
      order_id: order.id,
      first_name: order.shipping_address.first_name,
      last_name: order.shipping_address.last_name,
      address_1: order.shipping_address.address_1,
      address_2: order.shipping_address.address_2,
      phone: order.shipping_address.phone,
      billing_first_name: order.billing_address.first_name,
      billing_last_name: order.billing_address.last_name,
      billing_address_1: order.billing_address.address_1,
      billing_address_2: order.billing_address.address_2,
      billing_phone: order.billing_address.phone,
      currency_symbol: currency.symbol_native,
      subtotal: order.original_item_subtotal,
      discount_total: order.discount_total,
      shipping_method: order.shipping_methods[0].name,
      shipping_amount: order.shipping_methods[0].amount,
      tax_total: order.tax_total,
      total: order.total,
      item_names: order.items.map(item => item.variant.product.title),
      items
    }
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}