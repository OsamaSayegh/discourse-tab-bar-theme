import Component from "@ember/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import { on } from "@ember/modifier";
import { fn } from "@ember/helper";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import willDestroy from "@ember/render-modifiers/modifiers/will-destroy";
import and from "truth-helpers/helpers/and";

import discourseURL from "discourse/lib/url";
import dIcon from "discourse-common/helpers/d-icon";
import themeSetting from "discourse/helpers/theme-setting";

import { parseTabsSettings, routeToURL } from "../../../d-tab-bar/lib/helpers";

const SCROLL_MAX = 30;
const HIDDEN_TAB_BAR_CLASS = "tab-bar-hidden";

export default class DTabBar extends Component {
  tabs = parseTabsSettings();
  lastScrollTop = 0;
  @service router;
  @service currentUser;

  get width() {
    const length = this.tabs.length;
    const percentage = length ? 100 / length : length;
    return htmlSafe(`width: ${percentage}%;`);
  }

  scrollListener() {
    const scrollTop = window.scrollY;
    const body = document.body;
    if (
      this.lastScrollTop < scrollTop &&
      scrollTop > SCROLL_MAX &&
      !body.classList.contains(HIDDEN_TAB_BAR_CLASS)
    ) {
      body.classList.add(HIDDEN_TAB_BAR_CLASS);
    } else if (
      this.lastScrollTop > scrollTop &&
      body.classList.contains(HIDDEN_TAB_BAR_CLASS)
    ) {
      body.classList.remove(HIDDEN_TAB_BAR_CLASS);
    }
    this.lastScrollTop = scrollTop;
  }

  @action
  navigate(tab) {
    const destination = tab.destination;
    let url = destination;
    if (this.router._router.hasRoute(destination)) {
      url = routeToURL(this.router._router, destination, this.currentUser);
    }
    discourseURL.routeTo(url);
  }

  @action
  setupScrollListener() {
    document.addEventListener("scroll", this.scrollListener);
  }

  @action
  removeScrollListener() {
    document.removeEventListener("scroll", this.scrollListener);
  }

  <template>
    {{#if (and this.currentUser this.tabs.length)}}
      <div class="d-tab-bar" {{didInsert this.setupScrollListener}} {{willDestroy this.removeScrollListener}}>
        {{#each this.tabs as |tab|}}
          <a style="{{this.width}}" class="tab" data-destination="{{tab.destination}}" {{on "click" (fn this.navigate tab)}}>
            {{dIcon tab.icon}}
            {{#if (themeSetting 'display_icon_titles')}}
              <p class="title">{{tab.title}}</p>
            {{/if}}
          </a>
        {{/each}}
      </div>
    {{/if}}
  </template>
}
