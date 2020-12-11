import React, {useState} from 'react'
import {
    FormGroup,
    Group,
    HBox,
    MenuBar,
    MenuBarButton,
    MenuContainer,
    MenuDivider,
    MenuItem,
    ToggleButton,
    ToggleGroup, Toolbar, VBox
} from '../ui/ui.js'
import {Menu} from '@material-ui/core'
import {DataList, StandardSourceItem} from '../ui/dataList.js'
import {DataTable} from '../ui/datatable.js'
import {range} from '../util.js'

export function ThemeExamplePanel() {
    function rescale_lit(start, end, min, max) {
        for(let i=start; i<=end; i++) {
            let t = (i-start)/(end-start)
            // console.log(t)
            let v = min + t*(max-min)
            document.querySelector("body").style.setProperty(`--lit-${i}`,`${v}%`)
        }
    }
    const set_light_theme = () => rescale_lit(1,9,100,0)
    const set_dark_theme = () => rescale_lit(1,9,20,80)
    const set_theme = (hue, sat,acsat) => {
        let body = document.querySelector('body')
        body.style.setProperty("--bg-hue",`${hue}`)
        body.style.setProperty("--bg-sat",`${sat}%`)
        body.style.setProperty("--ac-sat",`${acsat}%`)
    }

    let hues = []
    for(let i=0; i<360; i+= 10) {
        hues.push(<div key={i} className={'swatch'}
                       onClick={()=>set_theme(i,5,100)}
                       style={{
                           backgroundColor:`hsl(${i},100%,80%)`,
                           color:'black',
                           width:'2em',
                           textAlign:'center',
                           height:'2em',
                           border:'1px solid black',
                           fontSize:'90%'
                       }}>{i}</div>)
    }

    const set_tint = (sat) => {
        let body = document.querySelector('body')
        body.style.setProperty("--bg-sat",`${sat}%`)
    }



    return <VBox scroll grow>
        <HBox>
            <button onClick={set_light_theme}>light</button>
            <button onClick={set_dark_theme}>dark</button>

            <button onClick={()=>set_tint(0)}>no tint</button>
            <button onClick={()=>set_tint(10)}>tint</button>
            <button onClick={()=>set_tint(20)}>heavy tint</button>
        </HBox>

        <HBox>{hues}</HBox>


        <MenuBar>
            <MenuBarButton caption={'File'}>
                <MenuContainer>
                    <MenuItem caption={'New'}/>
                    <MenuItem caption={'Open'}/>
                    <MenuDivider/>
                    <MenuItem caption={'Close'}/>
                    <MenuItem caption={'Quit'}/>
                </MenuContainer>
            </MenuBarButton>
            <MenuBarButton caption={'Edit'}>
                <MenuContainer>
                    <MenuItem caption={'Cut'}/>
                    <MenuItem caption={'Copy'}/>
                    <MenuItem caption={'Paste'}/>
                </MenuContainer>
            </MenuBarButton>
        </MenuBar>

        <PanelChoice/>
    </VBox>
}

function PanelChoice() {
    const [panel, set_panel] = useState('tables')
    let content = <div>nothing</div>
    if(panel === 'forms') content = <RenderPanel/>
    if(panel === 'tables') content = <RenderTable/>
    return <VBox scroll grow>
        <Toolbar>
            <ToggleGroup>
                <ToggleButton caption={'forms'} selected={panel==='forms'} onClick={()=>set_panel('forms')}/>
                <ToggleButton caption={'tables'} selected={panel==='tables'}  onClick={()=>set_panel('tables')}/>
            </ToggleGroup>
        </Toolbar>
        {content}
        <Toolbar>more stuff</Toolbar>
    </VBox>
}

function RenderTable() {
    let data = range(0,20).map(i => {
        return {
            id:i,
            props:{
                title:'blah '+i,
                number:i,
                instrument:'recorder'
            }
        }
    })
    const [sel, set_sel] = useState(null)
    return <div className={'grow scroll'}>
        <DataTable data={data} stringifyDataColumn={(o,k)=> o.props[k]+""} selected={sel} setSelected={set_sel}/>
    </div>
}

function RenderPanel() {
    const [sel, set_sel] = useState("")
    const items = ["fun item 1","fun item 2", "fun item 3", "fun item 4"].map(s=>({id:s,title:s}))
return     <HBox>
        <DataList data={items} selected={sel} setSelected={set_sel}
                  renderItem={({item,...rest})=>{
                      return <StandardSourceItem title={item.title} {...rest}/>
                  }}
        />
        <FormGroup>
            <ToggleGroup>
                <ToggleButton caption={'Wallpaper'}/>
                <ToggleButton caption={'Appearance'} selected={true}/>
                <ToggleButton caption={'Dock'}/>
                <ToggleButton caption={'Multitasking'}/>
            </ToggleGroup>
            <label className="col2">Visual style for system components like the Dock and Panel indicators.</label>
            <label>Schedule:</label>
            <ToggleGroup>
                <ToggleButton caption={'Disabled'} selected/>
                <ToggleButton caption={'Sunset to Sunrize'}/>
                <ToggleButton caption={'Manual'}/>
            </ToggleGroup>
            <Group>
                <label>From:</label>
                <input type="time" value="3:00 pm"/>
                <label>To:</label>
                <input type="time" value="7:00 am"/>
            </Group>

            <label>Accent</label>
            <Group>
                <button className="toggle color blue"></button>
                <button className="toggle color teal"></button>
                <button className="toggle color green"></button>
                <button className="toggle color yellow"></button>
                <button className="toggle color orange"></button>
                <button className="toggle color red"></button>
                <button className="toggle color pink"></button>
                <button className="toggle color purple"></button>
                <button className="toggle color brown"></button>
                <button className="toggle color gray"></button>
            </Group>
            <label className="col2">Used across the system by default. Apps can always use their own accent color.</label>
            <label>Window animations:</label>
            <Group>
                <input type="radio" id="anim_fast" name="anim"/>
                <label htmlFor="anim_fast">fast</label>
                <input type="radio" id="anim_slow" name="anim" checked/>
                <label htmlFor="anim_slow">slow</label>
            </Group>
            <label>Panel translucency:</label>
            <Group>
                <input type="checkbox" checked/>
            </Group>


            <label>Text size:</label>
            <ToggleGroup>
                <ToggleButton caption={'Small'}/>
                <ToggleButton caption={'Default'} selected/>
                <ToggleButton caption={'Large'}/>
                <ToggleButton caption={'Larger'}/>
            </ToggleGroup>

            <label>Dyslexia-friendly text:</label>
            <input type="checkbox"/>

            <label className="col2">bottom-heavy shapes and increased character spacing can help improve
                legibility and reading speed.</label>

            <label>more buttons</label>
            <Group>
                <button>button</button>
                <button disabled>disabled</button>
                <button className="primary">primary</button>
            </Group>
            <label>more checkboxes</label>
            <Group>
                <input type="checkbox" id="regular_checkbox"/>
                <label htmlFor="regular_checkbox">checkbox</label>
                <input type="checkbox" id="disabled_checkbox" disabled/>
                <label htmlFor="disabled_checkbox">checkbox</label>
            </Group>

            <label>number inputs</label>
            <Group>
                <input type="number" step="1" value="50" max="100" size="5"/>
                <select>
                    <option>option 1</option>
                    <option selected>option 2</option>
                    <option>option 3</option>
                </select>
            </Group>

        </FormGroup>
    </HBox>


}
