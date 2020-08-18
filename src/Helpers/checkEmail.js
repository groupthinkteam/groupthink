export default function checkEmail(email) {
  var pat = /\w+@[0-9a-zA-Z_]+?\.[a-zA-Z]{2,3}/;
  return pat.test(email);
}