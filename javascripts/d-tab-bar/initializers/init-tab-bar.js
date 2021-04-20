import { withPluginApi } from "discourse/lib/plugin-api";

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

export default {
  name: "discourse-tab-bar",

  initialize() {
    withPluginApi("0.8.13", (api) => {
      const site = api.container.lookup("site:main");
      if (!site.mobileView) return;
      const tabs = [];
      const router = api.container.lookup("router:main");
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
          tabs.push({
            title: props[0],
            icon: props[1],
            destination: props[2],
          });
        }
      });
      const user = api.getCurrentUser();

      const discourseURL = require("discourse/lib/url").default;

      tabs.forEach((tab) => {
        if (!user) return;
        if (tab.destination.indexOf("/") !== -1) return;
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
                if (target && user && target.username === user.username)
                  highlight(tab.destination);
              } else {
                highlight(tab.destination);
              }
              this._super(...arguments);
              return true;
            },
          },
        });
      });

      api.registerConnectorClass("above-footer", "d-tab-bar", {
        shouldRender() {
          return !Ember.isEmpty(user);
        },

        setupComponent() {
          const self = this;

          Ember.defineProperty(
            this,
            "width",
            Ember.computed("tabs", () => {
              const tabs = this.get("tabs");
              if (tabs) {
                const length = tabs.length;
                const percentage = length ? 100 / length : length;
                return Ember.String.htmlSafe(`width: ${percentage}%;`);
              }
            })
          );

          tabs.forEach((tab) => {
            tab.isURL = !router.hasRoute(tab.destination);
          });

          this.set("tabs", tabs);

          this.set("routeToURL", function(route) {
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
          });

          this.set("compareURLs", function(url1, url2) {
            if (url1 === url2) return true;

            return (
              url1 &&
              url2 &&
              url1.replace(/(\?|#).*/g, "") === url2.replace(/(\?|#).*/g, "")
            );
          });

          this.set("compareRoutes", function(route1, route2) {
            return route1 === route2;
          });

          api.onAppEvent("page:changed", (data) => {
            const tab = this.get("tabs").find((tab) => {
              return tab.isURL
                ? this.compareURLs(tab.destination, data.url)
                : this.compareRoutes(tab.destination, data.currentRouteName) &&
                    this.compareURLs(
                      this.routeToURL(tab.destination),
                      data.url
                    );
            });
            if (tab) {
              highlight(tab.destination);
            }
          });
        },

        actions: {
          navigate(tab) {
            const destination = tab.destination;
            let url = destination;
            if (router.hasRoute(destination)) {
              url = this.routeToURL(destination);
            }
            discourseURL.routeTo(url);
          },
        },
      });
    });
  },
};
