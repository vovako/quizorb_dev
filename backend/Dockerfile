FROM golang:1.20 AS assembly

WORKDIR /quizorb/backend

COPY . .

RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -o /build

FROM assembly AS test

RUN go test -v ./...

FROM gcr.io/distroless/base-debian11 AS deploy

COPY --from=assembly /build ./

EXPOSE 8080

USER nonroot:nonroot

ENTRYPOINT [ "/build" ]