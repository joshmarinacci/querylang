import {HBox, VBox} from '../ui/ui.js'
import {useContext} from 'react'
import {DBContext, propAsString} from '../db.js'
import {AND, IS_CATEGORY, IS_ID, IS_PROP_SUBSTRING, IS_TYPE, OR} from '../query2.js'
import {CATEGORIES} from '../schema.js'

export function ViewImagePanel({args}) {
    let db = useContext(DBContext)
    let q = AND(
        IS_CATEGORY(CATEGORIES.FILES.ID),
        IS_TYPE(CATEGORIES.FILES.SCHEMAS.FILE_INFO.TYPE),
        IS_ID(args.info.fileid),
    )
    console.log("query is",q)
    let files = db.QUERY(q)
    console.log("image panel with args",args,files)
    let file = files[0]
    console.log('fileid',args.info.fileid,'becomes',file)
    return <VBox className={'grow scroll'} style={{
        backgroundColor:'var(--bg-dark)',
        padding:'1em',
        alignItems:'center',
    }}>
            <b>{propAsString(file,'filename')}</b>
            <img className={'thumbnail'} src={propAsString(file,'url')}
                 style={{
                     width:'auto',
                     maxWidth:'300px',
                     height:'auto',
                 }}
            />
    </VBox>

}