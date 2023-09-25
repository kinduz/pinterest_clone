const initialState = {
    token: '',
    name: '',
    email: localStorage.getItem("email"),
    id: localStorage.getItem("id"),
    imgUrl: localStorage.getItem("imgUrl")
}

const LOGIN = 'LOGIN'
const REGISTRATION = 'REGISTRATION'
const SET_PROFILE_PARAMS = 'SET_PROFILE_PARAMS'
const LOGOUT = 'LOGOUT'

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {...state, email: action.payload.email, token: action.payload.token, id: action.payload.id, imgUrl: action.payload.imgUrl, name: action.payload.name}
        case REGISTRATION:
            return {...state, email: action.payload.email, name: action.payload.name, token: action.payload.token, id: action.payload.id}
        case SET_PROFILE_PARAMS:
            return {...state, name: action.payload, token: state.token, email: state.email, id: state.id}
        case LOGOUT:
            return {...state, email: '', id: '', token: '', name: ''}
        default:
            return state
    }
}

export const loginAction = (email, token, id, imgUrl, name) => {
    localStorage.setItem("email", email)
    localStorage.setItem("imgUrl", imgUrl)
    localStorage.setItem("name", name)
    const data = {email, token, id, imgUrl, name}
    return {type: LOGIN, payload: data}
}

export const registrationAction = (email, name, token, id, imgUrl = '') => {
    const data = {email, name, token, id}
    localStorage.setItem("email", email)
    localStorage.setItem("name", name)
    localStorage.setItem("imgUrl", imgUrl)
    return {type: REGISTRATION, payload: data}
}

export const setProfileParamsAction = (name) => {
    return {type: SET_PROFILE_PARAMS, payload: name}
}

export const logoutAction = () => {
    localStorage.removeItem("email")
    localStorage.removeItem("id")
    localStorage.removeItem("imgUrl")
    localStorage.removeItem("name")
    return {type: LOGOUT}
}