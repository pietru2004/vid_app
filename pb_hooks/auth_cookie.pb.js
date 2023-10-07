/// <reference path="../pb_data/types.d.ts" />

// Registers a middleware that will try to load the current request
// record auth state from a cookie.
routerUse((next) => {
    return (c) => {
        try {
            const token = c.request().cookie("pb_auth")?.value

            if (token) {
                const record = $app.dao().findAuthRecordByToken(
                    token,
                    $app.settings().recordAuthToken.secret,
                )
                c.set("authRecord", record)
            }
        } catch(_) {}

        return next(c)
    }
})

// Hook to write a cookie to the response after authentication.
// 
// Note: usually e.httpContext.setCookie(http.Cookie) should be used
// but the JSVM currently doesn't have bindings for the http.Cookie creation
// (I'll consider adding it with the next release),
// so instead we construct a raw cookie string and write it directly as response header.
onRecordAuthRequest((e) => {
    let rawCookie = `pb_auth=${e.token}; Max-Age=${$app.settings().recordAuthToken.duration}; Path=/; SameSite=Strict; Secure; HttpOnly`;

    e.httpContext.response().header().add("Set-Cookie", rawCookie);

    // ideally in the next release the above can be replaced with something like:
    // e.httpContext.setCookie(new Cookie({
    //     name:     "pb_auth",
    //     value:    e.token,
    //     secure:   true,
    //     sameSite: "Strict",
    //     httpOnly: true,
    //     maxAge:   $app.settings().recordAuthToken.duration,
    //     path:     "/",
    // }))
})