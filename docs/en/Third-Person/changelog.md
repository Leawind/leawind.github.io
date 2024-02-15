---
prev:
  text: ⚙️Configuration
  link: './configuration'
next:
  text: 💬FAQ
  link: ./faq
---

# Changelog

## v2.0.4-mc1.19.2

### Features

* Configurable aiming mode checking
  * add boolean config: Enable Build-in match rules
  * add string list config: Hand Item Match Rules
  * add string list config: Using Item Matching Rules

### Bug fix

* Player's unsmooth rotation
* In config screen, flying_smooth_factor option is in wrong tab

### Bug add

* Unable to join world in forge version

### Other

Optimizing and slight refactoring.

## v2.0.3-mc1.19.2

### Features

* Add Cloth-Config-API support for Forge version
* Auto rotate body when draw a bow
* Add config: auto_turn_body_drawing_a_bow
* Add key: toggle_pitch_lock

### Bug fix

* Can't pick entity in certain case
* Config is saved on dedicated server
* Config option lost in screen: render_crosshair_when_aiming

## v2.0.2-mc1.19.2

Port to 1.19.2

### Features

* Add config: normal/aiming_is_centered
* Now use Cloth Config API to build config screen for fabric version

### Bug adds

* No config screen for forge version by now, but you can modify config file manually. When trying to open config screen, config file will be reloaded.

## v2.0.1(1.19.4)

### Features

* Add config: Centered when flying
* Auto switch to aiming mode when holding some items.
  * ender_pearl
  * snowball
  * egg
  * splash_potion
  * lingering_potion
  * experience_bottle

### Fix bugs

* Wrong smooth factor when adjusting camera
* Can only swim forward
* Flashes when camera is close to player

## v2.0.1-beta.4-mc1.19.4

### Features

* Add config: Enable auto rotate when interecting. #4
* Add config: How to rotate when interecting. #26

### Fix bugs

* Camera is still moving when game paused

## v2.0.1-beta.3-mc1.19.4

### Features

* Add key: toggle mod enable
* Add config: Turn player with to camera when enter FP
* Add config: smooth factors about adjusting camera
* Now you can set smooth factor in range of [0, 1]

### Fix bugs

* Camera choppiness when moving (again)

### Hide bugs

* swimming to directions other than forward

## v2.0.1-beta.2-mc1.19.4

### Add features

* add config: lock pitch angle of camera
* Let player invible when camera close enough to player

### Fix bugs

* camera choppiness when moving

## v2.0.0-mc1.19.4

### Add features
* Use [Architectury](https://github.com/architectury/architectury-api)
* Use [YACL](https://github.com/isXander/YetAnotherConfigLib) to generate config screen
* Add [Modmenu](https://github.com/TerraformersMC/ModMenu) support for fabric version
* Add key binding to open config screen
* Ignore tall grass similar blocks when aiming
* Use dedicated smooth factor when flying with elytra
* Add config: disable auto rotate when moving #22
* Add config: if render crosshair when aiming
* Add config: if render crosshair when not aiming

### Fix bugs

* Can only run forward #20
* Camera go through wall
