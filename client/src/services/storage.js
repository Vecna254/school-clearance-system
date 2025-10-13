export const saveToken = (token) => localStorage.setItem("token", token)
export const getToken = () => localStorage.getItem("token")
export const clearToken = () => localStorage.removeItem("token")
export const saveUser = (u) => localStorage.setItem("user", JSON.stringify(u))
export const getUser = () => {
  const u = localStorage.getItem("user")
  return u ? JSON.parse(u) : null
}
export const clearUser = () => localStorage.removeItem("user")
