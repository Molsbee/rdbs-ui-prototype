package main

import (
	"github.com/gorilla/mux"
	"github.com/prometheus/common/log"
	"net/http"
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

	log.Fatal(":9000", router)
}
