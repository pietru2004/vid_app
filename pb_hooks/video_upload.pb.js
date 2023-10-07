/// <reference path="../pb_data/types.d.ts" />

routerAdd("get", "/upload", (c) => {
    const record = c.get("authRecord")
    let is_authed = (record!=null);
    let auth_txt = "File Upload"
    const html = $template.loadFiles(
        `${__hooks}/views/base/layout.html`,
        `${__hooks}/views/base/header.html`,
        `${__hooks}/views/base/footer.html`,
        `${__hooks}/views/video/video_upload.html`,
    ).render({
        "tittle":auth_txt,
        "authorized":is_authed,
        "upload_started":false,
    })

    return c.html(200, html)
})

routerAdd("post", "/upload", (c) => {
    const record = c.get("authRecord")
    let is_authed = (record!=null);
    let auth_txt = "Authorize"
    let upload_txt = "Upload Failed"
    let upload_success = false
    try {
        const videos = $app.dao().findCollectionByNameOrId("videos")
        const record = new Record(videos)

        const form = new RecordUpsertForm($app, record);

        form.loadRequest(c.request(), "")
        form.submit()
        upload_success=true
        upload_txt = "Upload Success"
        //const vidRecord = form.submit();

        //return c.redirect(307, "/v/"+vidRecord.get("id"));
    } catch (err) {
        // maybe redirect to an error page?
        console.log(err)
        //console.log(c.request().postFormValue("tittle"))
        //console.log(c.request().postFormValue("video"))
        //return c.redirect(400, "/error");
    }
    const html = $template.loadFiles(
        `${__hooks}/views/base/layout.html`,
        `${__hooks}/views/base/header.html`,
        `${__hooks}/views/base/footer.html`,
        `${__hooks}/views/video/video_upload.html`,
    ).render({
        "tittle":auth_txt,
        "authorized":is_authed,
        "upload_started":true,
        "upload_success":upload_success,
        "upload_txt":upload_txt,
    })

    return c.html(200, html)
}, $apis.activityLogger($app), $apis.requireRecordAuth())