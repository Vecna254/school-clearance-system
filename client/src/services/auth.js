import api from "./api"

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password })
  return data // { token, user }
}

export const registerStudent = async (payload) => {
  const { data } = await api.post("/auth/register-student", payload)
  return data // { token, user }
}
