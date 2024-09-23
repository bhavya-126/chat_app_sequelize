'use strict';

/** ******************************
 **** Managing all the models ***
 ********* independently ********
 ******************************* */
module.exports = {
  dbVersionModel: require('./dbVersionModel'),
  sessionModel: require('./sessionModel'),
  userModel: require('./userModel'),
  roomModel: require('./roomModel'),
  roomDetailsModel: require('./roomDetailsModel'),
  chatModel: require('./chatModel'),
};
