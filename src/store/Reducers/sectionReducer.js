const initialState = {
    selectedSection: 'main'
}

const SET_SECTION = 'SET_SECTION'

export const sectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SECTION:
            return {...state, selectedSection: action.payload}
        default:
            return state
    }
}

export const setSectionAction = (section) => {
    return {type: SET_SECTION, payload: section}
}