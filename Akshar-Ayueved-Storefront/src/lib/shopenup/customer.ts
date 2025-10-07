import { z } from "zod"
import { redirect } from "next/navigation"
import { HttpTypes } from "@shopenup/types"

import { sdk } from "@lib/config"
import {
  getAuthHeaders,
  setAuthToken,
  getCartId,
  clearAuthDataOnly,
} from "@lib/shopenup/cookies"
import {
  customerAddressSchema,
  loginFormSchema,
  signupFormSchema,
  updateCustomerFormSchema,
} from "hooks/customer"

// Client-side compatible revalidation function
const revalidateTag = (_tag: string) => {
  // In client-side context, we'll trigger a page refresh or use other methods
  if (typeof window !== 'undefined') {
    // Optionally trigger a page refresh or use other client-side cache invalidation
  }
}

export const getCustomer = async function () {
  return await sdk.client
    .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
      next: { tags: ["customer"] },
      headers: { ...(await getAuthHeaders()) },
      cache: "no-store",
    })
    .then(({ customer }) => customer)
    .catch(() => null)
}

export const updateCustomer = async function (
  formData: z.infer<typeof updateCustomerFormSchema>
): Promise<
  { state: "initial" | "success" } | { state: "error"; error: string }
> {
  return sdk.store.customer
    .update(
      {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone ?? undefined,
      },
      {},
      await getAuthHeaders()
    )
    .then(() => {
      revalidateTag("customer")
      return {
        state: "success" as const,
      }
    })
    .catch(() => {
      revalidateTag("customer")
      return {
        state: "error" as const,
        error: "Failed to update customer personal information",
      }
    })
}

export async function signup(formData: z.infer<typeof signupFormSchema>) {
  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: formData.email,
      password: formData.password,
    })

    const customHeaders = { authorization: `Bearer ${token}` }

    const { customer: createdCustomer } = await sdk.store.customer.create(
      {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone ?? undefined,
      },
      {},
      customHeaders
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: formData.email,
      password: formData.password,
    })

    if (typeof loginToken === "object") {
      redirect(loginToken.location)

      return { success: true, customer: createdCustomer }
    }

    await setAuthToken(loginToken)

    await sdk.client.fetch("/store/custom/customer/send-welcome-email", {
      method: "POST",
      headers: await getAuthHeaders(),
    })

    revalidateTag("customer")

    const cartId = await getCartId()
    if (cartId) {
      await sdk.store.cart.transferCart(cartId, {}, await getAuthHeaders())
      revalidateTag("cart")
    }

    return { success: true, customer: createdCustomer }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : `${error}`,
    }
  }
}

export async function login(formData: z.infer<typeof loginFormSchema>) {
  const redirectUrl = formData.redirect_url

  try {
    const token = await sdk.auth.login("customer", "emailpass", {
      email: formData.email,
      password: formData.password,
    })

    if (typeof token === "object") {
      return { success: true, redirectUrl: token.location }
    }

    await setAuthToken(token)
    revalidateTag("customer")

    // Import cart sync function dynamically to avoid circular dependencies
    const { syncCartOnLogin } = await import("./cart-sync")
    
    // Sync cart on login
    const cartSyncResult = await syncCartOnLogin()
    if (!cartSyncResult.success) {
      console.warn('⚠️ Cart sync failed on login:', cartSyncResult.message)
    }
    
    revalidateTag("cart")
    
    // Also invalidate React Query cache for cart
    if (typeof window !== 'undefined') {
      // Import queryClient dynamically to avoid circular dependencies
      const { useQueryClient } = await import('@tanstack/react-query')
      // Note: This won't work in server context, but will work in client context
    }
    return { success: true, redirectUrl: redirectUrl || "/" }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : `${error}`,
    }
  }
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()
  
  // Import cart sync function dynamically to avoid circular dependencies
  const { clearCartOnLogout } = await import("./cart-sync")
  
  // Clear cart data on logout
  await clearCartOnLogout()
  await clearAuthDataOnly()
  revalidateTag("customer")
  // try {
  //   const { clearCartEmail } = await import("./cart")
  //   await clearCartEmail()
  // } catch (error) {
  //   console.warn('⚠️ Failed to clear cart email on signout:', error)
  // }
  // Don't revalidate cart - keep cart data
  // revalidateTag("cart")
  return countryCode
}

