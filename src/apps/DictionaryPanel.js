import {HBox, VBox} from '../ui/ui.js'

export function DictionaryPanel({args, onClose}) {
    return <VBox className={'grow scroll'} style={{
        backgroundColor:'var(--bg-dark)',
        padding:'1em',
    }}>
        <HBox>
            <b>{args.info.word}</b>

            <i>{args.info.pronunciation}</i>
        </HBox>
        <p className={'grow'}>{args.info.definitions.map((def,i) => {
            return [<dt key={'type'+i}>{def.type}</dt>,<dd key={'def'+i}>{def.definition}</dd>]
        })}</p>
        <button onClick={onClose}>close</button>
    </VBox>

}