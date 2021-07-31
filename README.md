# Build

   Generate bundle.js and copy to host:

    DOCKER_BUILDKIT=1 docker build --force-rm --target webpack-out --output=type=local,dest=./ -f Dockerfile .

   Run locally:

    DOCKER_BUILDKIT=1 docker build --force-rm --target dev -t alenka:latest -f Dockerfile .
    docker run --rm -p 3000:80 alenka:latest
