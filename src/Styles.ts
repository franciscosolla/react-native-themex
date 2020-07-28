import React, { useMemo } from 'react'
import { Theme, useTheme } from './Theme'
import { StyleSheet } from 'react-native'

export function useStyles<T extends Theme, S extends StyleSheet.NamedStyles<S> | StyleSheet.NamedStyles<any>>(styleFactory: (theme: T) => S | StyleSheet.NamedStyles<S>) : { styles: S, theme: T } {

    const theme = useTheme() as T
    
    const styles = useMemo(() => StyleSheet.create(styleFactory(theme)), [theme])

    return { styles, theme }
}