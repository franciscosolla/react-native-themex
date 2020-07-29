import { useState, useEffect } from 'react'
import { BehaviorSubject } from "rxjs"
import { Appearance } from 'react-native'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

import AsyncStorage from '@react-native-community/async-storage'

export interface Theme {
    name: string
    androidNavigationBarColor?: string
    androidNavigationBarColorScheme?: 'light' | 'dark'
    [key: string]: any
}

export interface ThemeCollection {
    [key: string]: Theme
}

const Themes: ThemeCollection = {}

const colorSchemeToThemeName = function(){

    let _default: string, _light: string, _dark: string

    return Object.seal({

        get default() { return _default },
        set default(themeName: string) { _default = themeName },

        get light() { return _light },
        set light(themeName: string) { _light = themeName },
         
        get dark() { return _dark },
        set dark(themeName: string) { _dark = themeName },
        
        get system() {
            const systemColorScheme = Appearance.getColorScheme()
            if (systemColorScheme === 'light') return _light
            else if (systemColorScheme === 'dark') return _dark
            else return _default
        }
    })
}()

export function registerThemes<T extends Theme>( ...themes: ([T, 'light' | 'dark' | 'default' | undefined | null] | T)[] ) {

    if (!themes.length) throw new Error('react-native-theme: you have to register at least one theme')

    themes.forEach((themeInfo) => {
        
        let theme: T, colorScheme: 'light' | 'dark' | 'default' | undefined | null
        
        if (themeInfo instanceof Array) [theme, colorScheme] = themeInfo
        else theme = themeInfo
        
        Themes[theme.name] = theme
        if (colorScheme) colorSchemeToThemeName[colorScheme] = theme.name
        if (!THEME_NAME.value) setTHEME_NAME(theme.name, { save: false, shouldChangeNavigationBarColor: false })
    })

    if (!colorSchemeToThemeName.default) colorSchemeToThemeName.default = themes[0][0].name
    if (!colorSchemeToThemeName.light) colorSchemeToThemeName.light = themes[0][0].name
    if (!colorSchemeToThemeName.dark) colorSchemeToThemeName.dark = themes[0][0].name

    if (!THEME_NAME.value || THEME_NAME.value === themes[0][0].name) {

        AsyncStorage.getItem('react-native-theme/theme-name').then(themeName => {
            if (themeName && Themes[themeName] && themeName !== THEME_NAME.value) {
                setTHEME_NAME(themeName, { save: false })
                return false
            }
            else return true
        }).then(shouldChangeNavigationBarColor => {
            if (themes[0][0].androidNavigationBarColor && shouldChangeNavigationBarColor) {
                changeNavigationBarColor(
                    themes[0][0].androidNavigationBarColor,
                    themes[0][0].androidNavigationBarColorScheme === 'light' ? true : false,
                    false
                )
            }
        })
    }
}

export function theme<T extends Theme>(theme: T, colorScheme?: 'light' | 'dark' | 'default'): [T, 'light' | 'dark' | 'default' | undefined | null] {
    return [theme, colorScheme]
}

const THEME_NAME = new BehaviorSubject<string|undefined>(undefined)

function setTHEME_NAME(themeName: string, { save = true, changeNavigationBarColorAnimated = false, shouldChangeNavigationBarColor = true } = {}) {
    if (!Themes[themeName]) throw new Error(`react-native-theme: trying to set a theme that wasn't registered: "${themeName}"`)
    if (save) AsyncStorage.setItem('react-native-theme/theme-name', themeName)
    if (themeName !== THEME_NAME.value) {
        THEME_NAME.next(themeName)
        const theme = Themes[themeName]
        if (theme.androidNavigationBarColor && shouldChangeNavigationBarColor) changeNavigationBarColor(theme.androidNavigationBarColor, theme.androidNavigationBarColorScheme === 'light' ? true : false, changeNavigationBarColorAnimated)
    }
}

export function useTheme<T extends Theme = Theme>() {
    
    const [themeName, setThemeName] = useState(THEME_NAME.value)

    useEffect(() => {
        const subscription = THEME_NAME.subscribe(setThemeName)
        return () => subscription.unsubscribe()
    }, [])

    if (!themeName) throw new Error('react-native-theme: you have to register at least one theme')
    else return Themes[themeName] as T
}

export function getTheme<T extends Theme = Theme>(): T {
    if (!THEME_NAME.value) throw new Error('react-native-theme: you have to register at least one theme')
    else return Themes[THEME_NAME.value] as T
}

export function setTheme(themeName: string) {
    setTHEME_NAME(themeName, { changeNavigationBarColorAnimated: true })
}

export function getThemes<T extends Theme = Theme>() {
    return Object.freeze({ ...Themes }) as { [k: string]: T }
}

const LOADING = new BehaviorSubject(!THEME_NAME.value)

const loadingSubscription = THEME_NAME.subscribe(themeName => {
    LOADING.next(!themeName)
    if (themeName) loadingSubscription.unsubscribe()
    LOADING.complete()
})

export function isLoading() {
    return LOADING.value
}

export function useThemeLoading() {

    const [isLoading, setIsLoading] = useState(LOADING.value)

    useEffect(() => {
        const subscription = LOADING.subscribe(loading => {
            setIsLoading(loading)
            if (!loading) subscription.unsubscribe()
        })
        return () => {
            if (!subscription.closed) subscription.unsubscribe()
        }
    }, [])

    return isLoading
}