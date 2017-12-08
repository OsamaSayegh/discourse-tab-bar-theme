# discourse-tab-bar-theme

This theme adds a tab bar to your Discourse forums to let your users on mobile quickly navigate to other pages on the forums.

The tab bar will **only** show to **logged-in** users on **mobile** devices.

Out of the box, the theme includes 6 tabs and 5 are enabled.

Included tabs are:

1. Homepage (enabled)
2. Profile (enabled)
3. Messages (enabled)
4. Bookmarks (enabled)
5. Preferences (enabled)
6. Notifications (disabled)

### Screenshots:

<img src="demo-bright-1.png" height="500">

<img src="demo-bright-2.png" height="300">

<img src="demo-dark-1.png" height="300">

<img src="demo-dark-2.png" height="500">

### Installation

Follow the instructions here:

https://meta.discourse.org/t/how-do-i-install-a-theme-or-theme-component/63682?u=osama

### Can I change the order of the tabs? Can I remove a tab? Can I add new tabs?

Yes, you can remove and reorder very easily, go to Admin => Customize => Themes => Discourse Tab Bar => Edit CSS/HTML => Mobile => </head>, and you'll find instructions on how to do that.

Adding new tabs should be fairly easy for most cases. For example if you want to add a tab that takes to the about page of your forums, then it's only a matter of duplicating one line of code, figuring out an appropriate icon for your tab (find icons at http://fontawesome.io/icons/), and adding a relative URL to the page. Instructions are in theme's </head> tab.

### License

MIT
