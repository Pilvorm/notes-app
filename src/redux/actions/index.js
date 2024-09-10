export const createNote = payload => {
    return {
        type: "ADD_NOTE",
        payload
    };
}

export const editNote = payload => {
    return {
        type: "EDIT_NOTE",
        payload
    };
}

export const deleteNote = payload => {
    return {
        type: "DELETE_NOTE",
        payload
    };
}