import { useState, useEffect } from 'react'
import { BehaviorSubject } from "rxjs"
import { Appearance } from 'react-native'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

import { addColorSchemeListener, getColorScheme } from './ColorScheme'
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

export function registerTheme<T extends Theme>(theme: T, colorScheme?: 'light' | 'dark') {
    
    Themes[theme.name] = theme

    if (!colorSchemeToThemeName.default) {
        colorSchemeToThemeName.default = theme.name
        colorSchemeToThemeName.light = theme.name
        colorSchemeToThemeName.dark = theme.name
        setTHEME_NAME(theme.name)
        addColorSchemeListener(colorScheme => setTHEME_NAME(colorSchemeToThemeName[colorScheme]!))
        Appearance.addChangeListener(({ colorScheme }) => {
            if (getColorScheme() === 'system') {
                if (colorScheme && colorSchemeToThemeName[colorScheme] !== THEME_NAME.value) setTHEME_NAME(colorSchemeToThemeName[colorScheme]!)
                else if (colorSchemeToThemeName.default !== THEME_NAME.value) setTHEME_NAME(colorSchemeToThemeName.default!)
            }
        })
        if (theme.androidNavigationBarColor) changeNavigationBarColor(theme.androidNavigationBarColor, theme.androidNavigationBarColorScheme === 'light' ? true : false, false)
    }
    else if (colorScheme) {
        colorSchemeToThemeName[colorScheme] = theme.name
        const currentColorScheme = getColorScheme()
        if (currentColorScheme === colorScheme || (currentColorScheme === 'system' && colorSchemeToThemeName.system === theme.name)) {
            setTHEME_NAME(theme.name)
        } 
    }

}

const THEME_NAME = new BehaviorSubject<string|undefined>(undefined)

AsyncStorage.getItem('react-native-theme/theme-name').then(themeName => {
    if (themeName && Themes[themeName] && themeName !== THEME_NAME.value) setTHEME_NAME(themeName, { save: false })
})

function setTHEME_NAME(themeName: string, { save = true, changeNavigationBarColorAnimated = false } = {}) {
    if (!Themes[themeName]) throw new Error(`react-native-theme: trying to set a theme that wasn't registered: "${themeName}"`)
    if (themeName !== THEME_NAME.value) {
        if (save) AsyncStorage.setItem('react-native-theme/theme-name', themeName)
        THEME_NAME.next(themeName)
        const theme = Themes[themeName]
        if (theme.androidNavigationBarColor) changeNavigationBarColor(theme.androidNavigationBarColor, theme.androidNavigationBarColorScheme === 'light' ? true : false, changeNavigationBarColorAnimated)
    }
}

export function useTheme<T extends Theme>() {
    
    const [themeName, setThemeName] = useState(THEME_NAME.value)

    useEffect(() => {
        const subscription = THEME_NAME.subscribe(setThemeName)
        return () => subscription.unsubscribe()
    }, [])

    if (!themeName) throw new Error('react-native-theme: you have to register at least one theme')
    else return Themes[themeName] as T
}

export function getTheme<T extends Theme>(): T {
    if (!THEME_NAME.value) throw new Error('react-native-theme: you have to register at least one theme')
    else return Themes[THEME_NAME.value] as T
}

export function setTheme(themeName: string) {
    setTHEME_NAME(themeName, { changeNavigationBarColorAnimated: true })
}