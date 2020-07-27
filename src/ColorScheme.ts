import { useState, useEffect } from 'react'
import { BehaviorSubject } from 'rxjs'
import AsyncStorage from '@react-native-community/async-storage'

const ColorSchemes = Object.freeze(['light', 'dark', 'system'] as const)

export type ColorScheme = typeof ColorSchemes[number]

export const ColorScheme = ColorSchemes.reduce(<T extends ColorScheme>(o: any, t: T) => {
    o[t] = t
    return o
}, {} as { [k in ColorScheme]: k })

const COLOR_SCHEME = new BehaviorSubject<ColorScheme>(ColorScheme.system)

function setCOLOR_SCHEME(colorScheme: ColorScheme, save: boolean = true) {
    if (COLOR_SCHEME.value !== colorScheme) {
        if (save) AsyncStorage.setItem('@react-native-theme/color-scheme', colorScheme)
        COLOR_SCHEME.next(colorScheme)
    }
}

export function useColorScheme(): ColorScheme {

    const [colorScheme, setColorScheme] = useState(COLOR_SCHEME.value)

    useEffect(() => {
        const subscription = COLOR_SCHEME.subscribe(setColorScheme)
        return () => subscription.unsubscribe()
    })

    return colorScheme
}

export function getColorScheme(): ColorScheme {
    return COLOR_SCHEME.value
}

export function setColorScheme(colorScheme: ColorScheme) {
    setCOLOR_SCHEME(colorScheme)
}

export function addColorSchemeListener(listener: (colorScheme: ColorScheme) => void) {
    COLOR_SCHEME.subscribe(listener)
}