package resource

import (
	"github.com/gorilla/mux"
	"html/template"
	"net/http"
	"log"
)

var t, _ = template.ParseFiles(
	"./frontend/template/index.html",
	"./frontend/template/restore.html",
	"./frontend/template/subscription/create.html",
)

func Main(w http.ResponseWriter, r *http.Request) {
	data := struct{ RdbsApi string }{
		RdbsApi: "https://api-dv.rdbs.ctl.io/v1",
	}
	t.ExecuteTemplate(w, "index.html", data)
}

func Restore(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	data := struct {
		RdbsApi        string
		AccountAlias   string
		SubscriptionId string
	}{
		RdbsApi:        "http://10.121.12.26:8080/v1",
		AccountAlias:   vars["accountAlias"],
		SubscriptionId: vars["subscriptionId"],
	}

	t.ExecuteTemplate(w, "restore.html", data)
}

func SubscriptionCreate(w http.ResponseWriter, r *http.Request) {
	data := struct { RdbsApi string }{
		RdbsApi: "https://api-dv.rdbs.ctl.io/v1",
	}

	t.ExecuteTemplate(w, "create.html", data)
}