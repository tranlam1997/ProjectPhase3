exports.checkFormCategory = (path) => {
    if( path.toLowerCase().includes('probationary')){
        return 'probationary'
    } else {
        return 'assessment'
    }
}