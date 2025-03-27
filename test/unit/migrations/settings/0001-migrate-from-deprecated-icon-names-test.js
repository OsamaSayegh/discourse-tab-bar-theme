import { module, test } from "qunit";
import migrate from "../../../../migrations/settings/0001-migrate-from-deprecated-icon-names";

module(
  "Unit | Migrations | Settings | 0001-migrate-from-deprecated-icon-names",
  function () {
    test("migrate tab settings", function (assert) {
      const settings = new Map(
        Object.entries({
          tab_1_settings: "Home, home, /",
          tab_2_settings: "Profile, user, userActivity.index",
          tab_3_settings: "Messages, envelope, userPrivateMessages.user.index",
          tab_4_settings: "Bookmarks, bookmark, userActivity.bookmarks",
          tab_5_settings: "Preferences, cog, preferences.account",
          tab_6_settings: "Notifications, comment, userNotifications.index, false"
        })
      );

      const result = migrate(settings);

      const expectedResult = new Map(
        Object.entries({
          tab_1_settings: "Home, house, /",
          tab_2_settings: "Profile, user, userActivity.index",
          tab_3_settings: "Messages, envelope, userPrivateMessages.user.index",
          tab_4_settings: "Bookmarks, bookmark, userActivity.bookmarks",
          tab_5_settings: "Preferences, gear, preferences.account",
          tab_6_settings: "Notifications, comment, userNotifications.index, false"
        })
      );
      assert.deepEqual(Array.from(result), Array.from(expectedResult));
    });

    test("migrate extend_fa5_icons setting", function (assert) {
      const settings = new Map(
        Object.entries({
          extend_fa5_icons: "home|user|cog|comment"
        })
      );

      const result = migrate(settings);

      const expectedResult = new Map(
        Object.entries({
          extend_fa5_icons: "house|user|gear|comment"
        })
      );
      assert.deepEqual(Array.from(result), Array.from(expectedResult));
    });

    test("migrate empty settings", function (assert) {
      const settings = new Map(Object.entries({}));
      const result = migrate(settings);
      assert.deepEqual(Array.from(result), Array.from(settings));
    });
  }
);
