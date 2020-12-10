import {HBox, Spacer, VBox} from '../ui/ui.js'

export function WeatherPanel({args, onClose}) {
    console.log('args are',args)
    return <VBox className={'grow scroll center'} style={{
        backgroundColor:'var(--bg-dark)',
        padding:'1em',
    }}>
        <img src={args.info.current.condition.icon} style={{
            minHeight:'10em'
        }}/>
        <b style={{
            fontSize:'30pt',
        }}
        >{args.info.current.temp_f} F</b>
        <b>{args.info.location.name} {args.info.location.region}</b>
        <Spacer/>
        <button onClick={onClose}>close</button>
    </VBox>

}