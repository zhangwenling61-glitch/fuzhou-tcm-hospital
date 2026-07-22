export const normalizeSearchText = (value: unknown) => {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
}

const isSubsequence = (keyword: string, target: string) => {
  if (!keyword) return false
  let targetIndex = 0
  for (const char of keyword) {
    targetIndex = target.indexOf(char, targetIndex)
    if (targetIndex === -1) return false
    targetIndex += 1
  }
  return true
}

export const fuzzySearchMatch = (keyword: unknown, fields: unknown[]) => {
  const normalizedKeyword = normalizeSearchText(keyword)
  if (!normalizedKeyword) return false

  return fields.some((field) => {
    const target = normalizeSearchText(field)
    if (!target) return false
    return target.includes(normalizedKeyword) ||
      normalizedKeyword.includes(target) ||
      isSubsequence(normalizedKeyword, target)
  })
}
