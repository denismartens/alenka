Simple photography [portfolio](https://alenamartens.com) for my spouse.

# Build

   Generate bundle.js and copy to host:

    DOCKER_BUILDKIT=1 docker build --force-rm --target webpack-out --output=type=local,dest=./ -f Dockerfile .

   Build container only:

    DOCKER_BUILDKIT=1 docker build --force-rm --target dev -t alenka:latest -f Dockerfile .

   Run container:

    docker run --rm -p 3000:80 alenka:latest
