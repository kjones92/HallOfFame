const replacePathNavigation = (route, value) => {
  const linkParameter = route.substring(0, route.indexOf(":"));
  return `${linkParameter}${value}`;
};

const NavigationUtils = {
  replacePathNavigation,
};

export default NavigationUtils;
