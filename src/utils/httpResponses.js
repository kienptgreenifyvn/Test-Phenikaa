//#region HTTP status
// Success code
module.exports.HTTP_STATUS_CREATED = 201;
module.exports.HTTP_STATUS_OK = 200;

// Error code
module.exports.HTTP_STATUS_BAD_REQUEST = 400;
module.exports.HTTP_STATUS_UNAUTHORIZED = 401;
module.exports.HTTP_STATUS_NOT_ALLOWED = 403;
module.exports.HTTP_STATUS_NOT_FOUND = 404;
module.exports.HTTP_STATUS_UNSUPPORTED_REQUEST = 419;
module.exports.HTTP_STATUS_INTERNAL_ERROR = 500;
module.exports.HTTP_STATUS_CONFLICT = 409;
//#endregion HTTP status

module.exports.SUCCESS = 'Success';
module.exports.FAIL = 'Fail';

//#region Access
module.exports.CAN_GET_ACCESS = 'Can get access';
module.exports.PERMISSION_DENIED = 'Permission denied';
module.exports.UNAUTHORIZED = 'Unauthorized';
//#endregion Access

//#region User
module.exports.PASSWORD_INCORRECT = 'Incorrect password';
module.exports.USER_NOT_FOUND = 'User not found';
module.exports.EMAIL_HAS_USER = 'Email has user';
module.exports.PASSWORD_INVALID = 'Password invalid';
module.exports.EMAIL_NOT_FOUND = 'Email not found';
module.exports.TOKEN_NOT_FOUND = 'Token not found';
module.exports.USER_CREATE_SUCCESSFULLY = 'User create successfully';
module.exports.USER_DELETED_SUCCESSFULLY = 'User deleted successfully';
module.exports.EMAIL_ALREADY_EXISTS = 'Email already exists';
module.exports.ERROR_PASSWORD_INCORRECT = 'Password incorrect';
//#endregion User

//#region Map
module.exports.MAP_CREATE_SUCCESSFULLY = 'Map create successfully';
module.exports.MAP_NOT_FOUND = 'Map not found';
module.exports.MAP_UPDATE_SUCCESSFULLY = 'Map update successfully';
module.exports.MAP_DELETE_SUCCESSFULLY = 'Map delete successfully';
module.exports.MAP_ALREADY_HAS_A_LOCATION_CHARGING = 'Map already has a location charging';
//#endregion Map

//#region Location
module.exports.LOCATION_CREATE_SUCCESSFULLY = 'Location create successfully';
module.exports.LOCATION_NOT_FOUND = 'Location not found';
module.exports.LOCATION_UPDATE_SUCCESSFULLY = 'Location update successfully';
module.exports.LOCATION_DELETE_SUCCESSFULLY = 'Location delete successfully';
//#endregion Location
