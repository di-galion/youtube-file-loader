export const formatFileName  = (name) => {
  if (name.length > 50) return name.slice(0, 30) + "..." + name.slice(name.length - 10, name.length)

  return name
}
export const getSizeError = (size) => {
  return `Максимальный размер файла ${size} Мб`
}
export const getQuantityError = (maxQuantity) => {
  return `Максимальное количество файлов ${maxQuantity}`
}