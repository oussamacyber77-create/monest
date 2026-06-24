import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDisplayName(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  const last4 = cleaned.slice(-4)
  if (!last4 || last4.length < 4) return "User"
  return "User " + last4
}

export function obfuscatePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length < 4) return phone
  const last4 = cleaned.slice(-4)
  const prefix = phone.startsWith("+") ? phone.slice(0, Math.min(5, phone.length)) : phone.slice(0, 3)
  return prefix + " •••• " + last4
}

export function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
