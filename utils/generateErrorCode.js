export const generateErrCode = (msg) =>{
    if(msg.includes('at least') || msg.includes('required')||msg.includes('valid')){
        return 'INVALID_INPUT'
    } else if(msg.includes('exists')||msg.includes('is already')){
        return 'RESOURCE_EXISTS'
    } else if(msg.includes('not found')) {
        return 'RESOURCE_NOT_FOUND'
    } else {
        return 'UNKNOWN_ERROR'
    }
}