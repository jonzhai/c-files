export const curCount = state => state.curCount;

export const prevRouter = state => {
    return state.prevRouter ? state.prevRouter : '/home';
}

export const curOrder = state => state.curOrder;


export const curCarsList = state => state.curCarsList;

export const isSetTransitionPass = state => state.isSetTransitionPass;

export const curTime = state => state.curTime;

export const curCity = state => state.curCity;
export const curSaleCity = state => state.curSaleCity;