/// <reference path="../pb_data/types.d.ts" />

routerAdd("get", "/t/:tag", (c) => {
    const record = c.get("authRecord")
    let tag = c.pathParam("tag");
    tag = tag.replace(/'/g, "");
    tag = tag.toLocaleLowerCase()
    let tag_id = ""
    try {
        const tag_record = new Record;
        $app.dao().recordQuery("tags")
        .andWhere($dbx.hashExp({
        "name":  tag
        }))
        .limit(1)
        .one(tag_record)
        if (tag_record){
            tag_id=tag_record.get("id")
        }
    } catch (error) {
        const utils = require(`${__hooks}/utils.js`)
        return c.html(404, utils.get_error_page(404,"Could not find content with tag: "+tag))
    }

    const vid_record = arrayOf(new Record);
    try {
        $app.dao().recordQuery("videos")
        .andWhere($dbx.hashExp({"public":  true}))
        .andWhere($dbx.like("tags",tag_id))
        .orderBy("created DESC")
        .limit(12)
        .all(vid_record)
    } catch (error) {
        console.log("main page error");
        const utils = require(`${__hooks}/utils.js`)
        return c.html(404, utils.get_error_page(404,"Could not find content with tag: "+tag))
    }
    let data = []
    vid_record.forEach(el => {
        data.push({
            "id":el.get("id"),
            "tittle":el.get("tittle"),
            "icon":el.get("icon")
        })
    });
    const html = $template.loadFiles(
        `${__hooks}/views/base/layout.html`,
        `${__hooks}/views/base/header.html`,
        `${__hooks}/views/base/footer.html`,
        `${__hooks}/views/vid_grid.html`,
    ).render({
        "tittle":"Newest videos with tag: "+tag, //+'<br><a href="/t/'+tag+'/all>All</a>'
        "vids":data,
        "authorized":record!=null,
    })

    return c.html(200, html)
})
routerAdd("get", "/t/:tag/all", (c) => {
    const record = c.get("authRecord")
    let tag = c.pathParam("tag");
    tag = tag.replace(/'/g, "");
    tag = tag.toLocaleLowerCase()
    let tag_id = ""
    try {
        const tag_record = new Record;
        $app.dao().recordQuery("tags")
        .andWhere($dbx.hashExp({
        "name":  tag
        }))
        .limit(1)
        .one(tag_record)
        if (tag_record){
            tag_id=tag_record.get("id")
        }
    } catch (error) {
        const utils = require(`${__hooks}/utils.js`)
        return c.html(404, utils.get_error_page(404,"Could not find content with tag: "+tag))
    }

    const vid_record = arrayOf(new Record);
    try {
        $app.dao().recordQuery("videos")
        .andWhere($dbx.hashExp({"public":  true}))
        .andWhere($dbx.like("tags",tag_id))
        .orderBy("created DESC")
        .all(vid_record)
    } catch (error) {
        console.log("main page error");
        const utils = require(`${__hooks}/utils.js`)
        return c.html(404, utils.get_error_page(404,"Could not find content with tag: "+tag))
    }
    let data = []
    vid_record.forEach(el => {
        data.push({
            "id":el.get("id"),
            "tittle":el.get("tittle"),
            "icon":el.get("icon")
        })
    });
    const html = $template.loadFiles(
        `${__hooks}/views/base/layout.html`,
        `${__hooks}/views/base/header.html`,
        `${__hooks}/views/base/footer.html`,
        `${__hooks}/views/vid_grid.html`,
    ).render({
        "tittle":"Newest videos with tag: "+tag,
        "vids":data,
        "authorized":record!=null,
    })

    return c.html(200, html)
})
routerAdd("get", "/t", (c) => {
    const record = c.get("authRecord")
    const utils = require(`${__hooks}/utils.js`)
    return c.html(404, utils.get_error_page(404,"Please specifi videos tag you want to search for...",record!=null))
})
routerAdd("get", "/t/", (c) => {
    const record = c.get("authRecord")
    const utils = require(`${__hooks}/utils.js`)
    return c.html(404, utils.get_error_page(404,"Please specifi videos tag you want to search for...",record!=null))
})