FROM golang

ENV PORT=9000

ADD . /go/src/github.com/molsbee/rdbs-ui-prototype

RUN go get github.com/tools/godep
RUN cd /go/src/github.com/molsbee/rds-ui-prototype/ && godep restore && godep go install

ENTRYPOINT /go/bin/rdbs-ui-prototype

EXPOSE 9000