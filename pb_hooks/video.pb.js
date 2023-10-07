/// <reference path="../pb_data/types.d.ts" />


routerAdd("get", "/v/:id", (c) => {
    const record = c.get("authRecord")
    let id = c.pathParam("id");
    id = id.replace(/'/g, "");

    let vid_tittle = ""
    let vid_desc = ""
    let vid_src = ""
    const vid_record = new Record();
    try {
        $app.dao().recordQuery("videos")
        .andWhere($dbx.hashExp({
        "id":  id,
        }))
        .limit(1)
        .one(vid_record)
        if (vid_record){
            vid_tittle=vid_record.get("tittle")
            vid_desc=vid_record.get("desc")
            vid_src=vid_record.get("video")
        }
    } catch (error) {
        vid_desc="Video does not exist"
        const utils = require(`${__hooks}/utils.js`)
        return c.html(404, utils.get_error_page(404,"Video not found..."))
    }

    const html = $template.loadFiles(
        `${__hooks}/views/base/layout.html`,
        `${__hooks}/views/base/header.html`,
        `${__hooks}/views/video.html`,
    ).render({
        "vid_tittle":vid_tittle,
        "vid_desc":vid_desc,
        "vid_src":"http://localhost:8090/api/files/videos/"+id+"/"+vid_src,
        "authorized":record!=null,
    })

    return c.html(200, html)
})
routerAdd("get", "/v", (c) => {
    const record = c.get("authRecord")
    const utils = require(`${__hooks}/utils.js`)
    return c.html(404, utils.get_error_page(404,"Please specifi video you are looking for...",record!=null))
})
routerAdd("get", "/v/", (c) => {
    const record = c.get("authRecord")
    const utils = require(`${__hooks}/utils.js`)
    return c.html(404, utils.get_error_page(404,"Please specifi video you are looking for...",record!=null))
})