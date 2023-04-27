import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  /* 登录业务 */
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const res = await login({ username: username.trim(), password: password })
    console.log(res)
    if (res.code === 20000) {
      commit('SET_TOKEN', res.data.token)
      setToken(res.data.token)
    }
  },

  /* 获取用户信息 */
  async getInfo({ commit, state }) {
    const res = await getInfo(state.token)
    if (res.code === 20000) {
      const { name, avatar } = res.data
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
    }
  },

  /* 退出登录 清除token */
  async logout({ commit, state }) {
    const res = await logout(state.token)
    if (res.code === 20000) {
      removeToken()
      resetRouter()
      commit('RESET_STATE')
    }
  },

  // 删除 token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
