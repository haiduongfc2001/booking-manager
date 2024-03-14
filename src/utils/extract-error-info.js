/**
 * © Copyright OpenWay VietNam
 * @author duongdh
 * @create date 2023-11-20
 * @desc Error handling function when calling API
 */

// Error handling function
export const ExtractErrorInfo = (error) => {
  let res = {};
  res.data = error.response.data;
  res.status = error.response.status;
  res.headers = error.response.headers;
  return res;
};
