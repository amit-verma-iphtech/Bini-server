const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], []);
roleRights.set(roles[1], ['getStatus', 'getUsers']);

module.exports = {
  roles,
  roleRights,
};
