/* eslint ember/no-private-routing-service: 0 */

export function parseTabsSettings() {
  const list = [];
  [
    settings.tab_1_settings,
    settings.tab_2_settings,
    settings.tab_3_settings,
    settings.tab_4_settings,
    settings.tab_5_settings,
    settings.tab_6_settings,
  ].forEach((setting) => {
    const props = setting.split(",").map((s) => s.trim());
    if (props.length >= 3 && props[3] !== "false") {
      list.push({
        title: props[0],
        icon: props[1],
        destination: props[2],
      });
    }
  });
  return list;
}

export function routeToURL(router, route, user) {
  const needParams = router._routerMicrolib.recognizer.names[
    route
  ].handlers.some((handler) => handler.names.length > 0);
  let url;
  if (needParams) {
    // assume the param it needs is username... very difficult to guess
    // the params correctly let alone passing the correct data
    url = router.generate(route, { username: user.username });
  } else {
    url = router.generate(route);
  }
  return url;
}
