import React, {useEffect, useRef, useState} from 'react'
import {DataList, HBox, Spacer, Toolbar, VBox, Window} from './ui.js'
import {propAsBoolean, propAsIcon, propAsString, useDBChanged} from './db.js'
import {CATEGORIES} from './schema.js'
import {AND} from './query2.js'
import {HiPlusCircle} from 'react-icons/hi'
import {MdCheckBox, MdCheckBoxOutlineBlank} from 'react-icons/md'

const isGroup = () => ({ TYPE:CATEGORIES.MUSIC.TYPES.GROUP })
const isSong = () => ({ TYPE:CATEGORIES.MUSIC.TYPES.SONG })
const isMusicCategory = () => ({ CATEGORY:CATEGORIES.MUSIC.ID })
const isPropTrue = (prop) => ({ equal: {prop, value:true}})

export function Music({db, app, appService}) {
    useDBChanged(db,CATEGORIES.TASKS.ID)

    const [selectedGroup, setSelectedGroup] = useState(null)
    const [searchTerms, setSearchTerms] = useState("")
    const [selectedSong, setSelectedSong] = useState(null)
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
    let songs = db.QUERY(AND(isMusicCategory(), isSong()))


    const playSong = (o) => {
        console.log("toggling")
        setPlayingTitle(propAsString(o,'title'))
        setPlayingSong(o)
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
            <VBox grow>
                <DataList data={songs} selected={selectedSong} setSelected={setSelectedSong}
                          stringify={(o) => {
                              return <HBox>
                                  <button onClick={()=>playSong(o)}>play</button>
                                  {propAsString(o,'title')} &nbsp;
                                  {propAsString(o,'artist')}  &nbsp;
                                  {propAsString(o,'album')}
                              </HBox>
                          }}
                />

            </VBox>
        </HBox>
    </Window>
}
