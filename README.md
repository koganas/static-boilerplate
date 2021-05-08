# Static boilerplate
A simple static boilerplate (html, js and css).

## Features
- Support for [gulp-include](https://github.com/wiledal/gulp-include)
- PostCSS
- JS Modules (ES2016)
- Browsersync

## Requirements
- Node 14.16.1
- Gulp cli

## Dev
Installation

`
yarn
// or
npm install
`

Watch/Build
`
gulp
`


### ESLint settings
Always check before running gulp if your ESLint settings are compatible with the OS used on development:

**Windows**
```
"linebreak-style": [
  "error",
  "windows"
]
```

**MacOS / Unix**
```
"linebreak-style": [
  "error",
  "unix"
]
```
