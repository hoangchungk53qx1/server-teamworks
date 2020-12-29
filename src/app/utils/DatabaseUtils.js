const jsonInstance = require('../utils/JsonUtils');
const responeInstance = require('../utils/ResponeUtils');

// state = {save, delete, updae}
saveData = (res, err, product, state) => {
  if (err || product == null) {
    responeInstance
      .error400(res, jsonInstance.jsonNoData(`${state} error`));
  } else {
    responeInstance
      .success200(res, jsonInstance.toJsonWithData(`${state} success`, product));
  }
}

// saveWhenDelete = (res, err, product) => {
//   if (err || product == null) {
//     responeInstance
//       .error400(res, jsonInstance.jsonNoData(`delete error`));
//   } else {
//     responeInstance
//       .success200(res, jsonInstance.toJsonWithData(`delete sucess`, product));
//   }
// }

// saveWhenUpdate = (res, err, product) => {
//   if (err || product == null) {
//     responeInstance
//       .error400(res, jsonInstance.jsonNoData(`update error`));
//   } else {
//     responeInstance
//       .success200(res, jsonInstance.toJsonWithData(`update sucess`, product));
//   }
// }

module.exports = { saveData }