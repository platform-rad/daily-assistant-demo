import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Délai simulé pour imiter une génération LLM (aucun appel réseau). */
export function fakeLatency(ms = 1000) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

let seq = 0
export function uid(prefix = 'id') {
  seq += 1
  return `${prefix}-${seq}`
}
