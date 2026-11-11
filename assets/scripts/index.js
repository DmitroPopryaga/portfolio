import TabsCollection from "./TabsCollection.js";
import HeaderMenu from "./HeaderMenu.js";
import Theme from "./Theme.js";
import CopyCollection from "./CopyCollection.js";

new TabsCollection()
new HeaderMenu(document.querySelector('[data-js-header]'))
new Theme(document.querySelector('[data-js-theme-button]'))
new CopyCollection()
