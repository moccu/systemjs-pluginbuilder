# systemjs-pluginbuilder

A systemJS build tool to create plugin based bundles.

[![Travis Status](https://travis-ci.org/moccu/systemjs-pluginbuilder.png?branch=master)](https://travis-ci.org/moccu/systemjs-pluginbuilder)

This project allows builds of systemjs based modules. The key features are the
separated build outputs. The main build, called _base_ build, is ment to contain
all required modules and libraries. On the other hand there can exist smaller
builds called _plugins_ which only contain all modules which are missing in the
_base_ build. This approach allows to ship builds on websites, where the _base_
script is cached by the browser while _plugins_ can be exchanged on each site
and keep the traffic low.

### Tasks

If you're looking for a [gruntjs](http://gruntjs.com/) to build your
files, take a look at this one: [grunt-systemjs-pluginbuilder](https://github.com/moccu/grunt-systemjs-pluginbuilder)
