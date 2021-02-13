FROM ruby:2.5.3

# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

ENV RACK_ENV=development
ENV PORT=3000
EXPOSE 3000

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

ENTRYPOINT ["bundle", "exec"]
CMD ["puma -C puma.rb -p 3000"]