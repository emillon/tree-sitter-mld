(code
 (language_name) @injection.language
 (code_contents) @injection.content)

(code
 !language
 (code_contents) @injection.content
 (#set! injection.language "ocaml"))

(html
 (html_content) @injection.content
 (#set! injection.language "html"))
