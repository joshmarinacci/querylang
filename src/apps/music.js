import React, {useContext, useEffect, useRef, useState} from 'react'
import {DataList, HBox, Panel, Spacer, StandardListItem, Toolbar, TopToolbar, VBox, Window} from '../ui/ui.js'
import {DBContext, project, propAsBoolean, propAsIcon, propAsString, sort, useDBChanged} from '../db.js'
import {CATEGORIES, SORTS} from '../schema.js'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_PROP_TRUE, IS_TYPE} from '../query2.js'
import Icon from '@material-ui/core/Icon'
import {DataTable} from '../ui/datatable.js'
import {Grid3Layout} from '../ui/grid3layout.js'
import {SourceList, StandardSourceItem} from '../ui/sourcelist.js'
import {TitleBar} from '../stories/email_example.js'

const uniqueBy = (list,propname) => {
    let map = new Map()
    list.forEach(o=>{
        map.set(o.props[propname],o)
    })
    return Array.from(map.values())
}

export function SongsPanel({songs, playSong, db, ...rest}) {
    const [selectedSong, setSelectedSong] = useState(null)
    let [sortField, setSortField] = useState(null)
    let [sortDir, setSortDir] = useState(SORTS.ASCENDING)

    let [data, setData] = useState(songs)

    useEffect(() => {
        let d2 = sort(songs,[sortField], sortDir)
        setData(d2)
    },[songs, sortField, sortDir])

    return <VBox grow scroll {...rest}>
        <DataTable data={data} selected={selectedSong} setSelected={setSelectedSong}
                   sortDirection={sortDir}
                   sortField={sortField}
                   onDoubleClick={(o,k)=>{
                       console.log("double clicked on",o,k)
                       playSong(o)
                   }}
                   onSortChange={(a)=>{
                       let sd = sortDir
                       if(sortField === a) {
                           if(sd === SORTS.ASCENDING) {
                               sd = SORTS.DESCENDING
                           }else {
                               sd = SORTS.ASCENDING
                           }
                       }
                       setSortDir(sd)
                       setSortField(a)
                   }}
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

    return [
        <SourceList data={artists} column={2} row={2} selected={selectedArtist} setSelected={choose}
                    renderItem={({item, ...args}) => <StandardSourceItem title={propAsString(item,'artist')} {...args} />}
        />,
        <SongsPanel songs={songs} playSong={playSong} db={db} className={"col3 span3"}/>
    ]
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
    return [
        <SourceList data={albums} column={2} row={2} selected={selectedAlbum} setSelected={choose}
                    renderItem={({item, ...args}) => <StandardSourceItem title={propAsString(item,'album')} {...args} />}
        />,
        <SongsPanel songs={songs} playSong={playSong} db={db} className={'col3 span3'}/>
    ]
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
            if(audioRef && audioRef.current) {
                audioRef.current.removeEventListener("play", handler)
                audioRef.current.removeEventListener("loadeddata", handler)
                audioRef.current.removeEventListener("durationchange", handler)
                audioRef.current.addEventListener("timeupdate", handler)
            }
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
    return <HBox center style={{
        fontSize:'8pt',
    }}>
        <Icon onClick={togglePlaying}>{icon}</Icon>
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

    let panel = <Panel grow className={'panel col2 row2 span3'}>nothing</Panel>
    if(selectedGroup) {
        if(propAsString(selectedGroup,'title') === 'Songs') {
            let songs = db.QUERY(AND(IS_CATEGORY(CATEGORIES.MUSIC.ID), IS_TYPE(CATEGORIES.MUSIC.TYPES.SONG)))
            panel = <SongsPanel songs={songs} playSong={setSelectedSong} db={db} className={'col2 row2 span3'}/>
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

    return <Grid3Layout>
        <TitleBar title={'music'}/>
        <TopToolbar column={2} span={3}>
            <PlayPanel selectedSong={selectedSong}/>
            <Spacer/>
            <input type={'search'} value={searchTerms} onChange={e => setSearchTerms(e.target.value)}/>
        </TopToolbar>
        <SourceList column={1} row={2} data={groups}
                    selected={selectedGroup} setSelected={setSelectedGroup}
                    secondary
                    renderItem={({item, ...args}) => <StandardSourceItem
                        icon={propAsString(item,'icon')}
                        title={propAsString(item,'title')}
                        {...args}
                    />}/>
            {panel}
    </Grid3Layout>
}
