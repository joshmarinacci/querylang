import {FILE_SERVER_URL, SCAN_SERVER_URL} from '../globals.js'
import {get_json_with_auth} from '../util.js'
import {propAsString} from '../db.js'
import React from 'react'
import {CATEGORIES} from '../schema.js'

export async function scan_file(url) {
    let furl = `${SCAN_SERVER_URL}?url=${url}`;
    return get_json_with_auth(furl).then(r => r.json())
}

export async function upload_url(url) {
    let furl = `${FILE_SERVER_URL}/import?url=${url}`;
    return get_json_with_auth(furl).then(r => r.json())
}

export async function list_files() {
    let furl = `${FILE_SERVER_URL}/list/`;
    return fetch(furl).then(r => r.json())
}

export function calculate_data_url(real_file) {
    return `${FILE_SERVER_URL} ${real_file.info.path}`
}
export function calculate_thumb_url(db_file) {
    let thumbid = db_file.props.meta.thumbs[0].thumbid
    let fileid = db_file.props.fileid
    return `${FILE_SERVER_URL}/file/${fileid}/thumbs/${thumbid}`
}

export function get_mime_major(db_file) {
    let mimetype = propAsString(db_file,CATEGORIES.FILES.SCHEMAS.FILE_INFO.props.mimetype.key);
    return mimetype.substring(0,mimetype.indexOf('/'))
}