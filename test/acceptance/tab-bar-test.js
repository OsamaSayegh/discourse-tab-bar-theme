import { acceptance, exists } from "discourse/tests/helpers/qunit-helpers";
import { visit } from "@ember/test-helpers";
import { test } from "qunit";

acceptance("Tab bar component | Logged in users on mobile", function(needs) {
  needs.user();
  needs.mobileView();

  test("They see the bar on mobile", async function(assert) {
    await visit("/latest");
    assert.ok(exists(".d-tab-bar"));
  });
});

acceptance("Tab bar component | Anon users on mobile", function(needs) {
  needs.mobileView();

  test("They don't see the bar on mobile", async function(assert) {
    await visit("/latest");
    assert.ok(!exists(".d-tab-bar"));
  });
});
