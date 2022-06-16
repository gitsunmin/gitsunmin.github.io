import UAParser from 'ua-parser-js';

export const checkOS = (deviceType: DeviceType) => {
  const DESKTOP_FILTER = ['Mac OS', 'Windows'];
  const MOBILE_FILTER = ['Android[-x86]', 'iOS'];

  const OS_FILTER = {
    desktop: DESKTOP_FILTER,
    mobile: MOBILE_FILTER,
  };

  const parser: UAParser = new UAParser();
  const result: UAParser.IResult = parser.getResult();
  const { os } = result;

  const filter = OS_FILTER[deviceType];

  return !!filter?.includes(os.name);
};
