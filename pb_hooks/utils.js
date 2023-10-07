module.exports = {
    get_error_page: (code,msg,auth=false) => {
        const html = $template.loadFiles(
            `${__hooks}/views/base/layout.html`,
            `${__hooks}/views/base/header.html`,
            `${__hooks}/views/base/footer.html`,
            `${__hooks}/views/error.html`,
        ).render({
            "code":code,
            "msg":msg,
            "authorized":auth,
        })
        return html
    }
}