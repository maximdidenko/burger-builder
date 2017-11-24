export const updateObject = (obj, props) => {
    return {
        ...obj,
        ...props
    };
};