import React, {useEffect, useRef, useState} from 'react'
import {DataList, HBox, Spacer, Toolbar, VBox, Window} from './ui.js'
import {project, propAsBoolean, propAsIcon, propAsString, useDBChanged} from './db.js'
import {CATEGORIES} from './schema.js'
import {AND} from './query2.js'

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

export function SongsPanel({songs, playSong, db}) {
    const [selectedSong, setSelectedSong] = useState(null)
    return <DataList data={songs} selected={selectedSong} setSelected={setSelectedSong}
                  stringify={(o) => {
                      return <HBox>
                          <button onClick={()=>playSong(o)}>play</button>
                          {propAsString(o,'title')} &nbsp;
                          {propAsString(o,'artist')}  &nbsp;
                          {propAsString(o,'album')}
                      </HBox>
                  }}
        />
}

export function ArtistsPanel({artists, db}) {
    const [selectedArtist, setSelectedArtist] = useState(null)
    return <DataList data={artists}
                     selected={selectedArtist} setSelected={setSelectedArtist}
                     stringify={o => propAsString(o,'artist')}
    >


    </DataList>
}

export function AlbumsPanel({albums, db}) {
    const [selectedAlbum, setSelectedAlbum] = useState(null)
    return <DataList data={albums}
                     selected={selectedAlbum} setSelected={setSelectedAlbum}
                     stringify={o => propAsString(o,'album')}
    >


    </DataList>
}

export function Music({db, app, appService}) {
    useDBChanged(db,CATEGORIES.TASKS.ID)

    const [selectedGroup, setSelectedGroup] = useState(null)
    const [searchTerms, setSearchTerms] = useState("")
    const [playingTitle, setPlayingTitle] = useState('====')
    const [playingSong, setPlayingSong] = useState(null)

    const audioRef = useRef(null)

    useEffect(()=>{
        if(playingSong && audioRef.current) {
            audioRef.current.src = propAsString(playingSong,'url')
            audioRef.current.volume = 0.2
        }
        return ()=>{
        }
    })

    const togglePlaying = () => {
        if(playingSong && audioRef.current) {
            if(audioRef.current.paused) {
                audioRef.current.play()
            } else {
                audioRef.current.pause()
            }
        }
    }

    let groups = db.QUERY(AND(isGroup(), isMusicCategory(), isPropTrue('active')))

    const playSong = (o) => {
        console.log("toggling")
        setPlayingTitle(propAsString(o,'title'))
        setPlayingSong(o)
    }



    let panel = <div>nothing</div>
    if(selectedGroup) {
        if(propAsString(selectedGroup,'title') === 'Songs') {
            let songs = db.QUERY(AND(isMusicCategory(), isSong()))
            panel = <SongsPanel songs={songs} playSong={playSong} db={db}/>
        }
        if(propAsString(selectedGroup,'title') === 'Artists') {
            let songs = db.QUERY(AND(isMusicCategory(), isSong()))
            let artists = project(songs,['artist'])
            artists = uniqueBy(artists,'artist')
            panel = <ArtistsPanel artists={artists} playSong={playSong}  db={db}/>
        }
        if(propAsString(selectedGroup,'title') === 'Albums') {
            let songs = db.QUERY(AND(isMusicCategory(), isSong()))
            let albums = project(songs,['album'])
            albums = uniqueBy(albums,'album')
            console.log("albums are",albums)
            panel = <AlbumsPanel albums={albums} playSong={playSong} db={db}/>
        }
    }

    return <Window  app={app} appService={appService} width={600} height={300}>
        <Toolbar>
            <button onClick={togglePlaying}>play</button>
            <label>playing: {playingTitle}</label>
            <audio ref={audioRef}/>
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
