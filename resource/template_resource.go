package resource

import (
	"html/template"
	"net/http"
)

var t, _ = template.ParseFiles(
	"./frontend/template/index.html",
)

func Main(w http.ResponseWriter, r *http.Request) {
	data := struct { RdbsApi string }{
		RdbsApi: "http://10.121.12.26:8080/v1",
	}
	t.ExecuteTemplate(w, "index.html", data)
}