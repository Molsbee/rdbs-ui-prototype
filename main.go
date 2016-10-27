package main

import (
	"github.com/gorilla/mux"
	"github.com/prometheus/common/log"
	"net/http"
	"github.com/molsbee/rdbs-ui-prototype/resource"
)

func main() {
	router := mux.NewRouter()
	router.StrictSlash(true)

	externalJavascript := http.FileServer(http.Dir("./frontend/external"))
	router.PathPrefix("/external/").Handler(http.StripPrefix("/external/", externalJavascript))

	javascript := http.FileServer(http.Dir("./frontend/js"))
	router.PathPrefix("/js/").Handler(http.StripPrefix("/js/", javascript))

	css := http.FileServer(http.Dir("./frontend/css"))
	router.PathPrefix("/css/").Handler(http.StripPrefix("/css/", css))

	img := http.FileServer(http.Dir("./frontend/img"))
	router.PathPrefix("/img/").Handler(http.StripPrefix("/img/", img))

	router.HandleFunc("/", resource.Main)

	log.Fatal(http.ListenAndServe(":8080", router))
}
