## DataList

- [x] common ListItem with room for icon, title, subtitle, second icon, and grows properly.

## DataTable

- [ ] can detect columns from a specified type
- [ ] can detect columns from the first data row
- [ ] can insert extra synthetic columns
- [ ] put in a renderer to customize anything
- [ ] add classname and styles to any row or column
- [ ] header is generated from keynames
- [ ] right click header to get list of headers to toggle
- [ ] rearrange headers by drag and drop?
- [ ] click header to change sort
- [ ] booleans to enable / disable features
- [ ] scrolls properly on it's own. just drop it in and give it a size

## PopupMenu

- [x] A single column menu.
- [x] inside a popup container
- [ ] properly handles modality within the app or whole screen?
- [x] give it menu items which are buttons with actions and hover effects.
- [ ] click elsewhere to close the menu.
- [x] can put custom components inside of a popup container too

## TextBox

- [ ] single line single font text editor
- [ ] hooks for keystroke filtering and popups with arrows
- [ ] customize with required formats

## TextArea

- [ ] single font text editor
- [ ] hooks to filter keystrokes
- [ ] position popup at the cursor
- [ ] capture arrow keys to select something within the popup

## Toolbar

- [ ] improved toolbar style box
- [ ] icon buttons
- [ ] labels
- [ ] text buttons
- [ ] search fields
- [ ] spacers

## Dialogs

dialogs that are modal within an app

## Query Builder

Standard query builder panel that uses the schema to let the user
create custom queries. Should be as rich as what you can do in itunes.
Work with min/max values. before/after for dates and times.  greater
than and less than, etc.

- nested popup menus w/ a hamburger menu




# =============== cleanup tasks ===============

### General
- [ ] persisted smart queries w/ icons everywhere. nothing hardcoded in the apps
- [ ] use contexts instead of passing DB and app service around

### windows
- [ ] use z-index to move windows to top
    requires scanning all windows to check z-index on the dom
    or move Window outside of App
- [x] hover effect on the close button
- [x] icon in the title bar next to the title
- [ ] remove BG on appbar. with props or just custom CSS?
    

### Calendar
- [ ] search based on descriptions in the events?
- [ ] both day and week view
- [ ] preload with a lot more events
- [ ] button to add a new event using a form
- [ ] button to add a new event using parsed text
- [ ] research fetching and parsing ical from google calendar

### Contacts
- [x] crashing
- [ ] can't toggle 'favorite' setting

### notes
- [ ] cleanup layout of editing form

### alarms and timers
- [x] make delete button actually work
- [x] send alert when active alarm triggers
- [ ] add snooze button to the alert
- [ ] add a big timer button that spawns in a new window. ex: set a timer for 15 min.

### email    
- [x] stub out email app w/ inbox, two folders. 
- [x] list of messages w/ tags for inbox and folders. 
- [x] subject, senders, receivers, body. 
- [x] no compose. 
- [x] lists show subject and sender and date. sorted by date.
- [x] sort by date
- [x] message viewer shows full senders and receivers and subject and timestamp
    
### music
- [ ] search works for song titles, artists, albums
- [ ] show song duration
- [ ] heart to favorite a song
- [ ] favorite songs list
- [ ] icons in the queries list

### Command Bar
- [x] command bar. just say name of app to launch it w/ tab completion

### Chat
- [ ] input field with ‘send’ button and return to add to conversation
- [ ] search. what does it do?
- [ ] show icon and short name of participants


# ================ Services =================

### App Service

- [x] launch app by id
- [x] close app by id
- [ ] allow or disallow multiple instances of app?
- [ ] send args to the app. ex: open chat w/ user, creating a new conversation if needed.

### Alarm Service

- [x] create, edit, delete alarm objects in database
- [x] send notification when an active alarm triggers
- [ ] send notification when a repeated alarm triggers
- [x] alarm has time, label, repeat
- [ ] repeat = enum of none, daily, weekdays, weekenddays


### Notification Service and App

- [x] category in database of notifications
- [x] display in lower right that shows most recent notifications
- [ ] notification fades out after N seconds
- [ ] only most recent notifications are show, but all still exist in DB
- [x] does it actually need a service or just the DB?
- [x] icon and title and subtitle props
- [ ] action to trigger? launch app with args?

### NLP service

- [ ] parse incrementally typed code to show suggestions
- [ ] `open appname` -> launch app
- [ ] `appname` -> launch app
- [ ] `email josh` -> launch email compose with recipient prefilled
- [ ] `chat with josh` -> launch chat with participants prefilled
- [ ] `log my weight` -> launches a script that asks for a number
- [ ] `log my weight as 143` -> launches a script with value prefilled


### Database Service

- [x] track when object changed, so we can tell if it's dirty
- [x] save to local storage or indexdb. only objects that have been changed are persisted.
- [x] function to nuke local storage and reset to defaults
- [x] loads prefab database
- [x] add, update, delete objects in the database
- [ ] caches queries
- [x] sends notifications when data changes
- [x] prefab data is loaded, then real data is loaded. hash by id. loaded ids override existing ids.
- [x] on load, objects are validated against the schema
- [x] objects are upgraded using schema defaults. so adding a new schema field can apply to previously edited objects.
- [ ] deleting object doesn't persist. needs a tombstone
- [ ] schema can also delete properties using some special syntax, to upgrade old objects by deleting, or renaming.
- [ ] JSON storage encodes types into the keynames using the schemas
- [ ] properly store non-JSON safe properties using custom converters



# important things 

- [x] use contexts for app and db.
- [x] standardize a bunch of query util functions.  isCategory, isType, isPropEqual, isPropTrue, isPropFalse, etc.
- [x] click popup buttons to choose it
- [ ] arrow keys for popup nav
- [ ] enter key to choose item in popup nav


* move app inside of window and fix z-index
* dialogs and popups?
