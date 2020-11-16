import React, {useEffect, useState} from 'react'
import {HBox, Toolbar, VBox} from './ui.js'
import {flatten} from '../util.js'

import "./filebrowser.css"
import {propAsString} from '../db.js'
import Icon from '@material-ui/core/Icon'

import {format} from "date-fns"
import {DATA, genid} from '../data.js'

import "./themetester.css"
import {StandardEditPanel} from './StandardEditPanel.js'
import {ENUM, INTEGER, STRING} from '../schema.js'
export const THEME_SCHEMA = {
    ID:"THEME",
    TITLE:'theming system',
    SCHEMAS: {
        THEME: {
            title:'theme',
            props: {
                fontfamily:{
                    key: 'fontfamily',
                    title:'font family',
                    type: ENUM,
                    values: ['sans1', 'sans2'],
                    default: 'sans1'
                },
                base_font_size: {
                    key:'base_font_size',
                    title:'base font size',
                    type:INTEGER,
                    default:'10'
                },
                base_font_weight: {
                    key:'base_font_weight',
                    type:ENUM,
                    values:['100','200','300','400','500','600','700','800'],
                    default:'400',
                },
                text_color: {
                    key:'text_color',
                    type:STRING,
                    default:'#000000',
                },
                background_color: {
                    key:'background_color',
                    type:STRING,
                    default:'#ffffff',
                },
                background_2: {
                    key:'background_2',
                    type:STRING,
                    default:'red',
                },
                toolbar_padding: {
                    key:'toolbar_padding',
                    type:INTEGER,
                    default: 5,
                },
                base_margin: {
                    key:'base_margin',
                    type:INTEGER,
                    default: 5,
                },
                base_border_radius: {
                    key:'base_border_radius',
                    type:INTEGER,
                    default: 5,
                },
                accent_color: {
                    key:'accent_color',
                    type:STRING,
                    default:'orange',
                },
                inverse_accent_color: {
                    key:'inverse_accent_color',
                    type:STRING,
                    default:'white',
                }
            }
        }
    }

}
export function ThemeTester({theme}) {
    let style = {
        '--base-font-size':`${theme.props.base_font_size}pt`,
        '--text-color': theme.props.text_color,
        '--base-font-weight':theme.props.base_font_weight,
        '--base-background-color':theme.props.background_color,
        '--background-two':theme.props.background_2,
        '--accent-color':theme.props.accent_color,
        '--inverted-accent-color':theme.props.inverse_accent_color,
        '--toolbar-padding':`${theme.props.toolbar_padding/10.0}em`,
        '--base-border-radius':`${theme.props.base_border_radius/10.0}em`,
        '--base-margin':`${theme.props.base_margin/10.0}em`,
    }
    return <HBox className={'theme-tester'}>
        <StandardEditPanel object={theme} customSchema={THEME_SCHEMA}/>
        <VBox style={style} className={'preview'}>
            <h3>example</h3>
            <Toolbar>
                <label>label</label>
                <Icon className={'icon'}>add</Icon>
                <Icon className={'icon'}>settings</Icon>
                <button>button</button>
                <Icon className={'icon'}>alarm</Icon>
                <input type={'search'}/>
                <Icon className={'icon'}>alarm</Icon>
            </Toolbar>
            <HBox>
                list goes here
            </HBox>
        </VBox>
    </HBox>

}