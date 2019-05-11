# Garden of Pixels

A simple single page full screen homepage showing pixel art and customizable widgets.

![](/docs/img/gop-full-night.png)

_Jump to the bottom for more screenshots._

## Installation

This web app is built using the [Quasar Framework](https://quasar-framework.org/) which is built on [Vue.js](https://vuejs.org/) and specialises in multiplatform support, rich widgets and plugin support with a handy CLI.

PLEASE NOTE! No artwork has been included in this repo, though meta data has. I will not commit the art of the arts here, even though I have permission to use the artworks.

### Local dev environment

Quasar is awesome because it handles building and running a live debuggable instead of your web app locally. Changes in code are reflected immediately in the browser, making it a great development tool.

To run / install this web app in a local dev environment please first install quasar by following the [installation instructions](https://quasar-framework.org/guide/index.html#Development-with-Quasar-CLI-Recommended).

I will provide commandline instructions assuming preference for NPM instead of Yarn.

**Optional, update NPM**

On Windows:

```
npm install -g npm
```

On Linux / Mac:

```
sudo npm install -g npm
```

**Install tools**

```
npm install -g vue-cli
npm install -g quasar-cli
```

**Install dependencies**

```
npm install
```

**Launch web app**

```
quasar dev
```

### Production environment

Included in the code for this web app is a tiny Node.js server to simply serve the statically generated files. It also however contains instructions for building the web app, similarly to how it does locally, using NPM. This means it can be a fully automated process.

This has been tested on Heroku and you too can deploy it there by just commiting the code here or your own fork of it. If you do this via the Heroku CLI it will build it for you as per the config.

You can follow the Quasar Framework [Heroku deploy instructions](https://quasar-framework.org/guide/app-deploying-spa.html#Deploying-with-Heroku), or the summary here.

#### Quick deploy

With the Heroku CLI already installed (and git, which is a requirement of it anyway), run the follow commands:

```
heroku create
heroku push origin master
```

This will first create a randomly named deployment app and secondly push the repo code there. It is set to automatically build on deploy and you should see evidence of that in the logs as it works.

## Features

1. Show pixel art image matching the weather conditions at set location
2. Show date / time, weather and credit widgets
3. Customisable options, in drawer and as URL query params
4. Save settings automatically to browser

### 1. Show pixel art image matching the weather conditions at set location

#### What it does

The main feature of the app is to find an image in the image library which is the closest match to the current weather conditions at the set location.

#### How it works

Three variables are taken into account to achieve this:

* Weather code
* Time of day (solar)
* Temperature

The app uses the [Open Weather Map API](https://openweathermap.org/) to get the weather conditions at the set location, specifically using the [weather conditions](https://openweathermap.org/weather-conditions) endpoint.

A distance formula is used between the numeric weather code, solar time of day (normalized, and hour added to each side of day light), and temperature (normalized, 0 to 40 degrees C).

Each pixel art image in the library is marked up with meta data in the [/src/statics/json/bg-map.json](/src/statics/json/bg-map.json) file, according to the following spec example:

```
{
  "folder/image.ext": {
    "code": 800,
    "solar": 0.05,
    "temp": 0.2,
    "credit": "Untitled by 8PXL",
    "link": "http://softwaring.tumblr.com/post/156362892984/changed-this-piece-a-little-17-colors56",
    "anchor": "top",
    "super": "no",
    "animated": "yes",
    "season": "any",
    "setting": "urban",
    "era": "modern",
    "vibe": "classic",
    "style": "retro",
    "tone": "mid"
  },
  ...
}
```

* KEY: the path to the image, which is in /src/statics/art/...
* code: the weather code given by https://openweathermap.org/weather-conditions
* solar: normalized solar position (0 = night, 1 = midday)
* temp: normalized temperature (0 = 0 degress C, 1 = 40 degrees C)
* credit: text credit for artwork
* link: link to artwork or artist
* anchor: (NOT USED YET) image anchor position
* super: (NOT USED YET) one of "yes", "no" - is this image amazingly super?
* animated: (NOT USED YET) one of "yes", "no" - is this an animated gif?
* season: (NOT USED YET) combination of "any | winter | spring | summer | fall" - season in image
* setting: (NOT USED YET) one of "rural | urban | barren | sea | space | abstract" - where is the image set
* era: (NOT USED YET) one of "medieval | twencen | 80s | modern | future | farfuture | abstract" - what era in time is the image reminiscent of?
* vibe: (NOT USED YET) one of "cute | horror | realistic | sophisticated" - what is the general vibe of the image?
* style: (NOT USED YET) one of "primative | pc | anime | modern | retro" - what art style best fits this image?
* tone: one of "light", "mid", "dark" - setting the background color of image overspill

### 2. Show date / time, weather and credit widgets

Three widgets can appear on screen

* Date / time widget
* Weather conditions widget
* Credit widget

The credit widget cannot be removed but it can be minimized. In minimized form you can click it to get the info on the art for the current image.

The date time widget can show only the date, only the time, or both. When it shows the time, it can show hours and minutes, or hours and minutes and seconds.

The weather conditions widget shows the conditions in the form of a text adventure computer game description. e.g.

> I see Clouds
> at New York
> in the Night.
> I feel Cold.

### 3. Customisable options, in drawer and as URL query params

#### Drawer menu

The gear on the top right of the screen opens a "drawer" (in the system of Google's Material design) on the right side of the screen when clicked. This drawer contains some adjustable settings and a little information.

* Location: location to fetch weather info at
* Weather updates: number of minutes to wait until next weather info update
* Show Date: show date in widget
* Show Time: show time in widget
* Show Seconds: show seconds ticking in widget (only relevant if Show Time active)
* Show Description: show description of weather, temperature and day period conditions at location
* Minimize Credit: reduce size of pixel art artist credit (cannot be competely hidden)

#### URL query params

Each of these has a query parameter, in order:

* `location`
* `weatherupdates`
* `showdate`
* `showdate`
* `showsecs`
* `showdescription`
* `mincredit`

Additionally there is a further setting to not show the settings icon, in case the use case is full screen display purposes, this is

* `nosettings`

which if set to true will hide it.

### 4. Save settings automatically to browser

All settings are saved automatically to the browser in LocalStorage. This is not a secure storage but it should not matter as no sensitive data is saved.

### Further

There is some more info in the `docs/` folder.

## More screenshots

![](/docs/img/gop-eg-full.png)

_Full UI option_

---

![](/docs/img/gop-eg-min.png)

_Minimal UI option_

---

![](/docs/img/gop-eg-drawer-2.png)

_Open drawer showing options_

---

![](/docs/img/gop-eg-credit.png)

_Showing credit pop up when credit in minimal mode_

## License

This code is published under CC0 license. The author releases it into the public domain. See the [license](/LICENSE) for details.