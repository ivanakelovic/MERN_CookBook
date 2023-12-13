const allRoles = {
    user: [],
    admin: [],
    anonymous_user:[]
}

//extract all roles
const roles = Object.keys(allRoles);

const roleRights = new Map(Object.entries(allRoles));


module.exports = {
    roles,
    roleRights
};