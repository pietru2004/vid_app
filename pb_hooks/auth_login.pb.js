/// <reference path="../pb_data/types.d.ts" />

routerAdd("get", "/login", (c) => {
    const record = c.get("authRecord")
    let hide_form = (record!=null);
    let auth_txt = "Authorize"
    if (hide_form){
        auth_txt="Welcome "+record.get("username")
    }
    const html = $template.loadFiles(
        `${__hooks}/views/base/layout.html`,
        `${__hooks}/views/base/header.html`,
        `${__hooks}/views/base/footer.html`,
        `${__hooks}/views/auth/login_page.html`,
    ).render({
        "tittle":auth_txt,
        "hide_form":hide_form,
        "authorized":hide_form,
    })

    return c.html(200, html)
})

routerAdd("post", "/login", (c) => {
    const record = c.get("authRecord")
    let hide_form = (record!=null);
    let auth_txt = "Authorize"
    if (hide_form){
        auth_txt="Welcome "+record.get("username")
    }
    try {
        const users = $app.dao().findCollectionByNameOrId("users")

        const form = new RecordPasswordLoginForm($app, users);

        c.bind(form);
        // this will perform validation and will try to find an auth record matching the submitted credentials
        const authRecord = form.submit();

        const token = $tokens.recordAuthToken($app, authRecord)
        auth_txt="Welcome "+authRecord.get("username")

        const rawCookie = `pb_auth=${token}; Max-Age=${$app.settings().recordAuthToken.duration}; Path=/; SameSite=Strict; Secure; HttpOnly`;

        c.response().header().add("Set-Cookie", rawCookie);
        hide_form=true
    } catch (err) {
        // maybe redirect to an error page?
        //return c.redirect(400, "/error");
    }
    const html = $template.loadFiles(
        `${__hooks}/views/base/layout.html`,
        `${__hooks}/views/base/header.html`,
        `${__hooks}/views/base/footer.html`,
        `${__hooks}/views/auth/login_page.html`,
    ).render({
        "tittle":auth_txt,
        "hide_form":hide_form,
        "authorized":hide_form,
    })

    return c.html(200, html)
})

routerAdd("get", "/signout", (c) => {
    try {
        const rawCookie = `pb_auth=""; Max-Age=0; Path=/; SameSite=Strict; Secure; HttpOnly`;

        c.response().header().add("Set-Cookie", rawCookie);
    } catch (err) {
        return c.redirect(307, "/login");
    }

    return c.redirect(307, "/login");
})