const initialState = {
    posts: null,
    searchValue: null,
    isBurgerMenu: false,
}

const SET_POSTS = 'SET_POSTS'
const SET_SEARCH_VALUE = 'SET_SEARCH_VALUE'
const SET_BURGER_MENU = 'SET_BURGER_MENU'

export const postsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_POSTS:
            return {...state, posts: action.payload}
        case SET_SEARCH_VALUE:
            return {...state, searchValue: action.payload}
        case SET_BURGER_MENU:
            return {...state, isBurgerMenu: action.payload}
        default:
            return state
    }
}

export const setPostsAction = (payload) => {
    return {type: SET_POSTS, payload}
}

export const setSearchValueAction = (payload) => {
    return {type: SET_SEARCH_VALUE, payload}
}

export const setBurgerMenuAction = (payload) => {
    return {type: SET_BURGER_MENU, payload}
}