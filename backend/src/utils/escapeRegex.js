/** Escapes user input before using it inside a RegExp (prevents regex injection). */
export const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");