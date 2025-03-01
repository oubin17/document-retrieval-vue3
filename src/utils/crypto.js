import CryptoJS from 'crypto-js'

// 使用固定的盐值（salt）来确保加密结果一致
const SALT = import.meta.env.VITE_CRYPTO_KEY || 'your-default-key'

export const encrypt = (text) => {
  // 将密码和盐值组合
  const textWithSalt = `${text}${SALT}`
  // 使用 MD5 进行加密（或者使用 SHA256）
  return CryptoJS.MD5(textWithSalt).toString()

  // 如果想使用 SHA256：
  // return CryptoJS.SHA256(textWithSalt).toString()
}