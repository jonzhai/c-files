export const adminCount = state => state.adminCount;

export const prevRouter = state => {
    return state.prevRouter ? state.prevRouter : '/home';
}

export const curItem = state => state.curItem;

export const curProduct = state => state.curProduct;

export const adminID = state => state.adminID;