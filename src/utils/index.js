export const getStatusTxt = (status) => {
  status = parseInt(status)
  let statusTxt = 'pending';
  switch(status) {
    case 0:
      statusTxt = 'pending'
      break;
    case 1:
      statusTxt = 'success'
      break;
    case 2:
      statusTxt = 'creating'
      break;
    case 3:
      statusTxt = 'cancel'
      break;
    case -1:
      statusTxt = 'fail'
      break;
    default:
      statusTxt = 'pending';
  }
  return statusTxt;
}

export const timeFormat = (date) => {
  let format = date.split('.')

  return format[0];
}
