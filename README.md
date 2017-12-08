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

### Note on updates

Updating the theme **will override** all customization you made to the theme. So please copy your customizations to somewhere else then update the theme and re-implement your customization.

This hassle is temporary until we have a plugin to replace this theme. With plugin you'll have an interface to make customize without having to touch a single line of code. Keep an eye on [this topic](https://meta.discourse.org/t/discourse-tab-bar-for-mobile/75696?u=osama) for updates.

### Customization

**Please read the "Note on updates" section above before you make any customizations to the theme.**

Once you install this theme, go to Admin => Customize => Themes and select this theme. Click "Edit CSS/HTML", switch to Mobile and finally select </head>, you'll find there an "Edit Area" at the top of the code. Most of the customizations you might want to do will be done there.

1. Reorder tabs

If you go to the edit area, you'll find 6 lines each one of them represents a tab. The tabs follow the order of those lines. So if you reorder those lines and save your changes the tab bar will update the order of the icons (you'll need to referesh your browser though).

2. Remove tabs

Simply go to the edit area and remove the line (or "comment" the line by adding double slashes // at the beginning of the line) that represents the tab you want to remove and save your changes.

3. Add tabs

Adding new tab should be easy for most cases. Go to the edit area, duplicate one of lines that represent the tabs and update the new line's attributes.

The 'title' attribute is self-explanatory. The 'icon' attribute is the icon you want the tab to have (list of all icons and their names can be found at http://fontawesome.io/icons/).

Now the 'destination' attribute is the tricky part. If you want the new tab to takes users to a certain page such as /about or /u or /badges or /pirvacy, then you simply need to assign the 'destination' attribute to the relative URL of the page. Let's say that the URL to the About page of your forums is https://forums.mysite.com/about, then the relative URL of your forums' About page is '/about'. A relative URL must have a slash '/' in it, otherwise it'll be interpreted as a route name and it won't work.

The 'destination' attribute can also be a URL to your profile page or a group if you want to make it easy for your users to contact with staff. '/u/your_username' or '/groups/your_group_name' will work as well.

### Feedback

If you have an idea to improve this theme or want to report an issue, be sure to drop them in the topic dedicated to this theme on Discourse Meta:

https://meta.discourse.org/t/discourse-tab-bar-for-mobile/75696?u=osama

### License

MIT
