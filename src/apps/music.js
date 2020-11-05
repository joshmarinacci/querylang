import React, {useContext, useEffect, useRef, useState} from 'react'
import {DataList, HBox, Spacer, StandardListItem, Toolbar, VBox, Window} from '../ui/ui.js'
import {DBContext, project, propAsBoolean, propAsIcon, propAsString, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_PROP_TRUE, IS_TYPE} from '../query2.js'
import Icon from '@material-ui/core/Icon'
import {DataTable} from '../ui/datatable.js'

// const isGroup = () => ({ TYPE:CATEGORIES.MUSIC.TYPES.GROUP })
// const isSong = () => ({ TYPE:CATEGORIES.MUSIC.TYPES.SONG })
// const isMusicCategory = () => ({ CATEGORY:CATEGORIES.MUSIC.ID })
// const isPropTrue = (prop) => ({ equal: {prop, value:true}})
const uniqueBy = (list,propname) => {
    let map = new Map()
    list.forEach(o=>{
        map.set(o.props[propname],o)
    })
    return Array.from(map.values())
}
// const isPropEqual = (prop,value) => ({ equal: {prop, value}})

export function SongsPanel({songs, playSong, db}) {
    const [selectedSong, setSelectedSong] = useState(null)
    return <VBox grow scroll>
        <DataTable data={songs} selected={selectedSong} setSelected={setSelectedSong}
                   headers={["","Title","Artist","Album"]}
                   prepend={["play"]}
                   stringifyDataColumn={(o,k) => {
                       if(k === 'play') return <Icon onClick={()=>playSong(o)}>play_arrow</Icon>
                       if(k === 'url') return null
                       return propAsString(o,k)
                   }}
        />
    </VBox>
}

export function ArtistsPanel({artists, db, playSong}) {
    const [selectedArtist, setSelectedArtist] = useState(null)
    const [songs,setSongs] = useState([])
    const choose = (artist) => {
        setSelectedArtist(artist)
        setSongs(db.QUERY(AND(
            IS_CATEGORY(CATEGORIES.MUSIC.ID),
            IS_TYPE(CATEGORIES.MUSIC.TYPES.SONG),
            IS_PROP_EQUAL('artist', propAsString(artist,'artist'))
        )))
    }

    return <HBox grow>
        <DataList data={artists}
                  selected={selectedArtist} setSelected={choose}
                  stringify={o => <StandardListItem  title={propAsString(o, 'artist')}/>}
        />
        <SongsPanel songs={songs} playSong={playSong} db={db}/>
    </HBox>
}

export function AlbumsPanel({albums, db, playSong}) {
    const [selectedAlbum, setSelectedAlbum] = useState(null)
    const [songs,setSongs] = useState([])
    const choose = (album) => {
        setSelectedAlbum(album)
        setSongs(db.QUERY(AND(
            IS_CATEGORY(CATEGORIES.MUSIC.ID),
            IS_TYPE(CATEGORIES.MUSIC.TYPES.SONG),
            IS_PROP_EQUAL('album', propAsString(album,'album'))
        )))
    }
    return <HBox grow>
        <DataList data={albums}
                  selected={selectedAlbum} setSelected={choose}
                  stringify={o => <StandardListItem  title={propAsString(o, 'album')}/>}
        />
        <SongsPanel songs={songs} playSong={playSong} db={db}/>
    </HBox>
}

