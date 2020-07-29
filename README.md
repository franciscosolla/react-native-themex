![npm](https://img.shields.io/npm/v/react-native-themex) ![GitHub](https://img.shields.io/github/license/franciscosolla/react-native-themex) ![GitHub repo size](https://img.shields.io/github/repo-size/franciscosolla/react-native-themex)

<h1 align="center">ThemeX</h1>

Reactive theme manager for React Native.

Uses React Native, AsyncStorage and RxJS to manage themes, color schemes and styles through reactive actions and hooks.

## :zap: QuickStart


```shell
npm install react-native-themex
```

This packages depends on React Native, AsyncStorage, RxJS and "react-native-navigation-bar-color" to fully work.

```shell
npm install rxjs @react-native-community/async-storage react-native-navigation-bar-color
```

You can skeep the "react-native-navigation-bar-color" if you don't intend on changing the android navigation bar color through Themex.

> RxJS comes with React Native setup, but itś good practice to add it to your dependencies to avoid breaking Themex if React Native ever stops using RxJS as a dependency. 

### Initialize

To use Themex as your theme manager you need only to call it's theme registering function, **registerThemes**, at least once before using any of Themex tools.

```typescript
import { registerThemes } from 'react-native-themex'

const icecreamTheme = {
	name: 'icecream', // required
	androidNavigationBarColor: '#FFFFFF', // optional
	androidNavigationBarColorScheme: 'light', // optional
	
	// you can add here all the props you need to build your styles
	colors: {
		primary: '#0000AA',
	}
}

const darkTheme = {
	name: 'dark',
	androidNavigationBarColor: '#000000',
	androidNavigationBarColorScheme: 'dark',
	colors: {
		primary: '#000000',
	}
}

// You have to call "registerThemes" once before any of Themex functions are used
registerThemes(
	icecreamTheme, // first theme to be registered will be the default one,
	[darkTheme, 'dark'] // you can set a theme as the default for a color scheme
)
```

### Use Theme in a Component

Now you can simply call **useTheme** to access your current theme in components.

```jsx
import { useTheme } from 'react-native-themex'

function MyComponent() {
	
	const theme = useTheme()
	
	return (
		<Text style={{ color: theme.colors.primary }} >
			My Text
		<Text />
	)
}
```

You can also use **useStyles** to build a style from the current theme.

```jsx
import { useStyles } from 'react-native-themex'

function MyComponent() {
	
	const { styles, theme } = useStyles(theme => ({
		text: {
			color: theme.colors.primary
		}
	})
	
	return (
		<Text style={styles.text} >
			My Primary Color is {theme.colors.primary}
		<Text />
	)
}
```

### Change Current Theme

Call **setTheme** with the name of the theme you want to change to.

```jsx
import { useStyles, setTheme } from 'react-native-themex'

function MyComponent() {
	
	const { styles, theme } = useStyles(theme => ({
		text: {
			color: theme.colors.primary
		}
	})
	
	return (
		<Text style={styles.text} onPress={() => setTheme('icecream')} >
			Change to icecream theme
		<Text />
	)
}
```

Or, alternatively, you can call **setColorScheme** to change to the theme coreesponding to a color scheme.


```jsx
import { useStyles, setColorScheme } from 'react-native-themex'

function MyComponent() {
	
	const { styles, theme } = useStyles(theme => ({
		text: {
			color: theme.colors.primary
		}
	})
	
	return (
		<Text style={styles.text} onPress={() => setColorScheme('dark')} >
			Change to Dark Mode
		<Text />
	)
}
```

## `:brain:` Type Defining Themes

Themex works without it, but if you're in a **typescript** React Native project, **you should type define your themes** so you can use auto-complete when writing your styles. 

Themex is completely written in typescript and generic defined. So you can call any of it's functions with your theme type.

```typescript
const theme1 = {
	name: 'theme1',
	colors: {
		primary: '#000000'
	}
}

const theme = useTheme<typeof theme1>()
```

###  Tip

Write a extension file for Themex inside your project and import it instead of importing directly from Themex. This way you won't need to define your theme type each time you call a Themex feature.

This will provide you with definetly typed themes and also give you a extra layer between Themex and your project making it easier to detach from Themex if you ever decide to (I hope you don't `:smile:`.

```typescript
// file: Themes/index.ts

import { StyleSheet } from 'react-native'

import * as Themes from 'react-native-themex'
export * from 'react-native-themex' // export all Themex features

// import your theme objects
import  *  as  themes  from  './themes'

// export your specific theme type
export type Theme = Themes.Theme & typeof themes[keyof  typeof  themes]

// register your themes
Themes.registerThemes<Theme>(
	[themes.lightTheme, 'light'],
	[themes.darkTheme, 'dark']
)

// Override Themex features to type define it with your theme type

export function  useTheme() {
	return  Themes.useTheme<Theme>()
}

export function setTheme(themeName: Theme['name']) {
	return  Themes.setTheme(themeName)
}

export function useStyles<S  extends  StyleSheet.NamedStyles<S> | StyleSheet.NamedStyles<any>>(styleFactory: (theme: Theme) =>  S | StyleSheet.NamedStyles<S>) {
	return  Themes.useStyles(styleFactory)
}

export function getThemes() {
	return  Themes.getThemes<Theme>()
}
```

And now you can call any of the functions you overrided and have the auto-magical-completions typescript provides. Just remember to import from your project file, `import { useTheme } from './Themes'`.
:mage_man::sparkles:

## :notebook: API

API | Type | Description
--- | :---: | ---
[Theme](#interface-theme) | `interface` | *theme interface*
[ThemeCollection](#interface-themecollection) | `interface` | *collection of themes interface*
[registerThemes](#function-registerthemes) | `function` | *register themes*
[useTheme](#hook-usetheme) | `hook` | *access the current theme*
[setTheme](#function-settheme) | `function` | *change current theme*
[getTheme](#function-gettheme) | `function` | *get current theme*
[getThemes](#function-getthemes) | `function` | *get all registered themes*
[themeIsLoading](#function-themeisloading) | `function` | *check if Themex is initializing*
[useThemeLoading](#hook-usethemeloading) | `hook` | *check if Themex is initializing*
[ColorScheme](#type-const-colorscheme) | `type` `const` | *available color scheme connfigurations*
[useColorScheme](#hook-usecolorscheme) | `hook` | *access the current color scheme*
[setColorScheme](#function-setcolorscheme) | `function` | *change the current color scheme*
[getColorScheme](#function-getcolorscheme) | `function` | *get the current color scheme*
[useStyles](#hook-usestyles) | `hook` | *reactively build stylesheets from the current theme*

> Hooks, `hook`, can only be called inside React Function Components.

### Theme

#### `interface` Theme
```typescript
interface Theme {
	name: string
	androidNavigationBarColor?: string
	androidNavigationBarColorScheme?: 'light' | 'dark'
	[key: string]: any
}
```

#### `interface` ThemeCollection
```typescript
interface ThemeCollection<T extends Theme = Theme> {
	[key: string]: T
}
```

#### `function` registerThemes

Use it to register themes in Themex. It can be called at any time to register new themes or override old ones. But has to be called at least once before everything else (you have to have at least one theme registered for Themex to work).

```typescript
function registerThemes<T  extends  Theme>( ...themes: ([T, 'light' | 'dark' | 'default' | undefined | null] | T)[] ): void
```

##### Usage
```typescript
registerThemes(theme1)

registerThemes([theme1, 'default'])

registerThemes(
	[theme1, 'light'],
	[theme2, 'default']
	theme3,
	theme4,
	[theme5, 'dark'],
	[theme6, 'light'] // this will override theme1 as 'light'
)
```

#### `hook` useTheme

Use it to access the current theme in React Function Components.

```typescript
function useTheme<T  extends  Theme = Theme>(): T
```
##### Usage
```jsx
function MyComponent() {
	
	const theme = useTheme()
	
	return (
		<Text style={{ color: theme.colors.primary }} >
			My Text
		<Text />
	)
}
```

#### `function` setTheme

Use it to change your app's current theme.

```typescript
function setTheme(themeName: string): void
```
##### Usage
```jsx
function MyComponent() {
	
	const theme = useTheme()
	
	return (
		<Text style={{ color: theme.colors.primary }} onPress={() => setTheme('icecream')} >
			Change to icecream theme
		<Text />
	)
}
```

#### `function` getTheme
Use it to access the current theme once.
```typescript
function getTheme<T extends Theme = Theme>(): T
```
##### Usage
```typescript
const theme = getTheme()
```

#### `function` getThemes
Use it to access the current theme once.
```typescript
function getThemes<T extends Theme = Theme>(): ThemeCollection<T>
```
##### Usage
```typescript
const themes = getThemes()
```

#### `function` themeIsLoading
Use it to verify once if Themex is ready to be used.
```typescript
function themeIsLoading(): boolean
```
##### Usage
```typescript
if (themeIsLoading()) {
	// do something
}
```

#### `hook` useThemeLoading
Use it to access Themex initialization status in a React Function Component, and make sure you're not rendering any components that use Themex before it is properly initialized with a **registerThemes**.
```typescript
function useThemeLoading(): boolean
```
##### Usage
```jsx
function MyComponent() {
	const themexIsInitializing = useThemeLoading()
	if (themexIsInitializing) return <Loading />
	else return <MyApp />
}
```

### Color Scheme

#### `type` `const` ColorScheme
```typescript
type ColorScheme = 'light' | 'dark' | 'system'

const ColorScheme = {
	light: 'light',
	dark: 'dark',
	system: 'system'
}
```

#### `hook` useColorScheme
Use it to access the current color scheme inside React Function Components.
> It's possible to the theme and color scheme to not match. If you call a **setTheme** the theme will be changed even if it's color scheme don't match the current one. To avoid it, try to always use **setColorScheme** to change themes when working with color schemes in your app, it will change the theme to the one corresponding to the selected color scheme.
```typescript
function useColorScheme(): ColorScheme
```
##### Usage
```jsx
function MyComponent() {
	const colorScheme = useColorScheme()
	return (
		<Text >
			Current color scheme is {colorScheme}
		</Text>
	)
}
```


#### `function` setColorScheme
Use it to change the current color scheme.
> It will also change the current theme to the corresponding one.
```typescript
function setColorScheme(colorScheme: ColorScheme)
```
##### Usage
```jsx
function MyComponent() {
	return (
		<Text onPress={() => setColorScheme('system')} >
			Match the system's color scheme
		</Text>
	)
}
```

#### `function` getColorScheme
Use it to access the current color scheme once.
```typescript
function getColorScheme(): ColorScheme
```
##### Usage
```jsx
const colorScheme = getColorScheme()
```

### Styles

#### `hook` useStyles
Use in React Function Components to get a style for each theme change.
```typescript
function useStyles<T extends Theme, S extends StyleSheet.NamedStyles<S> | StyleSheet.NamedStyles<any>>(styleFactory: (theme: T) =>  S | StyleSheet.NamedStyles<S>) : { styles: S, theme: T }
```
##### Usage
```jsx
function MyComponent() {
	
	const { styles, theme } = useStyles(theme => ({
		text: {
			color: theme.colors.primary
		}
	})
	
	return (
		<Text style={styles.text} >
			My Primary Color is {theme.colors.primary}
		<Text />
	)
}
```