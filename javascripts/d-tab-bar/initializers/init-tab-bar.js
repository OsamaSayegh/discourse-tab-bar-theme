import { withPluginApi } from "discourse/lib/plugin-api";
import discourseComputed from "discourse-common/utils/decorators";
import discourseURL from "discourse/lib/url";

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
  if (url1 === decodeURI(url2)) return true;

  return (
    url1 &&
    url2 &&
    url1.replace(/(\?|#).*/g, "") === url2.replace(/(\?|#).*/g, "")
  );
}

function routeToURL(router, route, user) {
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

      api.onAppEvent("page:changed", (data) => {
        const tab = tabs.find((tab) => {
          return !router.hasRoute(tab.destination)
            ? compareURLs(tab.destination, data.url)
            : tab.destination === data.currentRouteName &&
                compareURLs(
                  routeToURL(router, tab.destination, user),
                  data.url
                );
        });
        if (tab) {
          highlight(tab.destination);
        }
      });

      api.registerConnectorClass("above-footer", "d-tab-bar", {
        shouldRender() {
          return !Ember.isEmpty(user);
        },

        setupComponent() {
          let lastScrollTop = 0;
          const scrollMax = 30;
          const hiddenTabBarClass = "tab-bar-hidden";
          const scrollCallback = (() => {
            const scrollTop = window.scrollY;
            const body = document.body;
            if (
              lastScrollTop < scrollTop &&
              scrollTop > scrollMax &&
              !body.classList.contains(hiddenTabBarClass)
            ) {
              body.classList.add(hiddenTabBarClass);
            } else if (
              lastScrollTop > scrollTop &&
              body.classList.contains(hiddenTabBarClass)
            ) {
              body.classList.remove(hiddenTabBarClass);
            }
            lastScrollTop = scrollTop;
          }).bind(this);

          this.reopen({
            tabs,

            @discourseComputed("tabs")
            width(tabs) {
              if (tabs) {
                const length = tabs.length;
                const percentage = length ? 100 / length : length;
                return Ember.String.htmlSafe(`width: ${percentage}%;`);
              }
            },

            didInsertElement() {
              this._super(...arguments);
              document.addEventListener("scroll", scrollCallback);
            },

            willDestroyElement() {
              this._super(...arguments);
              document.removeEventListener("scroll", scrollCallback);
            },
          });
        },

        actions: {
          navigate(tab) {
            const destination = tab.destination;
            let url = destination;
            if (router.hasRoute(destination)) {
              url = routeToURL(router, destination, user);
            }
            discourseURL.routeTo(url);
          },
        },
      });
    });
  },
};