export const addCustomerAddress = async (
  formData: z.infer<typeof customerAddressSchema>
) => {
  return sdk.store.customer
    .createAddress(
      {
        first_name: formData.first_name,
        last_name: formData.last_name,
        company: formData.company ?? undefined,
        address_1: formData.address_1,
        address_2: formData.address_2 ?? undefined,
        city: formData.city,
        postal_code: formData.postal_code,
        province: formData.province ?? undefined,
        country_code: formData.country_code,
        phone: formData.phone ?? undefined,
      },
      {},
      await getAuthHeaders()
    )
    .then(({ customer }) => {
      revalidateTag("customer")
      return {
        addressId: customer.addresses[customer.addresses.length - 1].id,
        success: true,
        error: null,
      }
    })
    .catch((err) => {
      revalidateTag("customer")
      return { addressId: "", success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (
  addressId: unknown
): Promise<void> => {
  if (typeof addressId !== "string") {
    throw new Error("Invalid input data")
  }

  await sdk.store.customer
    .deleteAddress(addressId, await getAuthHeaders())
    .then(() => {
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
  revalidateTag("customer")
}

export const updateCustomerAddress = async (
  addressId: string,
  formData: z.infer<typeof customerAddressSchema>
) => {
  if (!addressId) {
    throw new Error("Invalid input data")
  }

  return sdk.store.customer
    .updateAddress(
      addressId,
      {
        first_name: formData.first_name,
        last_name: formData.last_name,
        company: formData.company ?? undefined,
        address_1: formData.address_1,
        address_2: formData.address_2 ?? undefined,
        city: formData.city,
        postal_code: formData.postal_code,
        province: formData.province ?? undefined,
        country_code: formData.country_code,
        phone: formData.phone ?? undefined,
      },
      {},
      await getAuthHeaders()
    )
    .then(() => {
      revalidateTag("customer")
      return { addressId, success: true, error: null }
    })
    .catch((err) => {
      revalidateTag("customer")
      return { addressId, success: false, error: err.toString() }
    })
}

export async function requestPasswordReset() {
  const customer = await getCustomer()

  if (!customer) {
    return {
      success: false as const,
      error: "No customer found",
    }
  }
  await sdk.auth.resetPassword("logged-in-customer", "emailpass", {
    identifier: customer.email,
  })

  return {
    success: true as const,
  }
}

const resetPasswordStateSchema = z.object({
  email: z.string().email(),
  token: z.string(),
})

const resetPasswordFormSchema = z.object({
  type: z.literal("reset"),
  current_password: z.string().min(6),
  new_password: z.string().min(6),
  confirm_new_password: z.string().min(6),
})

const forgotPasswordSchema = z.object({
  type: z.literal("forgot"),
  new_password: z.string().min(6),
  confirm_new_password: z.string().min(6),
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const baseSchema = z.discriminatedUnion("type", [
  resetPasswordFormSchema,
  forgotPasswordSchema,
])

export async function resetPassword(
  currentState: unknown,
  formData: z.infer<typeof baseSchema>
): Promise<
  z.infer<typeof resetPasswordStateSchema> &
    ({ state: "initial" | "success" } | { state: "error"; error: string })
> {
  const validatedState = resetPasswordStateSchema.parse(currentState)
  if (formData.type === "reset") {
    try {
      await sdk.auth.login("customer", "emailpass", {
        email: validatedState.email,
        password: formData.current_password,
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        ...validatedState,
        state: "error" as const,
        error: "Wrong password",
      }
    }
  }
  return sdk.auth
    .updateProvider(
      formData.type === "reset" ? "logged-in-customer" : "customer",
      "emailpass",
      {
        email: validatedState.email,
        password: formData.new_password,
      },
      validatedState.token
    )
    .then(() => {
      return {
        ...validatedState,
        state: "success" as const,
      }
    })
    .catch(() => {
      return {
        ...validatedState,
        state: "error" as const,
        error: "Failed to update password",
      }
    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const forgotPasswordFormSchema = z.object({
  email: z.string().email(),
})

export async function forgotPassword(
  _currentState: unknown,
  formData: z.infer<typeof forgotPasswordFormSchema>
): Promise<
  { state: "initial" | "success" } | { state: "error"; error: string }
> {
  return sdk.auth
    .resetPassword("customer", "emailpass", {
      identifier: formData.email,
    })
    .then(() => {
      return {
        state: "success" as const,
      }
    })
    .catch(() => {
      return {
        state: "error" as const,
        error: "Failed to reset password",
      }
    })
}

export async function updateDefaultShippingAddress(addressId: string) {
  if (!addressId) {
    return { success: false, error: "No address id provided" }
  }

  return sdk.store.customer
    .updateAddress(
      addressId,
      {
        is_default_shipping: true,
      },
      {},
      await getAuthHeaders()
    )
    .then(() => {
      revalidateTag("customer")
      return { success: true, error: null }
    })
    .catch((err) => {
      revalidateTag("customer")
      return { success: false, error: err.toString() }
    })
}

export async function updateDefaultBillingAddress(addressId: string) {
  if (!addressId) {
    return { success: false, error: "No address id provided" }
  }

  return sdk.store.customer
    .updateAddress(
      addressId,
      {
        is_default_billing: true,
      },
      {},
      await getAuthHeaders()
    )
    .then(() => {
      revalidateTag("customer")
      return { success: true, error: null }
    })
    .catch((err) => {
      revalidateTag("customer")
      return { success: false, error: err.toString() }
    })
}
