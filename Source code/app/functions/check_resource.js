exports.checkResource = (path) => {
    if( path.includes('/infor/')){
        return 'userInfor';
    } else if(path.includes('/form/')){
        return 'form';
    } else return 'report';
}