import React, {useContext, useEffect, useRef, useState} from 'react'
import {DBContext, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {Window} from '../ui/window.js'
import {MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "./maps.css"

export function MapViewer({app}) {
    let db = useContext(DBContext)
    useDBChanged(db, CATEGORIES.TASKS.ID)
    const position = [51.505, -0.09]
    return <MapContainer center={position} zoom={13} scrollWheelZoom={false} className={'jmap'}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
            <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
        </Marker>
    </MapContainer>
}
