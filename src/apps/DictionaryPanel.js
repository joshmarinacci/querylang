import {HBox, VBox} from '../ui/ui.js'

export function DictionaryPanel({args}) {
    // console.log("DictionaryPanel args",args)
    return <VBox className={'grow scroll'} style={{
        backgroundColor:'var(--bg-dark)',
        padding:'1em',
    }}>
        <HBox>
            <b>{args.info.word}</b>

            <i>{args.info.pronunciation}</i>
        </HBox>
        <b>{args.info.definitions.map((def,i) => {
            return [<dt key={'type'+i}>{def.type}</dt>,<dd key={'def'+i}>{def.definition}</dd>]
        })}</b>
    </VBox>

}