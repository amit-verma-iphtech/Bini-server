const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { models } = require('../sequelize');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

const getUserByEmail = async (data) => {
  const { email } = data;
  const user = await models.user.findOne({
    where: { email },
  });
  return user;
};
const isEmailTaken = async (candidateEmail) => {
  const user = await getUserByEmail({ email: candidateEmail });

  const retValue = !!user;

  return retValue;
};
const createUser = async (data) => {
  const email = await isEmailTaken(data.email);

  if (email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const user = await models.user.create(data);

  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllUsers = async () => {
  const users = await models.user.findAll({
    limit: 2000,
  });

  return { length: users.length, data: users };
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (data) => {
  const { userId: id } = data;
  const user = await models.user.findByPk(id);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  console.log('user-->', user);
  return user;
};

// /**
//  * Update user by id
//  * @param {ObjectId} userId
//  * @param {Object} updateBody
//  * @returns {Promise<User>}
//  */
// const updateUserById = async (userId, updateBody) => {
//   const user = await getUserById({userId});
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
//   Object.assign(user, updateBody);
//   await user.save();
//   return user;
// };

const getUserByFirebaseUID = async ({ firebaseUID }) => {
  const user = await models.user.findOne({
    where: { firebaseUID },
  });

  return user;
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

const getUserByMobileNoOrCreate = async (mobileNo) => {
  const [user, created] = await models.user.findOrCreate({
    // Conditions that must be met
    where: { mobileNo },
    // Value of other columns to be set if no such row found
    // defaults: { secondColumn: "EXAMPLE" },
  });

  return user;
};

// /**
//  * Get user by email
//  * @param {string} email
//  * @returns {Promise<User>}
//  */
// const getUserByEmail = async (email) => {
//   return User.findOne({ email });
// };

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */

const updateUserById = async (data) => {
  const { userId, ...updatedBody } = data;
  if (updatedBody.password) {
    updatedBody.password = await bcrypt.hash(updatedBody.password, 8);
  }

  const user = await getUserById({ userId });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  Object.assign(user, updatedBody);
  await user.save();
  return { status: true, message: 'Successfully updated user', user };
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (data) => {
  const { userId } = data;
  const user = await getUserById({ userId });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  await models.user.destroy({
    where: { id: userId },
  });
  return { status: true, message: `Successfully deleted user`, id: user.id };
};

const isPasswordMatch = async (candidatePassword, user) => {
  return bcrypt.compare(candidatePassword, user.password);
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,

  getUserByEmail,
  getUserByMobileNoOrCreate,
  getUserByFirebaseUID,
  isPasswordMatch,
  isEmailTaken,
};
