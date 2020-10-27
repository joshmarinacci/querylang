import React, {useEffect, useRef, useState} from 'react'
import {DataList, HBox, Spacer, Toolbar, VBox, Window} from './ui.js'
import {project, propAsBoolean, propAsIcon, propAsString, useDBChanged} from './db.js'
import {CATEGORIES} from './schema.js'
import {AND} from './query2.js'
import Icon from '@material-ui/core/Icon'

const isGroup = () => ({ TYPE:CATEGORIES.MUSIC.TYPES.GROUP })
const isSong = () => ({ TYPE:CATEGORIES.MUSIC.TYPES.SONG })
const isMusicCategory = () => ({ CATEGORY:CATEGORIES.MUSIC.ID })
const isPropTrue = (prop) => ({ equal: {prop, value:true}})
const uniqueBy = (list,propname) => {
    let map = new Map()
    list.forEach(o=>{
        map.set(o.props[propname],o)
    })
    return Array.from(map.values())
}
const isPropEqual = (prop,value) => ({ equal: {prop, value}})

export function SongsPanel({songs, playSong, db}) {
    const [selectedSong, setSelectedSong] = useState(null)
    return <DataList data={songs} selected={selectedSong} setSelected={setSelectedSong}
                  stringify={(o) => {
                      return <HBox>
                          <button onClick={()=>playSong(o)}>select</button>
                          {propAsString(o,'title')} &nbsp;
                          {propAsString(o,'artist')}  &nbsp;
                          {propAsString(o,'album')}
                      </HBox>
                  }}
        />
}

export function ArtistsPanel({artists, db, playSong}) {
    const [selectedArtist, setSelectedArtist] = useState(null)
    const [songs,setSongs] = useState([])
    const choose = (artist) => {
        setSelectedArtist(artist)
        setSongs(db.QUERY(AND(
            isMusicCategory(),
            isSong(),
            isPropEqual('artist', propAsString(artist,'artist'))
        )))
    }

    return <HBox grow>
        <DataList data={artists}
                  selected={selectedArtist} setSelected={choose}
                  stringify={o => propAsString(o, 'artist')}
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
            isMusicCategory(),
            isSong(),
            isPropEqual('album', propAsString(album,'album'))
        )))
    }
    return <HBox grow>
        <DataList data={albums}
                  selected={selectedAlbum} setSelected={choose}
                  stringify={o => propAsString(o,'album')}
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
        // console.log("event",e.type,e)
        // console.log(audioRef.current.duration)
        console.log(audioRef.current.paused)
        if(e.type === 'timeupdate') {
            setPlaytime(Math.round(audioRef.current.currentTime))
            setDuration(Math.round(audioRef.current.duration))
        }
    }
    useEffect(()=>{
        if(selectedSong && audioRef.current) {
            console.log("set url")
            audioRef.current.src = propAsString(selectedSong,'url')
            // audioRef.current.autoplay = true
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

export function Music({db, app, appService}) {
    useDBChanged(db,CATEGORIES.TASKS.ID)

    const [selectedGroup, setSelectedGroup] = useState(null)
    const [searchTerms, setSearchTerms] = useState("")
    const [selectedSong, setSelectedSong] = useState(null)

    let groups = db.QUERY(AND(isGroup(), isMusicCategory(), isPropTrue('active')))

    let panel = <div>nothing</div>
    if(selectedGroup) {
        if(propAsString(selectedGroup,'title') === 'Songs') {
            let songs = db.QUERY(AND(isMusicCategory(), isSong()))
            panel = <SongsPanel songs={songs} playSong={setSelectedSong} db={db}/>
        }
        if(propAsString(selectedGroup,'title') === 'Artists') {
            let songs = db.QUERY(AND(isMusicCategory(), isSong()))
            let artists = project(songs,['artist'])
            artists = uniqueBy(artists,'artist')
            panel = <ArtistsPanel artists={artists} playSong={setSelectedSong}  db={db}/>
        }
        if(propAsString(selectedGroup,'title') === 'Albums') {
            let songs = db.QUERY(AND(isMusicCategory(), isSong()))
            let albums = project(songs,['album'])
            albums = uniqueBy(albums,'album')
            panel = <AlbumsPanel albums={albums} playSong={setSelectedSong} db={db}/>
        }
    }

    return <Window  app={app} appService={appService} width={600} height={300}>
        <Toolbar>
            <PlayPanel selectedSong={selectedSong}/>
            <Spacer/>
            <input type={'search'} value={searchTerms} onChange={e => setSearchTerms(e.target.value)}/>
        </Toolbar>
        <HBox grow>
            <DataList data={groups} selected={selectedGroup} setSelected={setSelectedGroup}
                      stringify={((o,i) => <HBox key={i}>
                            {propAsString(o,'title')}
                      </HBox>)}
            />
            {panel}
        </HBox>
    </Window>
}
