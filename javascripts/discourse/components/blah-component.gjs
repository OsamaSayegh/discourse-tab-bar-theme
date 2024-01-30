import Component from "@glimmer/component";
import { Input } from "@ember/component";
import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import willDestroy from "@ember/render-modifiers/modifiers/will-destroy";
import { inject as service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import discourseURL from "discourse/lib/url";
import dIcon from "discourse-common/helpers/d-icon";
import and from "truth-helpers/helpers/and";
import IconPicker from "select-kit/components/icon-picker";
import { hash } from "rsvp";
import DButton from "discourse/components/d-button";
import DTabBar from "../connectors/above-footer/d-tab-bar";
import { tracked } from "@glimmer/tracking";

class Tab {
  @tracked title;
  @tracked icon;
  @tracked destination;

  constructor(title, icon, destination) {
    this.title = title;
    this.icon = icon;
    this.destination = destination;
  }
}

export default class Blah extends Component {
  @tracked _tabs;

  get tabs() {
    return (
      this._tabs ||
      this.args.data?.map(
        (obj) => new Tab(obj.title, obj.icon, obj.destination)
      ) || [
        new Tab("Home", "home", "/"),
        new Tab("Profile", "user", "userActivity.index"),
        new Tab("Messages", "envelope", "userPrivateMessages.user.index"),
        new Tab("Bookmarks", "bookmark", "userActivity.bookmarks"),
        new Tab("Preferences", "cog", "preferences.account"),
      ]
    );
  }

  set tabs(newTabs) {
    this._tabs = newTabs;
  }

  @action
  updateIcon(index, icons) {
    this.tabs[index].icon = icons[icons.length - 1];
  }

  @action
  addTab() {
    this.tabs = [...this.tabs, new Tab("New", "far-circle", "/")];
  }

  @action
  deleteTab(index) {
    this.tabs = this.tabs.removeAt(index, 1);
  }

  @action
  save() {
    this.args.saveFunction(
      this.tabs.map((tab) => {
        return {
          title: tab.title,
          icon: tab.icon,
          destination: tab.destination,
        };
      })
    );
  }

  <template>
    <h3>Preview</h3>
    <div class="tab-bar-preview">
      <DTabBar @preview={{true}} @tabs={{this.tabs}} />
    </div>
    <h3>Settings</h3>
    <form class="d-tab-bar-admin-setup">
      <div class="row-wrapper header">
        <div class="input-field tab-icon">
          <label>Icon</label>
        </div>
        <div class="input-field tab-title">
          <label>Text</label>
        </div>
        <div class="input-field tab-path">
          <label>Path (or route)</label>
        </div>
      </div>
      <div class="body">
        <div class="list">
          {{#each this.tabs as |tab index|}}
            <div class="row-wrapper">
              <div class="draggable">
                {{dIcon "grip-lines"}}
              </div>
              <div class="input-field">
                <IconPicker
                  @name="icon"
                  @value={{tab.icon}}
                  @options={{hash
                    maximum=1
                    caretDownIcon="caret-down"
                    caretUpIcon="caret-up"
                    icon=tab.icon
                  }}
                  @onlyAvailable={{true}}
                  @onChange={{(fn this.updateIcon index)}}
                />
              </div>
              <div class="input-field">
                <Input @value={{tab.title}} />
              </div>
              <div class="input-field">
                <Input @value={{tab.destination}} />
              </div>
              <DButton
                @icon="trash-alt"
                class="btn-flat delete-link"
                @action={{(fn this.deleteTab index)}}
              />
            </div>
          {{/each}}
        </div>
      </div>
      <DButton @icon="plus" @action={{this.addTab}} />
      <div>
        <DButton
          @translatedLabel="Save"
          @icon="check"
          @action={{this.save}}
          class="btn-primary"
        />
      </div>
    </form>
  </template>
}
