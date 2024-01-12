/* eslint ember/no-private-routing-service: 0 */

import { withPluginApi } from "discourse/lib/plugin-api";
import { parseTabsSettings, routeToURL } from "../lib/helpers";

function highlight(destination) {
  const tabs = document.querySelectorAll(".d-tab-bar .tab");
  tabs.forEach((tab) => {
    if (tab.dataset.destination === destination) {
      tab.classList.add("active");
      return;
    }
    tab.classList.remove("active");
  });
}

function compareURLs(url1, url2) {
  if (url1 === decodeURI(url2)) {
    return true;
  }
  if (!settings.match_url_params) {
    return (
      url1 &&
      url2 &&
      url1.replace(/(\?|#).*/g, "") === url2.replace(/(\?|#).*/g, "")
    );
  }
  return false;
}

export default {
  name: "discourse-tab-bar",

  initialize() {
    withPluginApi("0.8.13", (api) => {
      const site = api.container.lookup("site:main");
      if (!site.mobileView) {
        return;
      }

      const user = api.getCurrentUser();
      if (!user) {
        return;
      }

      const tabs = parseTabsSettings();
      if (tabs.length === 0) {
        return;
      }

      const router = api.container.lookup("router:main");

      tabs.forEach((tab) => {
        if (tab.destination.indexOf("/") !== -1) {
          return;
        }
        // we need this to highlight tab when you navigate to
        // a subroute of a tab's route
        api.container.lookup(`route:${tab.destination}`).reopen({
          actions: {
            didTransition() {
              // check if the route has `username` dynamic segment. If it does then
              // highlight only if the target username === curentuser.username
              // if it doesn't have a `username` segment then highlight
              const usernameParam = router._routerMicrolib.recognizer.names[
                tab.destination
              ].handlers.some((handler) =>
                handler.names.some((n) => n === "username")
              );
              if (usernameParam) {
                const target = this.modelFor("user");
                if (target?.username === user.username) {
                  highlight(tab.destination);
                }
              } else {
                highlight(tab.destination);
              }
              this._super(...arguments);
              return true;
            },
          },
        });
      });

      api.onAppEvent("page:changed", (data) => {
        const match = tabs.find((tab) => {
          if (!router.hasRoute(tab.destination)) {
            return compareURLs(tab.destination, data.url);
          } else {
            return (
              tab.destination === data.currentRouteName &&
              compareURLs(routeToURL(router, tab.destination, user), data.url)
            );
          }
        });
        if (match) {
          highlight(match.destination);
        }
      });
    });
  },
};
