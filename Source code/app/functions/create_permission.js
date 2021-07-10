exports.createPermission = async (user, role) => {
   if(role === 'employee'){
        await Promise.allSettled([user.createPermission({
            classification: 'R',
            permissionDetail: 'View personal information, probationary form, assessment form '
        }),
        user.createPermission({
            classification: 'U',
            permissionDetail: 'Update personal information, probationary form, assessment form '
        }),
        user.createPermission({
            classification: 'W',
            permissionDetail: 'Submit probationary form, assessment form '
        })
    ]).catch(err => res.status(500).send({
        message: `Error while set permissions for user \n ${err}`
    }));
    } else if( role === 'manager')
 {
        await user.createPermission({
            classification: 'A',
            permissionDetail: 'Approve probationary form, assessment form '
        })
        .catch(err => res.status(500).send({
            message: `Error while set permissions for user \n ${err}`
        }));
    } else if ( role === 'hr'){
        await Promise.allSettled([user.createPermission({
            classification: 'R',
            permissionDetail: 'View probationary form and assessment form of all users '
        }),
        user.createPermission({
            classification: 'W',
            permissionDetail: 'Create probationary form and assessment form '
        }),
        user.createPermission({
            classification: 'R',
            permissionDetail: 'View report about all users not finish abd finished forms'
        })
    ]).catch(err => res.status(500).send({
        message: `Error while set permissions for user \n ${err}`
    }));
    }

}