export function PlayPanel({selectedSong}) {
    const audioRef = useRef(null)
    const [playing, setPlaying] = useState(false)
    const [playtime, setPlaytime] = useState(0)
    const [duration, setDuration] = useState(0)


    const handler = (e) => {
        if(e.type === 'timeupdate'     && audioRef.current) setPlaytime(Math.round(audioRef.current.currentTime))
        if(e.type === 'durationchange' && audioRef.current) setDuration(Math.round(audioRef.current.duration))
    }
    useEffect(()=>{
        if(selectedSong && audioRef.current) {
            console.log("set url")
            audioRef.current.src = propAsString(selectedSong,'url')
            audioRef.current.volume = 0.2
            audioRef.current.addEventListener("play",handler)
            audioRef.current.addEventListener("loadeddata",handler)
            audioRef.current.addEventListener("durationchange",handler)
            audioRef.current.addEventListener("timeupdate",handler)
        }
        return ()=>{
            audioRef.current.removeEventListener("play",handler)
            audioRef.current.removeEventListener("loadeddata",handler)
            audioRef.current.removeEventListener("durationchange",handler)
            audioRef.current.addEventListener("timeupdate",handler)
        }
    },[selectedSong])

    const togglePlaying = () => {
        if(selectedSong && audioRef.current) {
            if(audioRef.current.paused) {
                audioRef.current.play()
                setPlaying(true)
            } else {
                audioRef.current.pause()
                setPlaying(false)
            }
        }
    }

    let song = selectedSong
    if(!song) {
        song = {
            props:{
                title:'',
                artist:'',
                album:'',
            }
        }
    }

    let icon = "pause_circle_outline"
    if(audioRef.current && audioRef.current.paused) {
        icon = "play_circle_outline"
    }
    return <HBox center>
        <button onClick={togglePlaying}>
            <Icon>{icon}</Icon>
        </button>
        <audio ref={audioRef}/>
        <VBox center>
            <label>{propAsString(song,'title')}</label>
            <label>{propAsString(song,'artist')} - {propAsString(song,'album')}</label>
            <HBox>
                <label>{duration}</label> - <label>{playtime}</label>
            </HBox>
        </VBox>
    </HBox>
}

export function Music({app}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.TASKS.ID)

    const [selectedGroup, setSelectedGroup] = useState(null)
    const [searchTerms, setSearchTerms] = useState("")
    const [selectedSong, setSelectedSong] = useState(null)

    let groups = db.QUERY(AND(
        IS_CATEGORY(CATEGORIES.MUSIC.ID),
        IS_TYPE(CATEGORIES.MUSIC.TYPES.GROUP),
        IS_PROP_TRUE('active')))

    let panel = <div>nothing</div>
    if(selectedGroup) {
        if(propAsString(selectedGroup,'title') === 'Songs') {
            let songs = db.QUERY(AND(IS_CATEGORY(CATEGORIES.MUSIC.ID), IS_TYPE(CATEGORIES.MUSIC.TYPES.SONG)))
            panel = <SongsPanel songs={songs} playSong={setSelectedSong} db={db}/>
        }
        if(propAsString(selectedGroup,'title') === 'Artists') {
            let songs = db.QUERY(AND(IS_CATEGORY(CATEGORIES.MUSIC.ID), IS_TYPE(CATEGORIES.MUSIC.TYPES.SONG)))
            let artists = project(songs,['artist'])
            artists = uniqueBy(artists,'artist')
            panel = <ArtistsPanel artists={artists} playSong={setSelectedSong}  db={db}/>
        }
        if(propAsString(selectedGroup,'title') === 'Albums') {
            let songs = db.QUERY(AND(IS_CATEGORY(CATEGORIES.MUSIC.ID), IS_TYPE(CATEGORIES.MUSIC.TYPES.SONG)))
            let albums = project(songs,['album'])
            albums = uniqueBy(albums,'album')
            panel = <AlbumsPanel albums={albums} playSong={setSelectedSong} db={db}/>
        }
    }

    return <Window app={app}>
        <Toolbar>
            <PlayPanel selectedSong={selectedSong}/>
            <Spacer/>
            <input type={'search'} value={searchTerms} onChange={e => setSearchTerms(e.target.value)}/>
        </Toolbar>
        <HBox grow>
                <DataList data={groups} selected={selectedGroup} setSelected={setSelectedGroup}
                      stringify={(o,i) => <StandardListItem key={i} title={propAsString(o,'title')} icon={propAsString(o,'icon')}/>}
                />
            {panel}
        </HBox>
    </Window>
}
