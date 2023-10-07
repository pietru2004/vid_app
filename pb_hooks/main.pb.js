/// <reference path="../pb_data/types.d.ts" />
//app created on 25.09.2023

routerAdd("get", "/hello/:name", (c) => {
    const name = c.pathParam("name")

    const html = $template.loadFiles(
        `${__hooks}/views/base/layout.html`,
        `${__hooks}/views/hello.html`,
    ).render({
        "name": name,
        "posts": ["1",["a","3"],"b","2"],
    })

    return c.html(200, html)
})
routerAdd("get", "/", (c) => {
    const vid_record = arrayOf(new Record);
    try {
        $app.dao().recordQuery("videos")
        .andWhere($dbx.hashExp({
        "public":  true,
        }))
        .orderBy("created DESC")
        .limit(12)
        .all(vid_record)
    } catch (error) {
        console.log("main page error");
    }
    let data = []
    vid_record.forEach(el => {
        data.push({
            "id":el.get("id"),
            "tittle":el.get("tittle"),
            "icon":el.get("icon")
        })
    });
    const record = c.get("authRecord") // empty if not authenticated as regular auth record
    let txt = ""
    if (record){
        txt=" - Authorized"
    }
    const html = $template.loadFiles(
        `${__hooks}/views/base/layout.html`,
        `${__hooks}/views/base/header.html`,
        `${__hooks}/views/base/footer.html`,
        `${__hooks}/views/vid_grid.html`,
    ).render({
        "tittle":"Newest videos"+txt,
        "vids":data,
        "authorized":record!=null,
    })

    return c.html(200, html)
})
