import React from 'react'

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


    return <div>
        <div className="hbox">
            <button id="set-light-theme" onClick={set_light_theme}>light</button>
            <button id="set-dark-theme" onClick={set_dark_theme}>dark</button>

            <button id="without-tint">no tint</button>
            <button id="with-tint">tint</button>
            <button id="with-heavy-tint">heavy tint</button>
        </div>

        <div className="hbox" id="hues">{hues}</div>


        <ul className="menu-bar">
            <li>
                <div className="item">
                    <button className="menu-button">File</button>
                </div>
                <ul className="menu-container">
                    <li>
                        <div className="item">
                            <button className="menu-button">New</button>
                        </div>
                    </li>
                    <li>
                        <div className="item">
                            <button className="menu-button">Open</button>
                        </div>
                    </li>
                    <li className="divider"></li>
                    <li>
                        <div className="item">
                            <button className="menu-button">Close</button>
                        </div>
                    </li>
                    <li>
                        <div className="item">
                            <button className="menu-button">Quit</button>
                        </div>
                    </li>
                </ul>
            </li>
            <li>
                <div className="item">
                    <button className="menu-button">Edit</button>
                </div>
                <ul className="menu-container">
                    <li>
                        <div className="item">
                            <button className="menu-button">Cut</button>
                        </div>
                    </li>
                    <li>
                        <div className="item">
                            <button className="menu-button">Copy</button>
                        </div>
                    </li>
                    <li>
                        <div className="item">
                            <button className="menu-button">Paste</button>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
        <div className="hbox">
            <ul>
                <li>fun item 1</li>
                <li>fun item 1</li>
                <li className="selected" tabIndex="0">fun item 1</li>
                <li>fun item 1</li>
            </ul>
            <div className="form-grid grow">
                <div className="toggle-group c2">
                    <button className="toggle">Wallpaper</button>
                    <button className="toggle selected">Appearance</button>
                    <button className="toggle">Dock</button>
                    <button className="toggle">Multitasking</button>
                </div>
                <label>Style:</label>
                <div className="group">
                    <div className="custom-toggle">
                        <input type="radio" name="style" id="style_light"/>
                        <label htmlFor="style_light">
                            <img s1rc="#" width="100" height="75"/>
                            <span>Light</span>
                        </label>
                    </div>
                    <div className="custom-toggle selected">
                        <input type="radio" name="style" id="style_dark" checked/>
                        <label htmlFor="style_dark">
                            <img src="#" width="100" height="75"/>
                            <span>Dark</span>
                        </label>
                    </div>

                </div>
                <label className="c2">Visual style for system components like the Dock and Panel indicators.</label>
                <label>Schedule:</label>
                <div className="toggle-group c2">
                    <button className="selected">Disabled</button>
                    <button className="">Sunset to Sunrise</button>
                    <button className="">Manual</button>
                </div>
                <div className="group c2">
                    <label>From:</label>
                    <input type="time" value="3:00 pm"/>
                    <label>To:</label>
                    <input type="time" value="7:00 am"/>
                </div>

                <label>Accent</label>
                <div className="color-group c2">
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
                </div>
                <label className="c2">Used across the system by default. Apps can always use their own accent color.</label>
                <label>Window animations:</label>
                <div className="group">
                    <input type="radio" id="anim_fast" name="anim"/>
                    <label htmlFor="anim_fast">fast</label>
                    <input type="radio" id="anim_slow" name="anim" checked/>
                    <label htmlFor="anim_slow">slow</label>
                </div>
                <label>Panel translucency:</label>
                <input type="checkbox" checked/>


                <label>Text size:</label>
                <div className="toggle-group">
                    <button>Small</button>
                    <button className="selected">Default</button>
                    <button>Large</button>
                    <button>Larger</button>
                </div>

                <label>Dyslexia-friendly text:</label>
                <input type="checkbox"/>

                <label className="c2">bottom-heavy shapes and increased character spacing can help improve
                    legibility and reading speed.</label>

                <label>more buttons</label>
                <div className="group">
                    <button>button</button>
                    <button disabled>disabled</button>
                    <button className="primary">primary</button>
                </div>
                <label>more checkboxes</label>
                <div className="group">
                    <input type="checkbox" id="regular_checkbox"/>
                    <label htmlFor="regular_checkbox">checkbox</label>
                    <input type="checkbox" id="disabled_checkbox" disabled/>
                    <label htmlFor="disabled_checkbox">checkbox</label>
                </div>

                <label>number inputs</label>
                <div className="group">
                    <input type="number" step="1" value="50" max="100" size="5"/>
                    <select>
                        <option>option 1</option>
                        <option selected>option 2</option>
                        <option>option 3</option>
                    </select>
                </div>

            </div>

        </div>
    </div>
}